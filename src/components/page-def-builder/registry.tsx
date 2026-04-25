import type React from "react";
import type { PageComponentType } from "../../utils/pageDef";
import { TextField } from "../form-renderer/answer-inputs/TextField";
import { Number as NumberInput } from "../form-renderer/answer-inputs/Number";
import { TextArea } from "../form-renderer/answer-inputs/TextArea";
import { Select } from "../form-renderer/answer-inputs/Select";
import { Choice } from "../form-renderer/answer-inputs/Choice";
import { Checkbox } from "../form-renderer/answer-inputs/Checkbox";
import { DateTime } from "../form-renderer/answer-inputs/DateTime";

/** Maps each PageDef type to a core component. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const REGISTRY: Record<PageComponentType, React.ComponentType<any>> = {
  text: TextField,
  email: TextField,
  phone: TextField,
  url: TextField,
  number: NumberInput,
  textarea: TextArea,
  select: Select,
  radio: Choice,
  multiselect: Choice,
  checkbox: Checkbox,
  date: DateTime,
  time: DateTime,
};

/** Extra props to inject when rendering a type (e.g. variant, multiple). */
export function getVariantProps(type: PageComponentType): Record<string, unknown> {
  switch (type) {
    case "text":
      return { variant: "text" };
    case "email":
      return { variant: "email" };
    case "phone":
      return { variant: "phone" };
    case "url":
      return { variant: "url" };
    case "radio":
      return { variant: "radio" };
    case "multiselect":
      return { variant: "multiselect" };
    case "date":
      return { variant: "date" };
    case "time":
      return { variant: "time" };
    default:
      return {};
  }
}

export type RegistryKey = PageComponentType;
