// components/AttentionCard.tsx
interface AttentionCardProps {
  count: number;
  message: string;
  subtext: string;
  action: string;
  onActionClick: () => void;
}

export default function AttentionCard({ count, message, subtext, action, onActionClick }: AttentionCardProps) {
  return (
    <div className="flex items-start gap-3 lg:gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800 mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <span className="text-red-600">{count}</span> {message}
        </p>
        <p className="text-xs text-gray-600 mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          {subtext}
        </p>
        <button
          onClick={onActionClick}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
