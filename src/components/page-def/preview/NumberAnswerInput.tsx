import { BaseAnswerInputProps } from "./types";

export interface NumberAnswerInputProps extends BaseAnswerInputProps {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberAnswerInput = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  placeholder = "Enter a number",
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
  min,
  max,
  step,
}: NumberAnswerInputProps) => {
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
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
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
