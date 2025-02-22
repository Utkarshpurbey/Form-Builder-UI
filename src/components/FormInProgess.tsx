import React from "react";

interface FormInProgressModalProps {
  onContinue: () => void;
  onDiscard: () => void;
}

const FormInProgressModal: React.FC<FormInProgressModalProps> = ({ onContinue, onDiscard }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Form in Progress</h2>
        <p className="text-gray-600 mb-6">
          You have a form in progress with auto-save enabled. Would you like to
          continue where you left off?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            onClick={onDiscard}
          >
            Discard
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
