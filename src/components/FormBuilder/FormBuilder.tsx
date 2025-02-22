import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Question, FormSchema } from "./utils/types";
import QuestionItem from "./QuestionItem";
import AddQuestionForm from "./AddQuestionForm";
import SaveFormButton from "./SaveFormButton";

interface FormBuilderProps {
  onFormSave: () => void;
  initialFormSchema: FormSchema;
}

const FormBuilder = ({ onFormSave, initialFormSchema }: FormBuilderProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialFormSchema?.questions);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [formTitle, setFormTitle] = useState(initialFormSchema?.title);
  const [formDescription, setFormDescription] = useState(initialFormSchema?.description || "");
  const [loadingQuestions, setLoadingQuestions] = useState<{ [key: string]: boolean }>({});


  // Auto-save the form whenever questions, title, or description changes
  useEffect(() => {
    const autoSaveForm = async () => {
      const validQuestions = questions.filter((q) => {
        if (q.required && !q.label.trim()) return false; // Invalid if required and empty
        if (q.type === "select" && (!q.options || q.options.length === 0)) return false; // Invalid if no options
        return true;
      });

      setLoadingQuestions((prev) => ({
        ...prev,
        ...validQuestions.reduce((acc, q) => ({ ...acc, [q.id]: true }), {}),
      }));

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      const formSchema: FormSchema = {
        id: crypto.randomUUID(),
        title: formTitle,
        description: formDescription,
        questions: validQuestions,
      };
      localStorage.setItem("formSchema", JSON.stringify(formSchema));

      setLoadingQuestions((prev) => ({
        ...prev,
        ...validQuestions.reduce((acc, q) => ({ ...acc, [q.id]: false }), {}),
      }));
    };

    autoSaveForm();
  }, [questions, formTitle, formDescription]);

  const addQuestion = (newQuestion: Question) => {
    const questionToAdd: Question = {
      id: crypto.randomUUID(),
      type: newQuestion.type,
      label: newQuestion.label,
      helperText: newQuestion.helperText,
      required: newQuestion.required,
      options: newQuestion.type === "select" ? newQuestion.options : undefined,
    };
    setQuestions([...questions, questionToAdd]);
    setIsAddingQuestion(false);
  };

  const updateQuestion = (id: string, updatedQuestion: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q))
    );
  };

  const saveForm = async () => {
    const formSchema: FormSchema = {
      id: crypto.randomUUID(),
      title: formTitle,
      description: formDescription,
      questions: questions,
    };
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.setItem("formSchema", JSON.stringify(formSchema));
    toast.success("Form saved successfully!");
    onFormSave();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Form Title"
          className="text-3xl font-bold text-gray-800 w-full focus:outline-none"
        />
        <input
          type="text"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Form Description"
          className="text-sm text-gray-500 w-full mt-2 focus:outline-none"
        />
      </div>

      {/* List of Questions */}
      <div className="space-y-4">
        {questions?.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            onUpdate={(updated) => updateQuestion(q.id, updated)}
            showInput={false}
            isLoading={loadingQuestions[q.id] || false}
          />
        ))}
      </div>

      {/* Add Question Button */}
      {!isAddingQuestion && (
        <button
          onClick={() => setIsAddingQuestion(true)}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          <span>Add Question</span>
        </button>
      )}

      {/* Add Question Form */}
      {isAddingQuestion && <div className="py-3">
        <AddQuestionForm onAdd={addQuestion} /></div>}

      {/* Save Form Button */}
      <SaveFormButton onClick={saveForm} />
    </div>
  );
};

export default FormBuilder;