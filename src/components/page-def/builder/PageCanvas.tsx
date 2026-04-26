import { useState } from "react";
import type { PageDef } from "./pageDef";
import { REGISTRY, getVariantProps } from "./registry";
import type { RegistryKey } from "./registry";
import { DRAG_TYPE } from "./ComponentPalette";
import { getDefaultComponentDef } from "./defaults";
import { FormHeader } from "./FormHeader";
import {
  formAccentBarClass,
  formCardShellClass,
  getAppearance,
  getAppearanceStyles,
  getFormCardBoxShadow,
  getInputChromeParentClass,
  getSubmitButtonClass,
} from "./appearance";

const DRAG_COMPONENT_ID = "application/x-pagedef-component-id";

function reorderComponents(components: PageDef["components"], draggedId: string, dropTargetId: string): PageDef["components"] {
  if (draggedId === dropTargetId) return components;
  const comp = components.find((c) => c.id === draggedId);
  if (!comp) return components;
  const without = components.filter((c) => c.id !== draggedId);
  const dropIndex = without.findIndex((c) => c.id === dropTargetId);
  if (dropIndex === -1) return [...without, comp];
  const next = [...without];
  next.splice(dropIndex, 0, comp);
  return next;
}

interface PageCanvasProps {
  pageDef: PageDef;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onPageDefChange: (updater: (prev: PageDef) => PageDef) => void;
}

