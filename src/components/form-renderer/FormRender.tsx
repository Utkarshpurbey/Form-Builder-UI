import { useState } from "react";
import { Question, FormSchema, ValidationErrors } from "../../utils/types";
import QuestionList from "./QuestionList";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";

interface FormRendererProps {
  schema: FormSchema;
}

const FormRenderer = ({ schema }: FormRendererProps) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedValues, setSubmittedValues] = useState<{ [key: string]: string } | null>(null);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10}$/.test(phone);
  const validateUrl = (url: string) => {
    try {
      if (!url.trim()) return false;
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleBlur = (id: string, type: string, value: string) => {
    if (type === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, [id]: "Invalid email address" }));
    } else if (type === "phone" && value && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, [id]: "Invalid phone number" }));
    } else if (type === "url" && value && !validateUrl(value)) {
      setErrors((prev) => ({ ...prev, [id]: "Please enter a valid URL" }));
    }
  };

  const handleSubmit = () => {
    const newErrors: ValidationErrors = {};
    schema.questions.forEach((q: Question) => {
      const val = answers[q.id] ?? "";
      if (q.required) {
        if (q.type === "checkbox") {
          if (val !== "true") newErrors[q.id] = "This field is required";
        } else if (q.type === "multiselect") {
          if (!val.trim() || val.split(",").every((s) => !s.trim())) {
            newErrors[q.id] = "Select at least one option";
          }
        } else if (!val.trim()) {
          newErrors[q.id] = "This field is required";
        }
      }
      if (q.type === "email" && val && !validateEmail(val)) newErrors[q.id] = "Invalid email address";
      if (q.type === "phone" && val && !validatePhone(val)) newErrors[q.id] = "Invalid phone number";
      if (q.type === "url" && val && !validateUrl(val)) newErrors[q.id] = "Please enter a valid URL";
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setSubmittedValues(answers);
    toast.success("Form submitted successfully!");
    localStorage?.removeItem("formSchema");
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {schema.title}
          </h1>
          {schema.description && (
            <p className="text-slate-500 mt-2 leading-relaxed">
              {schema.description}
            </p>
          )}
        </header>

        <QuestionList
          questions={schema.questions}
          answers={answers}
          errors={errors}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
        />

        <SubmitButton onClick={handleSubmit} />

        {submittedValues && (
          <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Submitted Values
            </h2>
            <dl className="space-y-2">
              {Object.entries(submittedValues).map(([id, value]) => (
                <div key={id} className="flex gap-2 py-2 border-b border-slate-100 last:border-0">
                  <dt className="font-medium text-slate-600 shrink-0">
                    {schema.questions.find((q: Question) => q.id === id)?.label}:
                  </dt>
                  <dd className="text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
};

export default FormRenderer;
