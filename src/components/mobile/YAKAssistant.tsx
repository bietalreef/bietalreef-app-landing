import { useState, useRef, useEffect } from 'react';
import { Send, Mic, ChevronLeft, Zap, Users, Calculator, FileText, FileUp, Cpu, ImageIcon, Shield, MessageCircle, Package, Building2, Camera } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

// 🔥 AI Tools - Now dynamic based on language
const useAiTools = () => {
  const { t } = useTranslation('yak');
  
  return [
    { id: 1, name: t('projectPlanner'), icon: FileText, color: 'from-[#4A90E2] to-[#56CCF2]' },
    { id: 2, name: t('costEstimator'), icon: Calculator, color: 'from-[#56CCF2] to-[#4A90E2]' },
    { id: 3, name: t('quotation'), icon: FileUp, color: 'from-[#4A90E2] to-[#56CCF2]' },
    { id: 4, name: t('design3D'), icon: Cpu, color: 'from-[#56CCF2] to-[#4A90E2]' },
    { id: 5, name: t('compareContractors'), icon: Users, color: 'from-[#4A90E2] to-[#56CCF2]' },
    { id: 6, name: t('imageAnalysis'), icon: ImageIcon, color: 'from-[#56CCF2] to-[#4A90E2]' },
    { id: 7, name: t('smartReports'), icon: Shield, color: 'from-[#4A90E2] to-[#56CCF2]' },
    { id: 8, name: t('instantConsultation'), icon: MessageCircle, color: 'from-[#56CCF2] to-[#4A90E2]' },
  ];
};

// 🔥 Quick Actions - Now dynamic
const useQuickActions = () => {
  const { t } = useTranslation('yak');
  
  return [
    { id: 1, label: t('orderMaterials'), icon: Package, color: 'from-[#4A90E2] to-[#56CCF2]' },
    { id: 2, label: t('addWorker'), icon: Users, color: 'from-[#56CCF2] to-[#4A90E2]' },
    { id: 3, label: t('newProject'), icon: Building2, color: 'from-[#4A90E2] to-[#56CCF2]' },
    { id: 4, label: t('analyzeImage'), icon: Camera, color: 'from-[#56CCF2] to-[#4A90E2]' },
  ];
};

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
  time: string;
}

export function YAKAssistant() {
  const { t, dir, language } = useTranslation('yak');
  const aiTools = useAiTools();
  const quickActions = useQuickActions();
  
  const [showTools, setShowTools] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      text: t('welcomeMessage'),
      time: '10:30',
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        text: t('processingMessage'),
        time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-AE' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir={dir}>
      
      {/* AI TOOLS PANEL */}
      {showTools && (
        <div className="bg-white border-b border-[#F5EEE1] shadow-md">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                {t('aiTools')}
              </h3>
              <button
                onClick={() => setShowTools(false)}
                className="flex items-center gap-2 text-[#4A90E2] text-sm hover:text-[#56CCF2] transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                <span>{t('hide')}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-4 gap-3">
              {aiTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    className="flex flex-col items-center gap-2 p-3 bg-gradient-to-br from-[#F5EEE1] to-white rounded-[20px] hover:shadow-lg transition-all group"
                  >
                    <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[#1A1A1A] text-center text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, lineHeight: 1.2 }}>
                      {tool.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Show Tools Button (when hidden) */}
      {!showTools && (
        <button
          onClick={() => setShowTools(true)}
          className="mx-5 mt-5 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-5 py-3 rounded-[20px] shadow-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}
        >
          <Zap className="w-5 h-5" />
          {t('showTools')}
        </button>
      )}

      {/* CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? (dir === 'rtl' ? 'justify-start' : 'justify-end') : (dir === 'rtl' ? 'justify-end' : 'justify-start')}`}
          >
            <div
              className={`max-w-[75%] rounded-[24px] px-5 py-4 shadow-md ${
                message.type === 'user'
                  ? 'bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] text-white'
                  : 'bg-white text-[#1A1A1A] border-2 border-[#F5EEE1]'
              }`}
            >
              <p className="mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: 1.6 }}>
                {message.text}
              </p>
              <p className={`text-xs ${message.type === 'user' ? 'text-white/70' : 'text-[#1A1A1A]/50'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {message.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`flex ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
            <div className="bg-white border-2 border-[#F5EEE1] rounded-[24px] px-5 py-4 shadow-md">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#4A90E2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white border-t border-[#F5EEE1] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] p-5">
        {/* Input Box */}
        <div className="flex items-center gap-3 mb-4 bg-gradient-to-br from-[#F5EEE1] to-white rounded-[24px] px-5 py-3 shadow-md border-2 border-white">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('inputPlaceholder')}
            className="flex-1 bg-transparent border-none outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/50"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
          />
          <button className="p-2 hover:bg-[#4A90E2]/10 rounded-xl transition-all">
            <Mic className="w-5 h-5 text-[#4A90E2]" />
          </button>
          <button
            onClick={sendMessage}
            className="p-3 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[16px] shadow-lg hover:shadow-xl transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r ${action.color} text-white whitespace-nowrap shadow-md hover:shadow-lg transition-all`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
