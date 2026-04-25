import { useEffect, useState } from "react";
import type { PageDef, PageComponentDef } from "../../../lib/page-def";
import {
  TextAnswerInput,
  NumberAnswerInput,
  EmailAnswerInput,
  PhoneAnswerInput,
  DescriptionAnswerInput,
  SelectAnswerInput,
} from "./index";

const COMPONENT_REGISTRY = {
  TextAnswerInput,
  NumberAnswerInput,
  EmailAnswerInput,
  PhoneAnswerInput,
  DescriptionAnswerInput,
  SelectAnswerInput,
} as const;

type RegistryKey = keyof typeof COMPONENT_REGISTRY;

const parseActionRef = (val: unknown): string[] | null => {
  if (typeof val !== "string") return null;
  const parts = val.split(",").map((s) => s.trim());
  const ids = parts
    .map((s) => s.match(/^@actionDef\.(.+)$/)?.[1])
    .filter((id): id is string => Boolean(id));
  return ids.length > 0 ? ids : null;
};

interface LivePreviewProps {
  pageDef: PageDef;
  className?: string;
}

/**
 * Renders a PageDef from `lib/page-def` using the preview input components in this folder.
 * Values are local state; resets when `pageDef` identity changes.
 */
export const LivePreview = ({
  pageDef,
  className = "",
}: LivePreviewProps) => {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues({});
  }, [pageDef]);

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

  const renderComponent = (comp: PageComponentDef) => {
    const { id, type, onChange: onChangeRef, ...rawProps } = comp;
    const registryKey = type as RegistryKey;
    const Component = COMPONENT_REGISTRY[registryKey];

    if (!Component) {
      return (
        <div key={id} className="text-red-500 text-sm">
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
      <div key={id} className="mb-4 last:mb-0">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(baseProps as any)} />
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">{pageDef.title}</h1>
        {pageDef.description && (
          <p className="text-sm text-slate-500 mt-2">{pageDef.description}</p>
        )}
        <div className="mt-4">{pageDef.components.map((c) => renderComponent(c))}</div>
      </div>
    </div>
  );
};
