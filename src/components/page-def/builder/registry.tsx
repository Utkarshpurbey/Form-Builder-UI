import type React from "react";
import type { PageComponentType } from "./pageDef";
import { TextField } from "../widgets/TextField";
import { Number as NumberInput } from "../widgets/Number";
import { TextArea } from "../widgets/TextArea";
import { Select } from "../widgets/Select";
import { Choice } from "../widgets/Choice";
import { Checkbox } from "../widgets/Checkbox";
import { DateTime } from "../widgets/DateTime";

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
