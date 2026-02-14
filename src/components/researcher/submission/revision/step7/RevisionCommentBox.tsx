interface RevisionCommentBoxProps {
  comments: string;
  isLoading: boolean;
}

const RevisionCommentBox: React.FC<RevisionCommentBoxProps> = ({ comments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md animate-pulse"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!comments) return null;

  const reviewers = comments.split('---').filter(r => r.trim());

  return (
    <div className="mb-6 sm:mb-8 space-y-4">
      {reviewers.map((review, idx) => (
        <div key={idx} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-sm">{idx + 1}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-amber-900 mb-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Reviewer {idx + 1} Comments
              </h3>
              <div className="space-y-2 text-sm text-amber-900 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {review
                  .split('\n')
                  .filter(line => line.trim())
                  .map((line, lineIdx) => (
                    <p key={lineIdx} className="leading-relaxed">
                      {line.replace(/\*\*/g, '').trim()}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevisionCommentBox;
