interface SaveFormButtonProps {
    onClick: () => void;
  }
  
  const SaveFormButton = ({ onClick }: SaveFormButtonProps) => {
    return (
      <button
        onClick={onClick}
        className="mt-6 bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
      >
        Save Form
      </button>
    );
  };
  
  export default SaveFormButton;