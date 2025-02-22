import { Question } from "./types";
import AnswerInput from "./AnswerInput";

interface QuestionListProps {
  questions: Question[];
  answers: { [key: string]: string };
  errors: { [key: string]: string };
  onInputChange: (id: string, value: string) => void;
  onBlur: (id: string, type: QuestionType, value: string) => void;
}

const QuestionList = ({
  questions,
  answers,
  errors,
  onInputChange,
  onBlur,
}: QuestionListProps) => {
  return (
    <div className="space-y-4">
      {questions?.map((q) => (
        <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700">
            {q.label}
            {q.required && <span className="text-red-500"> *</span>}
          </h3>
          
          {q.helperText && (
            <p className="text-sm text-gray-500 mt-2">{q.helperText}</p>
          )}

          
          <AnswerInput
            type={q.type}
            value={answers[q.id] || ""}
            error={errors[q.id]}
            options={q.type === "select" ? q.options : undefined}
            onChange={(value) => onInputChange(q.id, value)}
            onBlur={(value) => onBlur(q.id, q.type, value)}
          />

         
          {errors[q.id] && (
            <p className="text-red-500 text-sm mt-2">{errors[q.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;