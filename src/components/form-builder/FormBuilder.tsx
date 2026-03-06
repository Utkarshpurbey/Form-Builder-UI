import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Question, FormSchema } from "../../utils/types";
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
        if (q.required && !q.label.trim()) return false;
        if (["select", "radio", "multiselect"].includes(q.type) && (!q.options || q.options.length === 0)) return false;
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

  const addQuestion = (newQuestion: Omit<Question, 'id'>) => {
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
    <div className="p-6 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Form title"
            className="w-full text-2xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <input
            type="text"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form description (optional)"
            className="w-full mt-2 text-slate-500 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
        </header>

        <div className="space-y-5">
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

        {!isAddingQuestion && (
          <button
            type="button"
            onClick={() => setIsAddingQuestion(true)}
            className="w-full sm:w-auto mt-2 px-6 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-600 font-medium hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add question
          </button>
        )}

        {isAddingQuestion && (
          <div className="pt-2">
            <AddQuestionForm onAdd={addQuestion} />
          </div>
        )}

        <SaveFormButton onClick={saveForm} />
      </div>
    </div>
  );
};

export default FormBuilder;