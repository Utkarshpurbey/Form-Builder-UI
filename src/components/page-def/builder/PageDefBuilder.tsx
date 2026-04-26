import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import type { PageDef } from "./pageDef";
import ComponentPalette from "./ComponentPalette";
import PageCanvas from "./PageCanvas";
import ComponentConfigPanel from "./ComponentConfigPanel";

export const SAVED_PAGE_DEF_KEY = "savedPageDef";
export const INJECTED_PAGE_DEF_TEMPLATE_KEY = "injectedPageDefTemplate";

const INITIAL_PAGE_DEF: PageDef = {
  id: "page-1",
  title: "New page",
  description: "",
  formSettings: {
    appearance: {
      primaryColor: "#4f46e5",
      backgroundColor: "#eef2ff",
      surfaceColor: "#ffffff",
      textColor: "#0f172a",
      borderRadius: "md",
      submitStyle: "solid",
      inputStyle: "outline",
    },
  },
  components: [],
};

type CenterView = "preview" | "json";

const DEBOUNCE_MS = 400;

export default function PageDefBuilder() {
  const [pageDef, setPageDef] = useState<PageDef>(INITIAL_PAGE_DEF);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [centerView, setCenterView] = useState<CenterView>("preview");
  const [jsonInput, setJsonInput] = useState(JSON.stringify(INITIAL_PAGE_DEF, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setJsonInput(JSON.stringify(pageDef, null, 2));
  }, [pageDef]);

  useEffect(() => {
    const injectedTemplate = localStorage.getItem(INJECTED_PAGE_DEF_TEMPLATE_KEY);
    if (!injectedTemplate) return;

    try {
      const parsed = JSON.parse(injectedTemplate) as PageDef;
      if (!parsed?.id || !parsed?.title || !Array.isArray(parsed.components)) {
        throw new Error("Template format is invalid.");
      }
      setPageDef(parsed);
      setSelectedId(null);
      setCenterView("preview");
      setJsonError(null);
      toast.success("Template loaded into Formvity.");
    } catch {
      toast.error("Could not load selected template.");
    } finally {
      localStorage.removeItem(INJECTED_PAGE_DEF_TEMPLATE_KEY);
    }
  }, []);

  // Apply JSON changes directly (debounced) when in JSON view
  useEffect(() => {
    if (centerView !== "json") return;
    const t = setTimeout(() => {
      setJsonError(null);
      try {
        const parsed = JSON.parse(jsonInput) as PageDef;
        if (!parsed?.id || !parsed?.title || !Array.isArray(parsed.components)) {
          throw new Error("Need id, title, and components array.");
        }
        setPageDef(parsed);
      } catch (e) {
        setJsonError(e instanceof Error ? e.message : "Invalid JSON");
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [centerView, jsonInput]);

  const selectedComponent =
    pageDef.components.find((c) => c.id === selectedId) ?? null;

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    setPageDef((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== selectedId),
    }));
    setSelectedId(null);
  }, [selectedId]);

  const handleSave = () => {
    try {
      localStorage.setItem(SAVED_PAGE_DEF_KEY, JSON.stringify(pageDef, null, 2));
      toast.success(
        'PageDef saved. Open "Page preview" in the top bar to try the full form — it loads this save automatically.',
      );
    } catch {
      toast.error("Failed to save PageDef.");
    }
  };

  return (
    <div className="flex flex-1 min-h-0 bg-slate-100">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ComponentPalette />
      </aside>
      <main className="flex-1 min-w-0 p-4 overflow-hidden flex flex-col">
        <div
          className="mb-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-600 shadow-sm"
          role="region"
          aria-label="Builder tips"
        >
          <span className="font-semibold text-slate-800">Tips: </span>
          Drag a field from the left onto the page. Click a field to edit it in the right panel. Use{" "}
          <strong className="text-slate-800">Save</strong> then open <strong className="text-slate-800">Page preview</strong> to test submit and validation.
        </div>
        <div className="flex gap-1 mb-3 items-center justify-between">
          <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCenterView("preview")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              centerView === "preview"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setCenterView("json")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              centerView === "json"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            JSON
          </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
        {centerView === "preview" ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <PageCanvas
              pageDef={pageDef}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onPageDefChange={setPageDef}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-3 border-b border-slate-200">
              <span className="text-sm text-slate-600">PageDef JSON — edits update the form automatically</span>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="flex-1 w-full p-4 font-mono text-sm text-slate-800 bg-slate-50 focus:outline-none resize-none"
              spellCheck={false}
            />
            {jsonError && (
              <p className="px-4 py-2 text-sm text-rose-600 bg-rose-50 border-t border-rose-100">
                {jsonError}
              </p>
            )}
          </div>
        )}
      </main>
      <aside className="w-72 shrink-0 bg-white border-l border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ComponentConfigPanel
          pageDef={pageDef}
          selectedComponent={selectedComponent}
          onPageDefChange={setPageDef}
          onClearSelection={() => setSelectedId(null)}
          onDeleteSelected={selectedId ? deleteSelected : undefined}
        />
      </aside>
    </div>
  );
}
