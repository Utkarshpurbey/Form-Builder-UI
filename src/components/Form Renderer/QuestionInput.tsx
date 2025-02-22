import { useState } from "react";
import { Question, QuestionType } from "../../utils/types";

interface QuestionInputProps {
  question: Question;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
}

const QuestionInput = ({ question, onUpdate }: QuestionInputProps) => {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim() === "") return; 
    const updatedOptions = [...(question.options || []), newOption];
    onUpdate({ options: updatedOptions });
    setNewOption(""); 
  };

  return (
    <div className="mt-4">
      <input
        type="text"
        value={question.label}
        onChange={(e) => onUpdate({ label: e.target.value })}
        placeholder="Question Label"
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
     
      <input
        type="text"
        value={question.helperText || ""}
        onChange={(e) => onUpdate({ helperText: e.target.value })}
        placeholder="Helper text (optional)"
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

     
      <select
        value={question.type}
        onChange={(e) =>
          onUpdate({
            type: e.target.value as QuestionType,
            options: e.target.value === "select" ? [] : undefined,
          })
        }
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="text">Text</option>
        <option value="select">Select</option>
        <option value="number">Number</option>
        <option value="email">Email</option>
        <option value="phone">Phone Number</option>
        <option value="description">Description</option>
      </select>

     
      {question.type === "select" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add an option"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddOption}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="space-y-1">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm">{option}</span>
                <button
                  onClick={() => {
                    const updatedOptions = question.options?.filter(
                      (_, i) => i !== index
                    );
                    onUpdate({ options: updatedOptions });
                  }}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={question.required === undefined ? true : question.required}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm">Required</span>
      </label>
    </div>
  );
};

export default QuestionInput;