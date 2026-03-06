import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import FormBuilder from "./components/form-builder/FormBuilder";
import FormRenderer from "./components/form-renderer/FormRender";
import JsonFormPlayground from "./components/form-renderer/JsonFormPlayground";
import PageDefPlayground from "./components/form-renderer/PageDefPlayground";
import ComponentReference from "./reference/ComponentReference";
import { FormSchema } from "./utils/types";
import FormInProgressModal from "./components/FormInProgressModal";

const App = () => {
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [shouldShowAutoSave, setShouldShowAutoSave] = useState(false);
  const [view, setView] = useState<"app" | "jsonForm" | "pageDef" | "reference">("app");

  const intialiseFormSchema = () => {
    const savedFormSchema = localStorage.getItem("formSchema");

    const parsedSchema = savedFormSchema ? JSON.parse(savedFormSchema) : null;
    return (parsedSchema?.questions?.length || parsedSchema?.title)
      ? parsedSchema
      : {
          id: "1",
          title:'',
          description: "",
          questions: [],
        };
  };
  const [formSchema, ] = useState<FormSchema>(intialiseFormSchema);

  // Load saved form schema from localStorage on initial render
  useEffect(() => {
    const savedFormSchema = localStorage.getItem("formSchema");
    if (savedFormSchema) {
      const parsedSchema = JSON.parse(savedFormSchema);
      if (parsedSchema.questions?.length || parsedSchema?.title) {
        // setFormSchema(parsedSchema);
        setShouldShowAutoSave(true);
        // setIsFormSaved(true);
      }
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <nav className="px-4 py-3 flex flex-wrap gap-2 border-b border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "app" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}
          onClick={() => setView("app")}
        >
          App
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "jsonForm" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}
          onClick={() => setView("jsonForm")}
        >
          JSON Form Schema
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "pageDef" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}
          onClick={() => setView("pageDef")}
        >
          JSON PageDef
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "reference" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"}`}
          onClick={() => setView("reference")}
        >
          Component reference
        </button>
      </nav>
      {view === "app" && (
        <>
          {shouldShowAutoSave && (
            <div>
              <FormInProgressModal
                onDiscard={() => {
                  localStorage.removeItem("formSchema");
                  setShouldShowAutoSave(false);
                  window.location.reload();
                }}
                onContinue={() => setShouldShowAutoSave(false)}
              />
            </div>
          )}
          {!isFormSaved ? (
            <FormBuilder
              onFormSave={() => setIsFormSaved(true)}
              initialFormSchema={formSchema}
            />
          ) : (
            <FormRenderer schema={intialiseFormSchema()} />
          )}
        </>
      )}
      {view === "jsonForm" && <JsonFormPlayground />}
      {view === "pageDef" && <PageDefPlayground />}
      {view === "reference" && <ComponentReference />}
    </>
  );
};

export default App;
