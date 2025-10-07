// components/staff-secretariat-admin/submission-details/ReviewsTab.tsx (Updated)
interface Review {
  id: number;
  reviewerName: string;
  status: 'Complete' | 'In Progress';
  completedDate?: string;
  dueDate?: string;
  overallAssessment?: string;
  feedbacks?: {
    document: string;
    comment: string;
  }[];
}

interface ReviewsTabProps {
  reviews: Review[];
  completionStatus: string;
}

export default function ReviewsTab({ reviews, completionStatus }: ReviewsTabProps) {
  return (
    <div className="space-y-6">
      {/* Review Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          Review Progress
        </h2>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg inline-block text-center" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {completionStatus}
        </span>
      </div>

      {/* Reviews List */}
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
          {/* Reviewer Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#101C50] p-4 lg:p-6">
            <div>
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {review.reviewerName}
              </h3>
              {review.status === 'Complete' && review.completedDate && (
                <p className="text-sm text-gray-300" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Completed on {review.completedDate}
                </p>
              )}
              {review.status === 'In Progress' && review.dueDate && (
                <p className="text-sm text-gray-300" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Due by {review.dueDate}
                </p>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                review.status === 'Complete'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-white'
              }`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              {review.status}
            </span>
          </div>

          {/* Review Content */}
          <div className="p-4 lg:p-6">
            {review.status === 'Complete' ? (
              <div className="space-y-4">
                {/* Overall Assessment */}
                {review.overallAssessment && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Overall Assessment
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-800" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {review.overallAssessment}
                      </p>
                    </div>
                  </div>
                )}

                {/* Feedbacks */}
                {review.feedbacks && review.feedbacks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Feedbacks
                    </h4>
                    <div className="space-y-3">
                      {review.feedbacks.map((feedback, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {feedback.document}
                          </p>
                          <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            Comment: {feedback.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Review in progress. Reviewer has been sent a reminder.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
