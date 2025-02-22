interface SubmitButtonProps {
  onClick: () => void;
}

const SubmitButton = ({ onClick }: SubmitButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
    >
      <i className="fas fa-paper-plane"></i>
      <span>Submit Form</span>
    </button>
  );
};

export default SubmitButton;