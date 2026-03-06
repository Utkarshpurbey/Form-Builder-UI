export type PageComponentType =
  | "Text"
  | "Number"
  | "Email"
  | "Phone"
  | "TextArea"
  | "Select"
  | "Checkbox"
  | "Radio"
  | "Date"
  | "Time"
  | "MultiSelect"
  | "Url";

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
