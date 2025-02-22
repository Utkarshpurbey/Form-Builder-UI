import { useState } from "react";
import { Question } from "../../utils/types";
import QuestionInput from "../Form Renderer/QuestionInput";


interface QuestionItemProps {
  question: Question;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
  showInput: boolean;
}

const QuestionItem = ({ question, onUpdate, showInput }: QuestionItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-gray-700">
          {question.label}
          {question.required && <span className="text-red-500"> *</span>}
        </h3>
        <i
          className={`fas ${
            isExpanded ? "fa-chevron-up" : "fa-chevron-down"
          } text-gray-500`}
        ></i>
      </div>
     
      {question.helperText && (
        <p className="text-sm text-gray-500 mt-2">{question.helperText}</p>
      )}
      
      {isExpanded && <QuestionInput question={question} onUpdate={onUpdate} />}
    </div>
  );
};

export default QuestionItem;