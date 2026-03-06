import { BaseProps, inputStyles } from "./types";

export interface TimeProps extends BaseProps {
  min?: string;
  max?: string;
  placeholder?: string;
}

/** Value is time string (HH:mm or HH:mm:ss). */
export const Time = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  min,
  max,
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: TimeProps) => (
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
      type="time"
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
