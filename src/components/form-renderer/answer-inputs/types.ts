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
  container: "space-y-1.5",
  label:
    "block text-sm font-medium text-slate-700 tracking-tight",
  required: "text-rose-500 ml-0.5",
  helper: "text-sm text-slate-500",
  inputBase:
    "w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50",
  inputError:
    "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10",
  errorText: "text-sm text-rose-600 mt-1.5 flex items-center gap-1.5",
} as const;
