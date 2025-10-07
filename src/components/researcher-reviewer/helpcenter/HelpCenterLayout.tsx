// components/helpcenter/HelpCenterLayout.tsx
'use client';

import { useState, ReactNode, useEffect } from 'react';
import { Search, Bot, FileText, ClipboardList, HelpCircle, Send, MessageSquare, X, AlignJustify, LucideIcon } from 'lucide-react';

// Custom Modern Menu Icon Component
const ModernMenuIcon = ({ className = "w-6 h-6", color }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="6" y1="12" x2="21" y2="12" />
    <line x1="9" y1="18" x2="21" y2="18" />
  </svg>
);

// Interface for menu items
interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

// Interface for role configuration
interface RoleConfig {
  title?: string;
  menuItems?: MenuItem[];
  initialMessage?: string;
  primaryColor?: string;
  accentColor?: string;
}

interface HelpCenterLayoutProps {
  children?: ReactNode;
  role?: 'researcher' | 'reviewer' | 'admin';
  customConfig?: RoleConfig;
}

// Default configurations for different roles
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
    primaryColor: '#050C2D',
    accentColor: '#F0E847'
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
    primaryColor: '#050C2D',
    accentColor: '#F0E847'
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

  return (
    <div className="flex h-full w-full relative pt-[72px]" style={{ backgroundColor: '#DAE0E7' }}>
      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
        style={{ top: '72px' , backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static w-80 left-0 z-40 transition-transform duration-300 ease-in-out flex-shrink-0`}
        style={{ 
          backgroundColor: config.primaryColor,
          top: '72px',
          height: 'calc(100vh - 72px)'
        }}
        aria-label="Help center navigation"
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="h-full flex flex-col pb-6 px-6 overflow-y-auto pt-6">
          <h2 className="text-white text-2xl font-bold mb-8 mt-4" style={{ fontFamily: 'Metropolis, sans-serif' }}>
            {config.title}
          </h2>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                fontFamily: 'Metropolis, sans-serif',
                outlineColor: config.accentColor
              }}
            />
          </div>

          <nav className="space-y-2" aria-label="Help topics">
            {config.menuItems?.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors group focus:outline-none focus:ring-2 focus:ring-white/30"
                  style={{ fontFamily: 'Metropolis, sans-serif' }}
                >
                  <IconComponent className="w-5 h-5 text-white group-hover:text-[#F0E847] transition-colors" />
                  <span className="text-sm">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0" style={{ height: 'calc(100vh - 72px)' }}>
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0 relative z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 flex-shrink-0"
              style={{ 
                backgroundColor: '#F5F5F5',
                outlineColor: config.primaryColor
              }}
              aria-label="Open navigation menu"
              aria-expanded={isSidebarOpen}
            >
              <ModernMenuIcon className="w-6 h-6" color={config.primaryColor} />
            </button>

            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" 
              style={{ backgroundColor: config.primaryColor }}
            >
              <Bot className="w-5 h-5" color={config.accentColor} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 
                className="font-bold text-base truncate" 
                style={{ 
                  fontFamily: 'Metropolis, sans-serif',
                  color: config.primaryColor
                }}
              >
                {config.title}
              </h3>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Metropolis, sans-serif' }}>
                Always Available
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-4" style={{ backgroundColor: '#DAE0E7' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[70%]">
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" 
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <Bot className="w-4 h-4" color={config.accentColor} />
                    </div>
                    <span 
                      className="text-xs font-semibold" 
                      style={{ 
                        fontFamily: 'Metropolis, sans-serif',
                        color: config.primaryColor
                      }}
                    >
                      {config.title}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isUser ? 'rounded-tr-none' : 'rounded-tl-none'
                  }`}
                  style={{
                    backgroundColor: message.isUser ? '#A0A0A0' : 'white',
                    color: message.isUser ? 'white' : config.primaryColor
                  }}
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
              className="flex-1 px-4 sm:px-5 py-3 rounded-full bg-gray-100 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                fontFamily: 'Metropolis, sans-serif',
                outlineColor: config.primaryColor
              }}
              aria-label="Type your message"
            />
            <button
              onClick={handleSendMessage}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#A0A0A0]/50 flex-shrink-0"
              style={{ backgroundColor: '#A0A0A0' }}
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
