// components/helpcenter/HelpCenterLayout.tsx
'use client';

import { useState, ReactNode, useEffect } from 'react';
import { Search, Bot, FileText, ClipboardList, HelpCircle, Send, MessageSquare, X, Download, LucideIcon } from 'lucide-react';

// Custom Modern Menu Icon Component
const ModernMenuIcon = ({ className = "w-6 h-6", color }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="21" y2="12" />
    <line x1="9" y1="18" x2="21" y2="18" />
  </svg>
);

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
}

interface RoleConfig {
  title?: string;
  menuItems?: MenuItem[];
  initialMessage?: string;
  primaryColor?: string;
  accentColor?: string;
  documentTemplates?: DocumentTemplate[];
}

interface HelpCenterLayoutProps {
  children?: ReactNode;
  role?: 'researcher' | 'reviewer' | 'admin';
  customConfig?: RoleConfig;
}

const DEFAULT_RESEARCHER_TEMPLATES: DocumentTemplate[] = [
  {
    id: '1',
    title: 'Application Form Ethics Review',
    description: 'Required form for submitting ethics review application',
    fileName: 'Application_Form_Ethics_Review.pdf',
    fileUrl: '/templates/application-form-ethics-review.pdf',
    fileSize: '2.5 MB'
  },
  {
    id: '2',
    title: 'Research Protocol Template',
    description: 'Standard template for research protocol submission',
    fileName: 'Research_Protocol_Template.docx',
    fileUrl: '/templates/research-protocol-template.docx',
    fileSize: '1.8 MB'
  },
  {
    id: '3',
    title: 'Informed Consent Form',
    description: 'Template for participant informed consent documentation',
    fileName: 'Informed_Consent_Form.docx',
    fileUrl: '/templates/informed-consent-form.docx',
    fileSize: '950 KB'
  },
  {
    id: '4',
    title: 'Research Instrument Template',
    description: 'Template for validated research instruments',
    fileName: 'Research_Instrument_Template.docx',
    fileUrl: '/templates/research-instrument-template.docx',
    fileSize: '1.2 MB'
  },
  {
    id: '5',
    title: 'Endorsement Letter Template',
    description: 'Format for research endorsement letters',
    fileName: 'Endorsement_Letter_Template.docx',
    fileUrl: '/templates/endorsement-letter-template.docx',
    fileSize: '780 KB'
  }
];

const ROLE_CONFIGS: Record<string, RoleConfig> = {
  researcher: {
    title: 'UMREC Smart Help',
    menuItems: [
      { icon: ClipboardList, label: 'Submission Guidelines', href: '#guidelines' },
      { icon: FileText, label: 'Document Templates', href: '#templates' },
      { icon: MessageSquare, label: 'Review Process', href: '#process' },
      { icon: HelpCircle, label: 'Common Questions', href: '#faq' }
    ],
    initialMessage: "Hello! I'm your UMREC Smart Help. How can I help you today?",
    primaryColor: '#071139', // ← Changed to match navbar
    accentColor: '#F7D117',
    documentTemplates: DEFAULT_RESEARCHER_TEMPLATES
  },
  reviewer: {
    title: 'Reviewer Support',
    menuItems: [
      { icon: ClipboardList, label: 'Review Guidelines', href: '#review-guidelines' },
      { icon: FileText, label: 'Evaluation Criteria', href: '#criteria' },
      { icon: MessageSquare, label: 'Communication Tips', href: '#communication' },
      { icon: HelpCircle, label: 'FAQ for Reviewers', href: '#reviewer-faq' }
    ],
    initialMessage: "Hello! I'm here to assist you with the review process. What do you need help with?",
    primaryColor: '#071139', // ← Changed to match navbar
    accentColor: '#F7D117'
  },
};

