import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

function getDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  return neon(process.env.DATABASE_URL);
}

function isPageData(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "root" in value &&
    "content" in value &&
    Array.isArray(value.content)
  );
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid page slug" }, { status: 400 });
  }

  try {
    const sql = getDatabase();
    const rows = await sql`
      SELECT data, updated_at
      FROM puck_pages
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (!rows[0]) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Failed to load Puck page", error);
    return NextResponse.json({ error: "Failed to load page" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid page slug" }, { status: 400 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > 1_000_000) {
    return NextResponse.json({ error: "Page data is too large" }, { status: 413 });
  }

  try {
    const data: unknown = await request.json();

    if (!isPageData(data)) {
      return NextResponse.json({ error: "Invalid Puck page data" }, { status: 400 });
    }

    const sql = getDatabase();
    const rows = await sql`
      INSERT INTO puck_pages (slug, data, updated_at)
      VALUES (${slug}, ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (slug)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
      RETURNING updated_at
    `;

    return NextResponse.json({ saved: true, updatedAt: rows[0].updated_at });
  } catch (error) {
    console.error("Failed to save Puck page", error);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}