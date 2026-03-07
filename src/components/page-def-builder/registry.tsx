import type React from "react";
import type { PageComponentType } from "../../utils/pageDef";
import { Text } from "../form-renderer/answer-inputs/Text";
import { Number as NumberInput } from "../form-renderer/answer-inputs/Number";
import { Email } from "../form-renderer/answer-inputs/Email";
import { Phone } from "../form-renderer/answer-inputs/Phone";
import { Url } from "../form-renderer/answer-inputs/Url";
import { TextArea } from "../form-renderer/answer-inputs/TextArea";
import { Select } from "../form-renderer/answer-inputs/Select";
import { Radio } from "../form-renderer/answer-inputs/Radio";
import { MultiSelect } from "../form-renderer/answer-inputs/MultiSelect";
import { Checkbox } from "../form-renderer/answer-inputs/Checkbox";
import { Date as DateInput } from "../form-renderer/answer-inputs/Date";
import { Time } from "../form-renderer/answer-inputs/Time";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const REGISTRY: Record<string, React.ComponentType<any>> = {
  Text,
  Number: NumberInput,
  Email,
  Phone,
  Url,
  TextArea,
  Select,
  Radio,
  MultiSelect,
  Checkbox,
  Date: DateInput,
  Time,
};

export type RegistryKey = PageComponentType;
