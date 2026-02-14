export default function DeclarationSection() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-lg font-bold">!</span>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#071139] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Declaration
          </h3>
          <p className="text-sm sm:text-base text-[#071139]/80 font-medium leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            By submitting this application, I/we certify that all information provided is accurate and complete to the best of my/our knowledge.
            I/we understand that any false or misleading information may result in the rejection of this application or withdrawal of ethics approval.
          </p>
        </div>
      </div>
    </div>
  );
}
