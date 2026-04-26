export interface BaseProps {
  value: string;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helperTextClassName?: string;
}

/** Shared aesthetic styles for all form controls */
export const inputStyles = {
  container: "space-y-2",
  label:
    "block text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-[color:var(--fb-label,#475569)]",
  required: "text-[color:var(--fb-primary,#4f46e5)] ml-0.5 font-bold",
  helper: "text-[0.8125rem] leading-relaxed text-[color:var(--fb-muted,#64748b)]",
  inputBase:
    "w-full rounded-[var(--fb-radius,0.75rem)] px-4 py-3 text-[0.9375rem] text-[color:var(--fb-text,#0f172a)] placeholder:text-[color:var(--fb-muted,#94a3b8)] placeholder:opacity-90 transition-[border-color,box-shadow,background-color] duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-55",
  inputError:
    "!border-rose-400 focus:!border-rose-500 focus:!ring-rose-500/20",
  errorText: "text-sm text-rose-600 mt-1.5 flex items-center gap-1.5",
} as const;
