// components/profile/PersonalInformationTab.tsx
'use client';

import { Calendar, ChevronDown } from 'lucide-react';

interface PersonalInformationTabProps {
  userData: any;
  setUserData: (data: any) => void;
  isEditing: boolean;
  onEditClick: () => void;
  onSaveChanges: () => void;
  onCancelEdit: () => void;
}

export default function PersonalInformationTab({
  userData,
  setUserData,
  isEditing,
  onEditClick,
  onSaveChanges,
  onCancelEdit
}: PersonalInformationTabProps) {
  const handleChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Last Name
          </label>
          <input
            type="text"
            value={userData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            First Name
          </label>
          <input
            type="text"
            value={userData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Middle Name
          </label>
          <input
            type="text"
            value={userData.middleName}
            onChange={(e) => handleChange('middleName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
      </div>

      {/* Date, Contact, Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative">
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Date of Birth
          </label>
          <input
            type="date"
            value={userData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
          {!isEditing && <Calendar className="absolute right-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />}
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Contact Number
          </label>
          <input
            type="tel"
            value={userData.contactNumber}
            onChange={(e) => handleChange('contactNumber', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        <div className="relative">
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Gender
          </label>
          <select
            value={userData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            disabled={!isEditing}
            className="w-full appearance-none px-3 py-2 pr-8 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select>
          <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* School and College */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            School
          </label>
          <input
            type="text"
            value={userData.school}
            onChange={(e) => handleChange('school', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            College
          </label>
          <input
            type="text"
            value={userData.college}
            onChange={(e) => handleChange('college', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
      </div>

      {/* Program/Major */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Program/Major
        </label>
        <input
          type="text"
          value={userData.program}
          onChange={(e) => handleChange('program', e.target.value)}
          disabled={!isEditing}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
          style={{ fontFamily: 'Metropolis, sans-serif' }}
        />
      </div>

      {/* Year Level, Section, Student No */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="relative">
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Year Level
          </label>
          <select
            value={userData.yearLevel}
            onChange={(e) => handleChange('yearLevel', e.target.value)}
            disabled={!isEditing}
            className="w-full appearance-none px-3 py-2 pr-8 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
            <option>5th Year</option>
          </select>
          <ChevronDown className="absolute right-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Section
          </label>
          <input
            type="text"
            value={userData.section}
            onChange={(e) => handleChange('section', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#003366] mb-1.5" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            Student No. (UMAK only)
          </label>
          <input
            type="text"
            value={userData.studentNo}
            onChange={(e) => handleChange('studentNo', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#003366]"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-4">
        {!isEditing ? (
          <button
            onClick={onEditClick}
            className="px-8 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'Metropolis, sans-serif' }}
          >
            Edit Information
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onCancelEdit}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Cancel
            </button>
            <button
              onClick={onSaveChanges}
              className="px-6 py-2.5 bg-[#003366] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
