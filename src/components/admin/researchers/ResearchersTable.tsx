// components/admin/researchers/ResearchersTable.tsx
'use client';

interface Researcher {
  id: string;
  name: string;
  organization: string;
  progress: string;
  college: string;
}

interface ResearchersTableProps {
  researchers: Researcher[];
  onRowClick: (researcher: Researcher) => void;
}

export default function ResearchersTable({ researchers, onRowClick }: ResearchersTableProps) {
  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'New Submission':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Revision':
        return 'bg-orange-100 text-orange-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (researchers.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <p className="text-sm sm:text-base text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          No researchers found
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#101C50] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Researcher
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Organization
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Progress
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                College
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {researchers.map((researcher) => (
              <tr
                key={researcher.id}
                onClick={() => onRowClick(researcher)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {researcher.name}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {researcher.organization}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getProgressColor(researcher.progress)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {researcher.progress}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {researcher.college}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {researchers.map((researcher) => (
          <div
            key={researcher.id}
            onClick={() => onRowClick(researcher)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {researcher.name}
              </h3>
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getProgressColor(researcher.progress)}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                {researcher.progress}
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>Organization:</span>
                <span className="font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>College:</span>
                <span className="font-medium text-gray-900" style={{ fontFamily: 'Metropolis, sans-serif' }}>{researcher.college}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
