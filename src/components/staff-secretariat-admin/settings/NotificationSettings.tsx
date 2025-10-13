// components/staff-secretariat-admin/settings/NotificationSettings.tsx
'use client';

import { useState } from 'react';
import ToggleSwitch from '@/components/staff-secretariat-admin/settings/ToggleSwitch';
import SaveButton from '@/components/staff-secretariat-admin/settings/SaveButton';

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    newSubmission: true,
    reviewerAssignment: true,
    reviewSubmission: true,
    reviewReminder: true,
    allReviewsComplete: true,
    statusChange: true,
    overdueReminder: true
  });

  const handleToggle = (field: string) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSave = () => {
    console.log('Saving notifications:', notifications);
    alert('Notification settings saved successfully!');
  };

  const notificationOptions = [
    {
      id: 'newSubmission',
      title: 'New Submission',
      description: 'Send email when a new submission is received',
      enabled: notifications.newSubmission
    },
    {
      id: 'reviewerAssignment',
      title: 'Reviewer Assignment',
      description: 'Send email when a reviewer is assigned',
      enabled: notifications.reviewerAssignment
    },
    {
      id: 'reviewSubmission',
      title: 'Review Submission',
      description: 'Send email when a review is submitted',
      enabled: notifications.reviewSubmission
    },
    {
      id: 'reviewReminder',
      title: 'Review Reminder',
      description: 'Send reminder emails for pending reviews',
      enabled: notifications.reviewReminder
    },
    {
      id: 'allReviewsComplete',
      title: 'All Reviews Complete',
      description: 'Send email when all reviews are completed',
      enabled: notifications.allReviewsComplete
    },
    {
      id: 'statusChange',
      title: 'Status Change',
      description: 'Send email when submission status changes',
      enabled: notifications.statusChange
    },
    {
      id: 'overdueReminder',
      title: 'Overdue Reminder',
      description: 'Send reminders for overdue reviews',
      enabled: notifications.overdueReminder
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border-2 border-gray-200">
      <h2 
        className="text-lg sm:text-xl font-bold text-[#003366] mb-6" 
        style={{ fontFamily: 'Metropolis, sans-serif' }}
      >
        Email Notifications
      </h2>

      <div className="space-y-4">
        {notificationOptions.map((option) => (
          <ToggleSwitch
            key={option.id}
            title={option.title}
            description={option.description}
            enabled={option.enabled}
            onToggle={() => handleToggle(option.id)}
          />
        ))}
      </div>

      <SaveButton onClick={handleSave} />
    </div>
  );
}
