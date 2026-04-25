import { BaseAnswerInputProps } from "./types";

export interface EmailAnswerInputProps extends BaseAnswerInputProps {
  placeholder?: string;
}

export const EmailAnswerInput = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  placeholder = "Enter your email",
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: EmailAnswerInputProps) => {
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
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
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
