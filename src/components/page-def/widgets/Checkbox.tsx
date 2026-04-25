import { BaseProps, inputStyles } from "./types";

export interface CheckboxProps extends BaseProps {
  /** Optional label shown next to the checkbox (in addition to main label). */
  checkboxLabel?: string;
}

/** Value is "true" or "false" (string) for form compatibility. */
export const Checkbox = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  checkboxLabel = "Yes",
  containerClassName,
  errorClassName,
  helperTextClassName,
}: CheckboxProps) => {
  const checked = value === "true";

  return (
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
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          disabled={disabled}
          className="size-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 disabled:opacity-60"
          aria-invalid={!!error}
        />
        <span className="text-slate-700 select-none group-hover:text-slate-900">
          {checkboxLabel}
        </span>
      </label>
      {error && (
        <p role="alert" className={errorClassName ?? inputStyles.errorText}>
          <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
};
