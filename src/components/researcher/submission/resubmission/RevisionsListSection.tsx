import { FileText, Plus, Trash2 } from 'lucide-react';

interface RevisionRow {
  id: number;
  recommendation: string;
  response: string;
  pageNumber: string;
}

interface RevisionsListProps {
  revisionRows: RevisionRow[];
  handleRowChange: (id: number, field: keyof RevisionRow, value: string) => void;
  addRow: () => void;
  removeRow: (id: number) => void;
}

export default function RevisionsListSection({ revisionRows, handleRowChange, addRow, removeRow }: RevisionsListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 overflow-hidden">
       <div className="p-6 md:p-8">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Revisions Required
            </h2>
          </div>
          <button 
            onClick={addRow}
            className="w-full sm:w-auto text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-6 py-3 sm:py-2 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="space-y-8">
          {revisionRows.map((row, index) => (
            <div key={row.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-6 relative group transition-all hover:shadow-md hover:border-orange-200">
              
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#071139] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Item #{index + 1}
                </div>
                {revisionRows.length > 1 && (
                  <button 
                    onClick={() => removeRow(row.id)}
                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-all"
                    title="Remove this item"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommendation */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#071139] uppercase mb-2">UMREC Recommendation / Feedback</label>
                  <textarea
                    value={row.recommendation}
                    onChange={(e) => handleRowChange(row.id, 'recommendation', e.target.value)}
                    placeholder="Enter the committee's recommendation here..."
                    className="w-full bg-white p-4 rounded-xl border border-gray-300 text-[#071139] font-medium min-h-[160px] focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-y text-base leading-relaxed"
                  />
                </div>

                {/* Response */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-[#071139] uppercase mb-2">Researcher's Response</label>
                  <textarea
                    value={row.response}
                    onChange={(e) => handleRowChange(row.id, 'response', e.target.value)}
                    placeholder="Type your detailed response here explaining how you addressed the feedback..."
                    className="w-full bg-white p-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-[#071139] font-medium min-h-[160px] outline-none resize-y text-base leading-relaxed"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="w-full sm:w-1/2 lg:w-1/3">
                  <label className="text-xs font-bold text-[#071139] uppercase mb-2 block">Section and page number of revisions</label>
                  <input
                    type="text"
                    value={row.pageNumber}
                    onChange={(e) => handleRowChange(row.id, 'pageNumber', e.target.value)}
                    placeholder="e.g. Methodology, Page 5"
                    className="w-full bg-white px-4 py-2 rounded-lg border border-gray-300 text-[#071139] font-medium focus:border-orange-500 outline-none text-sm"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
