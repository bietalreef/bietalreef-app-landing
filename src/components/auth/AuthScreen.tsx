import { useState } from 'react';
import { supabase } from '../../utils/supabase/client';
import { Home, Mail, ArrowRight, Loader2, CheckCircle2, Lock, KeyRound, User, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { NewHomeContent } from '../mobile/NewHomeContent';
import { LanguageProvider } from '../../contexts/LanguageContext';

import { FooterDirectory } from '../seo/FooterDirectory';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [showLogin, setShowLogin] = useState(false);

  // If showing login form
  if (showLogin) {
    return (
      <LoginForm 
        onComplete={onComplete} 
        onBack={() => setShowLogin(false)} 
      />
    );
  }

  // Gateway View (Visitor Mode)
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-white flex flex-col font-cairo" dir="rtl">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#F5EEE1] rounded-lg flex items-center justify-center border border-[#E6DCC8]">
               <Home className="w-5 h-5 text-[#5B7FE8]" />
             </div>
             <span className="font-bold text-lg text-[#1A1A1A]">بيت الريف</span>
          </div>
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>

        {/* Main Content (Gateway) */}
        <div className="flex-1">
          <NewHomeContent />
          <FooterDirectory />
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 left-6 right-6 md:hidden z-40">
          <button 
            onClick={() => setShowLogin(true)}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-2xl shadow-xl font-bold flex items-center justify-center gap-2 animate-in slide-in-from-bottom-4 duration-500"
          >
            <User className="w-5 h-5" />
            <span>تسجيل الدخول / إنشاء حساب</span>
          </button>
        </div>
        
      </div>
    </LanguageProvider>
  );
}

// Internal Login Form Component
function LoginForm({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('password');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      if (error) throw error;
      
      setStep('otp');
      toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء إرسال الرمز: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      
      if (error) throw error;
      
      if (data.session) {
        toast.success('تم تسجيل الدخول بنجاح');
        onComplete();
      }
    } catch (error: any) {
      toast.error('رمز التحقق غير صحيح أو منتهي الصلاحية');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success('تم تسجيل الدخول بنجاح');
        onComplete();
      }
    } catch (error: any) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    toast.success('متابعة كزائر');
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#F5EEE1] flex flex-col items-center justify-center p-6 font-cairo animate-in fade-in duration-300" dir="rtl">
      
      <button 
        onClick={onBack}
        className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors z-10"
      >
        <X className="w-6 h-6 text-gray-600" />
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border-2 border-[#E6DCC8]">
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#F5EEE1] rounded-2xl flex items-center justify-center shadow-inner mx-auto mb-4 border border-[#E6DCC8]">
            <Home className="w-10 h-10 text-[#5B7FE8]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">تسجيل الدخول</h1>
          <p className="text-gray-500 text-sm">للوصول إلى الميزات الكاملة</p>
        </div>

        {/* Header Tabs (Password vs OTP) */}
        {step !== 'otp' && (
             <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button 
                    onClick={() => setStep('password')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${step === 'password' ? 'bg-white shadow text-[#5B7FE8]' : 'text-gray-500'}`}
                >
                    كلمة المرور
                </button>
                <button 
                    onClick={() => setStep('email')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${step === 'email' ? 'bg-white shadow text-[#5B7FE8]' : 'text-gray-500'}`}
                >
                    دخول سريع
                </button>
             </div>
        )}

        {/* Step 1: Email Input (OTP Mode) */}
        {step === 'email' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-200 hover:border-[#5B7FE8] hover:bg-blue-50 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              <span>Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">أو</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-10 pl-3 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#5B7FE8] transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                  <span>إرسال الرمز</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>}
              </button>
            </form>
          </div>
        )}

        {/* Step: Password Login */}
        {step === 'password' && (
           <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
             <form onSubmit={handlePasswordLogin} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pr-10 pl-3 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#5B7FE8] transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pr-10 pl-3 py-3 border-2 border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#5B7FE8] transition-colors"
                    placeholder="كلمة المرور"
                    required
                  />
                </div>

                <div className="text-left">
                    <button type="button" className="text-xs text-gray-500 hover:text-[#5B7FE8]">نسيت كلمة المرور؟</button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                    <span>دخول</span>
                    <KeyRound className="w-4 h-4" />
                  </>}
                </button>
             </form>
           </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 'otp' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">تم إرسال الرمز</h3>
              <p className="text-sm text-gray-500 mt-1">أدخل الرمز المرسل إلى {email}</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="block w-full text-center text-2xl tracking-widest py-3 border-2 border-[#5B7FE8] rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-[#5B7FE8]/20 transition-all"
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#5B7FE8] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>
                  <span>تحقق</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm text-gray-500 hover:text-gray-800 py-2"
              >
                تغيير البريد
              </button>
            </form>
          </div>
        )}

        {/* Back Button */}
        <button 
            onClick={handleGuestLogin}
            className="w-full mt-4 text-sm text-gray-500 hover:text-[#1A1A1A] flex items-center justify-center gap-1"
        >
            <span>متابعة التصفح كزائر</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
        </button>

      </div>
      
      <p className="mt-8 text-center text-xs text-gray-400">
        بالدخول فإنك توافق على <span className="underline cursor-pointer hover:text-gray-600">شروط الاستخدام</span> و <span className="underline cursor-pointer hover:text-gray-600">سياسة الخصوصية</span>
      </p>
    </div>
  );
}
