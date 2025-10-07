// components/staff-secretariat-admin/submission-details/HistoryTab.tsx
import { FileText, CheckCircle, Users, UserCheck, Eye, AlertCircle, Clock } from 'lucide-react';

interface HistoryEvent {
  id: number;
  title: string;
  date: string;
  icon: 'submission' | 'verification' | 'classification' | 'assignment' | 'review' | 'complete' | 'revision';
  isCurrent?: boolean;
  description?: string;
}

interface HistoryTabProps {
  events: HistoryEvent[];
}

export default function HistoryTab({ events }: HistoryTabProps) {
  const getIcon = (iconType: string, isCurrent?: boolean) => {
    const iconClass = isCurrent ? 'text-blue-600' : 'text-gray-500';
    const size = 24;

    switch (iconType) {
      case 'submission':
        return <FileText size={size} className={iconClass} />;
      case 'verification':
        return <CheckCircle size={size} className={iconClass} />;
      case 'classification':
        return <Users size={size} className={iconClass} />;
      case 'assignment':
        return <UserCheck size={size} className={iconClass} />;
      case 'review':
        return <Eye size={size} className={iconClass} />;
      case 'complete':
        return <CheckCircle size={size} className="text-green-600" />;
      case 'revision':
        return <AlertCircle size={size} className="text-amber-600" />;
      default:
        return <Clock size={size} className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#101C50] overflow-hidden">
      <div className="bg-[#101C50] p-4 lg:p-6">
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Metropolis, sans-serif' }}>
          Submission History
        </h3>
      </div>

      <div className="p-4 lg:p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[15px] top-8 bottom-8 w-0.5 bg-gray-300"></div>

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-4">
                {/* Icon Circle */}
                <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  event.isCurrent 
                    ? 'bg-blue-100 ring-4 ring-blue-200' 
                    : event.icon === 'complete'
                    ? 'bg-green-100'
                    : event.icon === 'revision'
                    ? 'bg-amber-100'
                    : 'bg-gray-100'
                }`}>
                  {getIcon(event.icon, event.isCurrent)}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className={`${
                    event.isCurrent 
                      ? 'bg-blue-50 border-2 border-blue-500' 
                      : 'bg-gray-50 border border-gray-200'
                  } rounded-lg p-4`}>
                    <h4 className={`text-sm font-bold mb-1 ${
                      event.isCurrent ? 'text-blue-900' : 'text-gray-900'
                    }`} style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {event.title}
                    </h4>
                    <p className="text-xs text-gray-600" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {event.date}
                    </p>
                    {event.description && (
                      <p className="text-xs text-gray-700 mt-2" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {event.description}
                      </p>
                    )}
                    {event.isCurrent && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        Current Step
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
