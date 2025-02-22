import { useState } from "react";
import { QuestionType } from "./types";
import QuestionInput from "../Form Renderer/QuestionInput";
import { toast } from "react-toastify";

interface AddQuestionFormProps {
  onAdd: (newQuestion: {
    type: QuestionType;
    label: string;
    required: boolean;
    options?: string[];
  }) => void;
}

const AddQuestionForm = ({ onAdd }: AddQuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState({
    type: "text" as QuestionType,
    label: "",
    required: false,
    options: [] as string[],
  });

  const handleAdd = () => {
    if (!newQuestion.label) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (newQuestion.type === "select" && newQuestion.options.length === 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onAdd(newQuestion);
    setNewQuestion({ type: "text", label: "", required: false, options: [] });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Question</h2>
      <QuestionInput
        question={newQuestion}
        onUpdate={(updated) => setNewQuestion({ ...newQuestion, ...updated })}
      />
      <button
        onClick={handleAdd}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add
      </button>
    </div>
  );
};

export default AddQuestionForm;
