import { BaseProps, inputStyles } from "./types";

export type TextFieldVariant = "text" | "email" | "phone" | "url";

const PLACEHOLDERS: Record<TextFieldVariant, string> = {
  text: "Enter your answer",
  email: "Enter your email",
  phone: "Enter your phone number",
  url: "https://example.com",
};

const INPUT_TYPES: Record<TextFieldVariant, string> = {
  text: "text",
  email: "email",
  phone: "tel",
  url: "url",
};

export interface TextFieldProps extends BaseProps {
  variant?: TextFieldVariant;
  placeholder?: string;
}

export const TextField = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  variant = "text",
  placeholder,
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: TextFieldProps) => {
  const inputType = INPUT_TYPES[variant];
  const place = placeholder ?? PLACEHOLDERS[variant];

  return (
    <div className={containerClassName ?? inputStyles.container}>
      {label && (
        <label className={inputStyles.label}>
          {label}
          {required && <span className={inputStyles.required} aria-hidden>*</span>}
        </label>
      )}
      {helperText && (
        <p className={helperTextClassName ?? inputStyles.helper}>{helperText}</p>
      )}
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        placeholder={place}
        disabled={disabled}
        className={`${inputStyles.inputBase} ${error ? inputStyles.inputError : ""} ${inputClassName ?? ""}`}
        aria-invalid={!!error}
      />
      {error && (
        <p role="alert" className={errorClassName ?? inputStyles.errorText}>
          <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
};
