import { User, Settings, FileText, CreditCard, Package, Folder, HelpCircle, LogOut, ChevronLeft, Shield, Bell, Globe, Star, Moon, Sun, MapPin, Trash2, ExternalLink, Download, Wrench, Lock } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ProfileLocationSetup } from './ProfileLocationSetup';
import { BusinessLocationData } from './ProfileLocationSetup';
import { IDCopyBox } from './IDCopyBox';
import { useUser } from '../../utils/UserContext';
import { supabase } from '../../utils/supabase/client';

import { SubscriptionsScreen } from './SubscriptionsScreen';
import { AIToolsDashboard } from './AIToolsDashboard';

// --- Menu Item Configuration ---
const getMenuItems = (userType: 'visitor' | 'client' | 'provider', isVerified: boolean, hasPro: boolean) => {
  const items = [];

  // Common for Verified/Pro
  if (userType !== 'visitor') {
    items.push({
      id: 'profile',
      icon: User,
      label: 'ملفي الشخصي',
      color: 'text-[#4A90E2]',
      bg: 'from-[#4A90E2]/10 to-[#4A90E2]/5',
    });
    
    // Client Specific
    if (userType === 'client') {
       items.push({
        id: 'orders',
        icon: FileText,
        label: 'طلباتي',
        color: 'text-[#F2994A]',
        bg: 'from-[#F2994A]/10 to-[#F2994A]/5',
       });
    }

    // Provider Specific
    if (userType === 'provider') {
       items.push({
        id: 'tools',
        icon: Wrench,
        label: 'أدوات المزود الذكية',
        color: 'text-[#2AA676]',
        bg: 'from-[#2AA676]/10 to-[#2AA676]/5',
        badge: hasPro ? 'PRO' : 'جديد',
        locked: !isVerified // Tools require verification
       });
       
       items.push({
         id: 'services_manage',
         icon: Package,
         label: 'إدارة خدماتي',
         color: 'text-[#56CCF2]',
         bg: 'from-[#56CCF2]/10 to-[#56CCF2]/5',
       });
    }

    // Common Utilities
    items.push({
      id: 'location',
      icon: MapPin,
      label: 'إعداد الموقع',
      color: 'text-[#2AA676]',
      bg: 'from-[#2AA676]/10 to-[#2AA676]/5',
    });
    
    items.push({
      id: 'subscriptions',
      icon: Star,
      label: hasPro ? 'إدارة اشتراكي' : 'ترقية الحساب',
      color: 'text-[#F2C94C]',
      bg: 'from-[#F2C94C]/10 to-[#F2C94C]/5',
      vip: hasPro,
    });
  }

  // Settings & Support (Always visible)
  items.push(
    {
      id: 'settings',
      icon: Settings,
      label: 'الإعدادات',
      color: 'text-[#1F3D2B]',
      bg: 'from-[#1F3D2B]/10 to-[#1F3D2B]/5',
    },
    {
      id: 'support',
      icon: HelpCircle,
      label: 'الدعم والمساعدة',
      color: 'text-[#4A90E2]',
      bg: 'from-[#4A90E2]/10 to-[#4A90E2]/5',
    }
  );

  return items;
};

