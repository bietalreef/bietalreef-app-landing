import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabase/client';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Shield, Sparkles, Globe, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import logoImg from "figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png";
import { useLanguage } from '../../contexts/LanguageContext';
import { LegalModals, useLegalModals } from '../LegalModals';
import { HeroCylinder } from './HeroCylinder';
import { ServicesCylinder } from './ServicesCylinder';
import { useTheme } from '../../contexts/ThemeContext';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'welcome' | 'email' | 'otp' | 'password'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // Auto-login check on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) onComplete();
    });
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('خطأ في تسجيل الدخول بـ Google: ' + error.message);
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || isLoading) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      
      setStep('otp');
      setCountdown(60);
      toast.success('✉️ تم إرسال رمز التحقق إلى بريدك');
    } catch (error: any) {
      toast.error('خطأ في إرسال الرمز: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      otpRefs.current[5]?.focus();
      verifyOtp(pasted);
    }
  };

  const verifyOtp = async (code: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });
      if (error) throw error;
      if (data.session) {
        toast.success('🎉 تم تسجيل الدخول بنجاح!');
        onComplete();
      }
    } catch (error: any) {
      toast.error('رمز التحقق غير صحيح أو منتهي الصلاحية');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    handleSendOtp();
  };

  const handlePasswordLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !password || isLoading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) {
        toast.success('🎉 تم تسجيل الدخول بنجاح!');
        onComplete();
      }
    } catch (error: any) {
      toast.error('البريد أو كلمة المرور غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] via-[#F8F3EB] to-white flex flex-col font-[Cairo,sans-serif]" dir="rtl">
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <WelcomeScreen
            key="welcome"
            onGetStarted={() => setStep('email')}
            onPasswordLogin={() => setStep('password')}
            onGoogleLogin={handleGoogleLogin}
            isLoading={isLoading}
          />
        )}

        {step === 'email' && (
          <EmailScreen
            key="email"
            email={email}
            setEmail={setEmail}
            onSubmit={handleSendOtp}
            onBack={() => setStep('welcome')}
            onGoogleLogin={handleGoogleLogin}
            isLoading={isLoading}
          />
        )}

        {step === 'otp' && (
          <OtpScreen
            key="otp"
            email={email}
            otp={otp}
            otpRefs={otpRefs}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onResend={handleResend}
            onBack={() => { setStep('email'); setOtp(['', '', '', '', '', '']); }}
            countdown={countdown}
            isLoading={isLoading}
          />
        )}

        {step === 'password' && (
          <PasswordScreen
            key="password"
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handlePasswordLogin}
            onBack={() => { setStep('welcome'); setPassword(''); }}
            onGoogleLogin={handleGoogleLogin}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   WELCOME SCREEN
   ================================================================ */
function WelcomeScreen({ onGetStarted, onPasswordLogin, onGoogleLogin, isLoading }: {
  onGetStarted: () => void;
  onPasswordLogin: () => void;
  onGoogleLogin: () => void;
  isLoading: boolean;
}) {
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';
  const { openModal, openTerms, openPrivacy, closeModal } = useLegalModals();
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#F5EEE1] px-6 pt-8 pb-4 md:pt-12 md:pb-6">
        {/* Decorative circles */}
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-[#C8A86A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20px] left-[-30px] w-36 h-36 bg-[#2AA676]/8 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-lg mx-auto text-center">
          {/* Logo + Text Row */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl border border-[#E6DCC8] shadow-lg flex items-center justify-center p-2">
                <img 
                  src={logoImg} 
                  alt="بيت الريف" 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
            </motion.div>
            <div className="text-right">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#C8A86A] text-lg md:text-xl mb-1"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
              >
                {isEn ? 'Welcome Home' : 'مرحباً بك في الدار'}
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#1F3D2B]/60 text-sm md:text-base leading-relaxed max-w-[220px]"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              >
                {isEn ? 'Your smart digital platform — services, store & tools' : 'منصتك الرقمية الذكية — خدمات، متجر، وأدوات احترافية'}
              </motion.p>
            </div>
          </div>

          {/* Feature badges */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2.5 mb-2"
          >
            {[
              { icon: Shield, label: isEn ? 'Verified' : 'موثوق' },
              { icon: Sparkles, label: isEn ? 'Full Store' : 'متجر متكامل' },
              { icon: Globe, label: isEn ? 'UAE' : 'الإمارات' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E6DCC8] shadow-sm">
                <div className="w-5 h-5 rounded-full bg-[#2E7D50]/10 flex items-center justify-center">
                  <badge.icon className="w-3 h-3 text-[#2E7D50]" />
                </div>
                <span className="text-[#1F3D2B] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Rotating Cylinder — Offers & Featured Providers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 -mx-6"
        >
          <HeroCylinder isEn={isEn} />
        </motion.div>

        {/* Label under cylinder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 flex items-center justify-center gap-5 mt-2 mb-1"
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2AA676] shadow-[0_0_6px_rgba(42,166,118,0.4)]" />
            <span className="text-[#1F3D2B]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'Live Offers' : 'عروض حية'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C8A86A] shadow-[0_0_6px_rgba(200,168,106,0.4)]" />
            <span className="text-[#1F3D2B]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'Featured Pros' : 'مميزون'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_rgba(139,92,246,0.4)]" />
            <span className="text-[#1F3D2B]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'Platform' : 'المنصة'}</span>
          </div>
        </motion.div>

        {/* 3D Rotating Cylinder #2 — خدمات بيت الريف */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative z-10 -mx-6"
        >
          <ServicesCylinder isEn={isEn} />
        </motion.div>

        {/* Label under services cylinder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="relative z-10 flex items-center justify-center gap-2 mt-1 mb-1"
        >
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#E6DCC8] shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
            <span className="text-[#1F3D2B]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {isEn ? 'Beit Al Reef Services' : 'خدمات بيت الريف'}
            </span>
            <span className="text-[#2AA676] text-[10px] font-black bg-[#2AA676]/10 px-1.5 py-0.5 rounded-full">9</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12 -mt-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md space-y-4"
        >
          {/* Welcome info card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-[#E6DCC8]/50 p-5 mb-2">
            <div className="flex gap-2">
              <div className="flex-1 bg-[#F5EEE1] rounded-xl px-3 py-3 text-center">
                <span className="text-xs text-gray-500 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isEn ? 'Services' : 'خدمات'}</span>
                <span className="text-lg font-black text-[#2E7D50]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>+50</span>
              </div>
              <div className="flex-1 bg-[#F5EEE1] rounded-xl px-3 py-3 text-center">
                <span className="text-xs text-gray-500 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isEn ? 'Providers' : 'مزود خدمة'}</span>
                <span className="text-lg font-black text-[#2E7D50]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>+200</span>
              </div>
              <div className="flex-1 bg-[#F5EEE1] rounded-xl px-3 py-3 text-center">
                <span className="text-xs text-gray-500 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isEn ? 'Emirates' : 'إمارة'}</span>
                <span className="text-lg font-black text-[#2E7D50]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>7</span>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={onGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#4285F4] text-gray-700 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-sm disabled:opacity-70"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
                </svg>
                <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>{isEn ? 'Continue with Google' : 'الدخول بحساب Google'}</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">{isEn ? 'or' : 'أو'}</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Email Login */}
          <button
            onClick={onGetStarted}
            className="w-full bg-[#2E7D50] hover:bg-[#266B43] text-white py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-[#2E7D50]/20"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            <Mail className="w-5 h-5" />
            <span>{isEn ? 'Sign in with Email' : 'الدخول بالبريد الإلكتروني'}</span>
          </button>

          {/* Password Login */}
          <button
            onClick={onPasswordLogin}
            className="w-full bg-[#2E7D50] hover:bg-[#266B43] text-white py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-lg shadow-[#2E7D50]/20"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            <Lock className="w-5 h-5" />
            <span>{isEn ? 'Sign in with Password' : 'الدخول بكلمة المرور'}</span>
          </button>

          {/* Terms */}
          <p className="text-center text-[11px] text-gray-400 leading-relaxed pt-2">
            {isEn ? 'By signing in, you agree to our ' : 'بالدخول فإنك توافق على '}
            <button onClick={openTerms} className="underline cursor-pointer hover:text-[#2E7D50] text-gray-500 font-semibold transition-colors">
              {isEn ? 'Terms of Use' : 'شروط الاستخدام'}
            </button>
            {isEn ? ' and ' : ' و '}
            <button onClick={openPrivacy} className="underline cursor-pointer hover:text-[#2E7D50] text-gray-500 font-semibold transition-colors">
              {isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}
            </button>
          </p>

          {/* Language Switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center pt-1"
          >
            <div className="flex items-center bg-white/80 border border-[#E6DCC8] rounded-full p-1 shadow-sm">
              <button
                onClick={() => setLanguage('ar')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  language === 'ar'
                    ? 'bg-[#2E7D50] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#2E7D50]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                العربية
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-[#2E7D50] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#2E7D50]'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                English
              </button>
            </div>
          </motion.div>

          {/* Theme Switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center pt-1"
          >
            <div className="flex items-center bg-white/80 border border-[#E6DCC8] rounded-full p-1 shadow-sm">
              <button
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-[#2E7D50] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#2E7D50]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <Sun className="w-3.5 h-3.5" />
                {isEn ? 'Light' : 'فاتح'}
              </button>
              <button
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-[#2E7D50] text-white shadow-md'
                    : 'text-gray-500 hover:text-[#2E7D50]'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                <Moon className="w-3.5 h-3.5" />
                {isEn ? 'Dark' : 'داكن'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Legal Modals */}
      <LegalModals open={openModal} onClose={closeModal} language={language} />
    </motion.div>
  );
}

/* ================================================================
   EMAIL SCREEN
   ================================================================ */
function EmailScreen({ email, setEmail, onSubmit, onBack, onGoogleLogin, isLoading }: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack: () => void;
  onGoogleLogin: () => void;
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D50] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
          <span className="text-sm font-bold">رجوع</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-[#2E7D50]/10 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-[#2E7D50]" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">أدخل بريدك الإلكتروني</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            سنرسل لك رمز تحقق مكوّن من 6 أرقام للدخول بأمان
          </p>
        </div>

        {/* Email Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white placeholder-gray-400 focus:outline-none focus:border-[#2E7D50] focus:ring-4 focus:ring-[#2E7D50]/10 transition-all"
              placeholder="name@example.com"
              dir="ltr"
              style={{ textAlign: 'left' }}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-[#2E7D50] hover:bg-[#266B43] text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2E7D50]/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>إرسال رمز التحقق</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">أو</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google alternative */}
        <button
          onClick={onGoogleLogin}
          className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#4285F4] text-gray-600 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
          </svg>
          <span className="text-sm">الدخول بحساب Google</span>
        </button>
      </div>
    </motion.div>
  );
}

/* ================================================================
   OTP SCREEN
   ================================================================ */
function OtpScreen({ email, otp, otpRefs, onOtpChange, onOtpKeyDown, onOtpPaste, onResend, onBack, countdown, isLoading }: {
  email: string;
  otp: string[];
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onResend: () => void;
  onBack: () => void;
  countdown: number;
  isLoading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D50] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
          <span className="text-sm font-bold">تغيير البريد</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-[#2AA676]/10 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-[#2AA676]" />
          </motion.div>
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">أدخل رمز التحقق</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            تم إرسال رمز مكوّن من 6 أرقام إلى
          </p>
          <p className="text-[#2E7D50] font-bold text-sm mt-1" dir="ltr">{email}</p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-2.5 justify-center mb-6" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { otpRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => onOtpChange(index, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(index, e)}
              onPaste={index === 0 ? onOtpPaste : undefined}
              className={`w-12 h-14 md:w-14 md:h-16 text-center text-xl font-black rounded-2xl border-2 transition-all duration-200 focus:outline-none ${
                digit
                  ? 'border-[#2E7D50] bg-[#2E7D50]/5 text-[#2E7D50]'
                  : 'border-gray-200 bg-white text-gray-800 focus:border-[#2E7D50] focus:ring-4 focus:ring-[#2E7D50]/10'
              }`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-[#2E7D50]" />
            <span className="text-sm text-gray-500">جاري التحقق...</span>
          </div>
        )}

        {/* Resend */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-gray-400 text-sm">
              إعادة الإرسال بعد <span className="font-bold text-[#2E7D50]">{countdown}</span> ثانية
            </p>
          ) : (
            <button
              onClick={onResend}
              className="text-[#2E7D50] font-bold text-sm hover:underline transition-colors"
            >
              إعادة إرسال الرمز
            </button>
          )}
        </div>

        {/* Security note */}
        <div className="mt-8 bg-[#F5EEE1] rounded-2xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#1A1A1A] mb-1">تسجيل دخول آمن</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              رمز التحقق صالح لمدة 10 دقائق فقط. لا تشارك هذا الرمز مع أي شخص.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================
   PASSWORD SCREEN
   ================================================================ */
function PasswordScreen({ email, setEmail, password, setPassword, onSubmit, onBack, onGoogleLogin, isLoading }: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onBack: () => void;
  onGoogleLogin: () => void;
  isLoading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#2E7D50] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 rotate-180" />
          <span className="text-sm font-bold">رجوع</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-14 h-14 bg-[#2E7D50]/10 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-[#2E7D50]" />
          </div>
          <h2 className="text-2xl font-black text-[#1A1A1A] mb-2">تسجيل الدخول</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            أدخل بريدك وكلمة المرور للدخول إلى حسابك
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white placeholder-gray-400 focus:outline-none focus:border-[#2E7D50] focus:ring-4 focus:ring-[#2E7D50]/10 transition-all"
              placeholder="name@example.com"
              dir="ltr"
              style={{ textAlign: 'left' }}
              autoFocus
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pr-12 pl-12 py-4 border-2 border-gray-200 rounded-2xl text-base bg-white placeholder-gray-400 focus:outline-none focus:border-[#2E7D50] focus:ring-4 focus:ring-[#2E7D50]/10 transition-all"
              placeholder="كلمة المرور"
              dir="ltr"
              style={{ textAlign: 'left' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-[#2E7D50] hover:bg-[#266B43] text-white font-bold py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2E7D50]/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>تسجيل الدخول</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">أو</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google alternative */}
        <button
          onClick={onGoogleLogin}
          className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-[#4285F4] text-gray-600 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.7-3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
          </svg>
          <span className="text-sm">الدخول بحساب Google</span>
        </button>
      </div>
    </motion.div>
  );
}