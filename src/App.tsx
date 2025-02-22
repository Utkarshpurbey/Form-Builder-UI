import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import FormBuilder from "./components/FormBuilder/FormBuilder";
import FormRenderer from "./components/Form Renderer/FormRender";
import { FormSchema } from "./utils/types";
import FormInProgressModal from "./components/FormInProgess";

const App = () => {
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [shouldShowAutoSave, setShouldShowAutoSave] = useState(false);

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
  );
};

export default App;
