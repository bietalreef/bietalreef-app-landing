import { Settings, HelpCircle, LogOut, ChevronLeft, Shield, Bell, Moon, Sun, MapPin, Lock, Camera, Edit3, Mail, Phone, Save, Volume2, VolumeX, Trash2, MessageSquare, ShoppingBag, Star, Coins, Loader2, Info, Scale, ZoomIn, ZoomOut, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { ProfileLocationSetup } from './ProfileLocationSetup';
import { useUser } from '../../utils/UserContext';
import { useWallet } from '../../contexts/WalletContext';
import { SubscriptionsScreen } from './SubscriptionsScreen';
import { AIToolsDashboard } from './AIToolsDashboard';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../../utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { useNavigate } from 'react-router';
import { AboutScreen, TermsScreen } from './AboutTermsScreens';
import { useLanguage } from '../../contexts/LanguageContext';
import { useZoom } from '../../contexts/ZoomContext';
import { useTheme } from '../../contexts/ThemeContext';

// ─── Content Protection Hook ───
function useContentProtection() {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    // Prevent print screen and common screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'))) {
        e.preventDefault();
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2000);
      }
    };
    // Detect tab visibility change (user might be screenshotting)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setTimeout(() => setIsBlurred(false), 500);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isBlurred;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ad34c09a`;

type ProfileSection = 'main' | 'edit' | 'settings' | 'orders' | 'support' | 'subscriptions' | 'ai-tools' | 'location' | 'about' | 'terms';
type OrderTab = 'active' | 'completed' | 'cancelled';

const roleLabels: Record<string, Record<string, string>> = {
  client: { ar: 'عميل', en: 'Client' },
  provider: { ar: 'مزود خدمة', en: 'Service Provider' },
  admin: { ar: 'مدير', en: 'Admin' },
  guest: { ar: 'زائر', en: 'Guest' },
};

