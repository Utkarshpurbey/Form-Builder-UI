/**
 * JSON shape for the visual builder and JSON playground (`JsonPlayground`).
 * Distinct from `lib/page-def`, which is the template / marketing schema.
 */
export type PageComponentType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "multiselect"
  | "url";

export interface PageComponentDef {
  id: string;
  type: PageComponentType;
  [prop: string]: unknown;
}

export interface PageDef {
  id: string;
  title: string;
  description?: string;
  components: PageComponentDef[];
  /** Key = actionId, value = JS function body (receives `ctx`). */
  actions?: Record<string, string>;
}
