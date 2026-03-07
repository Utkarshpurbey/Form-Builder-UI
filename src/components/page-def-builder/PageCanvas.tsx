import { useState } from "react";
import type { PageDef } from "../../utils/pageDef";
import { REGISTRY } from "./registry";
import type { RegistryKey } from "./registry";
import { DRAG_TYPE } from "./ComponentPalette";
import { getDefaultComponentDef } from "./defaults";

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
    if (!type || !(type in REGISTRY)) return;
    const def = getDefaultComponentDef(type as RegistryKey);
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
    if (type && type in REGISTRY) {
      const def = getDefaultComponentDef(type as RegistryKey);
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
    <div className="flex flex-col min-h-0 flex-1 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-white shrink-0">
        <input
          type="text"
          value={pageDef.title}
          onChange={(e) =>
            onPageDefChange((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Page title"
          className="w-full text-lg font-semibold text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
        />
        <input
          type="text"
          value={pageDef.description ?? ""}
          onChange={(e) =>
            onPageDefChange((prev) => ({ ...prev, description: e.target.value || undefined }))
          }
          placeholder="Description (optional)"
          className="w-full mt-1 text-sm text-slate-500 bg-transparent focus:outline-none placeholder:text-slate-400"
        />
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 min-h-0 overflow-auto p-4 pb-8 transition-colors ${
          dragOver ? "bg-indigo-50/80" : ""
        }`}
      >
        {pageDef.components.length === 0 && (
          <div className="flex items-center justify-center min-h-[280px] text-slate-400 text-sm">
            Drop components here
          </div>
        )}
        <div className="space-y-0">
          {pageDef.components.map((comp) => {
            const { id, type, onChange: _onChange, ...rawProps } = comp;
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
            };
            if ((type === "Select" || type === "Radio" || type === "MultiSelect") && !Array.isArray(props.options))
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
                  <div className="flex-1 min-w-0 p-4 pt-3 bg-white rounded-xl">
                    <Component {...props} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
