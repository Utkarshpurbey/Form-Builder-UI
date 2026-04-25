type AppView =
  | "home"
  | "pageDef"
  | "pageDefBuilder"
  | "templates"
  | "reference";

interface AppHomeProps {
  onNavigate: (view: Exclude<AppView, "home">) => void;
}

const cards: {
  title: string;
  description: string;
  view: Exclude<AppView, "home">;
  cta: string;
  accent: string;
}[] = [
  {
    title: "Page preview (JSON)",
    description:
      "Paste a full PageDef JSON and test every field type, validation, and submit — without touching the visual builder.",
    view: "pageDef",
    cta: "Open page preview",
    accent: "from-teal-500 to-cyan-600",
  },
  {
    title: "Visual PageDef builder",
    description:
      "Drag fields from the palette, tweak props on the right, and switch to JSON anytime. Save to try it in Page preview.",
    view: "pageDefBuilder",
    cta: "Open builder",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "Templates",
    description:
      "Start from realistic examples (job application, support ticket, …). Preview the real UI, then edit in the builder if you want.",
    view: "templates",
    cta: "Browse templates",
    accent: "from-amber-500 to-orange-600",
  },
  {
    title: "Field types & props",
    description:
      "Reference for every PageDef component: props tables, example JSON, and live mini-demos.",
    view: "reference",
    cta: "Open reference",
    accent: "from-slate-600 to-slate-800",
  },
];

export function AppHome({ onNavigate }: AppHomeProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-sm font-medium text-indigo-600 tracking-wide uppercase">
            Getting started
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Build forms from JSON
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything runs from a schema you can version, copy, and ship. Pick a path
            below — you can always switch using the bar at the top.
          </p>
        </div>

        <ol className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center text-sm text-slate-600 max-w-3xl mx-auto">
          <li className="flex gap-3 items-start bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              1
            </span>
            <span>
              <strong className="text-slate-800">Define</strong> — edit JSON or use the visual builder.
            </span>
          </li>
          <li className="flex gap-3 items-start bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              2
            </span>
            <span>
              <strong className="text-slate-800">Preview</strong> — see the real form before you share it.
            </span>
          </li>
          <li className="flex gap-3 items-start bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
              3
            </span>
            <span>
              <strong className="text-slate-800">Save</strong> — builder can save; preview loads it automatically.
            </span>
          </li>
        </ol>

        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.view}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r ${card.accent}`}
                aria-hidden
              />
              <h2 className="text-lg font-semibold text-slate-900 pr-2">{card.title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{card.description}</p>
              <button
                type="button"
                onClick={() => onNavigate(card.view)}
                className="mt-5 w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              >
                {card.cta}
              </button>
            </article>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 max-w-xl mx-auto">
          Tip: invalid JSON shows a red message under the editor. Use{" "}
          <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[11px]">
            Esc
          </kbd>{" "}
          to close template previews.
        </p>
      </div>
    </div>
  );
}
