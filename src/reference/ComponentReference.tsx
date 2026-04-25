/**
 * Component reference: docs + live demos for PageDef builder component types.
 */
import { useState, useEffect } from "react";
import {
  BASE_PROPS_DOC,
  COMPONENT_SPECS,
  PAGEDEF_STRUCTURE,
} from "./component-reference-data";
import type { ComponentSpec } from "./component-reference-data";
import { REGISTRY, getVariantProps } from "../components/page-def/builder/registry";
import type { PageComponentType } from "../components/page-def/builder/pageDef";

const DEFAULT_VALUES: Record<string, string> = {
  text: "",
  number: "",
  email: "",
  phone: "",
  url: "",
  textarea: "",
  select: "",
  radio: "",
  multiselect: "",
  checkbox: "false",
  date: "",
  time: "",
};

/** Build JSON-serializable props passed to the live demo. */
function getLivePropsJson(spec: ComponentSpec, currentValue: string): Record<string, unknown> {
  const example = spec.exampleJson as Record<string, unknown>;
  const live: Record<string, unknown> = {
    id: example.id ?? spec.type.toLowerCase(),
    type: spec.type,
    label: example.label ?? spec.type,
    value: currentValue,
    onChange: "@actionDef.actionId",
  };
  if (example.helperText != null) live.helperText = example.helperText;
  if (example.required != null) live.required = example.required;
  if (example.placeholder != null) live.placeholder = example.placeholder;
  if (example.options != null) live.options = example.options;
  if (example.rows != null) live.rows = example.rows;
  if (example.checkboxLabel != null) live.checkboxLabel = example.checkboxLabel;
  if (example.min != null) live.min = example.min;
  if (example.max != null) live.max = example.max;
  return live;
}

interface ComponentDemoProps {
  spec: ComponentSpec;
  value: string;
  onChange: (v: string) => void;
  parsedProps: Record<string, unknown> | null;
}

function ComponentDemo({ spec, value, onChange, parsedProps }: ComponentDemoProps) {
  const Component = REGISTRY[spec.type as PageComponentType];
  if (!Component) return null;

  const base = parsedProps ?? (spec.exampleJson as Record<string, unknown>);
  const props: Record<string, unknown> = {
    value,
    onChange,
    label: base.label ?? spec.type,
    helperText: base.helperText,
    required: base.required ?? false,
    ...getVariantProps(spec.type as PageComponentType),
  };
  if (base.placeholder != null) props.placeholder = String(base.placeholder);
  if (base.options != null) props.options = Array.isArray(base.options) ? base.options : [];
  if (base.rows != null) props.rows = Number(base.rows);
  if (base.checkboxLabel != null) props.checkboxLabel = String(base.checkboxLabel);
  if (base.min != null) props.min = String(base.min);
  if (base.max != null) props.max = String(base.max);
  if (base.id != null) props.id = String(base.id);

  return (
    <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6">
      <Component {...(props as Record<string, unknown>)} />
    </div>
  );
}

const initialPropsJson = COMPONENT_SPECS.reduce(
  (acc, spec) => ({
    ...acc,
    [spec.type]: JSON.stringify(
      getLivePropsJson(spec, DEFAULT_VALUES[spec.type] ?? ""),
      null,
      2
    ),
  }),
  {} as Record<string, string>
);

