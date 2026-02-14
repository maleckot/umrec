'use client';

import { AlertTriangle, UserX } from 'lucide-react';

const COI_STATEMENTS_MAP: Record<string, string> = {
  'stocks': 'I/My family have owned stocks and shares in the proponent organization(s).',
  'salary': 'I/My family have received a salary, an honorarium, compensation, concessions, and gifts from the proponent organization(s).',
  'officer': 'I/My family have served as an officer, director, advisor, trustee, consultant or active participant in the activities of the proponent organization(s).',
  'research_work': 'I/My family/my other organizations have had research work experience with the principal investigator(s).',
  'issue': 'I/My family/my other organizations have a long-standing issue against the principal investigator(s), the proponent organization(s), or the funding agency.',
  'social': 'I/My family have regular social activities, such as parties, home visits, and sports events, with the principal investigator(s).',
  'ownership_topic': 'I/my family/my other organizations have an interest in or an ownership issue against the proposed topic.',
};

interface Props {
  conflictInfo: any;
}

const ConflictAlertCard = ({ conflictInfo }: Props) => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-full shadow-sm text-red-600 flex-shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div className="w-full">
          <h3 className="text-lg font-bold text-[#101C50] mb-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Conflict of Interest Reported
          </h3>
          <p className="text-gray-600 mb-4 text-sm font-medium">
            A reviewer has declined this submission. Please review the declared conflicts below.
          </p>
          
          <div className="bg-white rounded-lg border border-red-100 overflow-hidden">
            <div className="bg-red-50/50 p-3 border-b border-red-100 flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-full border border-red-100">
                <UserX size={16} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#101C50]">{conflictInfo.reviewerName}</p>
                <p className="text-xs text-gray-500 font-medium">Original Reviewer • Declared on {conflictInfo.date}</p>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* List Checked Reasons */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Declared Reasons</p>
                <ul className="space-y-2">
                  {conflictInfo.checkedReasonIds.length > 0 ? (
                    conflictInfo.checkedReasonIds.map((reasonId: string) => (
                      <li key={reasonId} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 font-medium">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        {COI_STATEMENTS_MAP[reasonId] || reasonId}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 italic">No specific checkboxes selected.</li>
                  )}
                </ul>
              </div>

              {/* Additional Remarks */}
              {conflictInfo.remarks && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Additional Remarks</p>
                  <p className="text-sm text-gray-700 italic border-l-2 border-red-200 pl-3 font-medium">
                    "{conflictInfo.remarks}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictAlertCard;