export function ProfileScreen() {
  const { profile, updateProfile, refreshProfile, logout } = useUser();
  const { balance: walletBalance } = useWallet();
  const [section, setSection] = useState<ProfileSection>('main');
  const [editName, setEditName] = useState(profile?.full_name || '');
  const [editPhone, setEditPhone] = useState(profile?.phone || '');
  const [orderTab, setOrderTab] = useState<OrderTab>('active');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isBlurred = useContentProtection();
  const { zoomLevel, zoomIn, zoomOut, resetZoom } = useZoom();
  const { theme, setTheme } = useTheme();

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ full_name: editName });
      toast.success('تم تحديث الملف الشخصي بنجاح');
      setSection('main');
    } catch {
      toast.error('فشل في تحديث الملف الشخصي');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      toast.error('يجب اختيار صورة (jpg, png, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 5MB');
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploadingAvatar(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error('يجب تسجيل الدخول أولاً');
        setAvatarPreview(null);
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${API_BASE}/avatar/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('تم تغيير الصورة الشخصية بنجاح!');
        // Refresh profile to get new avatar_url
        await refreshProfile();
        setAvatarPreview(null);
      } else {
        toast.error(data.error || 'فشل في رفع الصورة');
        setAvatarPreview(null);
      }
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      toast.error('حدث خطأ أثناء رفع الصورة');
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentAvatar = avatarPreview || profile?.avatar_url;

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(isEn ? 'en-US' : 'ar-EG', { year: 'numeric', month: 'long' })
    : '';

  // ─── Sub-screens ───

  if (section === 'subscriptions') {
    return <SubscriptionsScreen onBack={() => setSection('main')} />;
  }

  if (section === 'ai-tools') {
    return <AIToolsDashboard onBack={() => setSection('main')} />;
  }

  if (section === 'location') {
    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSection('main')} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
            <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
          </button>
          <h2 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>تحديد الموقع</h2>
        </div>
        <ProfileLocationSetup />
      </div>
    );
  }

  if (section === 'about') {
    return <AboutScreen onBack={() => setSection('main')} />;
  }

  if (section === 'terms') {
    return <TermsScreen onBack={() => setSection('main')} />;
  }

  // ─── Section Header Helper ───

  const SectionHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-[#1F3D2B]/10 px-4 py-3 flex items-center gap-3">
      <button onClick={onBack} className="p-2 rounded-xl hover:bg-[#F5EEE1] transition-colors">
        <ChevronLeft className="w-5 h-5 text-[#1F3D2B] rotate-180" />
      </button>
      <h2 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{title}</h2>
    </div>
  );

  // ─── Avatar Component ───

  const AvatarDisplay = ({ size = 'lg' }: { size?: 'sm' | 'lg' }) => {
    const dims = size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';
    const textSize = size === 'lg' ? 'text-3xl' : 'text-2xl';

    return (
      <div className="relative inline-block">
        <div className={`${dims} rounded-full bg-gradient-to-br from-[#2AA676] to-[#C8A86A] flex items-center justify-center text-white ${textSize} font-bold overflow-hidden ${size === 'sm' ? 'border-2 border-white/40' : ''}`}>
          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {currentAvatar ? (
            <img src={currentAvatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            (profile?.full_name?.[0] || 'U').toUpperCase()
          )}
        </div>
        {size === 'lg' && (
          <button
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="absolute -bottom-1 -left-1 w-8 h-8 bg-[#2AA676] rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
      </div>
    );
  };

  // ─── Edit Profile ───

  if (section === 'edit') {
    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title="تعديل الملف الشخصي" onBack={() => setSection('main')} />
        <div className="p-4 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <AvatarDisplay size="lg" />
            <p className="text-xs text-[#1F3D2B]/50" style={{ fontFamily: 'Cairo, sans-serif' }}>
              اضغط على أيقونة الكاميرا لتغيير الصورة
            </p>
          </div>

          {/* Name */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>الاسم</label>
            <div className="flex items-center gap-3">
              <Edit3 className="w-5 h-5 text-[#2AA676]" />
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#1F3D2B] font-semibold"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                placeholder="أدخل اسمك"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>الهاتف</label>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#2AA676]" />
              <input
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#1F3D2B] font-semibold"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                placeholder="+971 XX XXX XXXX"
                dir="ltr"
              />
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="bg-white rounded-2xl p-4 shadow-sm opacity-60">
            <label className="text-sm text-[#1F3D2B]/60 mb-1 block" style={{ fontFamily: 'Cairo, sans-serif' }}>البريد الإلكتروني</label>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#2AA676]" />
              <span className="flex-1 text-[#1F3D2B] font-semibold" dir="ltr">{profile?.email || '—'}</span>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                حفظ التعديلات
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── Settings ───

  if (section === 'settings') {
    const isDark = theme === 'dark';

    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title={isEn ? 'Settings' : 'الإعدادات'} onBack={() => setSection('main')} />
        <div className="p-4 space-y-3">

          {/* ─── Theme Toggle (المظهر) ─── */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              {isDark ? <Moon className="w-5 h-5 text-[#C8A86A]" /> : <Sun className="w-5 h-5 text-[#C8A86A]" />}
              <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isEn ? 'Appearance' : 'المظهر'}
              </span>
            </div>
            <div className="flex gap-2">
              {/* Light */}
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                  !isDark
                    ? 'border-[#2AA676] bg-[#2AA676]/5'
                    : 'border-transparent bg-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative" style={{ background: '#F5EEE1' }}>
                  <div className="absolute top-0 left-0 right-0 h-3" style={{ background: 'linear-gradient(to right, #2AA676, #1F3D2B)' }} />
                  <div className="absolute top-4 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute top-7 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ background: '#2AA676' }} />
                </div>
                <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Light' : 'فاتح'}
                </span>
                {!isDark && (
                  <div className="w-4 h-4 bg-[#2AA676] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>

              {/* Dark */}
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${
                  isDark
                    ? 'border-[#2AA676] bg-[#2AA676]/5'
                    : 'border-transparent bg-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative" style={{ background: '#F5EEE1' }}>
                  <div className="absolute top-0 left-0 right-0 h-3" style={{ background: 'linear-gradient(to right, #2AA676, #1F3D2B)' }} />
                  <div className="absolute top-4 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute top-7 left-1 right-1 h-2 bg-white rounded-sm" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full" style={{ background: '#C8A86A' }} />
                </div>
                <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Classic' : 'كلاسيكي'}
                </span>
                {isDark && (
                  <div className="w-4 h-4 bg-[#2AA676] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2.5 text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Theme is saved automatically across sessions' : 'يُحفظ المظهر تلقائياً ويبقى عند كل فتح'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#2AA676]" />
              <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>الإشعارات</span>
            </div>
            <button
              onClick={() => { setNotifications(!notifications); toast.info(notifications ? 'تم إيقاف الإشعارات' : 'تم تفعيل الإشعارات'); }}
              className={`w-12 h-6 rounded-full flex items-center transition-colors ${notifications ? 'bg-[#2AA676] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-[#2AA676]" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
              <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>الأصوات</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors ${soundEnabled ? 'bg-[#2AA676] justify-end' : 'bg-gray-300 justify-start'}`}
            >
              <div className="w-5 h-5 bg-white rounded-full shadow mx-0.5" />
            </button>
          </div>

          {/* Zoom / Display Size Control */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <ZoomIn className="w-5 h-5 text-[#2AA676]" />
                <span className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {isEn ? 'Display Size' : 'حجم العرض'}
                </span>
              </div>
              <span className="text-sm font-bold text-[#2AA676] bg-[#2AA676]/10 px-2.5 py-1 rounded-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {zoomLevel}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 70}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#1F3D2B] hover:bg-[#2AA676] hover:text-white transition-colors disabled:opacity-30"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="flex-1 h-2 bg-gray-100 rounded-full relative">
                <div 
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] rounded-full transition-all"
                  style={{ width: `${((zoomLevel - 70) / 80) * 100}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#2AA676] rounded-full shadow transition-all"
                  style={{ right: `calc(${((zoomLevel - 70) / 80) * 100}% - 8px)` }}
                />
              </div>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 150}
                className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#1F3D2B] hover:bg-[#2AA676] hover:text-white transition-colors disabled:opacity-30"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
            {zoomLevel !== 100 && (
              <button
                onClick={resetZoom}
                className="w-full mt-2.5 text-xs text-[#2AA676] font-bold py-1.5 bg-[#2AA676]/5 rounded-lg hover:bg-[#2AA676]/10 transition-colors"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {isEn ? 'Reset to default (100%)' : 'إعادة ضبط (100%)'}
              </button>
            )}
            <p className="text-[10px] text-gray-400 mt-2 text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Changes apply to the entire app and are saved automatically' : 'التغييرات تُطبّق على التطبيق بالكامل وتُحفظ تلقائياً'}
            </p>
          </div>

          <button className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right" onClick={() => toast.info('تغيير كلمة المرور — قريباً')}>
            <Lock className="w-5 h-5 text-[#C8A86A]" />
            <span className="flex-1 text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>تغيير كلمة المرور</span>
            <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/40 rotate-180" />
          </button>

          <button className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right" onClick={() => toast.error('حذف الحساب غير متاح حالياً')}>
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="flex-1 text-red-500 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>حذف الحساب</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── Orders ───

  if (section === 'orders') {
    const mockOrders = {
      active: [
        { id: 'ORD-001', title: 'صيانة تكييف', status: 'قيد التنفيذ', date: '2026-02-03', price: '350 د.إ' },
        { id: 'ORD-002', title: 'تركيب سباكة', status: 'بانتظار المزود', date: '2026-02-01', price: '500 د.إ' },
      ],
      completed: [
        { id: 'ORD-003', title: 'طلاء منزل', status: 'مكتمل', date: '2026-01-20', price: '1,200 د.إ' },
      ],
      cancelled: [
        { id: 'ORD-004', title: 'استشارة هندسية', status: 'ملغي', date: '2026-01-15', price: '200 د.إ' },
      ],
    };

    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title="طلباتي" onBack={() => setSection('main')} />
        <div className="flex gap-2 px-4 pt-3">
          {([['active', 'نشطة'], ['completed', 'مكتملة'], ['cancelled', 'ملغاة']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setOrderTab(key)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${orderTab === key ? 'bg-[#2AA676] text-white' : 'bg-white text-[#1F3D2B]'}`}
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-3">
          {mockOrders[orderTab].length === 0 ? (
            <div className="text-center py-12 text-[#1F3D2B]/50" style={{ fontFamily: 'Cairo, sans-serif' }}>
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              لا توجد طلبات
            </div>
          ) : (
            mockOrders[orderTab].map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1F3D2B] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>{order.title}</span>
                  <span className="text-xs text-[#1F3D2B]/50">{order.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                    orderTab === 'active' ? 'bg-blue-100 text-blue-700' :
                    orderTab === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-[#1F3D2B]/60">
                    <span>{order.date}</span>
                    <span className="font-bold text-[#2AA676]">{order.price}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ─── Support ───

  if (section === 'support') {
    return (
      <div className="min-h-screen bg-[#F5EEE1]" dir="rtl">
        <SectionHeader title="الدعم الفني" onBack={() => setSection('main')} />
        <div className="p-4 space-y-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
            <MessageSquare className="w-12 h-12 text-[#2AA676] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>كيف يمكننا مساعدتك؟</h3>
            <p className="text-sm text-[#1F3D2B]/60 mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              فريقنا متاح على مدار الساعة لمساعدتك
            </p>
          </div>

          {[
            { icon: <Mail className="w-5 h-5" />, label: 'البريد الإلكتروني', value: 'support@bietalreef.com' },
            { icon: <Phone className="w-5 h-5" />, label: 'الهاتف', value: '+971 XX XXX XXXX' },
            { icon: <MessageSquare className="w-5 h-5" />, label: 'محادثة مباشرة', value: 'ابدأ المحادثة' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => toast.info(`${item.label}: ${item.value}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 text-right"
            >
              <div className="w-10 h-10 bg-[#2AA676]/10 rounded-xl flex items-center justify-center text-[#2AA676]">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.label}</p>
                <p className="text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.value}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/40 rotate-180" />
            </button>
          ))}

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-bold text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>الأسئلة الشائعة</h4>
            {['كيف أضيف مشروعاً جديداً؟', 'كيف أتواصل مع مزود الخدمة؟', 'كيف أستخدم عملات ريف؟'].map((q, i) => (
              <button
                key={i}
                onClick={() => toast.info('قريباً — الإجابات التفصيلية')}
                className="w-full text-right py-2 border-b border-[#1F3D2B]/5 last:border-0 flex items-center justify-between"
              >
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>{q}</span>
                <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/30 rotate-180" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Profile Screen ───

  return (
    <div className="min-h-screen bg-[#F5EEE1] pb-8 select-none" dir="rtl">
      
      {/* ── Content Protection Overlay ── */}
      {isBlurred && (
        <div className="fixed inset-0 z-[100] bg-[#1F3D2B]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-4">
          <ShieldAlert className="w-16 h-16 text-white/80" />
          <p className="text-white text-lg font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Content Protected' : 'المحتوى محمي'}
          </p>
          <p className="text-white/60 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Screenshots are not allowed in this section' : 'لا يُسمح بالتقاط صور للشاشة في هذا القسم'}
          </p>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-[#F5EEE1] px-6 pt-8 pb-10 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#2AA676]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#C8A86A]/6 rounded-full blur-3xl" />
        
        <div className="relative flex items-center gap-4">
          {/* Avatar */}
          <AvatarDisplay size="sm" />
          <div className="flex-1">
            <h1 className="text-[#1F3D2B] text-xl font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {profile?.full_name || (isEn ? 'User' : 'مستخدم')}
            </h1>
            <p className="text-[#1F3D2B]/50 text-sm" dir="ltr">{profile?.email || ''}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#2AA676]/10 text-[#2AA676] text-xs px-2 py-0.5 rounded-lg font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {roleLabels[profile?.role || 'client']?.[language] || profile?.role}
              </span>
              {profile?.is_verified && (
                <span className="bg-[#C8A86A]/15 text-[#C8A86A] text-xs px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold">
                  <Shield className="w-3 h-3" /> {isEn ? 'Verified' : 'موثّق'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative grid grid-cols-3 gap-3 mt-6">
          {[
            { label: isEn ? 'Projects' : 'المشاريع', value: '0' },
            { label: isEn ? 'Rating' : 'التقييم', value: '—' },
            { label: isEn ? 'Member Since' : 'عضو منذ', value: memberSince || '—' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-[#E6DCC8]">
              <p className="text-[#1F3D2B] text-lg font-bold">{stat.value}</p>
              <p className="text-[#1F3D2B]/40 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Card */}
      <div className="px-4 -mt-5 mb-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wallet')}
          className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 border border-[#E6DCC8] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[#C8A86A]/5 group-hover:bg-[#C8A86A]/10 transition-colors" />
          <div className="relative w-12 h-12 bg-gradient-to-br from-[#C8A86A] to-[#A07D35] rounded-xl flex items-center justify-center shadow-md">
            <span className="text-2xl">🪙</span>
          </div>
          <div className="relative flex-1 text-right">
            <p className="text-[#1F3D2B]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {isEn ? 'Reef Wallet Balance' : 'رصيد محفظة ريف'}
            </p>
            <p className="text-[#1F3D2B] text-2xl font-black" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {walletBalance.toLocaleString(isEn ? 'en-US' : 'ar-EG')} <span className="text-sm font-semibold text-[#C8A86A]">{isEn ? 'Coins' : 'كوينز'}</span>
            </p>
          </div>
          <ChevronLeft className="relative w-5 h-5 text-[#C8A86A] rotate-180" />
        </motion.button>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-3">
        {[
          { icon: <Edit3 className="w-5 h-5" />, label: isEn ? 'Edit Profile' : 'تعديل الملف الشخصي', color: 'text-[#2AA676]', bg: 'bg-[#2AA676]/10', action: () => setSection('edit') },
          { icon: <MapPin className="w-5 h-5" />, label: isEn ? 'Set Location' : 'تحديد الموقع', color: 'text-blue-500', bg: 'bg-blue-50', action: () => setSection('location') },
          { icon: <ShoppingBag className="w-5 h-5" />, label: isEn ? 'My Orders' : 'طلباتي', color: 'text-orange-500', bg: 'bg-orange-50', action: () => setSection('orders') },
          { icon: <Star className="w-5 h-5" />, label: isEn ? 'Subscriptions' : 'الاشتراكات', color: 'text-[#C8A86A]', bg: 'bg-[#C8A86A]/10', action: () => setSection('subscriptions') },
          { icon: <Settings className="w-5 h-5" />, label: isEn ? 'Settings' : 'الإعدادات', color: 'text-gray-600', bg: 'bg-gray-100', action: () => setSection('settings') },
          { icon: <HelpCircle className="w-5 h-5" />, label: isEn ? 'Support' : 'الدعم الفني', color: 'text-purple-500', bg: 'bg-purple-50', action: () => setSection('support') },
          { icon: <Info className="w-5 h-5" />, label: isEn ? 'About Beit Al Reef' : 'من نحن', color: 'text-[#1F3D2B]', bg: 'bg-[#1F3D2B]/10', action: () => setSection('about') },
          { icon: <Scale className="w-5 h-5" />, label: isEn ? 'Terms & Conditions' : 'الشروط والأحكام', color: 'text-[#C8A86A]', bg: 'bg-[#C8A86A]/10', action: () => setSection('terms') },
        ].map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
          >
            <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
              {item.icon}
            </div>
            <span className="flex-1 text-right text-[#1F3D2B] font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>{item.label}</span>
            <ChevronLeft className="w-4 h-4 text-[#1F3D2B]/30 rotate-180" />
          </motion.button>
        ))}

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            await logout();
            window.location.reload();
          }}
          className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 mt-6"
        >
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="flex-1 text-right text-red-500 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isEn ? 'Log Out' : 'تسجيل الخروج'}
          </span>
        </motion.button>
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-[#1F3D2B]/30 mt-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {isEn ? 'Beit Al Reef v2.0 — Smart Local Experience' : 'بيت الريف v2.0 — تجربة محلية ذكية'}
      </p>
    </div>
  );
}