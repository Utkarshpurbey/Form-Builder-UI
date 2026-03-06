import { BaseProps, inputStyles } from "./types";

/** Separator for storing multiple values in a single string (e.g. "A,B,C"). */
export const MULTI_SELECT_SEP = ",";

function parseValues(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(MULTI_SELECT_SEP).map((s) => s.trim()).filter(Boolean);
}

function serializeValues(values: string[]): string {
  return values.join(MULTI_SELECT_SEP);
}

export interface MultiSelectProps extends BaseProps {
  options: string[];
}

export const MultiSelect = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  options,
  containerClassName,
  errorClassName,
  helperTextClassName,
}: MultiSelectProps) => {
  const selected = parseValues(value);

  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(serializeValues(next));
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
              className="size-4 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 disabled:opacity-60"
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
};
