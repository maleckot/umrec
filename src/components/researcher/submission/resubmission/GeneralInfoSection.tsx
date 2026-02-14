import { User, Phone, Mail, Building, MapPin, Users, Plus, Trash2 } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface GeneralInfoProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCoResearcherChange: (index: number, value: string) => void;
  addCoResearcher: () => void;
  removeCoResearcher: (index: number) => void;
  emailError: string;
}

export default function GeneralInfoSection({
  formData,
  handleInputChange,
  handleNumberChange,
  handleEmailChange,
  handleCoResearcherChange,
  addCoResearcher,
  removeCoResearcher,
  emailError
}: GeneralInfoProps) {
  
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const inputClass = "w-full bg-white px-4 py-3 rounded-xl border border-gray-300 text-[#071139] placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium shadow-sm";
  const labelClass = "block text-sm font-bold text-[#071139] mb-2 uppercase tracking-wide";

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, [formData.titleOfStudy]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-t-4 border-orange-500 overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <User className="w-5 h-5 text-orange-600" />
          <h2 className="text-xl font-bold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            General Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="md:col-span-2">
            <label className={labelClass}>Title of Study</label>
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

          {/* Version & Site */}
          <div>
            <label className={labelClass}>Version Number / Date</label>
            <input type="text" name="versionNumber" value={formData.versionNumber} onChange={handleInputChange} className={inputClass} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>UMREC Code</label>
                <input type="text" name="umrecCode" value={formData.umrecCode} readOnly className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`} />
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

          {/* Dynamic Co-Researchers */}
          <div className="md:col-span-1">
            <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                <label className={labelClass}>Co-Researcher/s</label>
                <button 
                    type="button"
                    onClick={addCoResearcher}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                >
                    <Plus size={14} /> Add Person
                </button>
            </div>
            
            <div className="space-y-3">
                {formData.coResearchers.map((researcher: string, index: number) => (
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
            <label className="block text-sm font-bold text-orange-900 mb-4 uppercase tracking-wide">Contact Information</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div>
                <span className="text-xs text-[#071139] font-bold mb-1 block">Tel No.</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" name="telNo" value={formData.telNo} onChange={handleNumberChange} 
                    placeholder="Numbers only" className={`${inputClass} pl-9 py-2 text-sm`} 
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#071139] font-bold mb-1 block">Mobile No.</span>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" name="mobileNo" value={formData.mobileNo} onChange={handleNumberChange} 
                    placeholder="Numbers only" className={`${inputClass} pl-9 py-2 text-sm`} 
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-[#071139] font-bold mb-1 block">Fax No.</span>
                 <input 
                    type="text" name="faxNo" value={formData.faxNo} onChange={handleNumberChange} 
                    placeholder="Numbers only" className={`${inputClass} py-2 text-sm`} 
                  />
              </div>

              <div>
                <span className="text-xs text-[#071139] font-bold mb-1 block">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleEmailChange} 
                    className={`${inputClass} pl-9 py-2 text-sm ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}`} 
                  />
                </div>
                {emailError && <p className="text-xs text-red-600 mt-1 font-bold">{emailError}</p>}
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
  );
}
