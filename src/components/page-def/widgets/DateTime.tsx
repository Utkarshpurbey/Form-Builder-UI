import { BaseProps, inputStyles } from "./types";

export type DateTimeVariant = "date" | "time";

export interface DateTimeProps extends BaseProps {
  variant: DateTimeVariant;
  min?: string;
  max?: string;
  placeholder?: string;
}

export const DateTime = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  variant,
  min,
  max,
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: DateTimeProps) => {
  const inputType = variant === "date" ? "date" : "time";

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
        min={min}
        max={max}
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
