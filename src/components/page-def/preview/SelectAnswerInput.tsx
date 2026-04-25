import { BaseAnswerInputProps } from "./types";

export interface SelectAnswerInputProps extends BaseAnswerInputProps {
  options: string[];
  placeholder?: string;
}

export const SelectAnswerInput = ({
  value,
  error,
  label,
  helperText,
  required,
  disabled,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option",
  containerClassName,
  inputClassName,
  errorClassName,
  helperTextClassName,
}: SelectAnswerInputProps) => {
  return (
    <div className={containerClassName}>
      {label && (
        <h3 className="font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </h3>
      )}
      {helperText && (
        <p className={helperTextClassName ?? "text-sm text-gray-500 mt-2"}>
          {helperText}
        </p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        disabled={disabled}
        className={
          inputClassName ??
          "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        }
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className={errorClassName ?? "text-red-500 text-sm mt-2"}>{error}</p>
      )}
    </div>
  );
};
