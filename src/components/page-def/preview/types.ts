/** Question kinds supported by `preview/AnswerInput` (lib PageDef template previews). */
export type QuestionType =
  | "text"
  | "select"
  | "number"
  | "email"
  | "phone"
  | "description";

export interface BaseAnswerInputProps {
  value: string;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}
