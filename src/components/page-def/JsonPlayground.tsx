import { useState } from "react";
import { toast } from "react-toastify";
import type { PageDef, PageComponentDef, PageComponentType } from "./builder/pageDef";
import { REGISTRY, getVariantProps } from "./builder/registry";
import { SAVED_PAGE_DEF_KEY } from "./builder/PageDefBuilder";
import { FormHeader } from "./builder/FormHeader";
import {
  formAccentBarClass,
  formCardShellClass,
  getAppearance,
  getAppearanceStyles,
  getFormCardBoxShadow,
  getInputChromeParentClass,
  getSubmitButtonClass,
} from "./builder/appearance";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone: string) => /^\d{10}$/.test(phone);
const validateUrl = (url: string) => {
  if (!url.trim()) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const EXAMPLE_PAGE_DEF: PageDef = {
  id: "page-1",
  title: "JSON PageDef",
  description: "Edit JSON on the left. Use \"onChange\": \"@actionDef.logName\" to run actions.",
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
  components: [
    { id: "name", type: "text", label: "Full Name", required: true, onChange: "@actionDef.logName" },
    { id: "age", type: "number", label: "Age", min: 0, max: 120 },
    { id: "email", type: "email", label: "Email", required: true },
    { id: "country", type: "select", label: "Country", required: true, options: ["India", "USA", "UK"] },
    { id: "preferences", type: "multiselect", label: "Preferences", options: ["News", "Updates", "Marketing"] },
    { id: "contactMethod", type: "radio", label: "Contact method", options: ["Email", "Phone", "Post"] },
    { id: "dob", type: "date", label: "Date of birth" },
    { id: "agreed", type: "checkbox", label: "I agree to terms", checkboxLabel: "Yes, I agree" },
    { id: "website", type: "url", label: "Website", placeholder: "https://" },
    { id: "about", type: "textarea", label: "About you", rows: 4 },
  ],
  actions: {
    logName: "alert('Name changed to', ctx.value);",
  },
};

function parseActionRef(val: unknown): string[] | null {
  if (typeof val !== "string") return null;
  const parts = val.split(",").map((s) => s.trim());
  const ids = parts.map((s) => s.match(/^@actionDef\.(.+)$/)?.[1]).filter(Boolean) as string[];
  return ids.length > 0 ? ids : null;
}

function loadSavedPageDef(): PageDef | null {
  try {
    const raw = localStorage.getItem(SAVED_PAGE_DEF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PageDef;
    if (!parsed?.id || !parsed?.title || !Array.isArray(parsed.components)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function JsonPlayground() {
  const initialDef = loadSavedPageDef() ?? EXAMPLE_PAGE_DEF;
  const [jsonInput, setJsonInput] = useState(JSON.stringify(initialDef, null, 2));
  const [pageDef, setPageDef] = useState<PageDef>(initialDef);
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submittedValues, setSubmittedValues] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSavedBanner, setShowSavedBanner] = useState(() => loadSavedPageDef() !== null);

  const runActions = (actionIds: string[], value: string, comp: PageComponentDef) => {
    if (!pageDef.actions || actionIds.length === 0) return;
    actionIds.forEach((id) => {
      const code = pageDef.actions?.[id];
      if (!code) return;
      try {
        const fn = new Function("ctx", code) as (ctx: {
          value: string;
          values: Record<string, string>;
          component: PageComponentDef;
          setValue: (id: string, v: string) => void;
        }) => void;
        fn({
          value,
          values,
          component: comp,
          setValue: (fieldId, next) => setValues((prev) => ({ ...prev, [fieldId]: next })),
        });
      } catch (e) {
        console.error("Action error", id, e);
      }
    });
  };

  const resetExample = () => {
    setJsonInput(JSON.stringify(EXAMPLE_PAGE_DEF, null, 2));
    setPageDef(EXAMPLE_PAGE_DEF);
    setValues({});
    setFieldErrors({});
    setSubmittedValues(null);
    setError(null);
    setShowSavedBanner(false);
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed?.id || !parsed?.title || !Array.isArray(parsed.components)) {
        throw new Error("pageDef must have id, title, and components array.");
      }
      parsed.components.forEach((c: PageComponentDef, i: number) => {
        if (!c.id || !c.type) throw new Error(`Component ${i} must have id and type.`);
        if (!(c.type in REGISTRY)) throw new Error(`Unknown type: ${c.type}`);
      });
      setPageDef(parsed);
      setError(null);
      setValues({});
      setFieldErrors({});
      setSubmittedValues(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const validateForm = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    pageDef.components.forEach((comp) => {
      const val = values[comp.id] ?? "";
      const required = comp.required === true;
      if (required) {
        if (comp.type === "checkbox") {
          if (val !== "true") errs[comp.id] = "This field is required";
        } else if (comp.type === "multiselect") {
          if (!val.trim() || val.split(",").every((s) => !s.trim())) {
            errs[comp.id] = "Select at least one option";
          }
        } else if (!val.trim()) {
          errs[comp.id] = "This field is required";
        }
      }
      if (comp.type === "email" && val && !validateEmail(val)) errs[comp.id] = "Invalid email address";
      if (comp.type === "phone" && val && !validatePhone(val)) errs[comp.id] = "Invalid phone number";
      if (comp.type === "url" && val && !validateUrl(val)) errs[comp.id] = "Please enter a valid URL";
    });
    return errs;
  };

  const handleSubmit = () => {
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setFieldErrors({});
    setSubmittedValues(values);
    toast.success("Form submitted successfully!");
  };

  const renderComp = (comp: PageComponentDef) => {
    const { id, type, onChange: onChangeRef, ...rawProps } = comp;
    const Component = REGISTRY[type as PageComponentType];
    if (!Component) return <div key={id} className="text-red-500">Unknown: {type}</div>;

    const value = values[id] ?? "";
    const actionIds = parseActionRef(onChangeRef);
    const handleChange = (next: string) => {
      setValues((prev) => ({ ...prev, [id]: next }));
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
      if (actionIds?.length) runActions(actionIds, next, comp);
    };

    const props: Record<string, unknown> = {
      value,
      onChange: handleChange,
      ...rawProps,
      ...getVariantProps(type as PageComponentType),
    };
    if ((type === "select" || type === "radio" || type === "multiselect") && !Array.isArray(props.options)) props.options = [];

    return (
      <div
        key={id}
        className="rounded-[calc(var(--fb-radius)*0.92)] border border-[color:color-mix(in_srgb,var(--fb-text)_7%,var(--fb-surface))] bg-[color:color-mix(in_srgb,var(--fb-text)_2.5%,var(--fb-surface))] p-4 shadow-sm sm:p-5"
      >
        <Component {...(props as Record<string, unknown>)} />
        {fieldErrors[id] && (
          <p className="mt-2 text-sm text-rose-600" role="alert">
            {fieldErrors[id]}
          </p>
        )}
      </div>
    );
  };

  const panelInput =
    "w-full h-[400px] px-4 py-3 rounded-xl border-2 border-slate-200 bg-white font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

  const appearance = getAppearance(pageDef);
  const appearanceVars = getAppearanceStyles(pageDef);
  const inputChromeParent = getInputChromeParentClass(appearance);
  const submitButtonClass = getSubmitButtonClass(appearance);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="md:w-1/2 space-y-4 min-h-0 flex flex-col">
        <aside
          className="rounded-xl border border-teal-100 bg-teal-50/80 px-4 py-3 text-sm text-teal-950"
          aria-label="How to use this screen"
        >
          <p className="font-medium text-teal-900">Quick steps</p>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-teal-900/90">
            <li>This is the full <strong>PageDef</strong> format (same as the visual builder).</li>
            <li>After <strong>Save</strong> in the builder, open this tab again — it loads your saved page.</li>
            <li>Click <strong>Apply &amp; render page</strong> after JSON edits.</li>
          </ol>
        </aside>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex-1 min-h-0 flex flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-800">Editor — PageDef (JSON)</h2>
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Step 1</span>
          </div>
          {showSavedBanner && (
            <p className="text-sm text-emerald-700 mt-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
              Loaded from <strong>Formvity</strong> (local save). Edit JSON and click Apply to re-render, or use{" "}
              <strong>Reset example</strong> for the demo page.
            </p>
          )}
          <p className="text-sm text-slate-500 mt-2">
            Use <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">&quot;onChange&quot;: &quot;@actionDef.logName&quot;</code> to run actions from the{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">actions</code> map.
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className={panelInput}
            spellCheck={false}
          />
          {error && (
            <p role="alert" className="text-sm text-rose-600 mt-2 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
              {error}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Apply &amp; render page
            </button>
            <button
              type="button"
              onClick={resetExample}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              Reset example
            </button>
          </div>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col space-y-3 overflow-hidden md:w-1/2">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Live page</p>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div
            className="relative overflow-hidden rounded-[1.2rem] border border-slate-300/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:p-4"
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
            <div
              className={`relative ${formCardShellClass} overflow-hidden bg-[color:var(--fb-surface)] text-[color:var(--fb-text)]`}
              style={{ boxShadow: getFormCardBoxShadow(pageDef) }}
            >
              <div className={formAccentBarClass} />
              <FormHeader variant="static" pageDef={pageDef} />
              <div className={`space-y-5 px-5 py-6 sm:space-y-6 sm:px-8 sm:py-8 ${inputChromeParent}`}>
                {pageDef.components.map(renderComp)}
                <div className="border-t border-[color:color-mix(in_srgb,var(--fb-text)_8%,var(--fb-surface))] pt-6 sm:pt-7">
                  <button type="button" onClick={handleSubmit} className={submitButtonClass}>
                    <svg className="size-5 shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 shrink-0 space-y-4">
        {submittedValues ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Submitted Values</h2>
            <dl className="space-y-2">
              {pageDef.components.map((comp) => {
                const val = submittedValues[comp.id];
                if (val === undefined || (typeof val === "string" && !val.trim())) return null;
                const label = (comp.label as string) || comp.id;
                return (
                  <div key={comp.id} className="flex gap-2 py-2 border-b border-slate-100 last:border-0">
                    <dt className="font-medium text-slate-600 shrink-0">{label}:</dt>
                    <dd className="text-slate-800 break-words">{String(val)}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ) : Object.keys(values).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-slate-700 mb-3">Current values</h2>
            <pre className="text-xs bg-slate-50 text-slate-700 p-4 rounded-xl border border-slate-100 overflow-auto max-h-48">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
