import { QuestionType } from "../../utils/types";

const inputBase =
  "w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 disabled:bg-slate-50";
const inputError = "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10";
const errorText = "text-sm text-rose-600 mt-1.5 flex items-center gap-1.5";
const selectAppearance =
  "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

interface AnswerInputProps {
  type: QuestionType;
  value: string;
  error?: string;
  options?: string[];
  /** Unique id for the field (e.g. question id), used for radio group name. */
  fieldId?: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
}

const AnswerInput = ({
  type,
  value,
  error,
  options,
  fieldId,
  onChange,
  onBlur,
}: AnswerInputProps) => {
  const hasError = !!error;
  const inputClass = `${inputBase} ${hasError ? inputError : ""}`;
  const needsOptions = type === "select" || type === "radio" || type === "multiselect";
  const opts = needsOptions ? options ?? [] : undefined;

  const errorBlock = error ? (
    <p role="alert" className={errorText}>
      <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
      {error}
    </p>
  ) : null;

  return (
    <div className="space-y-1.5">
      {type === "text" && (
        <>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            placeholder="Enter your answer"
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "number" && (
        <>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            placeholder="Enter a number"
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "email" && (
        <>
          <input
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            placeholder="Enter your email"
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "phone" && (
        <>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            placeholder="Enter your phone number"
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "description" && (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            placeholder="Enter a description"
            rows={4}
            className={`${inputClass} resize-y min-h-[6rem]`}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "select" && (
        <>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} ${selectAppearance}`}
            aria-invalid={hasError}
          >
            <option value="" disabled>Select an option</option>
            {opts?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errorBlock}
        </>
      )}
      {type === "checkbox" && (
        <>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value === "true"}
              onChange={(e) => onChange(e.target.checked ? "true" : "false")}
              className="size-5 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
              aria-invalid={hasError}
            />
            <span className="text-slate-700">Yes</span>
          </label>
          {errorBlock}
        </>
      )}
      {type === "radio" && (
        <>
          <fieldset className="space-y-2" aria-invalid={hasError}>
            {opts?.map((opt) => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={fieldId ?? "radio"}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="size-4 border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="text-slate-700">{opt}</span>
              </label>
            ))}
          </fieldset>
          {errorBlock}
        </>
      )}
      {type === "date" && (
        <>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "time" && (
        <>
          <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
      {type === "multiselect" && (
        <>
          <fieldset className="space-y-2" aria-invalid={hasError}>
            {opts?.map((opt) => {
              const selected = value.split(",").map((s) => s.trim()).filter(Boolean);
              const checked = selected.includes(opt);
              return (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? selected.filter((s) => s !== opt)
                        : [...selected, opt];
                      onChange(next.join(","));
                    }}
                    className="size-4 rounded border-2 border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-slate-700">{opt}</span>
                </label>
              );
            })}
          </fieldset>
          {errorBlock}
        </>
      )}
      {type === "url" && (
        <>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onBlur?.(e.target.value)}
            placeholder="https://example.com"
            className={inputClass}
            aria-invalid={hasError}
          />
          {errorBlock}
        </>
      )}
    </div>
  );
};

export default AnswerInput;
