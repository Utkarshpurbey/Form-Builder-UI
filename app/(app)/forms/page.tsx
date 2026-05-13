"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { PageDef, PageComponentDef, PageComponentType } from "../../../src/components/page-def/builder/pageDef";
import { REGISTRY, getVariantProps } from "../../../src/components/page-def/builder/registry";
import { FormHeader } from "../../../src/components/page-def/builder/FormHeader";
import {
  formAccentBarClass,
  formCardShellClass,
  getAppearance,
  getAppearanceStyles,
  getFormCardBoxShadow,
  getInputChromeParentClass,
  getSubmitButtonClass,
} from "../../../src/components/page-def/builder/appearance";
import { useFormBuilderDraft } from "../../../src/context/FormBuilderDraftContext";

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

function parseActionRef(val: unknown): string[] | null {
  if (typeof val !== "string") return null;
  const parts = val.split(",").map((s) => s.trim());
  const ids = parts.map((s) => s.match(/^@actionDef\.(.+)$/)?.[1]).filter(Boolean) as string[];
  return ids.length > 0 ? ids : null;
}

export default function FormsPage() {
  const router = useRouter();
  const { savedFormDef } = useFormBuilderDraft();
  const [pageDef, setPageDef] = useState<PageDef | null>(savedFormDef);
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submittedValues, setSubmittedValues] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    setPageDef(savedFormDef);
  }, [savedFormDef]);

  const runActions = (actionIds: string[], value: string, comp: PageComponentDef) => {
    if (!pageDef?.actions || actionIds.length === 0) return;
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

  const validateForm = (): Record<string, string> => {
    if (!pageDef) return {};
    const errs: Record<string, string> = {};
    pageDef.components.forEach((comp) => {
      const val = values[comp.id] ?? "";
      const required = comp.required === true;
      if (required) {
        if (comp.type === "checkbox") {
          if (val !== "true") errs[comp.id] = "This field is required";
        } else if (comp.type === "multiselect") {
          if (!val.trim() || val.split(",").every((s) => !s.trim())) errs[comp.id] = "Select at least one option";
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

  if (!pageDef) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">No form draft yet</h1>
          <p className="mt-2 text-sm text-slate-600">
            Build a form in the visual builder and click <strong className="text-slate-800">Save</strong> — your draft is kept in memory for this session until you connect an API.
          </p>
          <button
            type="button"
            onClick={() => router.push("/builder")}
            className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Open visual builder
          </button>
        </div>
      </div>
    );
  }

  const appearance = getAppearance(pageDef);
  const appearanceVars = getAppearanceStyles(pageDef);
  const inputChromeParent = getInputChromeParentClass(appearance);
  const submitButtonClass = getSubmitButtonClass(appearance);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100/80 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Maker preview — session draft</p>
        <p className="mb-4 text-sm text-slate-600">
          Try your saved PageDef here. Published forms for respondents will use separate public URLs later.
        </p>
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
              {pageDef.components.map((comp) => {
                const { id, type, onChange: onChangeRef, ...rawProps } = comp;
                const Component = REGISTRY[type as PageComponentType];
                if (!Component) return null;

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
                if ((type === "select" || type === "radio" || type === "multiselect") && !Array.isArray(props.options)) {
                  props.options = [];
                }

                return (
                  <div
                    key={id}
                    className="rounded-[calc(var(--fb-radius)*0.92)] border border-[color:color-mix(in_srgb,var(--fb-text)_7%,var(--fb-surface))] bg-[color:color-mix(in_srgb,var(--fb-text)_2.5%,var(--fb-surface))] p-4 shadow-sm sm:p-5"
                  >
                    <Component {...(props as Record<string, unknown>)} />
                    {fieldErrors[id] ? (
                      <p className="mt-2 text-sm text-rose-600" role="alert">
                        {fieldErrors[id]}
                      </p>
                    ) : null}
                  </div>
                );
              })}
              <div className="border-t border-[color:color-mix(in_srgb,var(--fb-text)_8%,var(--fb-surface))] pt-6 sm:pt-7">
                <button type="button" onClick={handleSubmit} className={submitButtonClass}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {submittedValues ? (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Submitted values</h2>
            <dl className="space-y-2">
              {pageDef.components.map((comp) => {
                const val = submittedValues[comp.id];
                if (val === undefined || (typeof val === "string" && !val.trim())) return null;
                const label = (comp.label as string) || comp.id;
                return (
                  <div key={comp.id} className="flex gap-2 border-b border-slate-100 py-2 last:border-0">
                    <dt className="shrink-0 font-medium text-slate-600">{label}:</dt>
                    <dd className="break-words text-slate-800">{String(val)}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}
