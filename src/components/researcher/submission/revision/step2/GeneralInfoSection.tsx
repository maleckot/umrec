import { FileText, User, Mail, Phone, Users, Plus, Trash2, Building, AlertCircle } from 'lucide-react';

interface GeneralInfoProps {
  formData: any;
  coResearchers: Array<{ name: string; contact: string; email: string }>;
  technicalAdvisers: Array<{ name: string; contact: string; email: string }>;
  errors: Record<string, string>;
  isUMak: boolean;
  umakColleges: string[];
  handleInputChange: (field: string, value: string) => void;
  setCoResearchers: (val: any) => void;
  setTechnicalAdvisers: (val: any) => void;
}

export default function GeneralInfoSection({
  formData,
  coResearchers,
  technicalAdvisers,
  errors,
  isUMak,
  umakColleges,
  handleInputChange,
  setCoResearchers,
  setTechnicalAdvisers,
}: GeneralInfoProps) {
  
  const inputClass = "w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] font-medium transition-all duration-300";
  const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
  const normalClass = "border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400";
  const labelClass = "flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#071139]/10 to-[#003366]/10 border-l-4 border-[#071139] p-6 rounded-xl">
        <h4 className="font-bold text-[#071139] text-lg mb-2 flex items-center gap-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <FileText size={20} />
          1. General Information
        </h4>
        <p className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Fields marked with <span className="text-red-500">*</span> are required. Some information pre-filled from Step 1.
        </p>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <FileText size={16} className="text-[#F7D117]" />
          </div>
          Title of Study <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`${inputClass} ${errors.title ? errorClass : normalClass}`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
            <AlertCircle size={16} /> {errors.title}
          </p>
        )}
      </div>

      {/* Study Site */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <Building size={16} className="text-[#F7D117]" />
          </div>
          Study Site <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.studySite}
          onChange={(e) => handleInputChange('studySite', e.target.value)}
          className={`${inputClass} ${normalClass}`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        />
      </div>

      {/* Researcher Name */}
      <div>
        <div className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <User size={16} className="text-[#F7D117]" />
          </div>
          <span>Name of Researcher <span className="text-red-500">*</span></span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">First Name</label>
            <input
              type="text"
              value={formData.researcherFirstName}
              onChange={(e) => handleInputChange('researcherFirstName', e.target.value)}
              className={`${inputClass} ${errors.researcherFirstName ? errorClass : normalClass}`}
              required
            />
            {errors.researcherFirstName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.researcherFirstName}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">Middle Name</label>
            <input
              type="text"
              value={formData.researcherMiddleName}
              onChange={(e) => handleInputChange('researcherMiddleName', e.target.value)}
              className={`${inputClass} ${normalClass}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1 text-gray-700">Last Name</label>
            <input
              type="text"
              value={formData.researcherLastName}
              onChange={(e) => handleInputChange('researcherLastName', e.target.value)}
              className={`${inputClass} ${errors.researcherLastName ? errorClass : normalClass}`}
              required
            />
            {errors.researcherLastName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.researcherLastName}</p>}
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Phone size={16} className="text-[#F7D117]" />
             </div>
             Mobile No <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            maxLength={11}
            value={formData.project_leader_contact}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 11) handleInputChange('project_leader_contact', val);
            }}
            className={`${inputClass} ${errors.mobileNo ? errorClass : normalClass}`}
            required
          />
          {errors.mobileNo && <p className="text-red-500 text-sm mt-2 font-bold">{errors.mobileNo}</p>}
        </div>
        <div>
           <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Mail size={16} className="text-[#F7D117]" />
             </div>
             Email <span className="text-red-500">*</span>
           </label>
           <input
             type="email"
             value={formData.project_leader_email}
             onChange={(e) => handleInputChange('project_leader_email', e.target.value)}
             className={`${inputClass} ${errors.email ? errorClass : normalClass}`}
             required
           />
           {errors.email && <p className="text-red-500 text-sm mt-2 font-bold">{errors.email}</p>}
        </div>
      </div>

      {/* Co-Researchers */}
      <div>
        <div className="flex items-center justify-between mb-3">
            <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Users size={16} className="text-[#F7D117]" />
                </div>
                Co-Researchers
            </label>
            <button
                type="button"
                onClick={() => setCoResearchers([...coResearchers, { name: '', contact: '', email: '' }])}
                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-bold"
            >
                <Plus size={16} /> Add
            </button>
        </div>
        {coResearchers.map((co, idx) => (
            <div key={idx} className="space-y-3 p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#071139]">Co-Researcher #{idx + 1}</span>
                    {coResearchers.length > 1 && (
                        <button type="button" onClick={() => setCoResearchers(coResearchers.filter((_, i) => i !== idx))} className="p-2 bg-red-500 text-white rounded-lg">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
                <input
                    type="text" placeholder="Full Name" value={co.name}
                    onChange={(e) => { const u = [...coResearchers]; u[idx].name = e.target.value; setCoResearchers(u); }}
                    className={`${inputClass} ${normalClass}`}
                />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="tel" placeholder="Contact" value={co.contact} onChange={(e) => { const u = [...coResearchers]; u[idx].contact = e.target.value; setCoResearchers(u); }} className={`${inputClass} ${normalClass}`} />
                    <input type="email" placeholder="Email" value={co.email} onChange={(e) => { const u = [...coResearchers]; u[idx].email = e.target.value; setCoResearchers(u); }} className={`${inputClass} ${normalClass}`} />
                 </div>
            </div>
        ))}
      </div>

       {/* Technical Advisers */}
       <div>
        <div className="flex items-center justify-between mb-3">
            <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                    <Users size={16} className="text-[#F7D117]" />
                </div>
                Technical/Content Adviser/s
            </label>
            <button
                type="button"
                onClick={() => setTechnicalAdvisers([...technicalAdvisers, { name: '', contact: '', email: '' }])}
                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg hover:bg-[#003366] transition-colors text-sm font-bold"
            >
                <Plus size={16} /> Add
            </button>
        </div>
        {technicalAdvisers.map((ad, idx) => (
            <div key={idx} className="space-y-3 p-4 bg-gray-50 rounded-xl mb-3 border border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#071139]">Adviser #{idx + 1}</span>
                    {technicalAdvisers.length > 1 && (
                        <button type="button" onClick={() => setTechnicalAdvisers(technicalAdvisers.filter((_, i) => i !== idx))} className="p-2 bg-red-500 text-white rounded-lg">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
                <input
                    type="text" placeholder="Full Name" value={ad.name}
                    onChange={(e) => { const u = [...technicalAdvisers]; u[idx].name = e.target.value; setTechnicalAdvisers(u); }}
                    className={`${inputClass} ${normalClass}`}
                />
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="tel" placeholder="Contact" value={ad.contact} onChange={(e) => { const u = [...technicalAdvisers]; u[idx].contact = e.target.value; setTechnicalAdvisers(u); }} className={`${inputClass} ${normalClass}`} />
                    <input type="email" placeholder="Email" value={ad.email} onChange={(e) => { const u = [...technicalAdvisers]; u[idx].email = e.target.value; setTechnicalAdvisers(u); }} className={`${inputClass} ${normalClass}`} />
                 </div>
            </div>
        ))}
      </div>

      {/* Institution */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Building size={16} className="text-[#F7D117]" />
             </div>
             Institution <span className="text-red-500">*</span>
        </label>
        <input
            type="text" value={formData.institution} onChange={(e) => handleInputChange('institution', e.target.value)}
            className={`${inputClass} ${normalClass}`} required
        />
      </div>

      {/* College */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Building size={16} className="text-[#F7D117]" />
             </div>
             College/Department <span className="text-red-500">*</span>
        </label>
        {isUMak ? (
            <select
                value={formData.college} onChange={(e) => handleInputChange('college', e.target.value)}
                className={`${inputClass} ${normalClass} cursor-pointer`} required
            >
                <option value="">Select College/Department</option>
                {umakColleges.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
        ) : (
            <input
                type="text" value={formData.college} onChange={(e) => handleInputChange('college', e.target.value)}
                className={`${inputClass} ${normalClass}`} required
            />
        )}
      </div>

      {/* Address */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Building size={16} className="text-[#F7D117]" />
             </div>
             Address of Institution <span className="text-red-500">*</span>
        </label>
        <input
            type="text" value={formData.institutionAddress} onChange={(e) => handleInputChange('institutionAddress', e.target.value)}
            className={`${inputClass} ${normalClass}`} required
        />
      </div>
    </div>
  );
}
