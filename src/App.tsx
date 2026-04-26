import { useState } from "react";
import { ToastContainer } from "react-toastify";
import JsonPlayground from "./components/page-def/JsonPlayground";
import PageDefBuilder from "./components/page-def/builder/PageDefBuilder";
import { TemplatesPage } from "./components/page-def";
import ComponentReference from "./reference/ComponentReference";
import { AppHome } from "./components/AppHome";

type AppView =
  | "home"
  | "pageDef"
  | "pageDefBuilder"
  | "templates"
  | "reference";

const navItems: { view: AppView; label: string; short?: string }[] = [
  { view: "home", label: "Home" },
  { view: "pageDef", label: "Live preview", short: "Preview" },
  { view: "pageDefBuilder", label: "Visual builder", short: "Builder" },
  { view: "templates", label: "Templates" },
  { view: "reference", label: "Components", short: "Docs" },
];

const App = () => {
  const [view, setView] = useState<AppView>("home");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <ToastContainer />
      <header className="shrink-0 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">Formvity</h1>
              <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">Branded forms, built your way</p>
            </div>
          </div>
          <nav
            className="flex gap-1.5 overflow-x-auto pb-1 -mb-1 sm:pb-0 sm:mb-0 [-webkit-overflow-scrolling:touch]"
            aria-label="Main"
          >
            {navItems.map(({ view: v, label, short }) => (
              <button
                key={v}
                type="button"
                aria-current={view === v ? "page" : undefined}
                className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                  view === v
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
                onClick={() => setView(v)}
                title={short && short !== label ? label : undefined}
              >
                <span className="sm:hidden">{short ?? label}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 min-h-0 flex flex-col">
        {view === "home" && (
          <AppHome
            onNavigate={(v) => setView(v)}
          />
        )}
        {view === "pageDef" && <JsonPlayground />}
        {view === "pageDefBuilder" && <PageDefBuilder />}
        {view === "templates" && (
          <TemplatesPage onOpenBuilder={() => setView("pageDefBuilder")} />
        )}
        {view === "reference" && <ComponentReference />}
      </main>
    </div>
  );
};

export default App;
