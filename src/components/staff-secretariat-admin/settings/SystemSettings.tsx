// components/staff-secretariat-admin/settings/SystemSettings.tsx
'use client';

import { useState } from 'react';
import SettingsInput from './SettingsInput';
import SaveButton from './SaveButton';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    defaultReviewPeriod: 30,
    expeditedReviewers: 3,
    fullReviewReviewers: 5,
    expeditedDueDate: 3,
    fullReviewDueDate: 7,
    fileUploadSize: 50,
    autoAssignReviewers: false
  });

  const handleChange = (field: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Add API call here
    alert('Settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <h2 
        className="text-lg sm:text-xl font-bold text-[#003366] mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        System Settings
      </h2>

      <div className="space-y-6">
        {/* Default Review Period */}
        <SettingsInput
          label="Default Review Period (Days)"
          type="number"
          value={settings.defaultReviewPeriod}
          onChange={(value) => handleChange('defaultReviewPeriod', value)}
          description="Standard timeframe for reviewers to complete their reviews"
        />

        {/* Expedited Review Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SettingsInput
            label="Expedited: Maximum Reviewers"
            type="number"
            value={settings.expeditedReviewers}
            onChange={(value) => handleChange('expeditedReviewers', value)}
            description="Max reviewers for expedited submissions"
          />
          <SettingsInput
            label="Expedited: Due Date (Days)"
            type="number"
            value={settings.expeditedDueDate}
            onChange={(value) => handleChange('expeditedDueDate', value)}
            description="Review deadline for expedited submissions"
          />
        </div>

        {/* Full Review Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SettingsInput
            label="Full Review: Maximum Reviewers"
            type="number"
            value={settings.fullReviewReviewers}
            onChange={(value) => handleChange('fullReviewReviewers', value)}
            description="Max reviewers for full review submissions"
          />
          <SettingsInput
            label="Full Review: Due Date (Days)"
            type="number"
            value={settings.fullReviewDueDate}
            onChange={(value) => handleChange('fullReviewDueDate', value)}
            description="Review deadline for full review submissions"
          />
        </div>

        {/* File Upload Size */}
        <SettingsInput
          label="File Upload Size Limit (MB)"
          type="number"
          value={settings.fileUploadSize}
          onChange={(value) => handleChange('fileUploadSize', value)}
          description="Maximum file size allowed for document uploads"
        />

        {/* Auto-assign Reviewers */}
        <div className="pt-4 border-t border-gray-200">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex-1">
              <p 
                className="text-sm font-semibold text-[#003366]" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Auto-assign Reviewers
              </p>
              <p 
                className="text-xs text-gray-600 mt-1" 
                style={{ fontFamily: 'Metropolis, sans-serif' }}
              >
                Automatically assign reviewers based on expertise and workload
              </p>
            </div>
            <div className="ml-4">
              <button
                type="button"
                onClick={() => handleChange('autoAssignReviewers', !settings.autoAssignReviewers)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#003366] focus:ring-offset-2 ${
                  settings.autoAssignReviewers ? 'bg-[#003366]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoAssignReviewers ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </label>
        </div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
