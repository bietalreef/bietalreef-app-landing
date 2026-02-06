import { useState } from 'react';
import { X, ChevronLeft, User, LogOut, ArrowRight } from 'lucide-react';
import { sectionsTree, MainSection, SubSection } from '../../data/sectionsTree';
import { useTranslation } from '../../contexts/LanguageContext';
import { useUser } from '../../utils/UserContext';
import { motion, AnimatePresence } from 'motion/react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export function SideDrawer({ isOpen, onClose, onNavigate, currentRoute }: SideDrawerProps) {
  const { t, language } = useTranslation('common');
  const { profile, logout } = useUser();
  const [showServicesOverlay, setShowServicesOverlay] = useState(false);
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';

  const handleSectionClick = (section: MainSection) => {
    if (section.expandable && section.subSections && section.subSections.length > 0) {
      // Open full services overlay instead of dropdown
      setShowServicesOverlay(true);
    } else {
      onNavigate(section.route);
      onClose();
    }
  };

  const handleSubSectionClick = (subSection: SubSection) => {
    onNavigate(subSection.route);
    setShowServicesOverlay(false);
    onClose();
  };

  const handleViewAllServices = () => {
    onNavigate('/services');
    setShowServicesOverlay(false);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    window.location.reload();
  };

  const handleClose = () => {
    setShowServicesOverlay(false);
    onClose();
  };

  // Derive display info from actual profile
  const isLoggedIn = !!profile && !!profile.email;
  const userEmail = profile?.email || '';
  const displayName = profile?.full_name || userEmail.split('@')[0] || (isEn ? 'Guest' : 'زائر');
  const userRole = profile?.role;
  
  const getRoleBadge = () => {
    if (!isLoggedIn) return { text: isEn ? 'Guest User' : 'مستخدم زائر', bg: 'bg-gray-400', textColor: 'text-white' };
    if (userRole === 'admin') return { text: isEn ? 'System Admin' : 'مدير النظام', bg: 'bg-red-500', textColor: 'text-white' };
    if (userRole === 'provider') return { text: isEn ? 'Service Provider' : 'مزود خدمة', bg: 'bg-blue-500', textColor: 'text-white' };
    return { text: isEn ? 'Client' : 'عميل', bg: 'bg-[#2AA676]', textColor: 'text-white' };
  };

  const badge = getRoleBadge();

  // Get services section from tree
  const servicesSection = sectionsTree.find(s => s.id === 'services');

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col"
        dir="rtl"
      >
        {/* ────────────────────────────────────────────────── */}
        {/*  SERVICES FULL OVERLAY                            */}
        {/* ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showServicesOverlay && servicesSection?.subSections && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0 bg-white z-60 flex flex-col"
            >
              {/* Overlay Header */}
              <div className="bg-white border-b border-[#E6DCC8] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowServicesOverlay(false)}
                    className="p-1.5 hover:bg-[#F5EEE1] rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-5 h-5 text-[#1F3D2B]" />
                  </button>
                  <h2 className="text-[#1F3D2B] font-bold text-lg" style={{ fontFamily }}>
                    {isEn ? 'Services' : 'الخدمات'}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1F3D2B]" />
                </button>
              </div>

              {/* Services Grid */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#F5EEE1]">
                {/* View All Services Button */}
                <button
                  onClick={handleViewAllServices}
                  className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] rounded-2xl p-4 mb-4 flex items-center justify-between group hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🔧</span>
                    </div>
                    <div className="text-right">
                      <h3 className="text-white font-bold text-sm" style={{ fontFamily }}>
                        {isEn ? 'All Services' : 'جميع الخدمات'}
                      </h3>
                      <p className="text-white/60 text-[10px]" style={{ fontFamily }}>
                        {isEn ? 'Browse all categories & providers' : 'تصفح جميع الأقسام ومزودي الخدمات'}
                      </p>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-white/60 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* Services Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {servicesSection.subSections.map((sub, idx) => (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleSubSectionClick(sub)}
                      className={`
                        bg-white rounded-2xl p-3 flex flex-col items-center gap-2 border-2 transition-all duration-200 shadow-sm hover:shadow-md
                        ${currentRoute?.includes(sub.id)
                          ? 'border-[#2AA676] bg-[#2AA676]/5 shadow-[#2AA676]/10'
                          : 'border-[#F5EEE1] hover:border-[#2AA676]/30'
                        }
                      `}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-[#F5EEE1] to-white rounded-xl flex items-center justify-center shadow-inner">
                        <span className="text-2xl">{sub.icon}</span>
                      </div>
                      <span 
                        className="text-[#1F3D2B] text-center leading-tight line-clamp-2"
                        style={{ fontFamily, fontWeight: 600, fontSize: '11px' }}
                      >
                        {isEn ? sub.nameEn : sub.nameAr}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Platform Showcase link */}
                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    onNavigate('/platform');
                    setShowServicesOverlay(false);
                    onClose();
                  }}
                  className="w-full mt-4 bg-white border border-[#E6DCC8] rounded-2xl p-4 flex items-center gap-3 group hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-lg">✨</span>
                  </div>
                  <div className="flex-1 text-right">
                    <h4 className="text-[#1F3D2B] font-bold text-sm" style={{ fontFamily }}>
                      {isEn ? 'Discover Features' : 'اكتشف المميزات'}
                    </h4>
                    <p className="text-[#1F3D2B]/40 text-[10px]" style={{ fontFamily }}>
                      {isEn ? '50+ tools for providers' : '+50 أداة لمزودي الخدمات'}
                    </p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-[#2AA676] group-hover:-translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ────────────────────────────────────────────────── */}
        {/*  MAIN DRAWER CONTENT                              */}
        {/* ────────────────────────────────────────────────── */}
        
        {/* Header */}
        <div className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily }}>
            {t('mainMenu')}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={t('closeMenu')}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Profile Card */}
        <div 
          className="bg-gradient-to-br from-[#F5EEE1] to-[#EDE5D5] p-4 border-b border-[#DDD4C4] cursor-pointer hover:bg-[#EDE5D5] transition-colors"
          onClick={() => {
            onNavigate('/profile');
            onClose();
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
              {isLoggedIn && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#2AA676] text-[11px] font-medium mb-0.5" style={{ fontFamily }}>
                {isLoggedIn ? (isEn ? 'Welcome' : 'مرحباً بك 👋') : (isEn ? 'Welcome' : 'مرحباً بك')}
              </p>
              <h3 className="font-bold text-[#1F3D2B] text-base truncate" style={{ fontFamily }}>
                {displayName}
              </h3>
              {isLoggedIn && userEmail && (
                <p className="text-gray-500 text-[11px] truncate mt-0.5">{userEmail}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs ${badge.bg} ${badge.textColor} px-2.5 py-0.5 rounded-full font-medium`} style={{ fontFamily }}>
                  {badge.text}
                </span>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav>
            {sectionsTree.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => handleSectionClick(section)}
                  className={`
                    w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${currentRoute === section.route 
                      ? 'bg-[#2AA676]/10 border-r-4 border-[#2AA676] text-[#2AA676]' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{section.icon}</span>
                    <span className="font-medium text-base" style={{ fontFamily }}>
                      {isEn ? section.nameEn : section.nameAr}
                    </span>
                  </div>
                  {/* Services gets a special indicator instead of expand arrow */}
                  {section.expandable ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-[#2AA676]/10 text-[#2AA676] px-2 py-0.5 rounded-full" style={{ fontFamily }}>
                        {section.subSections?.length || 0}
                      </span>
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : null}
                </button>
              </div>
            ))}
          </nav>

          {/* Logout Button */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-base" style={{ fontFamily }}>
                {isEn ? 'Sign Out' : 'تسجيل الخروج'}
              </span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-[#F5EEE1]/30">
          <div className="text-center mb-2">
            <div className="text-2xl mb-1">🏠</div>
            <p className="font-bold text-sm text-[#1F3D2B]" style={{ fontFamily }}>
              {isEn ? 'Beit Al Reef' : 'بيت الريف'}
            </p>
            <p className="text-xs text-gray-500" style={{ fontFamily }}>
              {isEn ? 'Smart Building Platform' : 'منصة البناء الذكي'}
            </p>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            {isEn ? '© 2026 All Rights Reserved' : '© 2026 جميع الحقوق محفوظة'}
          </p>
        </div>
      </div>
    </>
  );
}