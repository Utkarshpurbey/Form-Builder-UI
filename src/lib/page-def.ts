export type PageComponentType =
  | "TextAnswerInput"
  | "NumberAnswerInput"
  | "EmailAnswerInput"
  | "PhoneAnswerInput"
  | "DescriptionAnswerInput"
  | "SelectAnswerInput";

export interface PageComponentDef {
  id: string;
  type: PageComponentType;
  /**
   * Props can reference actions via "@actionDef.<actionId>".
   * E.g. "onChange": "@actionDef.logName"
   */
  [prop: string]: unknown;
}

export interface PageDef {
  id: string;
  title: string;
  description?: string;
  components: PageComponentDef[];
  /**
   * Key = actionId, value = JS function body (receives `ctx`).
   * E.g. { "logName": "console.log('changed', ctx.value);" }
   */
  actions?: Record<string, string>;
}
