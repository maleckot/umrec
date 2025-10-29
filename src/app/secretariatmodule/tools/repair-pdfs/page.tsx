'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/staff-secretariat-admin/DashboardLayout';
import { repairSingleSubmissionPdf } from '@/app/actions/secretariat-staff/repairSingleSubmissionPdf';

export default function RepairSinglePdfPage() {
  const [submissionId, setSubmissionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRepair = async () => {
    if (!submissionId.trim()) {
      alert('Please enter a submission ID');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await repairSingleSubmissionPdf(submissionId);
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ success: false, error: 'Failed to repair PDFs' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="secretariat" roleTitle="Secretariat" pageTitle="Repair Submission PDF" activeNav="submissions">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-2xl">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Metropolis, sans-serif', color: '#101C50' }}>
          Repair Missing PDFs for Submission
        </h2>
        
        <p className="text-gray-600 mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Enter the submission ID (UUID) to regenerate any missing PDFs for that specific submission.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Submission ID
          </label>
          <input
            type="text"
            value={submissionId}
            onChange={(e) => setSubmissionId(e.target.value)}
            placeholder="e.g., 8fd44e1f-577a-4329-88e6-c2d63a748628"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        <button
          onClick={handleRepair}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          {loading ? 'Repairing...' : 'Repair PDFs'}
        </button>

        {result && (
          <div className={`mt-6 p-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-semibold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
              {result.message || result.error}
            </p>
            {result.success && result.generated > 0 && (
              <div className="text-sm text-gray-700 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <p className="font-semibold">Generated PDFs:</p>
                <ul className="list-disc list-inside mt-1">
                  {result.types?.map((type: string, idx: number) => (
                    <li key={idx}>{type}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
