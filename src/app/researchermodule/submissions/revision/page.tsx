'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavbarRoles from '@/components/researcher-reviewer/NavbarRoles';
import Footer from '@/components/researcher-reviewer/Footer';
import { getSubmissionActivity } from '@/app/actions/researcher/getSubmissionActivity';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  AlertTriangle,
  UploadCloud,
  X,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  FileText,
  Users
} from 'lucide-react';
// Add these imports
import { getResubmissionData } from '@/app/actions/researcher/getResubmissionData';
import { submitResubmission } from '@/app/actions/researcher/submitResubmission';
// --- Interfaces ---
interface ResubmissionFormData {
  titleOfStudy: string;
  versionNumber: string;
  umrecCode: string;
  studySite: string;
  nameOfResearcher: string;
  coResearchers: string[]; 
  telNo: string;
  mobileNo: string;
  faxNo: string;
  email: string;
  institution: string;
  addressOfInstitution: string;
}

interface RevisionRow {
  id: number;
  recommendation: string;
  response: string;
  pageNumber: string;
}

function ResubmissionFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null); // Ref for auto-resizing title

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState('');

  // Form State
  const [formData, setFormData] = useState<ResubmissionFormData>({
    titleOfStudy: '',
    versionNumber: new Date().toISOString().split('T')[0],
    umrecCode: '',
    studySite: 'UMak',
    nameOfResearcher: '',
    coResearchers: [''],
    telNo: '',
    mobileNo: '',
    faxNo: '',
    email: '',
    institution: '',
    addressOfInstitution: '',
  });

  const [revisionRows, setRevisionRows] = useState<RevisionRow[]>([
    { id: 1, recommendation: '', response: '', pageNumber: '' }
  ]);

  // Load Data
  useEffect(() => {
    if (activityId) {
      loadActivityData();
    } else {
      setLoading(false);
    }
  }, [activityId]);

  // Auto-resize title textarea when content changes
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [formData.titleOfStudy]);

