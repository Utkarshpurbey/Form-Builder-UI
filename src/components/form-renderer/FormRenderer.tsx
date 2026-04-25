import { useState } from "react";
import { toast } from "react-toastify";
import type {
  Question,
  FormSchema,
  ValidationErrors,
} from "../../lib/form-schema";
import { STORAGE_KEYS } from "../../lib/config";
import QuestionList from "./QuestionList";
import SubmitButton from "./SubmitButton";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;

const validateEmail = (email: string) => EMAIL_REGEX.test(email);
const validatePhone = (phone: string) => PHONE_REGEX.test(phone);

interface FormRendererProps {
  schema: FormSchema;
}

export const FormRenderer = ({ schema }: FormRendererProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedValues, setSubmittedValues] = useState<Record<
    string,
    string
  > | null>(null);

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleBlur = (id: string, type: string, value: string) => {
    if (type === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        [id]: "Invalid email address",
      }));
    } else if (type === "phone" && value && !validatePhone(value)) {
      setErrors((prev) => ({
        ...prev,
        [id]: "Invalid phone number",
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors: ValidationErrors = {};

    schema.questions.forEach((q: Question) => {
      if (q.required && !answers[q.id]?.trim()) {
        newErrors[q.id] = "This field is required";
      } else if (q.type === "email" && !validateEmail(answers[q.id] || "")) {
        newErrors[q.id] = "Invalid email address";
      } else if (q.type === "phone" && !validatePhone(answers[q.id] || "")) {
        newErrors[q.id] = "Invalid phone number";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setSubmittedValues(answers);
    toast.success("Form submitted successfully!");
    localStorage.removeItem(STORAGE_KEYS.FORM_SCHEMA);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{schema.title}</h1>
        {schema.description && (
          <p className="text-sm text-gray-500 mt-2">{schema.description}</p>
        )}
      </div>
      <QuestionList
        questions={schema.questions}
        answers={answers}
        errors={errors}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
      />
      <SubmitButton onClick={handleSubmit} />
      {submittedValues && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Submitted Values
          </h2>
          {Object.entries(submittedValues).map(([id, value]) => (
            <div key={id} className="mb-2">
              <strong>
                {schema.questions.find((q: Question) => q.id === id)?.label}:
              </strong>{" "}
              {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
