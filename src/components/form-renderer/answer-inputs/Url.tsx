import { BaseProps, inputStyles } from "./types";

export interface UrlProps extends BaseProps {
  placeholder?: string;
}

export const Url = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  placeholder = "https://example.com",
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: UrlProps) => (
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
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur?.(e.target.value)}
      placeholder={placeholder}
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
