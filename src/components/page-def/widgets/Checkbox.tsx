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
          className="size-5 rounded border-2 border-[color:var(--fb-input-border,#cbd5e1)] text-[color:var(--fb-primary,#4f46e5)] focus:outline-none focus:ring-2 focus:ring-[color:var(--fb-ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--fb-surface,white)] disabled:opacity-60"
          aria-invalid={!!error}
        />
        <span className="text-[0.9375rem] text-[color:var(--fb-text,#0f172a)] select-none opacity-90 group-hover:opacity-100">
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
