interface SaveFormButtonProps {
    onClick: () => void;
  }
  
  const SaveFormButton = ({ onClick }: SaveFormButtonProps) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full sm:w-auto mt-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Save form
      </button>
    );
  };
  
  export default SaveFormButton;