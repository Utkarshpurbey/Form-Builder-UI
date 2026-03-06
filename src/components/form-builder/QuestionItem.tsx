import { useState } from "react";
import { Question } from "../../utils/types";
import QuestionInput from "../form-renderer/QuestionInput";


interface QuestionItemProps {
  question: Question;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
  isLoading?: boolean;
  showInput?: boolean;
}

const QuestionItem = ({ question, onUpdate }: QuestionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        className="w-full flex justify-between items-center gap-3 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <span className="block text-sm font-medium text-slate-700">
            {question.label || "Untitled question"}
            {question.required && <span className="text-rose-500 ml-0.5" aria-hidden>*</span>}
          </span>
          {question.helperText && (
            <p className="text-sm text-slate-500 mt-0.5">{question.helperText}</p>
          )}
        </div>
        <span className="shrink-0 text-slate-400" aria-hidden>
          <svg className={`size-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <QuestionInput question={question} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
};

export default QuestionItem;