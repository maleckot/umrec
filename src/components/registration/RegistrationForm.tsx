// components/registration/RegistrationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { registerResearcher } from '@/app/actions/auth/registerResearcher';

interface RegistrationFormProps {
  onSuccess: (email: string, userId: string) => void;
}

// UMAK Colleges list
const UMAK_COLLEGES = [
  { value: '', label: 'Select College' },
  { value: 'College of Liberal Arts and Sciences (CLAS)', label: 'College of Liberal Arts and Sciences (CLAS)' },
  { value: 'College of Human Kinetics (CHK)', label: 'College of Human Kinetics (CHK)' },
  { value: 'College of Business and Financial Science (CBFS)', label: 'College of Business and Financial Science (CBFS)' },
  { value: 'College of Computing and Information Sciences (CCIS)', label: 'College of Computing and Information Sciences (CCIS)' },
  { value: 'College of Construction Sciences and Engineering (CCSE)', label: 'College of Construction Sciences and Engineering (CCSE)' },
  { value: 'College of Governance and Public Policy (CGPP)', label: 'College of Governance and Public Policy (CGPP)' },
  { value: 'College of Engineering Technology (CET)', label: 'College of Engineering Technology (CET)' },
  { value: 'College of Tourism and Hospitality Management (CTHM)', label: 'College of Tourism and Hospitality Management (CTHM)' },
  { value: 'College of Innovative Teacher Education (CITE)', label: 'College of Innovative Teacher Education (CITE)' },
  { value: 'College of Continuing, Advanced and Professional Studies (CCAPS)', label: 'College of Continuing, Advanced and Professional Studies (CCAPS)' },
  { value: 'Institute of Arts and Design (IAD)', label: 'Institute of Arts and Design (IAD)' },
  { value: 'Institute of Accountancy (IOA)', label: 'Institute of Accountancy (IOA)' },
  { value: 'Institute of Pharmacy (IOP)', label: 'Institute of Pharmacy (IOP)' },
  { value: 'Institute of Nursing (ION)', label: 'Institute of Nursing (ION)' },
  { value: 'Institute of Imaging Health Science (IIHS)', label: 'Institute of Imaging Health Science (IIHS)' },
  { value: 'Institute of Technical Education and Skills Training (ITEST)', label: 'Institute of Technical Education and Skills Training (ITEST)' },
  { value: 'Institute for Social Development and Nation Building (ISDNB)', label: 'Institute for Social Development and Nation Building (ISDNB)' },
  { value: 'Institute of Psychology (IOPsy)', label: 'Institute of Psychology (IOPsy)' },
  { value: 'Institute of Social Work (ISW)', label: 'Institute of Social Work (ISW)' },
  { value: 'Institute of Disaster and Emergency Management (IDEM)', label: 'Institute of Disaster and Emergency Management (IDEM)' },
  { value: 'School of Law (SOL)', label: 'School of Law (SOL)' }
];

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    dateOfBirth: '2000-01-01', // Default value for professionals
    role: '',
    contactNumber: '',
    gender: '',
    school: '',
    college: '',
    program: '',
    yearLevel: '',
    section: '',
    studentNo: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUmakSchool, setIsUmakSchool] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isStudent = formData.role === 'Student';
  const isProfessional = formData.role === 'Professional';

  useEffect(() => {
    const schoolLower = formData.school.toLowerCase();
    const isUmak = schoolLower.includes('university of makati') || schoolLower.includes('umak');
    setIsUmakSchool(isUmak);
    
    // Clear student number if not UMAK student
    if (!isUmak || !isStudent) {
      if (formData.studentNo) {
        setFormData(prev => ({ ...prev, studentNo: '' }));
      }
    }
  }, [formData.school, formData.role, isStudent, formData.studentNo]);

  // Clear student-specific fields when switching to Professional
  useEffect(() => {
    if (isProfessional) {
      setFormData(prev => ({
        ...prev,
        yearLevel: '',
        section: '',
        studentNo: '',
        program: '',
        dateOfBirth: '2000-01-01' // Set default for professionals
      }));
    }
  }, [isProfessional]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (PH format)
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Contact number must be in format: 09XXXXXXXXX');
      return;
    }

    setLoading(true);

    try {
      const result = await registerResearcher(formData);

      if (result.success) {
        // Pass email and userId to show verification modal
        const userId = result.userId || `temp-${Date.now()}`; // Use temp ID if backend doesn't return one yet
        onSuccess(formData.email, userId);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
     {error && (
  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-4 backdrop-blur-sm animate-shake">
    <div className="flex items-center gap-2">
      <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <p className="text-sm text-red-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
        {error}
      </p>
    </div>
  </div>
)}

      {/* Personal Information */}
      <div>
        <h2 
          className="text-sm sm:text-base font-bold text-[#003366] mb-2 sm:mb-3 pb-1 sm:pb-2 border-b-2 border-gray-300" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Personal Information
        </h2>

        <div className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <FormInput
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => handleChange('lastName', value)}
              placeholder="Dela Cruz"
              required
            />
            <FormInput
              label="First Name"
              value={formData.firstName}
              onChange={(value) => handleChange('firstName', value)}
              placeholder="Juan"
              required
            />
            <FormInput
              label="Middle Name"
              value={formData.middleName}
              onChange={(value) => handleChange('middleName', value)}
              placeholder="Alfonso"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <FormSelect
              label="Role"
              value={formData.role}
              onChange={(value) => handleChange('role', value)}
              options={[
                { value: '', label: 'Select Role' },
                { value: 'Student', label: 'Student' },
                { value: 'Professional', label: 'Professional' }
              ]}
              required
            />
            <FormInput
              label="Contact Number"
              type="tel"
              value={formData.contactNumber}
              onChange={(value) => handleChange('contactNumber', value)}
              placeholder="09993232945"
              required
            />
            <FormSelect
              label="Gender"
              value={formData.gender}
              onChange={(value) => handleChange('gender', value)}
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Prefer not to say' }
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <FormInput
              label="School"
              value={formData.school}
              onChange={(value) => handleChange('school', value)}
              placeholder="University of Makati"
              required
            />
            
            {/* Conditional College field - Dropdown for UMAK (both student and professional) */}
            {isUmakSchool ? (
              <FormSelect
                label="College"
                value={formData.college}
                onChange={(value) => handleChange('college', value)}
                options={UMAK_COLLEGES}
                required
              />
            ) : (
              <FormInput
                label="College"
                value={formData.college}
                onChange={(value) => handleChange('college', value)}
                placeholder="College of Computing and Information Sciences"
                required
              />
            )}
          </div>

          <FormInput
            label="Program/Major"
            value={formData.program}
            onChange={(value) => handleChange('program', value)}
            placeholder="Bachelor of Science in Computer Science"
            required={isStudent}
            disabled={isProfessional}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Year Level - Match FormInput disabled style */}
            <FormInput
              label="Year Level"
              value={formData.yearLevel}
              onChange={(value) => handleChange('yearLevel', value)}
              placeholder={isProfessional ? "N/A" : "Select Year"}
              required={isStudent}
              disabled={isProfessional}
            />
            
            <FormInput
              label="Section"
              value={formData.section}
              onChange={(value) => handleChange('section', value)}
              placeholder={isProfessional ? "N/A" : "IV-BCSAD"}
              required={isStudent}
              disabled={isProfessional}
            />
            <FormInput
              label="Student No. (UMAK only)"
              value={formData.studentNo}
              onChange={(value) => handleChange('studentNo', value)}
              placeholder={isUmakSchool && isStudent ? "K12920931" : "N/A"}
              required={isUmakSchool && isStudent}
              disabled={!isUmakSchool || isProfessional}
            />
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div>
        <h2 
          className="text-sm sm:text-base font-bold text-[#003366] mb-2 sm:mb-3 pb-1 sm:pb-2 border-b-2 border-gray-300" 
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        >
          Account Information
        </h2>

        <div className="space-y-2 sm:space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <FormInput
              label="Username"
              value={formData.username}
              onChange={(value) => handleChange('username', value)}
              placeholder="username123"
              required
            />
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              placeholder="email23424@gmail.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* Password field - around line 300+ */}
<div className="relative">
  <FormInput
    label="Password"
    type={showPassword ? 'text' : 'password'}
    value={formData.password}
    onChange={(value) => handleChange('password', value)}
    placeholder="••••••••••••••••"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 sm:right-3 top-[27px] sm:top-[29px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? <EyeOff className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
  </button>
</div>

{/* Confirm Password field */}
<div className="relative">
  <FormInput
    label="Confirm Password"
    type={showConfirmPassword ? 'text' : 'password'}
    value={formData.confirmPassword}
    onChange={(value) => handleChange('confirmPassword', value)}
    placeholder="password123"
    required
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-2 sm:right-3 top-[27px] sm:top-[29px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
  >
    {showConfirmPassword ? <EyeOff className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
  </button>
</div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
  type="submit"
  disabled={loading}
  className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#212A4E] to-[#050C2D] text-white rounded-xl font-bold text-sm sm:text-base hover:scale-[1.02] transition-all duration-300 mt-4 sm:mt-5 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group shadow-xl"
  style={{ fontFamily: 'Metropolis, sans-serif' }}
>
  <span className="absolute inset-0 bg-gradient-to-r from-[#F0E847] via-white/10 to-[#F0E847] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 opacity-20"></span>
  <span className="relative z-10 flex items-center justify-center gap-2">
    {loading ? (
      <>
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Registering...
      </>
    ) : (
      <>
        Register
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </>
    )}
  </span>
</button>
<style jsx global>{`
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
`}</style>
    </form>
    
  );
}
