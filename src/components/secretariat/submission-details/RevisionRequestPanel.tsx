'use client';

interface Props {
  checklist: {
    researchProtocol: boolean;
    consentForm: boolean;
    researchInstrument: boolean;
    endorsementLetter: boolean;
    proposalDefense: boolean;
    applicationForm: boolean;
  };
  comments: string;
  isSubmitting: boolean;
  onChecklistChange: (field: any) => void;
  onCommentsChange: (val: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

const RevisionRequestPanel = ({ checklist, comments, isSubmitting, onChecklistChange, onCommentsChange, onClear, onSubmit }: Props) => {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-[#101C50] mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        Request Revision
      </h3>
      <p className="text-sm text-gray-600 mb-6 font-medium">
        Select the documents that need revision and provide specific feedback below. This will send the submission back to the researcher.
      </p>

      {/* Checklist */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200">
        <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
          Documents requiring revision:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: 'researchProtocol', label: 'Research Protocol' },
            { key: 'consentForm', label: 'Informed Consent Form' },
            { key: 'researchInstrument', label: 'Research Instrument' },
            { key: 'endorsementLetter', label: 'Endorsement Letter' },
            { key: 'proposalDefense', label: 'Proposal Defense' },
            { key: 'applicationForm', label: 'Application Form' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={(checklist as any)[item.key]}
                onChange={() => onChecklistChange(item.key)}
                className="w-5 h-5 rounded border-2 border-gray-400 text-[#101C50] focus:ring-2 focus:ring-[#101C50] cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#101C50] font-bold">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Specific Feedback: <span className="text-red-600">*</span>
        </label>

        <textarea
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          placeholder="Example:&#10;&#10;Research Protocol - Section 3.2:&#10;Please clarify the sampling method and justify the sample size."
          className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#101C50] focus:ring-4 focus:ring-[#101C50]/10 resize-none text-gray-900 font-medium transition-all placeholder:font-normal"
          style={{ minHeight: '180px' }}
          maxLength={2000}
          disabled={isSubmitting}
        />
        <div className="flex justify-end mt-2">
          <p className="text-xs text-gray-500 font-bold">
            {comments.length} / 2000
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={onClear}
          className="px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
          disabled={isSubmitting}
        >
          Clear All
        </button>
        <button
          onClick={onSubmit}
          disabled={Object.values(checklist).every(v => !v) || !comments.trim() || isSubmitting}
          className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all font-bold text-sm flex items-center gap-2 shadow-md active:scale-95"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Sending...
            </>
          ) : (
            'Request Revision'
          )}
        </button>
      </div>
    </div>
  );
};

export default RevisionRequestPanel;
