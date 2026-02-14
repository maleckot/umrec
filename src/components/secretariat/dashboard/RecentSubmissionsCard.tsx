'use client';

interface Props {
  submissions: any[];
  onSubmissionClick: (item: any) => void;
}

const RecentSubmissionsCard = ({ submissions, onSubmissionClick }: Props) => {
  const formatShortDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '';
  const formatDueDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#101C50]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Recent Submissions</h3>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">View All</button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        <th className="pb-3 pl-2">Title</th>
                        <th className="pb-3 text-center">Date</th>
                        <th className="pb-3 text-center">Due Date</th>
                        <th className="pb-3 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {submissions.slice(0, 5).map((sub) => (
                        <tr key={sub.id} onClick={() => onSubmissionClick(sub)} className="hover:bg-gray-50 cursor-pointer transition-colors group">
                            <td className="py-4 pl-2 pr-4">
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">{sub.title}</p>
                                <p className="text-xs text-gray-400 mt-1">ID: {sub.code || 'N/A'}</p>
                            </td>
                            <td className="py-4 text-center text-sm text-gray-600 whitespace-nowrap">
                                {formatShortDate(sub.submittedAt)}
                            </td>
                            <td className="py-4 text-center text-sm text-gray-600 whitespace-nowrap">
                                {formatDueDate(sub.dueDate)}
                            </td>
                            <td className="py-4 text-center">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                    sub.status === 'Review Complete' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {sub.status || 'Pending'}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {submissions.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">No recent submissions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default RecentSubmissionsCard;
