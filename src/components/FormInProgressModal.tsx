import React from "react";

interface FormInProgressModalProps {
  onContinue: () => void;
  onDiscard: () => void;
}

const FormInProgressModal: React.FC<FormInProgressModalProps> = ({ onContinue, onDiscard }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 max-w-md w-full">
        <h2 className="text-lg font-semibold text-slate-800">Form in progress</h2>
        <p className="text-slate-600 mt-2 mb-6 leading-relaxed">
          You have a form in progress with auto-save enabled. Would you like to continue where you left off?
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
            onClick={onDiscard}
          >
            Discard
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormInProgressModal;
