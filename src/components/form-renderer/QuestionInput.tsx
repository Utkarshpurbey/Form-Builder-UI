import { useState } from "react";
import { Question, QuestionType } from "../../utils/types";

interface QuestionInputProps {
  question: Question;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

const selectClass =
  `${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`;

const QuestionInput = ({ question, onUpdate }: QuestionInputProps) => {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim() === "") return;
    const updatedOptions = [...(question.options || []), newOption];
    onUpdate({ options: updatedOptions });
    setNewOption("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
        <input
          type="text"
          value={question.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          placeholder="Question label"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Helper text (optional)</label>
        <input
          type="text"
          value={question.helperText || ""}
          onChange={(e) => onUpdate({ helperText: e.target.value })}
          placeholder="Helper text"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
        <select
          value={question.type}
          onChange={(e) =>
            onUpdate({
              type: e.target.value as QuestionType,
              options: ["select", "radio", "multiselect"].includes(e.target.value) ? [] : undefined,
            })
          }
          className={selectClass}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="url">URL</option>
          <option value="description">Description</option>
          <option value="select">Select (dropdown)</option>
          <option value="radio">Radio (single choice)</option>
          <option value="multiselect">Multi-select (checkboxes)</option>
          <option value="checkbox">Checkbox (yes/no)</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
        </select>
      </div>
      {(question.type === "select" || question.type === "radio" || question.type === "multiselect") && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">Options</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add an option"
              className={inputClass}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddOption())}
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="shrink-0 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {question.options?.map((option, index) => (
              <li
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm"
              >
                <span>{option}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updatedOptions = question.options?.filter((_, i) => i !== index);
                    onUpdate({ options: updatedOptions });
                  }}
                  className="text-slate-400 hover:text-rose-500 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${option}`}
                >
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={question.required === undefined ? true : question.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-slate-700">Required</span>
      </label>
    </div>
  );
};

export default QuestionInput;
