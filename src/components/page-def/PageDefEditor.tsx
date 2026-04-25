import { useState } from "react";
import type { PageDef, PageComponentDef } from "../../lib/page-def";
import { getDefaultPageDefTemplate } from "../../lib/page-def-templates";
import {
  TextAnswerInput,
  NumberAnswerInput,
  EmailAnswerInput,
  PhoneAnswerInput,
  DescriptionAnswerInput,
  SelectAnswerInput,
} from "../form-inputs";

const COMPONENT_REGISTRY = {
  TextAnswerInput,
  NumberAnswerInput,
  EmailAnswerInput,
  PhoneAnswerInput,
  DescriptionAnswerInput,
  SelectAnswerInput,
} as const;

type RegistryKey = keyof typeof COMPONENT_REGISTRY;

interface PageDefEditorProps {
  initialPageDef?: PageDef;
}

const clonePageDef = (pageDef: PageDef): PageDef =>
  JSON.parse(JSON.stringify(pageDef)) as PageDef;

const parseActionRef = (val: unknown): string[] | null => {
  if (typeof val !== "string") return null;
  const parts = val.split(",").map((s) => s.trim());
  const ids = parts
    .map((s) => s.match(/^@actionDef\.(.+)$/)?.[1])
    .filter((id): id is string => Boolean(id));
  return ids.length > 0 ? ids : null;
};

export const PageDefEditor = ({ initialPageDef }: PageDefEditorProps) => {
  const startingPageDef = clonePageDef(
    initialPageDef ?? getDefaultPageDefTemplate()
  );
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(startingPageDef, null, 2)
  );
  const [pageDef, setPageDef] = useState<PageDef>(startingPageDef);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const runActions = (
    actionIds: string[],
    value: string,
    comp: PageComponentDef
  ) => {
    if (!pageDef.actions || actionIds.length === 0) return;

    actionIds.forEach((id) => {
      const code = pageDef.actions?.[id];
      if (!code) return;

      try {
        const fn = new Function(
          "ctx",
          code
        ) as (ctx: {
          value: string;
          values: Record<string, string>;
          component: PageComponentDef;
          setValue: (fieldId: string, next: string) => void;
        }) => void;

        fn({
          value,
          values,
          component: comp,
          setValue: (fieldId: string, next: string) =>
            setValues((prev) => ({ ...prev, [fieldId]: next })),
        });
      } catch (e) {
        console.error("Error running action", id, e);
      }
    });
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("JSON must describe an object.");
      }
      if (!parsed.id || !parsed.title || !Array.isArray(parsed.components)) {
        throw new Error(
          "pageDef must have id, title and components array fields."
        );
      }

      parsed.components.forEach((comp: PageComponentDef, index: number) => {
        if (!comp.id || !comp.type) {
          throw new Error(
            `Component at index ${index} must have id and type fields.`
          );
        }
        if (!(comp.type in COMPONENT_REGISTRY)) {
          throw new Error(
            `Component type "${comp.type}" is not allowed. Allowed types: ${Object.keys(COMPONENT_REGISTRY).join(", ")}`
          );
        }
      });

      setPageDef(parsed as PageDef);
      setError(null);
      setValues({});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid JSON pageDef.";
      setError(message);
    }
  };

  const renderComponent = (comp: PageComponentDef) => {
    const { id, type, onChange: onChangeRef, ...rawProps } = comp;
    const registryKey = type as RegistryKey;
    const Component = COMPONENT_REGISTRY[registryKey];

    if (!Component) {
      return (
        <div key={id} className="text-red-500">
          Unknown component type: {type}
        </div>
      );
    }

    const value = values[id] ?? "";
    const actionIds = parseActionRef(onChangeRef);

    const handleChange = (next: string) => {
      setValues((prev) => ({ ...prev, [id]: next }));
      if (actionIds && actionIds.length > 0) {
        runActions(actionIds, next, comp);
      }
    };

    const baseProps: Record<string, unknown> = {
      value,
      onChange: handleChange,
      ...rawProps,
    };
    if (type === "SelectAnswerInput" && !Array.isArray(baseProps.options)) {
      baseProps.options = [];
    }

    return (
      <div key={id} className="mb-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(baseProps as any)} />
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="md:w-1/2 w-full">
        <h2 className="text-xl font-semibold mb-2">PageDef JSON</h2>
        <p className="text-sm text-gray-500 mb-2">
          Define components using PageDef JSON. Use{" "}
          <code>&quot;onChange&quot;: &quot;@actionDef.logName&quot;</code> to
          run custom JS from <code>actions</code>.
        </p>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-[400px] p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && (
          <p className="text-red-500 text-sm mt-2 whitespace-pre-wrap">
            {error}
          </p>
        )}
        <button
          onClick={handleApplyJson}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Render page
        </button>
      </div>
      <div className="md:w-1/2 w-full">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">{pageDef.title}</h1>
          {pageDef.description && (
            <p className="text-sm text-gray-500 mt-2">
              {pageDef.description}
            </p>
          )}
          <div className="mt-4">
            {pageDef.components.map((comp) => renderComponent(comp))}
          </div>
        </div>
        {Object.keys(values).length > 0 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Current values</h2>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(values, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
