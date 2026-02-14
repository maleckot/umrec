import { MessageSquare } from 'lucide-react';

interface RevisionCommentBoxProps {
  comments: string;
}

export default function RevisionCommentBox({ comments }: RevisionCommentBoxProps) {
  return (
    <div className="mb-6 sm:mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-900 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Reviewer Comments
          </h3>
          <p className="text-amber-800 leading-relaxed font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {comments}
          </p>
        </div>
      </div>
    </div>
  );
}
