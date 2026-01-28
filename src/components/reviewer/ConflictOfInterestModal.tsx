'use client';

import { X, CheckCircle2, Upload, Trash2, AlertTriangle, Check } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

type YesNo = 'yes' | 'no' | '';

interface COIStatement {
  id: string;
  text: string;
}

interface ConflictOfInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolCode?: string;
  submissionTitle?: string;
  onSubmit: (payload: {
    protocolCode: string;
    remarks: string;
    answers: Record<string, 'yes' | 'no'>;
    signatureName: string;
    signatureImage: string | null;
    signedDateISO: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export default function ConflictOfInterestModal({
  isOpen,
  onClose,
  protocolCode = '',
  submissionTitle = '',
  onSubmit,
}: ConflictOfInterestModalProps) {
  const [mounted, setMounted] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statements: COIStatement[] = useMemo(
    () => [
      { id: 'stocks', text: 'I/My family have owned stocks and shares in the proponent organization(s).' },
      { id: 'salary', text: 'I/My family have received a salary, an honorarium, compensation, concessions, and gifts from the proponent organization(s).' },
      { id: 'officer', text: 'I/My family have served as an officer, director, advisor, trustee, consultant or active participant in the activities of the proponent organization(s).' },
      { id: 'research_work', text: 'I/My family/my other organizations have had research work experience with the principal investigator(s).' },
      { id: 'issue', text: 'I/My family/my other organizations have a long-standing issue against the principal investigator(s), the proponent organization(s), or the funding agency.' },
      { id: 'social', text: 'I/My family have regular social activities, such as parties, home visits, and sports events, with the principal investigator(s).' },
      { id: 'ownership_topic', text: 'I/my family/my other organizations have an interest in or an ownership issue against the proposed topic.' },
    ],
    []
  );

  const [answers, setAnswers] = useState<Record<string, YesNo>>(() =>
    Object.fromEntries(statements.map((s) => [s.id, '' as YesNo]))
  );

  useEffect(() => {
    setAnswers((prev) => {
      const next: Record<string, YesNo> = { ...prev };
      for (const s of statements) if (!(s.id in next)) next[s.id] = '';
      return next;
    });
  }, [statements]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isOpen) return;
    const original = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (submittedOk) handleSuccessClose();
        else onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, mounted, submittedOk]);

  const allAnswered = statements.every((s) => answers[s.id] === 'yes' || answers[s.id] === 'no');
  const canSubmit = !!protocolCode.trim() && !!signatureName.trim() && !!signatureImage && allAnswered && !submitting;

  const reset = () => {
    setRemarks('');
    setSignatureName('');
    setSignatureImage(null);
    setSubmittedOk(false);
    setAnswers(Object.fromEntries(statements.map((s) => [s.id, '' as YesNo])));
  };

  const handleClose = () => {
    if (!submitting) {
      reset();
      onClose();
    }
  };

  const handleSuccessClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        // REPLACED ALERT WITH CONSOLE LOG TO REMOVE POPUP
        console.warn("File too large. Please select an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSignatureImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const signedDateISO = new Date().toISOString();

      const payload = {
        protocolCode: protocolCode.trim(),
        remarks: remarks.trim(),
        answers: Object.fromEntries(
          Object.entries(answers).map(([k, v]) => [k, v as 'yes' | 'no'])
        ),
        signatureName: signatureName.trim(),
        signatureImage,
        signedDateISO,
      };

      const res = await onSubmit(payload);
      
      if (!res.success) {
        // REPLACED ALERT WITH CONSOLE ERROR TO REMOVE POPUP
        console.error("Submission failed:", res.error || 'Unknown error');
        return; 
      }

      setSubmittedOk(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || !isOpen) return null;

  // SUCCESS POPUP VIEW
  if (submittedOk) {
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center text-white transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
           
           {/* Decorative Background Glows */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none -ml-5 -mb-5"></div>

           <div className="relative w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md shadow-inner ring-1 ring-white/30">
              <Check size={40} strokeWidth={3} className="text-white drop-shadow-sm" />
           </div>
           
           <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight" style={{ fontFamily: 'Metropolis, sans-serif' }}>
              Submission Successful
           </h2>
           
           <p className="text-orange-50 text-sm sm:text-base mb-8 leading-relaxed font-medium opacity-95">
              Your Disclosure of Conflict of Interest Agreement has been successfully recorded.
           </p>
           
           <button 
              onClick={handleSuccessClose} 
              className="bg-white text-orange-600 px-8 py-3.5 rounded-xl font-bold hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all w-full shadow-lg text-sm sm:text-base tracking-wide"
           >
              Done
           </button>
        </div>
      </div>,
      document.body
    );
  }

  // MAIN FORM VIEW
  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 md:p-6 h-full sm:h-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm hidden sm:block" onClick={handleClose} />

      <div className="relative w-full max-w-5xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full sm:max-h-[95vh] sm:h-auto">
        {/* Header - Adaptive Layout (Stacked on Mobile, Row on Desktop) */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 w-full shadow-md relative overflow-hidden flex-shrink-0 z-10">
             {/* Decorative background elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

             {/* Close Button - Absolute on Mobile, Static in Flex on Desktop */}
             <button
                 onClick={handleClose}
                 className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm z-50 sm:hidden"
                 title="Close"
             >
                 <X className="text-white w-5 h-5" />
             </button>

             <div className="flex flex-col sm:flex-row items-center sm:justify-between p-5 pt-8 sm:pt-6 sm:p-6 gap-5 relative z-10 w-full text-center sm:text-left">
                 <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 min-w-0">
                     {/* Logo Container */}
                     <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl shadow-lg flex items-center justify-center flex-shrink-0 p-1.5 transition-transform hover:scale-105">
                         <Image 
                            src="/img/umreclogonobg.png" 
                            alt="Logo" 
                            width={80} 
                            height={80} 
                            className="w-full h-full object-contain"
                         />
                     </div>
                     
                     {/* Text Content */}
                     <div className="text-white flex-1 min-w-0 flex flex-col justify-center gap-1">
                         <h2 className="text-xs sm:text-sm md:text-lg font-extrabold leading-tight tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                             UNIVERSITY OF MAKATI RESEARCH ETHICS COMMITTEE
                         </h2>
                         <h2 className="text-[10px] sm:text-xs md:text-base font-bold leading-tight text-orange-50/95 tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                             STANDARD OPERATING PROCEDURES
                         </h2>
                         <h2 className="text-xs sm:text-sm md:text-lg font-extrabold leading-tight tracking-wide text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                             DISCLOSURE OF CONFLICT OF INTEREST AGREEMENT
                         </h2>
                         <p className="text-[10px] sm:text-[11px] md:text-sm text-orange-100 font-medium leading-snug opacity-90 mt-1 border-t border-orange-400/30 pt-1.5 inline-block sm:self-start self-center">
                            (For Members and Consultants of the Research Ethics Committee)
                         </p>
                     </div>
                 </div>

                 {/* Desktop Close Button - Only visible on sm+ screens */}
                 <button
                     onClick={handleClose}
                     className="hidden sm:block p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm flex-shrink-0 self-center"
                     title="Close"
                 >
                     <X className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                 </button>
             </div>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-4 sm:p-6 md:p-8 space-y-6">
            
            {/* Introductory Text */}
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 sm:p-5 text-sm text-gray-800 leading-relaxed text-justify shadow-sm">
                <p className="mb-3">
                    In general, <strong>Conflict of Interest</strong> occurs when there is conflict (actual, potential, or perceived) between an individual's duties and his/her personal or private interests. Conflict of Interest impairs one's ability to exercise objectivity in the performance of official duties.
                </p>
                <p className="mb-3">
                    The Members (including the Chair) of the University of Makati Research Ethics Committee (UMREC) and its consultants shall sign this agreement to disclose any Conflict of Interest that they may have in the review of research protocols and other related documents.
                </p>
                <p className="font-semibold text-orange-800">
                    The following can be used as a guide to determining whether he/she has a Conflict of Interest.
                </p>
            </div>

            {/* Instructions */}
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
                    <h4 className="font-bold text-gray-800 uppercase text-xs sm:text-sm tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        INSTRUCTIONS TO NEC MEMBERS OR CONSULTANTS
                    </h4>
                 </div>
                 <p className="text-xs sm:text-sm text-gray-600 text-justify mb-4 pl-3">
                    Before affixing your signature below, please consider each of the following statements in relation to: 1) all your past and current official positions; and 2) all your immediate family members, especially your spouse and children. Then, check (√) your answer in the 'yes' or the 'no' column.
                 </p>
            </div>

            {/* Statements List */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white flex p-3 text-xs sm:text-sm font-bold uppercase tracking-wider">
                    <div className="flex-1 pl-2">Statements</div>
                    <div className="w-16 sm:w-20 text-center border-l border-white/20">YES</div>
                    <div className="w-16 sm:w-20 text-center border-l border-white/20">NO</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                    {statements.map((s, idx) => (
                        <div key={s.id} className="flex flex-col sm:flex-row text-sm group hover:bg-orange-50/30 transition-colors">
                            <div className="flex-1 p-3 sm:p-4 text-gray-800 font-medium leading-relaxed">
                                {idx + 1}. {s.text}
                            </div>
                            <div className="flex border-t sm:border-t-0 sm:border-l border-gray-100">
                                <label className="w-1/2 sm:w-20 flex items-center justify-center p-3 cursor-pointer hover:bg-orange-100/50 border-r sm:border-r-0 border-gray-100 transition-colors">
                                    <input 
                                        type="radio" 
                                        name={s.id} 
                                        checked={answers[s.id] === 'yes'} 
                                        onChange={() => setAnswers(p => ({ ...p, [s.id]: 'yes' }))}
                                        className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 cursor-pointer"
                                    />
                                    <span className="sm:hidden ml-2 font-bold text-gray-600">Yes</span>
                                </label>
                                <label className="w-1/2 sm:w-20 flex items-center justify-center p-3 cursor-pointer hover:bg-orange-100/50 sm:border-l border-gray-100 transition-colors">
                                    <input 
                                        type="radio" 
                                        name={s.id} 
                                        checked={answers[s.id] === 'no'} 
                                        onChange={() => setAnswers(p => ({ ...p, [s.id]: 'no' }))}
                                        className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-gray-300 cursor-pointer"
                                    />
                                     <span className="sm:hidden ml-2 font-bold text-gray-600">No</span>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {!allAnswered && (
                <div className="flex items-center justify-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs sm:text-sm font-bold animate-pulse">
                    <AlertTriangle size={16} />
                    Please answer YES or NO for all statements above.
                </div>
            )}

            {/* Declaration Text */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <p className="text-xs sm:text-sm text-gray-700 italic text-justify leading-relaxed">
                    "As a member/consultant of the UMREC, I shall disclose any conflict of interest that I may have in connection with the review of specific research protocols and related documents. I shall do this before or during any deliberations so that I may not participate in the decision regarding the said protocol."
                </p>
            </div>

            {/* Protocol & Remarks Fields */}
            <div className="flex flex-col gap-6">
                <div>
                     <label className="block text-xs font-bold uppercase text-gray-600 mb-2 tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Protocol Code
                     </label>
                     <input
                        value={protocolCode}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 font-bold focus:outline-none shadow-sm text-sm"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                     />
                </div>
                <div>
                     <label className="block text-xs font-bold uppercase text-gray-600 mb-2 tracking-wide" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Remarks
                     </label>
                     <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="State specific nature of conflict if any..."
                        rows={5}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all placeholder:text-gray-400 font-medium resize-none shadow-sm text-sm"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                     />
                </div>
            </div>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Signature Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-200">
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2 tracking-wide">
                        Signature Over Printed Name
                    </label>
                    <input
                        value={signatureName}
                        onChange={(e) => setSignatureName(e.target.value)}
                        placeholder="Type Full Name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-bold focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:outline-none transition-all text-sm"
                    />
                </div>
                
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2 tracking-wide">
                        Digital Signature
                    </label>
                    
                    {!signatureImage ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-[50px] bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-orange-50 hover:border-orange-400 transition-all group"
                        >
                            <Upload size={18} className="text-gray-400 group-hover:text-orange-500" />
                            <span className="text-xs sm:text-sm font-bold text-gray-500 group-hover:text-orange-600">Upload Image</span>
                        </div>
                    ) : (
                        <div className="relative w-full h-[50px] border-2 border-green-500 rounded-xl bg-green-50 flex items-center px-3 gap-3">
                             <div className="relative h-8 w-16">
                                <Image src={signatureImage} alt="Signature" fill className="object-contain" />
                             </div>
                             <span className="text-xs font-bold text-green-700 flex-1 truncate">Signature Added</span>
                             <button onClick={handleRemoveImage} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors">
                                <Trash2 size={16} />
                             </button>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/png, image/jpeg, image/jpg" 
                        className="hidden" 
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2 tracking-wide">
                        Date Signed
                    </label>
                    <input
                        value={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-bold text-center text-sm"
                    />
                </div>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] relative z-20">
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium italic text-center sm:text-left order-2 sm:order-1">
            * By clicking submit, you certify that the information provided is true and correct.
          </p>

          <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 sm:flex-none px-4 py-3 sm:px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors disabled:opacity-60 text-xs sm:text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-[2] sm:flex-none px-4 py-3 sm:px-8 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm"
            >
              {submittedOk ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} />
                  Submitted
                </span>
              ) : submitting ? (
                'Submitting...'
              ) : (
                'Submit Declaration'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
