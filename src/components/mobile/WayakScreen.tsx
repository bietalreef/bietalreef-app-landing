import { X, Download, Mic, Send, Volume2, Copy, Share2, Trash2, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'wayak';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface WayakScreenProps {
  onClose: () => void;
}

export function WayakScreen({ onClose }: WayakScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'wayak',
      content: 'مرحباً بك في وياك 👋\n\nأنا مساعدك الذكي في بيت الريف. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  // Settings State
  const [aiModel, setAiModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [responseLength, setResponseLength] = useState('medium');
  const [voiceGender, setVoiceGender] = useState('male');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false);
  const [bgTheme, setBgTheme] = useState('blue');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'بالتأكيد! أنا هنا لمساعدتك في تخطيط مشروعك.',
        'فهمت طلبك. سأساعدك في العثور على أفضل الحلول.',
        'ممتاز! دعني أبحث عن المعلومات المطلوبة.',
        'سأقوم بتحليل طلبك وتقديم الاقتراحات المناسبة.',
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'wayak',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      
      // Simulate voice message
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'رسالة صوتية',
        timestamp: new Date(),
        isVoice: true,
      };
      
      setMessages(prev => [...prev, voiceMessage]);
      setIsTyping(true);

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'wayak',
          content: 'تم استلام رسالتك الصوتية. كيف يمكنني مساعدتك؟',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 2000);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };

  const handleDownloadChat = () => {
    const chatContent = messages.map(m => 
      `[${m.timestamp.toLocaleTimeString('ar-EG')}] ${m.type === 'user' ? 'أنت' : 'وياك'}: ${m.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `محادثة-وياك-${new Date().toLocaleDateString('ar-EG')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (confirm('هل تريد حذف المحادثة؟')) {
      setMessages([{
        id: '1',
        type: 'wayak',
        content: 'مرحباً بك في وياك 👋\n\nأنا مساعدك الذكي في بيت الريف. كيف يمكنني مساعدتك اليوم؟',
        timestamp: new Date(),
      }]);
    }
  };

  // Background Theme Colors
  const bgThemes = {
    blue: {
      gradient: 'from-[#56CCF2] via-[#2F80ED] to-[#2D9CDB]',
      primary: '#56CCF2',
      secondary: '#2F80ED'
    },
    green: {
      gradient: 'from-[#1F3D2B] via-[#2AA676] to-[#4A90E2]',
      primary: '#2AA676',
      secondary: '#4A90E2'
    },
    purple: {
      gradient: 'from-[#BB6BD9] via-[#9B51E0] to-[#6C5CE7]',
      primary: '#BB6BD9',
      secondary: '#9B51E0'
    },
    orange: {
      gradient: 'from-[#F2994A] via-[#F2C94C] to-[#EB5757]',
      primary: '#F2994A',
      secondary: '#F2C94C'
    },
    pink: {
      gradient: 'from-[#F093FB] via-[#F5576C] to-[#FD79A8]',
      primary: '#F093FB',
      secondary: '#F5576C'
    },
    dark: {
      gradient: 'from-[#2C3E50] via-[#34495E] to-[#1F3D2B]',
      primary: '#2C3E50',
      secondary: '#34495E'
    }
  };

  const currentTheme = bgThemes[bgTheme as keyof typeof bgThemes];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-gradient-to-br ${currentTheme.gradient} overflow-hidden`} dir="rtl">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-[#56CCF2]/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-[#F2C94C]/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '40%', right: '40%' }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Top Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-[#2AA676]" />
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-xl">وياك</h1>
              <p className="text-white/80 text-sm">مساعدك الذكي • متصل الآن</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all active:scale-95"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={handleDownloadChat}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all active:scale-95"
            >
              <Download className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={clearChat}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all active:scale-95"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all active:scale-95"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 relative z-10">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-[24px] px-5 py-4 shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-white text-[#1F3D2B]' 
                    : 'bg-white/95 backdrop-blur-md text-[#1F3D2B]'
                }`}>
                  {message.isVoice ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2AA676] flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(20)].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-1 bg-[#2AA676] rounded-full"
                              style={{ height: `${Math.random() * 20 + 10}px` }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">0:05</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  )}
                </div>
                <p className="text-xs text-white/60 mt-2 px-2">
                  {message.timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-[24px] px-6 py-4 shadow-lg">
              <div className="flex gap-2">
                <motion.div
                  className="w-2 h-2 bg-[#2AA676] rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#2AA676] rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#2AA676] rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20"
              onClick={() => setShowSettings(false)}
            />
            
            {/* Settings Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-[400px] bg-white/95 backdrop-blur-xl z-30 overflow-y-auto shadow-2xl"
              dir="rtl"
            >
              {/* Panel Header */}
              <div className="sticky top-0 bg-gradient-to-br from-[#2AA676] to-[#4A90E2] px-6 py-5 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-white font-bold text-xl">الإعدادات</h2>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-6 space-y-6">
                
                {/* Background Theme Settings */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#1F3D2B] mb-4 flex items-center gap-2">
                    🎨 ألوان الخلفية
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'blue', name: 'أزرق سماوي', colors: ['#56CCF2', '#2F80ED', '#2D9CDB'] },
                      { id: 'green', name: 'أخضر طبيعي', colors: ['#1F3D2B', '#2AA676', '#4A90E2'] },
                      { id: 'purple', name: 'بنفسجي', colors: ['#BB6BD9', '#9B51E0', '#6C5CE7'] },
                      { id: 'orange', name: 'برتقالي', colors: ['#F2994A', '#F2C94C', '#EB5757'] },
                      { id: 'pink', name: 'وردي', colors: ['#F093FB', '#F5576C', '#FD79A8'] },
                      { id: 'dark', name: 'داكن', colors: ['#2C3E50', '#34495E', '#1F3D2B'] }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setBgTheme(theme.id)}
                        className={`p-3 rounded-xl transition-all relative overflow-hidden ${
                          bgTheme === theme.id
                            ? 'ring-4 ring-[#2AA676] scale-105'
                            : 'ring-1 ring-gray-300'
                        }`}
                      >
                        <div 
                          className="w-full h-16 rounded-lg mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`
                          }}
                        />
                        <p className="text-xs font-bold text-[#1F3D2B] text-center">{theme.name}</p>
                        {bgTheme === theme.id && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-[#2AA676] text-sm">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Model Settings */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#1F3D2B] mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#2AA676]" />
                    نموذج الذكاء الاصطناعي
                  </h3>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'gpt-4', name: 'GPT-4 Turbo', desc: 'الأكثر ذكاءً وتطوراً' },
                      { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', desc: 'سريع ومتوازن' },
                      { id: 'claude', name: 'Claude 3', desc: 'ممتاز للمحادثات الطويلة' },
                      { id: 'gemini', name: 'Gemini Pro', desc: 'متعدد الوسائط' }
                    ].map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setAiModel(model.id)}
                        className={`w-full p-4 rounded-xl text-right transition-all ${
                          aiModel === model.id
                            ? 'bg-gradient-to-br from-[#2AA676] to-[#4A90E2] text-white shadow-lg'
                            : 'bg-white/80 text-[#1F3D2B] hover:bg-white'
                        }`}
                      >
                        <div className="font-bold">{model.name}</div>
                        <div className={`text-sm ${aiModel === model.id ? 'text-white/80' : 'text-gray-500'}`}>
                          {model.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#1F3D2B] mb-4">درجة الإبداع (Temperature)</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>دقيق</span>
                      <span className="font-bold text-[#2AA676]">{temperature.toFixed(1)}</span>
                      <span>مبدع</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-[#2AA676]"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      {temperature < 0.4 && 'إجابات دقيقة ومباشرة'}
                      {temperature >= 0.4 && temperature < 0.7 && 'متوازن بين الدقة والإبداع'}
                      {temperature >= 0.7 && 'إجابات مبدعة ومتنوعة'}
                    </p>
                  </div>
                </div>

                {/* Response Length */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#1F3D2B] mb-4">طول الإجابة</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'short', label: 'قصيرة', icon: '📝' },
                      { id: 'medium', label: 'متوسطة', icon: '📄' },
                      { id: 'long', label: 'مفصلة', icon: '📚' }
                    ].map((length) => (
                      <button
                        key={length.id}
                        onClick={() => setResponseLength(length.id)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          responseLength === length.id
                            ? 'bg-gradient-to-br from-[#2AA676] to-[#4A90E2] text-white shadow-lg'
                            : 'bg-white/80 text-[#1F3D2B] hover:bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{length.icon}</div>
                        <div className="text-xs font-bold">{length.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Settings */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-gray-200">
                  <h3 className="font-bold text-[#1F3D2B] mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-[#2AA676]" />
                    إعدادات الصوت
                  </h3>
                  
                  {/* Voice Gender */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 font-bold mb-2 block">نوع الصوت</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'male', label: 'صوت رجالي', icon: '👨' },
                        { id: 'female', label: 'صوت نسائي', icon: '👩' }
                      ].map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => setVoiceGender(voice.id)}
                          className={`p-3 rounded-xl text-center transition-all ${
                            voiceGender === voice.id
                              ? 'bg-gradient-to-br from-[#2AA676] to-[#4A90E2] text-white shadow-lg'
                              : 'bg-white/80 text-[#1F3D2B] hover:bg-white'
                          }`}
                        >
                          <div className="text-2xl mb-1">{voice.icon}</div>
                          <div className="text-xs font-bold">{voice.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Speed */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-700 font-bold mb-2 block">سرعة الكلام</label>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>بطيء</span>
                        <span className="font-bold text-[#2AA676]">{voiceSpeed.toFixed(1)}x</span>
                        <span>سريع</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={voiceSpeed}
                        onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                        className="w-full accent-[#2AA676]"
                      />
                    </div>
                  </div>

                  {/* Auto Play Voice */}
                  <div className="flex items-center justify-between p-3 bg-white/80 rounded-xl">
                    <span className="font-bold text-[#1F3D2B]">تشغيل الصوت تلقائياً</span>
                    <button
                      onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                      className={`w-14 h-8 rounded-full transition-all ${
                        autoPlayVoice ? 'bg-[#2AA676]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                        autoPlayVoice ? 'translate-x-7' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => {
                    setShowSettings(false);
                    // Simulate save
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-24 left-1/2 transform -translate-x-1/2 bg-[#2AA676] text-white px-6 py-3 rounded-full shadow-lg z-50';
                    notification.textContent = '✓ تم حفظ الإعدادات بنجاح';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                  }}
                  className="w-full bg-gradient-to-br from-[#2AA676] to-[#4A90E2] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Voice Recording Overlay */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-8 flex flex-col items-center gap-4 shadow-2xl">
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center relative"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <Mic className="w-12 h-12 text-white" />
              </motion.div>
              <p className="text-2xl font-bold text-[#1F3D2B]">{formatDuration(recordingDuration)}</p>
              <p className="text-sm text-gray-500">جاري التسجيل...</p>
              <button
                onClick={handleVoiceRecord}
                className="mt-4 px-8 py-3 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors active:scale-95"
              >
                إيقاف التسجيل
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Input Area */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border-t border-white/20 px-5 py-4">
        <div className="flex items-end gap-3">
          {/* Voice Button */}
          <motion.button
            onClick={handleVoiceRecord}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                : 'bg-white/20 hover:bg-white/30'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <Mic className="w-5 h-5 text-white" />
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-[24px] px-5 py-3 shadow-lg">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="اكتب رسالتك هنا..."
              className="w-full bg-transparent outline-none resize-none text-[#1F3D2B] placeholder:text-gray-400"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-gradient-to-br from-[#2AA676] to-[#4A90E2] shadow-lg'
                : 'bg-white/20 opacity-50'
            }`}
            whileTap={{ scale: inputText.trim() ? 0.9 : 1 }}
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
          {[
            '💡 اقتراحات تصميم',
            '📐 مخططات هندسية',
            '🛠️ مقاولين',
            '🏗️ حساب التكلفة',
            '📊 تقارير المشروع'
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => setInputText(action.split(' ').slice(1).join(' '))}
              className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm whitespace-nowrap transition-all active:scale-95"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}