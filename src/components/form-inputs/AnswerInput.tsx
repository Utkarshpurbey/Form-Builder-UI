import type { QuestionType } from "../../lib/form-schema";
import { TextAnswerInput } from "./TextAnswerInput";
import { NumberAnswerInput } from "./NumberAnswerInput";
import { EmailAnswerInput } from "./EmailAnswerInput";
import { PhoneAnswerInput } from "./PhoneAnswerInput";
import { DescriptionAnswerInput } from "./DescriptionAnswerInput";
import { SelectAnswerInput } from "./SelectAnswerInput";

export type { BaseAnswerInputProps } from "./types";
export { TextAnswerInput } from "./TextAnswerInput";
export type { TextAnswerInputProps } from "./TextAnswerInput";
export { NumberAnswerInput } from "./NumberAnswerInput";
export type { NumberAnswerInputProps } from "./NumberAnswerInput";
export { EmailAnswerInput } from "./EmailAnswerInput";
export type { EmailAnswerInputProps } from "./EmailAnswerInput";
export { PhoneAnswerInput } from "./PhoneAnswerInput";
export type { PhoneAnswerInputProps } from "./PhoneAnswerInput";
export { DescriptionAnswerInput } from "./DescriptionAnswerInput";
export type { DescriptionAnswerInputProps } from "./DescriptionAnswerInput";
export { SelectAnswerInput } from "./SelectAnswerInput";
export type { SelectAnswerInputProps } from "./SelectAnswerInput";

interface AnswerInputProps {
  type: QuestionType;
  value: string;
  error?: string;
  options?: string[];
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
}

const AnswerInput = ({
  type,
  value,
  error,
  options,
  onChange,
  onBlur,
}: AnswerInputProps) => {
  const commonProps = {
    value,
    error,
    onChange,
    onBlur,
  };

  switch (type) {
    case "text":
      return <TextAnswerInput {...commonProps} />;
    case "number":
      return <NumberAnswerInput {...commonProps} />;
    case "email":
      return <EmailAnswerInput {...commonProps} />;
    case "phone":
      return <PhoneAnswerInput {...commonProps} />;
    case "description":
      return <DescriptionAnswerInput {...commonProps} />;
    case "select":
      return (
        <SelectAnswerInput
          {...commonProps}
          options={options ?? []}
        />
      );
    default:
      return null;
  }
};

export default AnswerInput;
