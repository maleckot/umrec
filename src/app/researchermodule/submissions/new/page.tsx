// app/researchermodule/submissions/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { FileText, CheckCircle, Clock, MapPin } from 'lucide-react';

export default function NewSubmissionPage() {
  const router = useRouter();

  // ✅ NEW - Points to public folder
// ✅ UPDATED - Correct paths for your folder structure
const requiredDocuments = [
  {
    text: 'Application Form Ethics Review (UMREC Form No. 0013-1)',
    pdfUrl: '/forms/UMREC Form No. 0013-1.pdf',  // ✅ Changed
    hasPdf: true
  },
  {
    text: 'Research Protocol (UMREC Form No. 0033)',
    pdfUrl: '/forms/UMREC Form No. 0033.pdf',  // ✅ Changed
    hasPdf: true
  },
  {
    text: 'Informed Consent Form (sample for legal-age respondents)',
    pdfUrl: '/forms/Informed Consent Form.pdf',  // ✅ Changed
    hasPdf: true
  },
  {
    text: 'Informed Consent Form (sample for minor respondents)',
    pdfUrl: '/forms/Informed Consent Form.pdf',  // ✅ Changed
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
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 pb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Enhanced Header */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#003366] to-[#004080] rounded-full mb-6 sm:mb-8 shadow-lg">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Submit Request For Ethics Review
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                To Our Valued Researchers,
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-8 sm:mb-10 md:mb-12">
              <div className="bg-gradient-to-br from-[#E0C8A0]/10 to-[#E0C8A0]/20 border-l-4 border-[#003366] p-4 sm:p-6 rounded-xl mb-8 sm:mb-10">
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Thank you for your interest in researching with us at the University of Makati. To ensure that your research is within the bounds of the Ethics of Research, the following are the requirements for Ethics Review.
                </p>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-[#003366] flex items-center gap-3" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <span className="w-1 h-6 sm:h-8 bg-gradient-to-b from-[#003366] to-[#F7D117] rounded-full"></span>
                Required Documents and Information for Ethics Review
              </h2>

              {/* Enhanced Required Documents List */}
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="group bg-gradient-to-br from-white to-gray-50 hover:from-[#E0C8A0]/5 hover:to-[#E0C8A0]/10 p-4 sm:p-5 rounded-xl border border-gray-200 hover:border-[#003366]/30 transition-all duration-300 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#003366] to-[#004080] text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm sm:text-base shadow-md group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {index + 1}
                      </div>
                      <p className="text-sm sm:text-base md:text-lg text-gray-700 flex-1 leading-relaxed font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {doc.text}
                      </p>
                      {doc.hasPdf && (
                        <a
                          href={doc.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-[#003366] to-[#004080] hover:from-[#004080] hover:to-[#003366] text-white rounded-xl transition-all duration-300 font-semibold text-xs sm:text-sm flex-shrink-0 shadow-md hover:shadow-lg hover:scale-105"
                          style={{ fontFamily: 'Metropolis, sans-serif' }}
                        >
                          <FileText size={16} className="sm:w-5 sm:h-5" />
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Info Cards */}

              {/* Formatting Guidelines - Yellow Theme */}
              <div className="bg-gradient-to-br from-[#F7D117]/10 to-[#F7D117]/20 border-l-4 border-[#B8860B] p-5 sm:p-6 md:p-7 rounded-xl mb-5 sm:mb-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F7D117] to-[#B8860B] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#003366] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Formatting Guidelines for Documents
                  </h3>
                </div>
                <ul className="space-y-2 sm:space-y-2.5 text-sm sm:text-base md:text-lg text-gray-700 ml-14 sm:ml-16" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full flex-shrink-0"></span>
                    <span><strong>Paper Size:</strong> 8.5 x 13 inches (Legal)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full flex-shrink-0"></span>
                    <span><strong>Font:</strong> Arial</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#B8860B] rounded-full flex-shrink-0"></span>
                    <span><strong>Line Spacing:</strong> Single</span>
                  </li>
                </ul>
              </div>

              {/* External Research - Sky Blue Theme */}
              <div className="bg-gradient-to-br from-[#87CEEB]/10 to-[#87CEEB]/20 border-l-4 border-[#87CEEB] p-5 sm:p-6 md:p-7 rounded-xl mb-5 sm:mb-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#87CEEB] to-[#6BB6D9] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#003366] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    For External Research (Non-UMak)
                  </h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed ml-14 sm:ml-16" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  If your research was reviewed by an Ethics Board/Committee or any PHREB-accredited external Research Ethics Board/Committee, please submit the Letter or Certification of Approval.
                </p>
              </div>

              {/* UMREC Office Information - Enhanced with Icons */}
              <div className="bg-gradient-to-br from-[#003366]/5 to-[#003366]/10 border-l-4 border-[#003366] p-5 sm:p-6 md:p-7 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#003366] to-[#004080] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#003366] flex-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    UMREC Office Information
                  </h3>
                </div>
                <div className="ml-14 sm:ml-16 space-y-4">
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Processing will begin upon receipt of both your uploaded consolidated files via the Google link and the hard copy submitted to the UMREC office.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/50 p-4 rounded-lg border border-[#003366]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-[#003366]" />
                        <span className="font-semibold text-sm text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Location</span>
                      </div>
                      <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Room 9020, 9th Floor HPSB Bldg., University of Makati
                      </p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-lg border border-[#003366]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[#003366]" />
                        <span className="font-semibold text-sm text-[#003366]" style={{ fontFamily: 'Metropolis, sans-serif' }}>Operating Hours</span>
                      </div>
                      <p className="text-sm text-gray-700" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Monday to Friday, 8:00 AM to 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="flex justify-center pt-6 sm:pt-8 border-t-2 border-gray-200">
              <button
                onClick={() => router.push('/researchermodule/submissions/new/step1')}
                className="group relative w-full sm:w-auto px-10 sm:px-12 md:px-16 py-4 sm:py-5 bg-gradient-to-r from-[#003366] to-[#004080] text-white text-base sm:text-lg md:text-xl font-bold rounded-xl hover:from-[#004080] hover:to-[#003366] transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Make a Submission
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
