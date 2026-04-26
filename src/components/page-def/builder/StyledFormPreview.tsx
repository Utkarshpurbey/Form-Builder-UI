import { useEffect, useState } from "react";
import type { PageComponentDef, PageComponentType, PageDef } from "./pageDef";
import { REGISTRY, getVariantProps } from "./registry";
import { FormHeader } from "./FormHeader";
import {
  formAccentBarClass,
  formCardShellClass,
  getAppearance,
  getAppearanceStyles,
  getFormCardBoxShadow,
  getInputChromeParentClass,
  getSubmitButtonClass,
} from "./appearance";

function parseActionRef(val: unknown): string[] | null {
  if (typeof val !== "string") return null;
  const parts = val.split(",").map((s) => s.trim());
  const ids = parts.map((s) => s.match(/^@actionDef\.(.+)$/)?.[1]).filter(Boolean) as string[];
  return ids.length > 0 ? ids : null;
}

export interface StyledFormPreviewProps {
  pageDef: PageDef;
  className?: string;
}

/**
 * Builder PageDef with full `formSettings.appearance` — same visual shell as the live JSON preview.
 */
export function StyledFormPreview({ pageDef, className = "" }: StyledFormPreviewProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues({});
  }, [pageDef]);

  const appearance = getAppearance(pageDef);
  const appearanceVars = getAppearanceStyles(pageDef);
  const inputChromeParent = getInputChromeParentClass(appearance);
  const submitButtonClass = getSubmitButtonClass(appearance);

  const renderComp = (comp: PageComponentDef) => {
    const { id, type, onChange: onChangeRef, ...rawProps } = comp;
    const Component = REGISTRY[type as PageComponentType];
    if (!Component) {
      return (
        <div key={id} className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          Unknown type: {type}
        </div>
      );
    }

    const value = values[id] ?? "";
    const actionIds = parseActionRef(onChangeRef);

    const handleChange = (next: string) => {
      setValues((prev) => {
        const merged = { ...prev, [id]: next };
        if (actionIds?.length && pageDef.actions) {
          const setValue = (fid: string, v: string) => {
            merged[fid] = v;
          };
          for (const aid of actionIds) {
            const code = pageDef.actions?.[aid];
            if (!code) continue;
            try {
              const fn = new Function("ctx", code) as (ctx: {
                value: string;
                values: Record<string, string>;
                component: PageComponentDef;
                setValue: (fid: string, v: string) => void;
              }) => void;
              fn({ value: next, values: merged, component: comp, setValue });
            } catch (e) {
              console.error("Action error", aid, e);
            }
          }
        }
        return merged;
      });
    };

    const props: Record<string, unknown> = {
      value,
      onChange: handleChange,
      ...rawProps,
      ...getVariantProps(type as PageComponentType),
    };
    if ((type === "select" || type === "radio" || type === "multiselect") && !Array.isArray(props.options)) {
      props.options = [];
    }

    return (
      <div
        key={id}
        className="rounded-[calc(var(--fb-radius)*0.92)] border border-[color:color-mix(in_srgb,var(--fb-text)_7%,var(--fb-surface))] bg-[color:color-mix(in_srgb,var(--fb-text)_2.5%,var(--fb-surface))] p-4 shadow-sm sm:p-5"
      >
        <Component {...(props as Record<string, unknown>)} />
      </div>
    );
  };

  return (
    <div className={className}>
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
          <FormHeader variant="static" pageDef={pageDef} compact />
          <div className={`space-y-4 px-4 py-5 sm:space-y-5 sm:px-7 sm:py-6 ${inputChromeParent}`}>
            {pageDef.components.map(renderComp)}
            <div className="border-t border-[color:color-mix(in_srgb,var(--fb-text)_8%,var(--fb-surface))] pt-5 sm:pt-6">
              <button
                type="button"
                disabled
                className={`${submitButtonClass} cursor-not-allowed opacity-[0.92]`}
                aria-label="Submit disabled in preview"
              >
                <span>Submit</span>
                <span className="ml-1 text-xs font-normal opacity-80">(preview)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