export default function PageCanvas({
  pageDef,
  selectedId,
  onSelect,
  onPageDefChange,
}: PageCanvasProps) {
  const appearance = getAppearance(pageDef);
  const appearanceVars = getAppearanceStyles(pageDef);
  const inputChromeParent = getInputChromeParentClass(appearance);
  const submitButtonClass = getSubmitButtonClass(appearance);
  const [values, setValues] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const [dropZoneOver, setDropZoneOver] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = e.dataTransfer.types.includes(DRAG_COMPONENT_ID) ? "move" : "copy";
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const draggedId = e.dataTransfer.getData(DRAG_COMPONENT_ID);
    const type = e.dataTransfer.getData(DRAG_TYPE);
    if (draggedId) {
      onPageDefChange((prev) => {
        const comp = prev.components.find((c) => c.id === draggedId);
        if (!comp) return prev;
        const rest = prev.components.filter((c) => c.id !== draggedId);
        return { ...prev, components: [...rest, comp] };
      });
      return;
    }
    if (!type) return;
    const def = getDefaultComponentDef(type);
    if (!def) return;
    onPageDefChange((prev) => ({
      ...prev,
      components: [...prev.components, def],
    }));
    onSelect(def.id);
  };

  const handleRowDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData(DRAG_COMPONENT_ID, id);
    e.dataTransfer.effectAllowed = "move";
  };

  /** Drop zone: insert *before* the row with dropTargetId. Handles both reorder and new component from palette. */
  const handleInsertBefore = (e: React.DragEvent, dropTargetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = e.dataTransfer.getData(DRAG_COMPONENT_ID);
    const type = e.dataTransfer.getData(DRAG_TYPE);
    if (draggedId) {
      onPageDefChange((prev) => ({
        ...prev,
        components: reorderComponents(prev.components, draggedId, dropTargetId),
      }));
      return;
    }
    if (type) {
      const def = getDefaultComponentDef(type);
      if (def) {
        const dropIndex = pageDef.components.findIndex((c) => c.id === dropTargetId);
        if (dropIndex === -1) return;
        onPageDefChange((prev) => ({
          ...prev,
          components: [
            ...prev.components.slice(0, dropIndex),
            def,
            ...prev.components.slice(dropIndex),
          ],
        }));
        onSelect(def.id);
      }
    }
  };

  const dropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes(DRAG_COMPONENT_ID)) e.dataTransfer.dropEffect = "move";
    else if (e.dataTransfer.types.includes(DRAG_TYPE)) e.dataTransfer.dropEffect = "copy";
  };

  const handleChange = (id: string) => (value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.2rem] border border-slate-300/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
      style={{
        ...appearanceVars,
        backgroundColor: "var(--fb-bg)",
        color: "var(--fb-text)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 75% at 50% -28%, color-mix(in srgb, var(--fb-primary) 30%, transparent), transparent 52%)",
        }}
      />
      <div className="relative flex min-h-0 flex-1 flex-col p-3 sm:p-4">
        <div
          className={`${formCardShellClass} flex min-h-0 flex-1 flex-col overflow-hidden bg-[color:var(--fb-surface)] text-[color:var(--fb-text)]`}
          style={{ boxShadow: getFormCardBoxShadow(pageDef) }}
        >
          <div className={formAccentBarClass} />
          <FormHeader
            variant="editable"
            pageDef={pageDef}
            onTitleChange={(title) => onPageDefChange((prev) => ({ ...prev, title }))}
            onDescriptionChange={(description) =>
              onPageDefChange((prev) => ({ ...prev, description }))
            }
          />
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex min-h-0 flex-1 flex-col overflow-auto px-4 py-4 pb-6 transition-colors duration-200 sm:px-6 sm:py-5 ${inputChromeParent} ${
              dragOver ? "bg-[color:color-mix(in_srgb,var(--fb-primary)_7%,var(--fb-surface))]" : ""
            }`}
          >
        {pageDef.components.length === 0 && (
          <div className="flex min-h-[220px] items-center justify-center text-center text-sm text-[color:var(--fb-muted)]">
            Drag fields from the palette onto this form.
          </div>
        )}
        <div className="space-y-0">
          {pageDef.components.map((comp) => {
            // Strip `onChange` (e.g. @actionDef refs) — canvas uses its own change handler
            const { id, type, onChange: _ignoredOnChange, ...rawProps } = comp;
            void _ignoredOnChange;
            const Component = REGISTRY[type as RegistryKey];
            const isSelected = selectedId === id;
            if (!Component)
              return (
                <div key={id} className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm">
                  Unknown: {type}
                </div>
              );
            const value = values[id] ?? "";
            const props: Record<string, unknown> = {
              value,
              onChange: handleChange(id),
              ...rawProps,
              ...getVariantProps(type),
            };
            if ((type === "select" || type === "radio" || type === "multiselect") && !Array.isArray(props.options))
              props.options = [];

            return (
              <div key={id} className="relative">
                <div
                  className={`min-h-[32px] flex items-center justify-center rounded transition-all ${
                    dropZoneOver === `before-${id}`
                      ? "min-h-[48px] bg-indigo-100 border-2 border-dashed border-indigo-400"
                      : "border-2 border-transparent border-slate-200"
                  }`}
                  onDragOver={(e) => {
                    dropZoneDragOver(e);
                    setDropZoneOver(`before-${id}`);
                  }}
                  onDragLeave={() => setDropZoneOver(null)}
                  onDrop={(e) => {
                    setDropZoneOver(null);
                    handleInsertBefore(e, id);
                  }}
                >
                  {dropZoneOver === `before-${id}` ? (
                    <span className="text-xs text-indigo-600 font-medium">Drop to insert above</span>
                  ) : (
                    <span className="text-slate-300 text-xs">·</span>
                  )}
                </div>
                <div
                  draggable
                  onDragStart={(e) => handleRowDragStart(e, id)}
                  onDragOver={(e) => {
                    if (e.dataTransfer.types.includes(DRAG_COMPONENT_ID) || e.dataTransfer.types.includes(DRAG_TYPE)) {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.types.includes(DRAG_COMPONENT_ID)) e.dataTransfer.dropEffect = "move";
                      else e.dataTransfer.dropEffect = "copy";
                      setDropZoneOver(`row-${id}`);
                    }
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropZoneOver(null);
                  }}
                  onDrop={(e) => {
                    setDropZoneOver(null);
                    handleInsertBefore(e, id);
                  }}
                  onClick={() => onSelect(id)}
                  className={`rounded-xl border-2 transition-all cursor-pointer flex gap-2 items-start group mt-2 ${
                    dropZoneOver === `row-${id}`
                      ? "border-indigo-400 bg-indigo-50/80 ring-2 ring-indigo-500/30"
                      : isSelected
                        ? "border-indigo-500 ring-2 ring-indigo-500/20"
                        : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <span
                    className="shrink-0 mt-4 p-1.5 rounded text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
                    title="Drag to reorder"
                    aria-hidden
                  >
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
                  </span>
                  <div className="flex-1 min-w-0 rounded-[calc(var(--fb-radius)*0.92)] border border-[color:color-mix(in_srgb,var(--fb-text)_7%,var(--fb-surface))] bg-[color:color-mix(in_srgb,var(--fb-text)_2.5%,var(--fb-surface))] p-3.5 shadow-sm sm:p-4">
                    <Component {...props} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
            <div className="mt-6 border-t border-[color:color-mix(in_srgb,var(--fb-text)_8%,var(--fb-surface))] px-0 pt-5 sm:pt-6">
              <button type="button" className={submitButtonClass} onClick={() => undefined}>
                Continue
              </button>
              <p className="mt-2 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[color:var(--fb-muted)]">
                Primary action preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
