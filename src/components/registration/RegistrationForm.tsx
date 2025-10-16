// components/registration/RegistrationForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Calendar } from 'lucide-react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { registerResearcher } from '@/app/actions/auth/registerResearcher';

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    dateOfBirth: '',
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
  const [isUmakStudent, setIsUmakStudent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const schoolLower = formData.school.toLowerCase();
    const isUmak = schoolLower.includes('university of makati') || schoolLower.includes('umak');
    setIsUmakStudent(isUmak);
    
    if (!isUmak && formData.studentNo) {
      setFormData(prev => ({ ...prev, studentNo: '' }));
    }
  }, [formData.school]);

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
        onSuccess(); // Show success modal
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
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700 font-semibold" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {error}
          </p>
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
            <div className="relative">
              <FormInput
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(value) => handleChange('dateOfBirth', value)}
                required
              />
              <Calendar className="absolute right-2 sm:right-3 top-[27px] sm:top-[29px] w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-500 pointer-events-none" />
            </div>
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
            <FormInput
              label="College"
              value={formData.college}
              onChange={(value) => handleChange('college', value)}
              placeholder="College of Computing and Information Sciences"
              required
            />
          </div>

          <FormInput
            label="Program/Major"
            value={formData.program}
            onChange={(value) => handleChange('program', value)}
            placeholder="Bachelor of Science in Computer Science"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <FormSelect
              label="Year Level"
              value={formData.yearLevel}
              onChange={(value) => handleChange('yearLevel', value)}
              options={[
                { value: '', label: 'Select Year' },
                { value: '1st Year', label: '1st Year' },
                { value: '2nd Year', label: '2nd Year' },
                { value: '3rd Year', label: '3rd Year' },
                { value: '4th Year', label: '4th Year' },
                { value: '5th Year', label: '5th Year' }
              ]}
              required
            />
            <FormInput
              label="Section"
              value={formData.section}
              onChange={(value) => handleChange('section', value)}
              placeholder="IV-BCSAD"
              required
            />
            <FormInput
              label="Student No. (UMAK only)"
              value={formData.studentNo}
              onChange={(value) => handleChange('studentNo', value)}
              placeholder={isUmakStudent ? "K12920931" : "N/A"}
              required={isUmakStudent}
              disabled={!isUmakStudent}
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
                className="absolute right-2 sm:right-3 top-[27px] sm:top-[29px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-3.5 sm:w-4 h-3.5 sm:h-4" /> : <Eye className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
              </button>
            </div>
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
                className="absolute right-2 sm:right-3 top-[27px] sm:top-[29px] text-gray-500 hover:text-gray-700"
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
        className="w-full py-2.5 sm:py-3 bg-[#212A4E] text-white rounded-lg font-bold text-sm sm:text-base hover:opacity-90 transition-opacity mt-3 sm:mt-4 disabled:opacity-50"
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
