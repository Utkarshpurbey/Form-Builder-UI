import { COMPONENT_SPECS } from "../../reference/component-reference-data";

const DRAG_TYPE = "application/x-pagedef-component-type";

const iconClass = "size-9 text-indigo-600/90 stroke-[1.5]";

/** Large icons for each component type (24x24 viewBox, scaled via size class). */
const COMPONENT_ICONS: Record<string, React.ReactNode> = {
  Text: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  ),
  Number: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17h4l2-8 2 8h4M7 10h10" />
    </svg>
  ),
  Email: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  ),
  Phone: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Url: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
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
  Radio: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  MultiSelect: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <path d="M11 6h8M6 12h12M6 18h10" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  Checkbox: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" strokeWidth="1.5" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  Date: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Time: (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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
        <p className="text-xs text-slate-500 mt-0.5">Drag onto the canvas to add</p>
      </header>
      <div className="flex-1 overflow-auto p-4 space-y-2.5 min-h-0">
        {COMPONENT_SPECS.map((spec) => (
          <div
            key={spec.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(DRAG_TYPE, spec.type);
              e.dataTransfer.effectAllowed = "copy";
              onDragStart?.(spec.type);
            }}
            className="group flex items-center gap-3.5 px-3.5 py-3 rounded-2xl border border-slate-100 bg-white text-slate-700 cursor-grab active:cursor-grabbing shadow-sm transition-shadow hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/60"
          >
            <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600/90 ring-1 ring-indigo-100/80 group-hover:bg-indigo-100 group-hover:ring-indigo-200/60 transition-colors">
              {COMPONENT_ICONS[spec.type] ?? (
                <span className="text-base font-semibold text-indigo-500">{spec.type.slice(0, 1)}</span>
              )}
            </span>
            <div className="min-w-0 flex-1 py-0.5">
              <div className="text-sm font-medium text-slate-800">{spec.type}</div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { DRAG_TYPE };