export default function HelpCenterLayout({ 
  children, 
  role = 'researcher',
  customConfig 
}: HelpCenterLayoutProps) {
  const config = {
    ...ROLE_CONFIGS[role],
    ...customConfig
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('chat');
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: string }>>([
    {
      id: 1,
      text: config.initialMessage || "Hello! How can I help you today?",
      isUser: false,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        isUser: true,
        timestamp: 'Just now'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I'm processing your request. How else can I assist you?",
          isUser: false,
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleMenuClick = (href: string) => {
    if (href === '#templates') {
      setActiveSection('templates');
    } else {
      setActiveSection('chat');
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-full w-full relative pt-[72px]" style={{ backgroundColor: '#DAE0E7' }}>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          style={{ top: '72px' }}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Now matches navbar color */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static w-80 left-0 z-40 transition-transform duration-300 ease-in-out flex-shrink-0`}
        style={{ 
          backgroundColor: '#071139', 
          top: '72px',
          height: 'calc(100vh - 72px)'
        }}
        aria-label="Help center navigation"
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 z-10 w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors focus:outline-none"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="h-full flex flex-col pb-6 px-6 overflow-y-auto pt-6">
          <h2 className="text-white text-2xl font-bold mb-8 mt-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {config.title}
          </h2>

          {/* Clean Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7D117]"
              style={{ fontFamily: 'Metropolis, sans-serif' }}
            />
          </div>

          {/* Clean Nav */}
          <nav className="space-y-2" aria-label="Help topics">
            {config.menuItems?.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => handleMenuClick(item.href)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors group focus:outline-none"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <IconComponent className="w-5 h-5 text-white group-hover:text-[#F7D117] transition-colors" />
                  <span className="text-sm">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0" style={{ height: 'calc(100vh - 72px)' }}>
        {activeSection === 'chat' ? (
          <>
            {/* Clean Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0 relative z-10 mt-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none flex-shrink-0"
                  aria-label="Open navigation menu"
                >
                  <ModernMenuIcon className="w-6 h-6" color="#071139" />
                </button>

                <div className="w-10 h-10 rounded-lg bg-[#071139] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-[#F7D117]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base text-[#071139] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    {config.title}
                  </h3>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                    Always Available
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-4" style={{ backgroundColor: '#E8EEF3' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[70%]">
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#071139] flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-[#F7D117]" />
                        </div>
                        <span className="text-xs font-semibold text-[#071139]" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {config.title}
                        </span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.isUser ? 'rounded-tr-none bg-[#A0A0A0] text-white' : 'rounded-tl-none bg-white text-[#071139]'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                        {message.text}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 sm:p-5 flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3 max-w-4xl mx-auto">
                <input
                  type="text"
                  placeholder="Type your question......"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 sm:px-5 py-3 rounded-full bg-gray-100 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#071139]"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                  aria-label="Type your message"
                />
                <button
                  onClick={handleSendMessage}
                  className="w-11 h-11 rounded-full bg-[#A0A0A0] flex items-center justify-center transition-colors hover:bg-[#8a8a8a] focus:outline-none flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Document Templates
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#DAE0E7' }}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10 mt-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none flex-shrink-0"
                  aria-label="Open navigation menu"
                >
                  <ModernMenuIcon className="w-6 h-6" color="#071139" />
                </button>

                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#071139] flex-shrink-0" />
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#071139] truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                  Document Templates
                </h3>
              </div>
            </div>

            {/* Templates List */}
            <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
              <div className="max-w-5xl mx-auto space-y-3 sm:space-y-4">
                {config.documentTemplates?.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-bold text-[#071139] mb-1.5 sm:mb-2 break-words" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {template.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                          {template.description}
                        </p>
                        <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-xs text-gray-500">
                          <span className="truncate" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {template.fileName}
                          </span>
                          <span className="flex-shrink-0" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                            {template.fileSize}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(template.fileUrl, template.fileName)}
                        className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-[#071139] hover:bg-[#163049] text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm flex-shrink-0"
                        style={{ fontFamily: 'Metropolis, sans-serif' }}
                      >
                        <Download className="w-4 h-4 flex-shrink-0" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
