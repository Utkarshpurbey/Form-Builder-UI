import type { PageDef, PageComponentDef } from "./pageDef";
import { COMPONENT_SPECS, getTypeGroup } from "../../../reference/component-reference-data";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400";

interface ComponentConfigPanelProps {
  selectedComponent: PageComponentDef | null;
  onPageDefChange: (updater: (prev: PageDef) => PageDef) => void;
  onClearSelection: () => void;
  onDeleteSelected?: () => void;
}

export default function ComponentConfigPanel({
  selectedComponent,
  onPageDefChange,
  onClearSelection,
  onDeleteSelected,
}: ComponentConfigPanelProps) {
  const updateSelected = (updates: Partial<PageComponentDef>) => {
    if (!selectedComponent) return;
    onPageDefChange((prev) => ({
      ...prev,
      components: prev.components.map((c) =>
        c.id === selectedComponent.id ? { ...c, ...updates } : c
      ),
    }));
  };

  if (!selectedComponent) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white">
        <header className="shrink-0 px-4 py-3 border-b border-slate-200 bg-white">
          <h2 className="text-sm font-semibold text-slate-800">Config</h2>
          <p className="text-xs text-slate-500 mt-0.5">Page settings</p>
        </header>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <p className="text-xs text-slate-500">Edit title and description in the canvas header.</p>
          <p className="text-xs text-slate-500">Select a component on the canvas to edit its props here.</p>
        </div>
      </div>
    );
  }

  const spec = COMPONENT_SPECS.find((s) => s.type === selectedComponent.type);
  const comp = selectedComponent as Record<string, unknown>;

  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <header className="shrink-0 px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Config</h2>
          <p className="text-xs text-slate-500 mt-0.5">Edit selected component</p>
        </div>
        <div className="flex gap-1">
          {onDeleteSelected && (
            <button
              type="button"
              onClick={onDeleteSelected}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onClearSelection}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">ID</label>
          <input
            type="text"
            value={String(comp.id ?? "")}
            onChange={(e) => updateSelected({ id: e.target.value })}
            className={inputClass}
            placeholder="e.g. number0da1"
          />
          <p className="text-xs text-slate-500 mt-0.5">Auto-generated as type + short id; you can edit.</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
          {(() => {
            const typeGroup = getTypeGroup(String(comp.type ?? ""));
            if (typeGroup && typeGroup.length > 0) {
              return (
                <select
                  value={String(comp.type ?? "")}
                  onChange={(e) => updateSelected({ type: e.target.value as PageComponentDef["type"] })}
                  className={inputClass}
                >
                  {typeGroup.map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              );
            }
            return (
              <input
                type="text"
                value={String(comp.type ?? "")}
                disabled
                className={inputClass + " opacity-70 bg-slate-50 cursor-not-allowed"}
              />
            );
          })()}
          {getTypeGroup(String(comp.type ?? "")) && (
            <p className="text-xs text-slate-500 mt-0.5">Change type in this group</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Label</label>
          <input
            type="text"
            value={String(comp.label ?? "")}
            onChange={(e) => updateSelected({ label: e.target.value })}
            className={inputClass}
            placeholder="Label"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Helper text</label>
          <input
            type="text"
            value={String(comp.helperText ?? "")}
            onChange={(e) => updateSelected({ helperText: e.target.value })}
            className={inputClass}
            placeholder="Optional"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(comp.required)}
            onChange={(e) => updateSelected({ required: e.target.checked })}
            className="size-4 rounded border-slate-300 text-indigo-600"
          />
          <span className="text-sm text-slate-700">Required</span>
        </label>
        {(spec?.specificProps?.some((p) => p.name === "placeholder") ?? true) && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Placeholder</label>
            <input
              type="text"
              value={String(comp.placeholder ?? "")}
              onChange={(e) => updateSelected({ placeholder: e.target.value })}
              className={inputClass}
              placeholder="Optional"
            />
          </div>
        )}
        {(selectedComponent.type === "select" ||
          selectedComponent.type === "radio" ||
          selectedComponent.type === "multiselect") && (
          <>
            <OptionsEditor
              options={Array.isArray(comp.options) ? (comp.options as string[]) : []}
              onChange={(options) => updateSelected({ options })}
            />
            {(selectedComponent.type === "radio" || selectedComponent.type === "multiselect") && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedComponent.type === "multiselect"}
                  onChange={(e) =>
                    updateSelected(
                      e.target.checked ? { type: "multiselect" } : { type: "radio" }
                    )
                  }
                  className="size-4 rounded border-slate-300 text-indigo-600"
                />
                <span className="text-sm text-slate-700">Multi select (checkboxes)</span>
              </label>
            )}
          </>
        )}
        {selectedComponent.type === "textarea" && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Rows</label>
            <input
              type="number"
              value={Number(comp.rows) || 4}
              onChange={(e) => updateSelected({ rows: e.target.value ? Number(e.target.value) : undefined })}
              className={inputClass}
              min={1}
            />
          </div>
        )}
        {selectedComponent.type === "checkbox" && (
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Checkbox label</label>
            <input
              type="text"
              value={String(comp.checkboxLabel ?? "Yes")}
              onChange={(e) => updateSelected({ checkboxLabel: e.target.value })}
              className={inputClass}
            />
          </div>
        )}
        {(selectedComponent.type === "number" || selectedComponent.type === "date" || selectedComponent.type === "time") && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Min</label>
              <input
                type={selectedComponent.type === "number" ? "number" : "text"}
                value={comp.min != null ? String(comp.min) : ""}
                onChange={(e) =>
                  updateSelected({
                    min: selectedComponent.type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value || undefined,
                  })
                }
                className={inputClass}
                placeholder={selectedComponent.type === "number" ? undefined : "e.g. 1900-01-01"}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Max</label>
              <input
                type={selectedComponent.type === "number" ? "number" : "text"}
                value={comp.max != null ? String(comp.max) : ""}
                onChange={(e) =>
                  updateSelected({
                    max: selectedComponent.type === "number" ? (e.target.value ? Number(e.target.value) : undefined) : e.target.value || undefined,
                  })
                }
                className={inputClass}
                placeholder={selectedComponent.type === "number" ? undefined : "e.g. 2025-12-31"}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: string[];
  onChange: (options: string[]) => void;
}) {
  const add = () => onChange([...options, `Option ${options.length + 1}`]);
  const remove = (i: number) => onChange(options.filter((_, j) => j !== i));
  const update = (i: number, value: string) =>
    onChange(options.map((o, j) => (j === i ? value : o)));

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-xs font-medium text-slate-600">Options</label>
        <button
          type="button"
          onClick={add}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          + Add
        </button>
      </div>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={opt}
              onChange={(e) => update(i, e.target.value)}
              className={inputClass + " flex-1"}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="px-2 text-slate-400 hover:text-rose-500 shrink-0"
              aria-label="Remove"
            >
              ×
            </button>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-xs text-slate-500">No options. Click + Add.</p>
        )}
      </div>
    </div>
  );
}
