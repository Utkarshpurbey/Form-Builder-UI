import { BaseAnswerInputProps } from "./types";

export interface DescriptionAnswerInputProps extends BaseAnswerInputProps {
  placeholder?: string;
  rows?: number;
}

export const DescriptionAnswerInput = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  placeholder = "Enter a description",
  rows = 4,
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: DescriptionAnswerInputProps) => {
  return (
    <div className={containerClassName}>
      {label && (
        <h3 className="font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </h3>
      )}
      {helperText && (
        <p className={helperTextClassName ?? "text-sm text-gray-500 mt-2"}>
          {helperText}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={
          inputClassName ??
          "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        }
      />
      {error && (
        <p className={errorClassName ?? "text-red-500 text-sm mt-2"}>{error}</p>
      )}
    </div>
  );
};
