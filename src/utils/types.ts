export type QuestionType =
  | "text"
  | "select"
  | "number"
  | "email"
  | "phone"
  | "description";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  helperText?: string;
  required: boolean;
  options?: string[];
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface ValidationErrors {
  [key: string]: string;
}