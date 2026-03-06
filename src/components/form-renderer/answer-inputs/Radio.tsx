import { BaseProps, inputStyles } from "./types";

export interface RadioProps extends BaseProps {
  options: string[];
}

export const Radio = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  options,
  containerClassName,
  errorClassName,
  helperTextClassName,
}: RadioProps) => (
  <div className={containerClassName ?? inputStyles.container}>
    {label && (
      <span className={inputStyles.label}>
        {label}
        {required && <span className={inputStyles.required} aria-hidden>*</span>}
      </span>
    )}
    {helperText && (
      <p className={helperTextClassName ?? inputStyles.helper}>{helperText}</p>
    )}
    <fieldset className="space-y-2" aria-invalid={!!error}>
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name={label ?? "radio"}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            onBlur={() => onBlur?.(value)}
            disabled={disabled}
            className="size-4 border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 disabled:opacity-60"
          />
          <span className="text-slate-700 select-none group-hover:text-slate-900">{opt}</span>
        </label>
      ))}
    </fieldset>
    {error && (
      <p role="alert" className={errorClassName ?? inputStyles.errorText}>
        <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
        {error}
      </p>
    )}
  </div>
);
