import { useState, useEffect } from "react";
import type { PageDef } from "../../utils/pageDef";
import ComponentPalette from "./ComponentPalette";
import PageCanvas from "./PageCanvas";
import ComponentConfigPanel from "./ComponentConfigPanel";

const INITIAL_PAGE_DEF: PageDef = {
  id: "page-1",
  title: "New page",
  description: "",
  components: [],
};

type CenterView = "preview" | "json";

export default function PageDefBuilder() {
  const [pageDef, setPageDef] = useState<PageDef>(INITIAL_PAGE_DEF);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [centerView, setCenterView] = useState<CenterView>("preview");
  const [jsonInput, setJsonInput] = useState(JSON.stringify(INITIAL_PAGE_DEF, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    setJsonInput(JSON.stringify(pageDef, null, 2));
  }, [pageDef]);

  const selectedComponent =
    pageDef.components.find((c) => c.id === selectedId) ?? null;

  const deleteSelected = () => {
    if (!selectedId) return;
    setPageDef((prev) => ({
      ...prev,
      components: prev.components.filter((c) => c.id !== selectedId),
    }));
    setSelectedId(null);
  };

  const handleApplyJson = () => {
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
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-slate-100">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <ComponentPalette />
      </aside>
      <main className="flex-1 min-w-0 p-4 overflow-hidden flex flex-col">
        <div className="flex gap-1 mb-3">
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
            <div className="p-3 border-b border-slate-200 flex items-center justify-between gap-2">
              <span className="text-sm text-slate-600">PageDef JSON — edit and Apply to update the form</span>
              <button
                type="button"
                onClick={handleApplyJson}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                Apply
              </button>
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
          selectedComponent={selectedComponent}
          onPageDefChange={setPageDef}
          onClearSelection={() => setSelectedId(null)}
          onDeleteSelected={selectedId ? deleteSelected : undefined}
        />
      </aside>
    </div>
  );
}
