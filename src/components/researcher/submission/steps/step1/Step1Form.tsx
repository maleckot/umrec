'use client';
import { User, Mail, Phone, Building, AlertCircle } from 'lucide-react';

interface Step1FormProps {
  formData: any;
  errors: Record<string, string>;
  handleInputChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function Step1Form({ formData, errors, handleInputChange, handleSubmit }: Step1FormProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8 md:p-10 lg:p-12">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        
        {/* Title of Project */}
        <InputField 
          id="title" 
          label="Title of the project" 
          value={formData.title} 
          error={errors.title} 
          onChange={(val: string) => handleInputChange('title', val)} 
          placeholder="Enter your project title"
          icon={<User size={16} className="text-[#F7D117]" />}
        />

        {/* Project Leader Full Name */}
        <div>
          <Label icon={<User size={16} className="text-[#F7D117]" />} text="Project Leader Full Name" required />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <SimpleInput 
              id="projectLeaderLastName" 
              placeholder="Last Name" 
              value={formData.projectLeaderLastName} 
              error={errors.projectLeaderLastName} 
              onChange={(val: string) => handleInputChange('projectLeaderLastName', val)} 
            />
            <SimpleInput 
              id="projectLeaderFirstName" 
              placeholder="First Name" 
              value={formData.projectLeaderFirstName} 
              error={errors.projectLeaderFirstName} 
              onChange={(val: string) => handleInputChange('projectLeaderFirstName', val)} 
            />
            <SimpleInput 
              id="projectLeaderMiddleName" 
              placeholder="Middle Name (Optional)" 
              value={formData.projectLeaderMiddleName} 
              onChange={(val: string) => handleInputChange('projectLeaderMiddleName', val)} 
              required={false}
            />
          </div>
        </div>

        {/* Email and Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            id="projectLeaderEmail" 
            type="email"
            label="Email Address" 
            value={formData.projectLeaderEmail} 
            error={errors.projectLeaderEmail} 
            onChange={(val: string) => handleInputChange('projectLeaderEmail', val)} 
            placeholder="email@example.com"
            icon={<Mail size={16} className="text-[#F7D117]" />}
          />
          <InputField 
            id="projectLeaderContact" 
            type="tel"
            label="Contact Number" 
            value={formData.projectLeaderContact} 
            error={errors.projectLeaderContact} 
            onChange={(val: string) => handleInputChange('projectLeaderContact', val)} 
            placeholder="+63 912 345 6789"
            icon={<Phone size={16} className="text-[#F7D117]" />}
          />
        </div>

        {/* Organization */}
        <div>
          <Label icon={<Building size={16} className="text-[#F7D117]" />} text="Organization" required />
          <select
            id="organization"
            value={formData.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            className="w-full px-4 sm:px-5 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:border-[#071139] focus:ring-2 focus:ring-[#071139]/20 focus:outline-none text-[#071139] transition-all duration-300 hover:border-gray-400 cursor-pointer"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            required
            aria-required="true"
          >
            <option value="internal">Internal (UMak)</option>
            <option value="external">External</option>
          </select>
        </div>

        {/* Navigation Button */}
        <div className="flex justify-end pt-8 mt-8 border-t-2 border-gray-200">
          <button
            type="submit"
            className="group relative px-10 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-[#071139] to-[#003366] text-white rounded-xl hover:from-[#003366] hover:to-[#071139] transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 overflow-hidden"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
            aria-label="Proceed to next step"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#F7D117] via-white/10 to-[#F7D117] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
            <span className="relative z-10 flex items-center justify-center gap-2">
              Next Step
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

// Sub-components
const Label = ({ icon, text, required = false }: any) => (
  <label className="flex items-center gap-2 text-sm sm:text-base font-bold mb-3 text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#071139] to-[#003366] flex items-center justify-center shadow-md">
      {icon}
    </div>
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);

const InputField = ({ id, label, icon, value, error, onChange, placeholder, type = "text" }: any) => (
  <div>
    <Label icon={icon} text={label} required />
    <SimpleInput id={id} type={type} value={value} error={error} onChange={onChange} placeholder={placeholder} />
  </div>
);

const SimpleInput = ({ id, value, error, onChange, placeholder, type = "text", required = true }: any) => (
  <>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 sm:px-5 py-3 sm:py-4 border-2 rounded-xl focus:ring-2 focus:outline-none text-[#071139] transition-all duration-300 ${
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#071139] focus:ring-[#071139]/20 hover:border-gray-400'
      }`}
      style={{ fontFamily: 'Metropolis, sans-serif' }}
      required={required}
      aria-invalid={!!error}
    />
    {error && (
      <p className="text-red-500 text-sm mt-2 flex items-center gap-1" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        <AlertCircle size={16} /> {error}
      </p>
    )}
  </>
);
