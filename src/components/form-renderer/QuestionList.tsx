import AnswerInput from "./AnswerInput";
import type { Question } from "../../utils/types";

interface QuestionListProps {
  questions: Question[];
  answers: { [key: string]: string };
  errors: { [key: string]: string };
  onInputChange: (id: string, value: string) => void;
  /** `string` so both utils and lib schema renderers can pass the same handler */
  onBlur: (id: string, type: string, value: string) => void;
}

const QuestionList = ({
  questions,
  answers,
  errors,
  onInputChange,
  onBlur,
}: QuestionListProps) => {
  return (
    <div className="space-y-5">
      {questions?.map((q) => (
        <div
          key={q.id}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <label className="block text-sm font-medium text-slate-700 tracking-tight">
            {q.label}
            {q.required && <span className="text-rose-500 ml-0.5" aria-hidden>*</span>}
          </label>
          {q.helperText && (
            <p className="text-sm text-slate-500 mt-1">{q.helperText}</p>
          )}
          <div className="mt-3">
            <AnswerInput
              fieldId={q.id}
              type={q.type}
              value={answers[q.id] || ""}
              error={errors[q.id]}
              options={
                q.type === "select" || q.type === "radio" || q.type === "multiselect"
                  ? q.options
                  : undefined
              }
              onChange={(value) => onInputChange(q.id, value)}
              onBlur={(value) => onBlur(q.id, q.type, value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
