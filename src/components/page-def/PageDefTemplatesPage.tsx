import { useMemo } from "react";
import {
  PAGE_DEF_TEMPLATES,
} from "../../lib/page-def-templates";
import { INJECTED_PAGE_DEF_TEMPLATE_KEY } from "../page-def-builder/PageDefBuilder";
import type { PageDef as BuilderPageDef, PageComponentType } from "../../utils/pageDef";
import type { PageDef as TemplatePageDef } from "../../lib/page-def";

type TemplateEntry = [string, (typeof PAGE_DEF_TEMPLATES)[string]];

interface PageDefTemplatesPageProps {
  onOpenBuilder: () => void;
}

const COMPONENT_TYPE_MAP: Record<
  string,
  PageComponentType
> = {
  TextAnswerInput: "text",
  NumberAnswerInput: "number",
  EmailAnswerInput: "email",
  PhoneAnswerInput: "phone",
  DescriptionAnswerInput: "textarea",
  SelectAnswerInput: "select",
};

const toBuilderPageDef = (template: TemplatePageDef): BuilderPageDef => {
  const components = template.components.map((component) => {
    const mappedType = COMPONENT_TYPE_MAP[String(component.type)];
    if (!mappedType) {
      return {
        ...component,
        type: "text" as PageComponentType,
      };
    }
    return {
      ...component,
      type: mappedType,
    };
  });

  return {
    id: template.id,
    title: template.title,
    description: template.description,
    components,
    actions: template.actions,
  };
};

interface PreviewTheme {
  start: string;
  end: string;
  badge: string;
  fieldRows: [number, number, number];
  cta: string;
}

const PREVIEW_THEMES: Record<string, PreviewTheme> = {
  "job-application": {
    start: "#4f46e5",
    end: "#2563eb",
    badge: "Hiring",
    fieldRows: [470, 420, 370],
    cta: "Apply",
  },
  "customer-support-request": {
    start: "#0f766e",
    end: "#0ea5e9",
    badge: "Support",
    fieldRows: [470, 440, 390],
    cta: "Submit Ticket",
  },
  "event-registration": {
    start: "#7c3aed",
    end: "#ec4899",
    badge: "Events",
    fieldRows: [460, 420, 400],
    cta: "Register",
  },
  "patient-intake": {
    start: "#0f766e",
    end: "#16a34a",
    badge: "Healthcare",
    fieldRows: [450, 430, 380],
    cta: "Save Intake",
  },
  "lead-capture": {
    start: "#b45309",
    end: "#f59e0b",
    badge: "Sales",
    fieldRows: [465, 430, 385],
    cta: "Capture Lead",
  },
};

const escapeSvgText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Keep preview header readable; full title is on the card below. */
const truncatePreviewTitle = (value: string, max = 48) =>
  value.length <= max ? value : `${value.slice(0, max - 1)}…`;

const PREVIEW_SVG_W = 600;
/** Shorter than 16:9 so cards feel less tall; keep 600 width for crisp scaling */
const PREVIEW_SVG_H = 220;

const getTemplatePreviewImage = (templateKey: string, title: string) => {
  const theme = PREVIEW_THEMES[templateKey] ?? PREVIEW_THEMES["job-application"];
  const safeTitle = escapeSvgText(truncatePreviewTitle(title));
  const safeBadge = escapeSvgText(theme.badge);
  const safeCta = escapeSvgText(theme.cta);

  const cardX = 44;
  const cardY = 44;
  const cardW = 512;
  const cardH = 156;
  const pad = 24;
  const innerLeft = cardX + pad;
  const innerTop = cardY + 16;
  const innerW = cardW - pad * 2;
  const titleBarW = Math.min(280, innerW);
  const row1 = Math.min(theme.fieldRows[0], innerW);
  const row2 = Math.min(theme.fieldRows[1], innerW);
  const row3 = Math.min(theme.fieldRows[2], innerW);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${PREVIEW_SVG_W}" height="${PREVIEW_SVG_H}" viewBox="0 0 ${PREVIEW_SVG_W} ${PREVIEW_SVG_H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.start}" />
      <stop offset="100%" stop-color="${theme.end}" />
    </linearGradient>
  </defs>
  <rect width="${PREVIEW_SVG_W}" height="${PREVIEW_SVG_H}" fill="url(#bg)" rx="18" />
  <rect x="24" y="12" width="86" height="20" rx="10" fill="rgba(255,255,255,0.22)" />
  <text x="36" y="26" font-size="11" font-weight="600" font-family="system-ui, Arial, sans-serif" fill="#ffffff">${safeBadge}</text>
  <text x="120" y="26" font-size="14" font-weight="600" font-family="system-ui, Arial, sans-serif" fill="#ffffff">${safeTitle}</text>
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="14" fill="rgba(255,255,255,0.96)" />
  <rect x="${innerLeft}" y="${innerTop}" width="${titleBarW}" height="12" rx="6" fill="#cbd5e1" />
  <rect x="${innerLeft}" y="${innerTop + 20}" width="${row1}" height="9" rx="4" fill="#e2e8f0" />
  <rect x="${innerLeft}" y="${innerTop + 36}" width="${row2}" height="9" rx="4" fill="#e2e8f0" />
  <rect x="${innerLeft}" y="${innerTop + 52}" width="${row3}" height="9" rx="4" fill="#e2e8f0" />
  <rect x="${innerLeft}" y="${innerTop + 72}" width="152" height="24" rx="8" fill="${theme.start}" />
  <text x="${innerLeft + 12}" y="${innerTop + 88}" font-size="11" font-weight="600" font-family="system-ui, Arial, sans-serif" fill="#ffffff">${safeCta}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const PageDefTemplatesPage = ({ onOpenBuilder }: PageDefTemplatesPageProps) => {
  const templateEntries = useMemo(
    () => Object.entries(PAGE_DEF_TEMPLATES) as TemplateEntry[],
    []
  );

  const handleEditInBuilder = (template: TemplatePageDef) => {
    const builderTemplate = toBuilderPageDef(template);
    localStorage.setItem(
      INJECTED_PAGE_DEF_TEMPLATE_KEY,
      JSON.stringify(builderTemplate)
    );
    onOpenBuilder();
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">PageDef Templates</h1>
        <p className="text-sm text-slate-600 mt-1">
          Pick any pre-made template and move to the PageDef Builder only when
          you want to customize it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templateEntries.map(([key, template]) => {
          const previewImage = getTemplatePreviewImage(key, template.title);
          return (
            <div
              key={key}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="rounded-lg border border-slate-100 bg-slate-50 overflow-hidden">
                <img
                  src={previewImage}
                  alt={`${template.title} preview`}
                  width={PREVIEW_SVG_W}
                  height={PREVIEW_SVG_H}
                  className="w-full h-auto block max-w-full"
                  decoding="async"
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <h2 className="mt-3 text-base font-semibold text-slate-800">
                  {template.title}
                </h2>
                <span className="mt-3 text-[11px] uppercase tracking-wide px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {key}
                </span>
              </div>
              {template.description && (
                <p className="text-sm text-slate-600 mt-2">{template.description}</p>
              )}
              <p className="text-xs text-slate-500 mt-3">
                Components: {template.components.length}
              </p>
              <button
                type="button"
                onClick={() => handleEditInBuilder(template)}
                className="mt-4 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Edit in PageDef Builder
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
