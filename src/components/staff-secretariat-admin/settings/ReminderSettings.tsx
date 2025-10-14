// components/staff-secretariat-admin/settings/ReminderSettings.tsx
'use client';

import { useState } from 'react';
import SettingsInput from '@/components/staff-secretariat-admin/settings/SettingsInput';
import SaveButton from '@/components/staff-secretariat-admin/settings/SaveButton';

export default function ReminderSettings() {
  const [reminders, setReminders] = useState({
    firstReminder: 7,
    secondReminder: 3,
    finalReminder: 1
  });

  const handleChange = (field: string, value: number) => {
    setReminders(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving reminders:', reminders);
    alert('Reminder settings saved successfully!');
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <h2 
        className="text-lg sm:text-xl font-bold text-[#003366] mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Reminder Settings
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <SettingsInput
            label="First Reminder (Days Before Due)"
            type="number"
            value={reminders.firstReminder}
            onChange={(value) => handleChange('firstReminder', value)}
            description="Initial reminder before deadline"
          />
          <SettingsInput
            label="Second Reminder (Days Before Due)"
            type="number"
            value={reminders.secondReminder}
            onChange={(value) => handleChange('secondReminder', value)}
            description="Follow-up reminder"
          />
          <SettingsInput
            label="Final Reminder (Days Before Due)"
            type="number"
            value={reminders.finalReminder}
            onChange={(value) => handleChange('finalReminder', value)}
            description="Last reminder before deadline"
          />
        </div>
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