const loadActivityData = async () => {
    if (!activityId) return;
    setLoading(true);
    try {
      // 👇 Call the new server action
      const result = await getResubmissionData(activityId);
      
      if (result.success) {
        // 👇 Directly set the pre-formatted form data
        if (result.formData) {
          setFormData(result.formData);
        }
        
        // 👇 Directly set the pre-formatted revision rows
        if (result.revisionRows && result.revisionRows.length > 0) {
          setRevisionRows(result.revisionRows);
        }
      } else {
        console.error('Failed to load data:', result.error);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  // --- Input Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  // --- Co-Researcher Dynamic Fields ---
  const handleCoResearcherChange = (index: number, value: string) => {
    const updatedCoResearchers = [...formData.coResearchers];
    updatedCoResearchers[index] = value;
    setFormData(prev => ({ ...prev, coResearchers: updatedCoResearchers }));
  };

  const addCoResearcher = () => {
    setFormData(prev => ({ ...prev, coResearchers: [...prev.coResearchers, ''] }));
  };

  const removeCoResearcher = (index: number) => {
    if (formData.coResearchers.length > 1) {
      const updatedCoResearchers = formData.coResearchers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, coResearchers: updatedCoResearchers }));
    }
  };

  // --- Revision Table Handlers ---
  const handleRowChange = (id: number, field: keyof RevisionRow, value: string) => {
    setRevisionRows(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const addRow = () => {
    setRevisionRows(prev => [
      ...prev, 
      { id: Date.now(), recommendation: '', response: '', pageNumber: '' }
    ]);
  };

  const removeRow = (id: number) => {
    if (revisionRows.length > 1) {
      setRevisionRows(prev => prev.filter(row => row.id !== id));
    }
  };

  // --- Signature Handlers ---
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignatureImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const handleSubmit = async () => {
    // Validations
    if (emailError || !formData.email) {
      alert('Please enter a valid email address.');
      return;
    }
    // Note: In a real app, you need to upload the signature image to storage 
    // and get a URL before sending it here.
    if (!signatureImage) {
      alert('Please upload your signature before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!activityId) return;

      // Call Server Action
      const result = await submitResubmission(activityId, formData, revisionRows);

      if (result.success) {
        alert('Resubmission Submitted Successfully!');
        router.push('/researchermodule');
      } else {
        alert('Failed to submit: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBack = () => {
    router.back();
  };

  // --- Styles ---
  const inputClass = "w-full bg-white px-4 py-3 rounded-xl border border-gray-300 text-[#111827] placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium shadow-sm";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
        <NavbarRoles role="researcher" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-[#071139] font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>Loading form...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8EEF3] to-[#DAE0E7]">
      <NavbarRoles role="researcher" />

      <div className="pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pb-12">
        <div className="max-w-[1200px] mx-auto">
          
          {/* --- Header Section --- */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button 
                onClick={handleBack} 
                className="w-12 h-12 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 hover:shadow-lg transition-all duration-300 group flex-shrink-0" 
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="text-orange-600 group-hover:text-orange-700 transition-colors duration-300" />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Required Resubmission
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-600 ml-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Please carefully address the feedback below.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* 1. GENERAL INFORMATION CARD */}
            <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                  <User className="w-5 h-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    General Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Width Fields */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>Title of Study</label>
                    {/* Replaced input with auto-expanding textarea */}
                    <textarea 
                      ref={titleRef}
                      name="titleOfStudy" 
                      value={formData.titleOfStudy} 
                      onChange={handleInputChange} 
                      className={`${inputClass} min-h-[50px] overflow-hidden resize-none py-3 leading-relaxed`}
                      rows={1}
                      placeholder="Enter the complete title of your study..."
                    />
                  </div>

                  {/* Half Width Fields */}
                  <div>
                    <label className={labelClass}>Version Number / Date</label>
                    <input type="text" name="versionNumber" value={formData.versionNumber} onChange={handleInputChange} className={inputClass} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClass}>UMREC Code</label>
                        <input type="text" name="umrecCode" value={formData.umrecCode} readOnly className={`${inputClass} bg-gray-50 text-gray-500`} />
                     </div>
                     <div>
                        <label className={labelClass}>Study Site</label>
                        <input type="text" name="studySite" value={formData.studySite} onChange={handleInputChange} className={inputClass} />
                     </div>
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 my-2 pt-4"></div>

                  {/* Researcher Info */}
                  <div>
                    <label className={labelClass}>Name of Researcher</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="text" name="nameOfResearcher" value={formData.nameOfResearcher} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                    </div>
                  </div>

                  {/* DYNAMIC CO-RESEARCHERS SECTION */}
                  <div className="md:col-span-1">
                    <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Co-Researcher/s</label>
                        <button 
                            type="button"
                            onClick={addCoResearcher}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                        >
                            <Plus size={14} /> Add Person
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {formData.coResearchers.map((researcher, index) => (
                            <div key={index} className="relative flex items-center gap-2">
                                <div className="relative flex-1 min-w-0">
                                    <Users className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={researcher} 
                                        onChange={(e) => handleCoResearcherChange(index, e.target.value)} 
                                        placeholder={`Co-Researcher ${index + 1}`}
                                        className={`${inputClass} pl-10`} 
                                    />
                                </div>
                                {formData.coResearchers.length > 1 && (
                                    <button 
                                        onClick={() => removeCoResearcher(index)}
                                        className="p-3 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                        title="Remove Researcher"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                  </div>

                  {/* Contact Info Group */}
                  <div className="md:col-span-2 bg-orange-50/50 p-4 md:p-6 rounded-xl border border-orange-100">
                    <label className="block text-sm font-bold text-orange-800 mb-4 uppercase tracking-wide">Contact Information</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Tel No - Number Only */}
                      <div>
                        <span className="text-xs text-gray-500 font-semibold mb-1 block">Tel No.</span>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            name="telNo" 
                            value={formData.telNo} 
                            onChange={handleNumberChange} 
                            placeholder="Numbers only"
                            className={`${inputClass} pl-9 py-2 text-sm`} 
                          />
                        </div>
                      </div>

                      {/* Mobile No - Number Only */}
                      <div>
                        <span className="text-xs text-gray-500 font-semibold mb-1 block">Mobile No.</span>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            name="mobileNo" 
                            value={formData.mobileNo} 
                            onChange={handleNumberChange} 
                            placeholder="Numbers only"
                            className={`${inputClass} pl-9 py-2 text-sm`} 
                          />
                        </div>
                      </div>

                      {/* Fax No - Number Only */}
                      <div>
                        <span className="text-xs text-gray-500 font-semibold mb-1 block">Fax No.</span>
                         <input 
                            type="text" 
                            name="faxNo" 
                            value={formData.faxNo} 
                            onChange={handleNumberChange} 
                            placeholder="Numbers only"
                            className={`${inputClass} py-2 text-sm`} 
                         />
                      </div>

                      {/* Email - Email Validation */}
                      <div>
                        <span className="text-xs text-gray-500 font-semibold mb-1 block">Email</span>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleEmailChange} 
                            className={`${inputClass} pl-9 py-2 text-sm ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`} 
                          />
                        </div>
                        {emailError && <p className="text-xs text-red-500 mt-1 font-medium">{emailError}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Institution */}
                  <div>
                    <label className={labelClass}>Institution of researcher</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="text" name="institution" value={formData.institution} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Address of Institution</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input type="text" name="addressOfInstitution" value={formData.addressOfInstitution} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* 2. REVISIONS LIST SECTION */}
            <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 overflow-hidden">
               <div className="p-6 md:p-8">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    <h2 className="text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      Revisions Required
                    </h2>
                  </div>
                  {/* Responsive Add Button */}
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
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2">UMREC Recommendation / Feedback</label>
                          <textarea
                            value={row.recommendation}
                            onChange={(e) => handleRowChange(row.id, 'recommendation', e.target.value)}
                            placeholder="Enter the committee's recommendation here..."
                            className="w-full bg-white p-4 rounded-xl border border-gray-300 text-[#111827] min-h-[160px] focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none resize-y text-base leading-relaxed"
                          />
                        </div>

                        {/* Response */}
                        <div className="flex flex-col">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2">Researcher's Response</label>
                          <textarea
                            value={row.response}
                            onChange={(e) => handleRowChange(row.id, 'response', e.target.value)}
                            placeholder="Type your detailed response here explaining how you addressed the feedback..."
                            className="w-full bg-white p-4 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-[#111827] min-h-[160px] outline-none resize-y text-base leading-relaxed"
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="w-full sm:w-1/2 lg:w-1/3">
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Section and page number of revisions</label>
                          <input
                            type="text"
                            value={row.pageNumber}
                            onChange={(e) => handleRowChange(row.id, 'pageNumber', e.target.value)}
                            placeholder="e.g. Methodology, Page 5"
                            className="w-full bg-white px-4 py-2 rounded-lg border border-gray-300 text-[#111827] focus:border-orange-500 outline-none text-sm"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. SIGNATURE SECTION */}
            <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 overflow-hidden p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#071139] mb-6" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Authorization
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                {/* Signature Upload */}
                <div className="flex-1 w-full">
                  <label className={labelClass}>Signature of Researcher</label>
                  
                  {!signatureImage ? (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-orange-50 hover:border-orange-300 transition-colors cursor-pointer group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-orange-500 mb-3 transition-colors" />
                      <p className="text-sm font-medium text-gray-600 group-hover:text-orange-700 text-center">Click to upload signature image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleSignatureUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  ) : (
                    <div className="relative border border-gray-200 rounded-xl p-4 bg-white inline-block max-w-full">
                      <img src={signatureImage} alt="Signature" className="h-24 object-contain" />
                      <button 
                        onClick={removeSignature}
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="w-full md:w-1/3">
                  <label className={labelClass}>Date</label>
                  <div className="bg-gray-100 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Footer Action --- */}
            <div className="flex justify-end pt-4 pb-12 px-4 sm:px-0">
               {/* Responsive Submit Button */}
               <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Submit Revisions
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ResubmissionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResubmissionFormContent />
    </Suspense>
  );
}
