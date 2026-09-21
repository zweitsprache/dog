"use client";

import {
  Button,
  createUsePuck,
  Puck,
  type Data,
  type Overrides,
} from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { Eye, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { config, initialData, type PageComponents } from "@/puck/config";

const storageKey = "puck-page-data";
const pageEndpoint = "/api/pages/home";
const usePuck = createUsePuck<typeof config>();

function HeaderActions({ children }: { children: ReactNode }) {
  const previewMode = usePuck((state) => state.appState.ui.previewMode);
  const dispatch = usePuck((state) => state.dispatch);
  const isPreviewing = previewMode === "interactive";

  return (
    <>
      <Button
        icon={isPreviewing ? <Pencil size={14} /> : <Eye size={14} />}
        onClick={() =>
          dispatch({
            type: "setUi",
            ui: { previewMode: isPreviewing ? "edit" : "interactive" },
          })
        }
        variant="secondary"
      >
        {isPreviewing ? "Edit" : "Preview"}
      </Button>
      {children}
    </>
  );
}

const overrides: Partial<Overrides<typeof config>> = {
  headerActions: HeaderActions,
};

export default function EditorPage() {
  const [data, setData] = useState<Data<PageComponents> | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        const response = await fetch(pageEndpoint);

        if (response.ok) {
          const result = (await response.json()) as {
            data: Data<PageComponents>;
          };

          if (!cancelled) setData(result.data);
          return;
        }

        if (response.status !== 404) throw new Error("Failed to load page");
      } catch (error) {
        console.error(error);
      }

      const savedData = window.localStorage.getItem(storageKey);

      try {
        if (!cancelled) {
          setData(savedData ? JSON.parse(savedData) : initialData);
        }
      } catch {
        if (!cancelled) setData(initialData);
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <div className="p-8">Loading editor...</div>;
  }

  return (
    <>
      {saveError && (
        <div
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-destructive px-4 py-2 text-sm text-white shadow-lg"
          role="alert"
        >
          {saveError}
        </div>
      )}
      <Puck
        config={config}
        data={data}
        overrides={overrides}
        onPublish={async (publishedData) => {
          setSaveError(null);

          try {
            const response = await fetch(pageEndpoint, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(publishedData),
            });

            if (!response.ok) throw new Error("Publish failed");

            window.localStorage.removeItem(storageKey);
          } catch (error) {
            console.error(error);
            setSaveError("Could not publish to Neon. Please try again.");
          }
        }}
      />
    </>
  );
}