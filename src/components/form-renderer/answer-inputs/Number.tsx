import { BaseProps, inputStyles } from "./types";

export interface NumberProps extends BaseProps {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const Number = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  placeholder = "Enter a number",
  min,
  max,
  step,
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: NumberProps) => (
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
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onBlur?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
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
