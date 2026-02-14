import { User, Mail, Phone, Users, Building, AlertCircle } from 'lucide-react';

interface FormData {
  title: string;
  projectLeaderFirstName: string;
  projectLeaderMiddleName: string;
  projectLeaderLastName: string;
  projectLeaderEmail: string;
  projectLeaderContact: string;
  coAuthors: string;
  organization: string;
}

interface FormFieldsProps {
  formData: FormData;
  errors: Record<string, string>;
  handleInputChange: (field: string, value: string) => void;
}

export default function RevisionFormFields({ formData, errors, handleInputChange }: FormFieldsProps) {
  
  const inputClass = "w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] font-medium transition-all duration-300";
  const errorClass = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
  const normalClass = "border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400";
  const labelClass = "flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Title of Project */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <User size={16} className="text-[#F7D117]" />
          </div>
          Title of the project <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter your project title"
          className={`${inputClass} ${errors.title ? errorClass : normalClass}`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-semibold">
            <AlertCircle size={16} /> {errors.title}
          </p>
        )}
      </div>

      {/* Project Leader Full Name */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <User size={16} className="text-[#F7D117]" />
          </div>
          Project Leader Full Name <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <input
              id="projectLeaderLastName"
              type="text"
              placeholder="Last Name"
              value={formData.projectLeaderLastName}
              onChange={(e) => handleInputChange('projectLeaderLastName', e.target.value)}
              className={`${inputClass} ${errors.projectLeaderLastName ? errorClass : normalClass}`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            {errors.projectLeaderLastName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-semibold">
                <AlertCircle size={12} /> {errors.projectLeaderLastName}
              </p>
            )}
          </div>
          <div>
            <input
              id="projectLeaderFirstName"
              type="text"
              placeholder="First Name"
              value={formData.projectLeaderFirstName}
              onChange={(e) => handleInputChange('projectLeaderFirstName', e.target.value)}
              className={`${inputClass} ${errors.projectLeaderFirstName ? errorClass : normalClass}`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
              required
            />
            {errors.projectLeaderFirstName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-semibold">
                <AlertCircle size={12} /> {errors.projectLeaderFirstName}
              </p>
            )}
          </div>
          <div>
            <input
              id="projectLeaderMiddleName"
              type="text"
              placeholder="Middle Name (Optional)"
              value={formData.projectLeaderMiddleName}
              onChange={(e) => handleInputChange('projectLeaderMiddleName', e.target.value)}
              className={`${inputClass} ${normalClass}`}
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* Email and Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Mail size={16} className="text-[#F7D117]" />
            </div>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="projectLeaderEmail"
            type="email"
            value={formData.projectLeaderEmail}
            onChange={(e) => handleInputChange('projectLeaderEmail', e.target.value)}
            placeholder="email@example.com"
            className={`${inputClass} ${errors.projectLeaderEmail ? errorClass : normalClass}`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
          />
          {errors.projectLeaderEmail && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-semibold">
              <AlertCircle size={16} /> {errors.projectLeaderEmail}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
              <Phone size={16} className="text-[#F7D117]" />
            </div>
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            id="projectLeaderContact"
            type="tel"
            value={formData.projectLeaderContact}
            onChange={(e) => handleInputChange('projectLeaderContact', e.target.value)}
            placeholder="+63 912 345 6789"
            className={`${inputClass} ${errors.projectLeaderContact ? errorClass : normalClass}`}
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
          />
          {errors.projectLeaderContact && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-semibold">
              <AlertCircle size={16} /> {errors.projectLeaderContact}
            </p>
          )}
        </div>
      </div>

      {/* Co-Authors */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <Users size={16} className="text-[#F7D117]" />
          </div>
          List of Co-Authors <span className="text-red-500">*</span>
          <span className="text-gray-500 font-normal text-xs ml-2">(If none, write "N/A")</span>
        </label>
        <textarea
          id="coAuthors"
          value={formData.coAuthors}
          onChange={(e) => handleInputChange('coAuthors', e.target.value)}
          rows={4}
          placeholder="Juan A. Dela Cruz, Jeon H. Womwoo, Choi J. Seungcheol"
          className={`${inputClass} resize-none ${errors.coAuthors ? errorClass : normalClass}`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        />
        {errors.coAuthors && (
          <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-semibold">
            <AlertCircle size={16} /> {errors.coAuthors}
          </p>
        )}
      </div>

      {/* Organization */}
      <div>
        <label className={labelClass} style={{ fontFamily: 'Metropolis, sans-serif' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <Building size={16} className="text-[#F7D117]" />
          </div>
          Organization <span className="text-red-500">*</span>
        </label>
        <select
          id="organization"
          value={formData.organization}
          onChange={(e) => handleInputChange('organization', e.target.value)}
          className={`${inputClass} ${normalClass} cursor-pointer`}
          style={{ fontFamily: 'Metropolis, sans-serif' }}
          required
        >
          <option value="internal">Internal (UMak)</option>
          <option value="external">External</option>
        </select>
      </div>
    </div>
  );
}
