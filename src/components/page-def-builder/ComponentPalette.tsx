import { PALETTE_SPECS } from "../../reference/component-reference-data";

const DRAG_TYPE = "application/x-pagedef-component-type";

const iconClass = "size-9 text-indigo-600/90 stroke-[1.5]";

/** Icons for each palette item (by palette id). */
const PALETTE_ICONS: Record<string, React.ReactNode> = {
  TextField: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  ),
  Number: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17h4l2-8 2 8h4M7 10h10" />
    </svg>
  ),
  TextArea: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 10h16M4 14h10M4 18h8" />
    </svg>
  ),
  Select: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
      <path d="M4 4h16v4H4z" />
    </svg>
  ),
  Choice: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  Checkbox: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" strokeWidth="1.5" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  DateAndTime: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
};

interface ComponentPaletteProps {
  onDragStart?: (type: string) => void;
}

export default function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white">
      <header className="shrink-0 px-4 py-3 border-b border-slate-200 bg-white">
        <h2 className="text-sm font-semibold text-slate-800">Components</h2>
        <p className="text-xs text-slate-500 mt-0.5">Drag onto the canvas; set type in Config</p>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-2.5 min-h-0">
        {PALETTE_SPECS.map((spec) => (
          <div
            key={spec.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(DRAG_TYPE, spec.id);
              e.dataTransfer.effectAllowed = "copy";
              onDragStart?.(spec.id);
            }}
            className="group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-slate-100 bg-white text-slate-700 cursor-grab active:cursor-grabbing shadow-sm transition-shadow hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/60"
          >
            <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600/90 ring-1 ring-indigo-100/80 group-hover:bg-indigo-100 group-hover:ring-indigo-200/60 transition-colors">
              {PALETTE_ICONS[spec.id] ?? (
                <span className="text-base font-semibold text-indigo-500">{spec.label.slice(0, 1)}</span>
              )}
            </span>
            <div className="min-w-0 flex-1 py-0.5">
              <div className="text-sm font-medium text-slate-800">{spec.label}</div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DRAG_TYPE };
