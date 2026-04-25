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
  { view: "pageDef", label: "Page preview", short: "Page" },
  { view: "pageDefBuilder", label: "Visual builder", short: "Builder" },
  { view: "templates", label: "Templates" },
  { view: "reference", label: "Field types", short: "Docs" },
];

const App = () => {
  const [view, setView] = useState<AppView>("home");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ToastContainer />
      <header className="shrink-0 border-b border-slate-200 bg-white shadow-sm">
        <div className="px-4 pt-3 pb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Form Builder</h1>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
              JSON-first forms and dynamic pages — edit, preview, save.
            </p>
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