export function ProfileScreen() {
  const { profile } = useUser();
  const [darkMode, setDarkMode] = useState(false);
  
  // Sub-screens state
  const [showLocationSetup, setShowLocationSetup] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showTools, setShowTools] = useState(false);
  
  // Logic to determine User State
  const isLoggedIn = !!profile && profile.role !== 'guest'; // Assuming guest role or null profile
  // Note: We need to handle the "Visitor" concept. If no profile, or generic email, treat as visitor.
  const isVisitor = !profile || !profile.email; 
  
  // Derived state
  const userType = isVisitor ? 'visitor' : (profile?.role === 'provider' ? 'provider' : 'client');
  const isVerified = profile?.user_metadata?.is_verified === true;
  const hasPro = profile?.tier === 'vip' || profile?.tier === 'pro'; // Check tier logic

  const menuItems = getMenuItems(userType, isVerified, hasPro);

  const handleLogout = async () => {
      await supabase.auth.signOut();
      window.location.reload();
  };

  // ====================================
  // 🎨 Render Sub-Screens
  // ====================================

  if (showTools) {
      return (
          <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
             <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center gap-3 z-10">
                 <button onClick={() => setShowTools(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                     <ChevronLeft className="w-6 h-6 transform rotate-180 text-gray-700"/>
                 </button>
                 <span className="font-bold text-lg text-gray-800">أدوات المزود</span>
             </div>
             <AIToolsDashboard onFullscreenToggle={() => {}} />
          </div>
      );
  }
  
  if (showSubscriptions) {
    return <SubscriptionsScreen onBack={() => setShowSubscriptions(false)} />;
  }

  if (showEditProfile) {
      return (
        <div className="flex-1 bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto pb-24" dir="rtl">
            <div className="sticky top-0 bg-white border-b border-[#F5EEE1] z-10 px-5 py-4 flex items-center gap-3">
                <button onClick={() => setShowEditProfile(false)} className="text-[#1F3D2B] hover:text-[#2AA676] transition-colors">
                    <ChevronLeft className="w-6 h-6 transform rotate-180" />
                </button>
                <h2 className="text-lg font-bold text-[#1F3D2B]">تعديل الملف الشخصي</h2>
            </div>
            <div className="p-5 space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl relative">
                        👤
                        <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white shadow-lg">
                            <Settings size={14}/>
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
                        <input 
                            type="text" 
                            disabled
                            value={profile?.full_name || ''} 
                            className="w-full p-4 rounded-xl bg-gray-100 border border-gray-200 cursor-not-allowed text-gray-500"
                        />
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (showLocationSetup) {
    return (
      <div className="flex-1 bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto pb-24" dir="rtl">
        <div className="sticky top-0 bg-white border-b border-[#F5EEE1] z-10 px-5 py-4 flex items-center gap-3">
          <button onClick={() => setShowLocationSetup(false)} className="text-[#1F3D2B] hover:text-[#2AA676] transition-colors">
            <ChevronLeft className="w-6 h-6 transform rotate-180" />
          </button>
          <h2 className="text-lg font-bold text-[#1F3D2B]">إعداد الموقع</h2>
        </div>
        <div className="p-5">
          <ProfileLocationSetup
            userType={userType === 'provider' ? 'provider' : 'verified'}
            onVerificationClick={() => alert('🔐 سيتم توجيهك لصفحة التوثيق')}
            onSaveHomeLocation={(loc) => alert(`✅ تم حفظ موقعك السكني:\n${loc.address}`)}
            onSaveBusinessLocation={(data) => alert(`✅ تم حفظ موقع نشاطك التجاري:\n${data.location.address}`)}
          />
        </div>
      </div>
    );
  }

  // ====================================
  // 🎨 Main Control Panel View
  // ====================================

  return (
    <div className="flex-1 bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto pb-24" dir="rtl">
      
      {/* 1. Header Section */}
      <div className="relative bg-gradient-to-br from-[#1A5490] via-[#1F3D2B] to-[#2AA676] px-5 pt-12 pb-8 rounded-b-[40px] shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
             {isVisitor ? (
                 <div className="text-center">
                     <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                         <User className="w-10 h-10 text-white/80"/>
                     </div>
                     <h1 className="text-2xl font-bold text-white mb-2">مرحباً بك، زائر</h1>
                     <p className="text-white/70 text-sm mb-6">قم بتسجيل الدخول أو إنشاء حساب للاستفادة من كافة الخدمات</p>
                     <button 
                        onClick={() => {/* Trigger Login Logic - usually handled by App state */}}
                        className="bg-white text-[#1A5490] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
                     >
                         تسجيل الدخول / إنشاء حساب
                     </button>
                 </div>
             ) : (
                 <div className="w-full">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-[24px] bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center overflow-hidden">
                                <span className="text-4xl">👤</span>
                            </div>
                            {isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-[#1A5490]">
                                    <Shield size={14} fill="currentColor"/>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white mb-1">{profile?.full_name || 'المستخدم'}</h1>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm">
                                    {userType === 'provider' ? 'مزود خدمة' : 'عميل'}
                                </span>
                                {hasPro && (
                                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold shadow-sm">
                                        PRO
                                    </span>
                                )}
                            </div>
                        </div>
                     </div>
                     
                     {/* Stats Row */}
                     <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                            <span className="block text-2xl font-bold text-white mb-1">0</span>
                            <span className="text-white/60 text-xs">الطلبات</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                            <span className="block text-2xl font-bold text-white mb-1">0.00</span>
                            <span className="text-white/60 text-xs">الرصيد</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-center border border-white/10">
                            <span className="block text-2xl font-bold text-white mb-1">--</span>
                            <span className="text-white/60 text-xs">التقييم</span>
                        </div>
                     </div>
                 </div>
             )}
        </div>
      </div>

      {/* 2. Menu Items */}
      <div className="px-5 py-6 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isLocked = item.locked;
          
          return (
            <motion.button
              key={item.id}
              disabled={isLocked}
              onClick={() => {
                if (isLocked) {
                    alert('🚫 هذه الميزة تتطلب توثيق الحساب');
                    return;
                }
                if (item.id === 'profile') setShowEditProfile(true);
                if (item.id === 'location') setShowLocationSetup(true);
                if (item.id === 'subscriptions') setShowSubscriptions(true);
                if (item.id === 'tools') setShowTools(true);
              }}
              className={`w-full bg-white rounded-[24px] p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-4 border border-[#F5EEE1] ${isLocked ? 'opacity-60 grayscale' : ''}`}
              whileTap={{ scale: isLocked ? 1 : 0.98 }}
            >
              <div className={`w-12 h-12 rounded-[18px] bg-gradient-to-br ${item.bg} flex items-center justify-center shadow-sm`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              
              <div className="flex-1 text-right">
                <p className="text-[#1A1A1A] font-bold text-sm">{item.label}</p>
                {isLocked && <p className="text-red-400 text-xs mt-0.5">يتطلب توثيق</p>}
              </div>

              <div className="flex items-center gap-2">
                {item.vip && <div className="bg-gradient-to-r from-[#F2C94C] to-[#F2994A] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">VIP</div>}
                {item.badge && !item.vip && <div className="bg-[#2AA676] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">{item.badge}</div>}
                {isLocked ? <Lock size={16} className="text-gray-400"/> : <ChevronLeft className="w-5 h-5 text-gray-300" />}
              </div>
            </motion.button>
          );
        })}

        {/* Dark Mode (Visual Only for now) */}
        <div className="w-full bg-white rounded-[24px] p-4 shadow-sm flex items-center gap-4 border border-[#F5EEE1]">
          <div className="w-12 h-12 rounded-[18px] bg-gray-100 flex items-center justify-center">
            {darkMode ? <Moon className="w-6 h-6 text-gray-600" /> : <Sun className="w-6 h-6 text-orange-400" />}
          </div>
          <div className="flex-1 text-right">
            <p className="text-[#1A1A1A] font-bold text-sm">الوضع الليلي</p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-7 rounded-full transition-all relative ${darkMode ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${darkMode ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {/* Logout */}
        {!isVisitor && (
            <motion.button 
                onClick={handleLogout}
                className="w-full mt-8 flex items-center justify-center gap-2 text-red-500 p-4 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors"
                whileTap={{ scale: 0.98 }}
            >
                <LogOut size={20}/>
                <span className="font-bold">تسجيل الخروج</span>
            </motion.button>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 pb-6 text-center text-gray-400 text-xs font-medium">
        <p>بيت الريف إصدار 1.0.0</p>
        <p>© 2026 Biet Alreef. All rights reserved.</p>
      </div>

    </div>
  );
}
