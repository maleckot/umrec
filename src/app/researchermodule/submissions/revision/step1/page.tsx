// app/researchermodule/submissions/revision/step1/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RevisionStepLayout from '@/components/researcher/revision/RevisionStepLayout';
import FormField from '@/components/researcher/revision/FormField';
import RevisionCommentBox from '@/components/researcher/revision/RevisionCommentBox';

export default function RevisionStep1() {
  const router = useRouter();
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    projectLeaderFirstName: '',
    projectLeaderMiddleName: '',
    projectLeaderLastName: '',
    projectLeaderEmail: '',
    projectLeaderContact: '',
    coAuthors: '',
    organization: 'internal',
  });

  const [revisionComments] = useState('Please update the project title to be more specific and ensure all contact information is current.');

  useEffect(() => {
    const saved = localStorage.getItem('revisionStep1Data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading Revision Step 1 data:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  useEffect(() => {
    if (isInitialMount.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem('revisionStep1Data', JSON.stringify(formData));
      console.log('💾 Revision Step 1 auto-saved');
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('revisionStep1Data', JSON.stringify(formData));
    router.push('/researchermodule/submissions/revision/step2');
  };

  const handleBack = () => {
    router.push('/researchermodule/submissions');
  };

  return (
    <RevisionStepLayout
      stepNumber={1}
      title="Researcher Details"
      description="Review and update the requested details based on feedback."
      onBack={handleBack}
    >
      <RevisionCommentBox comments={revisionComments} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Title of the project" required>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
          />
        </FormField>

        <FormField label="Project Leader Full Name" required>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Last Name"
              value={formData.projectLeaderLastName}
              onChange={(e) => setFormData({...formData, projectLeaderLastName: e.target.value})}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={formData.projectLeaderFirstName}
              onChange={(e) => setFormData({...formData, projectLeaderFirstName: e.target.value})}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            <input
              type="text"
              placeholder="Middle Name"
              value={formData.projectLeaderMiddleName}
              onChange={(e) => setFormData({...formData, projectLeaderMiddleName: e.target.value})}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Email of the Project Leader" required>
            <input
              type="email"
              value={formData.projectLeaderEmail}
              onChange={(e) => setFormData({...formData, projectLeaderEmail: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
          </FormField>

          <FormField label="Contact Number of the Project Leader" required>
            <input
              type="tel"
              value={formData.projectLeaderContact}
              onChange={(e) => setFormData({...formData, projectLeaderContact: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
          </FormField>
        </div>

        <FormField 
          label="List of Co-Authors" 
          helperText="If there are none, please write N/A"
          required
        >
          <textarea
            value={formData.coAuthors}
            onChange={(e) => setFormData({...formData, coAuthors: e.target.value})}
            rows={3}
            placeholder="Juan A. Dela Cruz, Jeon H. Womwoo, Choi J. Seungcheol"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none resize-none text-[#1E293B]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
          />
        </FormField>

        <FormField label="Organization" required>
          <select
            value={formData.organization}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-[#1E293B]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
          >
            <option value="internal">Internal (UMak)</option>
            <option value="external">External</option>
          </select>
        </FormField>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-8 border-t-2 border-gray-200">
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Save & Exit
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Next
          </button>
        </div>
      </form>
    </RevisionStepLayout>
  );
}
