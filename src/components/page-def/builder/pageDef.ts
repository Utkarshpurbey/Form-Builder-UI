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

export interface FormAppearanceSettings {
  primaryColor?: string;
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  borderRadius?: "sm" | "md" | "lg";
  submitStyle?: "solid" | "soft" | "outline";
  inputStyle?: "outline" | "filled";
}

export interface FormSettings {
  appearance?: FormAppearanceSettings;
}

export interface PageDef {
  id: string;
  title: string;
  description?: string;
  components: PageComponentDef[];
  formSettings?: FormSettings;
  /** Key = actionId, value = JS function body (receives `ctx`). */
  actions?: Record<string, string>;
}
