    interface ActionButtonsProps {
  uploading: boolean;
  file: File | null;
  isQuickRevision: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ uploading, file, isQuickRevision }) => {
  return (
    <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
      <button
        type="submit"
        disabled={uploading || !file}
        className={`group relative px-10 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden transition-all duration-300 ${!file || uploading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
          }`}
        style={{ fontFamily: 'Metropolis, sans-serif' }}
        aria-label={isQuickRevision ? "Submit revision" : "Save and continue"}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-50"></span>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {isQuickRevision ? 'Submit Revision' : 'Save & Continue'}
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default ActionButtons;
