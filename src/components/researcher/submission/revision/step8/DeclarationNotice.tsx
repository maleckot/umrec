'use client';

const DeclarationNotice = () => {
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-white text-lg font-bold">!</span>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-orange-800 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Declaration
          </h3>
          <p className="text-sm sm:text-base text-orange-800 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            By submitting this revision, I/we certify that all requested changes have been addressed and all revised information provided is accurate and complete to the best of my/our knowledge. I/we understand that the revised submission will be re-evaluated by the University of Makati Research Ethics Committee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeclarationNotice;
