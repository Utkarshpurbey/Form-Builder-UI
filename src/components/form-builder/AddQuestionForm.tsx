import { useState } from "react";
import QuestionInput from "../form-renderer/QuestionInput";
import { toast } from "react-toastify";
import { Question,QuestionType } from "../../utils/types";

interface AddQuestionFormProps {
  onAdd: (newQuestion: Omit<Question, 'id'>) => void;
  // onAdd: (newQuestion: {
  //   type: QuestionType;
  //   label: string;
  //   required: boolean;
  //   options?: string[];
  // }) => void;
}

const AddQuestionForm = ({ onAdd }: AddQuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState({
    type: "text" as QuestionType,
    id:'',
    label: "",
    required: false,
    options: [] as string[],
  });

  const handleAdd = () => {
    if (!newQuestion.label) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (["select", "radio", "multiselect"].includes(newQuestion.type) && (!newQuestion.options?.length)) {
      toast.error("Add at least one option for this question type.");
      return;
    }
    onAdd(newQuestion);
    setNewQuestion({ id:crypto.randomUUID(),type: "text", label: "", required: false, options: [] });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Add new question</h2>
      <QuestionInput
        question={newQuestion}
        onUpdate={(updated) => setNewQuestion({ ...newQuestion, ...updated })}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
      >
        Add question
      </button>
    </div>
  );
};

export default AddQuestionForm;