export default function ComponentReference() {
  const [values, setValues] = useState<Record<string, string>>(DEFAULT_VALUES);
  const [propsJson, setPropsJson] = useState<Record<string, string>>(initialPropsJson);

  useEffect(() => {
    let updates: Record<string, string> | null = null;
    COMPONENT_SPECS.forEach((spec) => {
      const raw = propsJson[spec.type];
      if (raw == null) return;
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (typeof parsed.value === "string") {
          updates = updates ?? {};
          updates[spec.type] = parsed.value;
        }
      } catch {
        // ignore parse errors
      }
    });
    if (updates) setValues((prev) => ({ ...prev, ...updates }));
  }, [propsJson]);

  const handleChange = (type: string) => (v: string) => {
    setValues((prev) => ({ ...prev, [type]: v }));
    setPropsJson((prev) => {
      const raw = prev[type];
      try {
        const parsed = JSON.parse(raw ?? "{}") as Record<string, unknown>;
        parsed.value = v;
        return { ...prev, [type]: JSON.stringify(parsed, null, 2) };
      } catch {
        return prev;
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            PageDef component reference
          </h1>
          <p className="text-slate-500 mt-2">
            All components accept the base props below. Use{" "}
            <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-sm">type</code> in
            JSON to select the component; other keys are passed as props. Try each component below.
          </p>
        </header>

        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">PageDef structure</h2>
          <pre className="text-sm bg-slate-50 text-slate-700 p-4 rounded-xl border border-slate-100 overflow-x-auto">
            {JSON.stringify(PAGEDEF_STRUCTURE, null, 2)}
          </pre>
          <p className="text-sm text-slate-500 mt-3">
            For <code className="px-1 rounded bg-slate-100">onChange</code>, use{" "}
            <code className="px-1 rounded bg-slate-100">&quot;@actionDef.actionId&quot;</code> to
            run JavaScript from <code className="px-1 rounded bg-slate-100">actions</code>. Action
            code receives <code className="px-1 rounded bg-slate-100">ctx</code> with{" "}
            <code className="px-1 rounded bg-slate-100">value</code>,{" "}
            <code className="px-1 rounded bg-slate-100">values</code>,{" "}
            <code className="px-1 rounded bg-slate-100">component</code>,{" "}
            <code className="px-1 rounded bg-slate-100">setValue(id, v)</code>.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Base props (all components)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-medium text-slate-700">Prop</th>
                  <th className="text-left py-2 pr-4 font-medium text-slate-700">Type</th>
                  <th className="text-left py-2 font-medium text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(BASE_PROPS_DOC).map(([prop, spec]) => (
                  <tr key={prop} className="border-b border-slate-100">
                    <td className="py-2 pr-4">
                      <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        {prop}
                      </code>
                      {spec.required && <span className="text-rose-500 ml-1">*</span>}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">{spec.type}</td>
                    <td className="py-2 text-slate-600">{spec.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-lg font-semibold text-slate-800">Components — try them</h2>
          {COMPONENT_SPECS.map((spec) => (
            <div
              key={spec.type}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <code className="text-base font-medium text-indigo-600">{spec.type}</code>
                <span className="text-slate-500 text-sm">— {spec.description}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                <strong>Value format:</strong> {spec.valueFormat}
              </p>

              {(() => {
                const raw = propsJson[spec.type] ?? "";
                let parsed: Record<string, unknown> | null = null;
                let parseError: string | null = null;
                try {
                  parsed = raw.trim() ? (JSON.parse(raw) as Record<string, unknown>) : null;
                } catch (e) {
                  parseError = e instanceof Error ? e.message : "Invalid JSON";
                }
                const displayValue =
                  parsed && typeof parsed.value === "string"
                    ? parsed.value
                    : values[spec.type] ?? DEFAULT_VALUES[spec.type] ?? "";

                return (
                  <>
                    <div className="mt-5">
                      <h3 className="text-sm font-medium text-slate-700 mb-2">Live demo</h3>
                      <ComponentDemo
                        spec={spec}
                        value={displayValue}
                        onChange={handleChange(spec.type)}
                        parsedProps={parsed}
                      />
                    </div>

                    <div className="mt-5">
                      <h3 className="text-sm font-medium text-slate-700 mb-2">
                        Edit props JSON (changes apply to the component above)
                      </h3>
                      <textarea
                        value={raw}
                        onChange={(e) =>
                          setPropsJson((prev) => ({ ...prev, [spec.type]: e.target.value }))
                        }
                        className="w-full min-h-[180px] px-4 py-3 rounded-xl border-2 border-slate-200 bg-white font-mono text-xs text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10"
                        spellCheck={false}
                        placeholder='{ "id": "...", "type": "...", "label": "...", "value": "" }'
                      />
                      {parseError && (
                        <p className="text-sm text-rose-600 mt-2 flex items-center gap-1.5" role="alert">
                          <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
                          {parseError}
                        </p>
                      )}
                    </div>
                  </>
                );
              })()}

              {spec.specificProps.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Specific props</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-1.5 pr-3 font-medium text-slate-600">Prop</th>
                        <th className="text-left py-1.5 pr-3 font-medium text-slate-600">Type</th>
                        <th className="text-left py-1.5 font-medium text-slate-600">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spec.specificProps.map((p) => (
                        <tr key={p.name} className="border-b border-slate-50">
                          <td className="py-1.5 pr-3">
                            <code className="px-1 rounded bg-slate-100 text-slate-800">{p.name}</code>
                            {p.required && <span className="text-rose-500 ml-0.5">*</span>}
                          </td>
                          <td className="py-1.5 pr-3 text-slate-600">{p.type}</td>
                          <td className="py-1.5 text-slate-600">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
