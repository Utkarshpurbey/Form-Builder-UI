import { useState } from "react";
import type { FormSchema } from "../../utils/types";
import FormRenderer from "./FormRender";

const EXAMPLE_SCHEMA: FormSchema = {
  id: "example",
  title: "Example Form",
  description: "Edit the JSON on the left to change this form.",
  questions: [
    { id: "name", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    { id: "country", label: "Country", type: "select", required: true, options: ["India", "USA", "UK"] },
  ],
};

const panelInput =
  "w-full h-[400px] px-4 py-3 rounded-xl border-2 border-slate-200 bg-white font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10";

export default function JsonFormPlayground() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(EXAMPLE_SCHEMA, null, 2));
  const [schema, setSchema] = useState<FormSchema>(EXAMPLE_SCHEMA);
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed?.id || !parsed?.title || !Array.isArray(parsed.questions)) {
        throw new Error("Schema must have id, title, and questions array.");
      }
      setSchema(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div className="md:w-1/2 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">FormSchema JSON</h2>
          <p className="text-sm text-slate-500 mt-1">Edit JSON and click Apply to render the form.</p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className={panelInput}
            spellCheck={false}
          />
          {error && (
            <p role="alert" className="text-sm text-rose-600 mt-2 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-rose-500 shrink-0" aria-hidden />
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={handleApply}
            className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Apply &amp; render form
          </button>
        </div>
      </div>
      <div className="md:w-1/2 overflow-auto">
        <FormRenderer schema={schema} />
      </div>
    </div>
  );
}
