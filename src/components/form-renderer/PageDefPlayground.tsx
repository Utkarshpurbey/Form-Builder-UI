import { useState } from "react";
import type { PageDef, PageComponentDef } from "../../utils/pageDef";
import { Text } from "./answer-inputs/Text";
import { Number } from "./answer-inputs/Number";
import { Email } from "./answer-inputs/Email";
import { Phone } from "./answer-inputs/Phone";
import { TextArea } from "./answer-inputs/TextArea";
import { Select } from "./answer-inputs/Select";
import { Checkbox } from "./answer-inputs/Checkbox";
import { Radio } from "./answer-inputs/Radio";
import { Date } from "./answer-inputs/Date";
import { Time } from "./answer-inputs/Time";
import { MultiSelect } from "./answer-inputs/MultiSelect";
import { Url } from "./answer-inputs/Url";

const EXAMPLE_PAGE_DEF: PageDef = {
  id: "page-1",
  title: "JSON PageDef",
  description: "Edit JSON on the left. Use \"onChange\": \"@actionDef.logName\" to run actions.",
  components: [
    { id: "name", type: "Text", label: "Full Name", required: true, onChange: "@actionDef.logName" },
    { id: "age", type: "Number", label: "Age", min: 0, max: 120 },
    { id: "email", type: "Email", label: "Email", required: true },
    { id: "country", type: "Select", label: "Country", required: true, options: ["India", "USA", "UK"] },
    { id: "preferences", type: "MultiSelect", label: "Preferences", options: ["News", "Updates", "Marketing"] },
    { id: "contactMethod", type: "Radio", label: "Contact method", options: ["Email", "Phone", "Post"] },
    { id: "dob", type: "Date", label: "Date of birth" },
    { id: "agreed", type: "Checkbox", label: "I agree to terms", checkboxLabel: "Yes, I agree" },
    { id: "website", type: "Url", label: "Website", placeholder: "https://" },
    { id: "about", type: "TextArea", label: "About you", rows: 4 },
  ],
  actions: {
    logName: "alert('Name changed to', ctx.value);",
  },
};

const REGISTRY = {
  Text,
  Number,
  Email,
  Phone,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Date,
  Time,
  MultiSelect,
  Url,
} as const;

type RegistryKey = keyof typeof REGISTRY;

function parseActionRef(val: unknown): string[] | null {
  if (typeof val !== "string") return null;
  const parts = val.split(",").map((s) => s.trim());
  const ids = parts.map((s) => s.match(/^@actionDef\.(.+)$/)?.[1]).filter(Boolean) as string[];
  return ids.length > 0 ? ids : null;
}

export default function PageDefPlayground() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(EXAMPLE_PAGE_DEF, null, 2));
  const [pageDef, setPageDef] = useState<PageDef>(EXAMPLE_PAGE_DEF);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const renderComp = (comp: PageComponentDef) => {
    const { id, type, onChange: onChangeRef, ...rawProps } = comp;
    const Component = REGISTRY[type as RegistryKey];
    if (!Component) return <div key={id} className="text-red-500">Unknown: {type}</div>;

    const value = values[id] ?? "";
    const actionIds = parseActionRef(onChangeRef);
    const handleChange = (next: string) => {
      setValues((prev) => ({ ...prev, [id]: next }));
      if (actionIds?.length) runActions(actionIds, next, comp);
    };

    const props: Record<string, unknown> = {
      value,
      onChange: handleChange,
      ...rawProps,
    };
    if ((type === "Select" || type === "Radio" || type === "MultiSelect") && !Array.isArray(props.options)) props.options = [];

    return (
      <div key={id}>
        <Component {...(props as any)} />
      </div>
    );
  };

  const panelInput =
    "w-full h-[400px] px-4 py-3 rounded-xl border-2 border-slate-200 bg-white font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="md:w-1/2 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">PageDef JSON</h2>
          <p className="text-sm text-slate-500 mt-1">
            Use <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">&quot;onChange&quot;: &quot;@actionDef.logName&quot;</code> to run actions.
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
          <button
            type="button"
            onClick={handleApply}
            className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Apply &amp; render page
          </button>
        </div>
      </div>
      <div className="md:w-1/2 space-y-6 overflow-auto">
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{pageDef.title}</h1>
          {pageDef.description && (
            <p className="text-slate-500 mt-2 leading-relaxed">{pageDef.description}</p>
          )}
          <div className="mt-6 space-y-5">{pageDef.components.map(renderComp)}</div>
        </div>
        {Object.keys(values).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-slate-700 mb-3">Values</h2>
            <pre className="text-xs bg-slate-50 text-slate-700 p-4 rounded-xl border border-slate-100 overflow-auto max-h-48">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
