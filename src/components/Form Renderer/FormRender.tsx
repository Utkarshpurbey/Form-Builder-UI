import { useState } from "react";
import { Question, FormSchema, ValidationErrors } from "./types";
import QuestionList from "./QuestionList";
import SubmitButton from "./SubmitButton";
import { toast } from "react-toastify";

interface FormRendererProps {
  schema: FormSchema;
}

const FormRenderer = ({ schema }: FormRendererProps) => {
  console.log('uttu',schema)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedValues, setSubmittedValues] = useState<{ [key: string]: string } | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string) => {
    const regex = /^\d{10}$/; // Simple validation for 10-digit phone numbers
    return regex.test(phone);
  };

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" })); // Clear error on input change
  };

  const handleBlur = (id: string, type: QuestionType, value: string) => {
    if (type === "email" && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, [id]: "Invalid email address" }));
    } else if (type === "phone" && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, [id]: "Invalid phone number" }));
    }
  };

  const handleSubmit = () => {
    const newErrors: ValidationErrors = {};
  
    // Validate all required questions
    schema.questions.forEach((q) => {
      if (q.required && !answers[q.id]?.trim()) {
        newErrors[q.id] = "This field is required";
      } else if (q.type === "email" && !validateEmail(answers[q.id] || "")) {
        newErrors[q.id] = "Invalid email address";
      } else if (q.type === "phone" && !validatePhone(answers[q.id] || "")) {
        newErrors[q.id] = "Invalid phone number";
      }
    });
  
    // If there are errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting."); // Replace alert with toast
      return;
    }
  
    // Set submitted values and show success message
    setSubmittedValues(answers);
    toast.success("Form submitted successfully!"); 
    localStorage?.removeItem("formSchema"); // Clear form data after submission
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{schema.title}</h1>
        {schema.description && (
          <p className="text-sm text-gray-500 mt-2">{schema.description}</p>
        )}
      </div>

      {/* Question List */}
      <QuestionList
        questions={schema.questions}
        answers={answers}
        errors={errors}
        onInputChange={handleInputChange}
        onBlur={handleBlur}
      />

      {/* Submit Button */}
      <SubmitButton onClick={handleSubmit} />

      {/* Display Submitted Values */}
      {submittedValues && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Submitted Values</h2>
          {Object.entries(submittedValues).map(([id, value]) => (
            <div key={id} className="mb-2">
              <strong>{schema.questions.find((q) => q.id === id)?.label}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormRenderer;