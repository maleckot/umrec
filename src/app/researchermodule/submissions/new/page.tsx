// app/researchermodule/submissions/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { FileText } from 'lucide-react';

export default function NewSubmissionPage() {
  const router = useRouter();

  const requiredDocuments = [
    {
      text: 'Application Form Ethics Review (UMREC Form No. 0013-1)',
      pdfUrl: '/documents/FORM-0013-1_APPLICATION-FOR-ETHICS-REVIEW.pdf',
      hasPdf: true
    },
    {
      text: 'Research Protocol (UMREC Form No. 0033)',
      pdfUrl: '/documents/FORM-0033_RESEARCH-PROTOCOL.pdf',
      hasPdf: true
    },
    {
      text: 'Informed Consent Form (sample for legal-age respondents)',
      pdfUrl: '/documents/Sample-Informed-Consent-Form.pdf',
      hasPdf: true
    },
    {
      text: 'Informed Consent Form (sample for minor respondents)',
      pdfUrl: '/documents/FORM-0012-2_INFORMED-ASSENT-FORM.pdf',
      hasPdf: true
    },
    {
      text: 'Validated Research Instrument (Survey form/questionnaire)',
      hasPdf: false
    },
    {
      text: 'One-page attachment of proposal defense certification/evaluation for students (scan copies are allowed)',
      hasPdf: false
    },
    {
      text: 'Endorsement Letter from Research Adviser (scan copies are allowed)',
      hasPdf: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#DAE0E7] flex flex-col">
      <NavbarRoles role="researcher" />
      
      <div className="flex-grow py-6 sm:py-8 px-4 sm:px-6 md:px-12 lg:px-20 mt-16 sm:mt-20 md:mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 md:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Submit Request For Ethics Review
              </h1>
              <p className="text-base sm:text-lg text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                To Our Valued Researchers,
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8 sm:mb-10">
              <p className="text-sm sm:text-base text-[#475569] mb-6 sm:mb-8 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Thank you for your interest in researching with us at the University of Makati. To ensure that your research is within the bounds of the Ethics of Research, the following are the requirements for Ethics Review.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Required Documents and Information for Ethics Review:
              </h2>

              {/* Required Documents List - Responsive */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start gap-3 bg-[#F3F4F6] p-3 sm:p-4 rounded-lg sm:rounded-xl">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#1E293B] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {index + 1}
                    </div>
                    <p className="text-sm sm:text-base text-[#1E293B] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {doc.text}
                    </p>
                    {doc.hasPdf && (
                      <a
                        href={doc.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#071139] hover:bg-[#15235C] text-white rounded-lg transition-colors font-semibold text-xs sm:text-sm flex-shrink-0"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        <FileText size={14} className="sm:w-4 sm:h-4" />
                        View PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {/* Formatting Guidelines - Blue and Yellow */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-5 md:p-6 rounded-lg mb-4 sm:mb-6">
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Formatting Guidelines for Documents:
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li>• Paper Size: 8.5 x 13 inches (Legal)</li>
                  <li>• Font: Arial</li>
                  <li>• Line Spacing: Single</li>
                </ul>
              </div>

              {/* External Research - Blue */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-[#3B82F6] p-4 sm:p-5 md:p-6 rounded-lg mb-4 sm:mb-6">
                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  For External Research (Non-UMak):
                </h3>
                <p className="text-sm sm:text-base text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  If your research was reviewed by an Ethics Board/Committee or any PHREB-accredited external Research Ethics Board/Committee, please submit the Letter or Certification of Approval.
                </p>
              </div>

              {/* UMREC Office Information - Yellow */}
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-[#FFD700] p-4 sm:p-5 md:p-6 rounded-lg">
                <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-[#1E293B]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  UMREC Office Information:
                </h3>
                <p className="text-sm sm:text-base text-[#475569] mb-3 sm:mb-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Processing will begin upon receipt of both your uploaded consolidated files via the Google link and the hard copy submitted to the UMREC office.
                </p>
                <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-[#475569]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li>• Location: Room 9020, 9th Floor HPSB Bldg., University of Makati.</li>
                  <li>• Operating Hours: Monday to Friday, 8:00 AM to 5:00 PM</li>
                </ul>
              </div>
            </div>

            {/* Make a Submission Button */}
            <div className="flex justify-center pt-4 sm:pt-6 border-t-2 border-gray-200">
              <button
                onClick={() => router.push('/researchermodule/submissions/new/step1')}
                className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-[#071139] text-[#F0E847] text-base sm:text-lg font-bold rounded-lg hover:bg-[#1C2C6B] transition-colors cursor-pointer shadow-lg"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Make a Submission
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
