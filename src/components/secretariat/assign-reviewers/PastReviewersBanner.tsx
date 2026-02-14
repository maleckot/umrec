'use client';

interface Props {
  reviewers: any[];
}

const PastReviewersBanner = ({ reviewers }: Props) => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-blue-600 text-xl font-bold">⟲</div>
        <div>
          <h3 className="font-bold text-blue-900 text-lg mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Previous Reviewers - Auto-Selected
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {reviewers.map(reviewer => (
              <div
                key={reviewer.id}
                className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-200"
              >
                ✓ {reviewer.name}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-blue-800">
            These reviewers have been selected to review the resubmitted work. Click "Assign" below to proceed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PastReviewersBanner;
