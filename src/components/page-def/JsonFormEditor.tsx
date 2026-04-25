import { useState } from "react";
import type { FormSchema } from "../../lib/form-schema";
import { FormRenderer } from "../form-renderer";

const EXAMPLE_SCHEMA: FormSchema = {
  id: "example-form",
  title: "Example JSON Form",
  description: "Edit the JSON on the left to change this form.",
  questions: [
    {
      id: "name",
      label: "Full Name",
      helperText: "Enter your full legal name",
      type: "text",
      required: true,
    },
    {
      id: "email",
      label: "Email Address",
      type: "email",
      required: true,
    },
    {
      id: "country",
      label: "Country",
      type: "select",
      required: true,
      options: ["India", "USA", "UK"],
    },
  ],
};

export const JsonFormEditor = () => {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(EXAMPLE_SCHEMA, null, 2)
  );
  const [schema, setSchema] = useState<FormSchema>(EXAMPLE_SCHEMA);
  const [error, setError] = useState<string | null>(null);

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      if (!parsed || typeof parsed !== "object") {
        throw new Error("JSON must describe an object.");
      }
      if (!parsed.id || !parsed.title || !Array.isArray(parsed.questions)) {
        throw new Error(
          "Schema must have id, title and questions array fields."
        );
      }

      setSchema(parsed as FormSchema);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid JSON schema.";
      setError(message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="md:w-1/2 w-full">
        <h2 className="text-xl font-semibold mb-2">JSON Schema</h2>
        <p className="text-sm text-gray-500 mb-2">
          Edit the JSON below and click &quot;Render form&quot; to update the
          UI.
        </p>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-[400px] p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && (
          <p className="text-red-500 text-sm mt-2 whitespace-pre-wrap">
            {error}
          </p>
        )}
        <button
          onClick={handleApplyJson}
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Render form
        </button>
      </div>
      <div className="md:w-1/2 w-full">
        <FormRenderer schema={schema} />
      </div>
    </div>
  );
};
