"use client";

import { Render, type Data } from "@puckeditor/core";
import Link from "next/link";
import { useEffect, useState } from "react";
import { config, initialData, type PageComponents } from "@/puck/config";

export default function Home() {
  const [data, setData] = useState<Data<PageComponents> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        const response = await fetch("/api/pages/home");

        if (response.ok) {
          const result = (await response.json()) as {
            data: Data<PageComponents>;
          };

          if (!cancelled) setData(result.data);
          return;
        }
      } catch (error) {
        console.error(error);
      }

      if (!cancelled) setData(initialData);
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <div className="p-8">Loading page...</div>;
  }

  return (
    <main className="min-h-screen">
      <Render config={config} data={data} />
      <Link
        className="fixed right-4 bottom-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg"
        href="/edit"
      >
        Edit page
      </Link>
    </main>
  );
}
