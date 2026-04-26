import { BaseProps, inputStyles } from "./types";

export type ChoiceVariant = "radio" | "multiselect";

/** Separator for storing multiple values in a single string (e.g. "A,B,C"). */
export const MULTI_SELECT_SEP = ",";

function parseMultiValues(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(MULTI_SELECT_SEP).map((s) => s.trim()).filter(Boolean);
}

function serializeMultiValues(values: string[]): string {
  return values.join(MULTI_SELECT_SEP);
}

export interface ChoiceProps extends BaseProps {
  variant: ChoiceVariant;
  options: string[];
  name?: string;
  id?: string;
}

export const Choice = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  variant,
  options,
  name,
  id,
  containerClassName,
  errorClassName,
  helperTextClassName,
}: ChoiceProps) => {
  if (variant === "radio") {
    const groupName = name ?? id ?? label ?? "radio";
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
        <fieldset className="space-y-2" aria-invalid={!!error}>
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name={groupName}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                onBlur={() => onBlur?.(value)}
                disabled={disabled}
                className="size-4 border-2 border-[color:var(--fb-input-border,#cbd5e1)] text-[color:var(--fb-primary,#4f46e5)] focus:outline-none focus:ring-2 focus:ring-[color:var(--fb-ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--fb-surface,white)] disabled:opacity-60"
              />
              <span className="text-[0.9375rem] text-[color:var(--fb-text,#0f172a)] select-none opacity-90 group-hover:opacity-100">
                {opt}
              </span>
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
  }

  // multiselect
  const selected = parseMultiValues(value);
  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(serializeMultiValues(next));
  };

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
      <fieldset className="space-y-2" aria-invalid={!!error}>
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              disabled={disabled}
              className="size-4 rounded border-2 border-[color:var(--fb-input-border,#cbd5e1)] text-[color:var(--fb-primary,#4f46e5)] focus:outline-none focus:ring-2 focus:ring-[color:var(--fb-ring)] focus:ring-offset-2 focus:ring-offset-[color:var(--fb-surface,white)] disabled:opacity-60"
            />
            <span className="text-[0.9375rem] text-[color:var(--fb-text,#0f172a)] select-none opacity-90 group-hover:opacity-100">
              {opt}
            </span>
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
};
