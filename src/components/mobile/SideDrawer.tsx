import { useState } from 'react';
import { X, ChevronLeft, User, ArrowRight, Download, Smartphone, Sun, Moon } from 'lucide-react';
import { sectionsTree, MainSection, SubSection } from '../../data/sectionsTree';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../utils/UserContext';
import { Icon3D, NAV_ICONS, SERVICE_ICONS } from '../ui/Icon3D';
import { FolderKanban, Wallet, Bot, BarChart3, Wrench, Home as HomeIcon } from 'lucide-react';
import bietAlreefLogo from 'figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export function SideDrawer({ isOpen, onClose, onNavigate, currentRoute }: SideDrawerProps) {
  const { t, language } = useTranslation('common');
  const theme = useTheme();
  const { profile } = useUser();
  const [showServicesOverlay, setShowServicesOverlay] = useState(false);
  const [showAppCTA, setShowAppCTA] = useState(false);
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, sans-serif' : 'Cairo, sans-serif';
  
  // Pull name from profile context, fallback to Guest
  const displayName = profile?.full_name || (isEn ? 'Guest User' : 'مستخدم زائر');
  const userRole = profile?.role || 'guest';
  const roleLabel = userRole === 'guest'
    ? (isEn ? 'Guest' : 'زائر')
    : userRole === 'client'
    ? (isEn ? 'Client' : 'عميل')
    : userRole === 'provider'
    ? (isEn ? 'Provider' : 'مزود خدمة')
    : (isEn ? 'Guest' : 'زائر');

  const handleSectionClick = (section: MainSection) => {
    if (!section.guestAllowed) {
      setShowAppCTA(true);
      return;
    }
    if (section.expandable && section.subSections && section.subSections.length > 0) {
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

  const handleClose = () => {
    setShowServicesOverlay(false);
    setShowAppCTA(false);
    onClose();
  };

  const servicesSection = sectionsTree.find(s => s.id === 'services');

  // Filter: show guest-allowed only, exclude 'projects'
  const visibleSections = sectionsTree.filter(s => s.guestAllowed && s.id !== 'projects');

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
        {/* ═══ APP CTA OVERLAY ═══ */}
        <AnimatePresence>
          {showAppCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white z-70 flex flex-col"
            >
              <div className="bg-white border-b border-[#E6DCC8] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowAppCTA(false)} className="p-1.5 hover:bg-[#F5EEE1] rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5 text-[#1F3D2B]" />
                  </button>
                  <h2 className="text-[#1F3D2B] font-bold text-lg" style={{ fontFamily }}>
                    {isEn ? 'App Features' : 'ميزات التطبيق'}
                  </h2>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#1F3D2B]" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-[#2AA676]/20">
                  <Smartphone className="w-11 h-11 text-white" />
                </div>

                <h3 className="text-xl font-extrabold text-[#1F3D2B] mb-2" style={{ fontFamily }}>
                  {isEn ? 'Get the Full Experience' : 'احصل على التجربة الكاملة'}
                </h3>
                <p className="text-[#1F3D2B]/40 text-sm leading-relaxed mb-6" style={{ fontFamily }}>
                  {isEn
                    ? 'Download Beit Al Reef app to unlock projects, wallet, AI agent, CRM, and more.'
                    : 'حمّل تطبيق بيت الريف لفتح المشاريع، المحفظة، الوكيل الذكي، CRM، وأكثر.'}
                </p>

                {/* App-only features list */}
                <div className="w-full space-y-2 mb-6">
                  {[
                    { iconComp: FolderKanban, theme: 'indigo', ar: 'إدارة المشاريع', en: 'Project Management' },
                    { iconComp: Wallet, theme: 'gold', ar: 'محظة الدار', en: 'Dar Wallet' },
                    { iconComp: Bot, theme: 'emerald', ar: 'وكيل ذكي متكامل', en: 'Full AI Agent' },
                    { iconComp: User, theme: 'blue', ar: 'ملف شخصي محترف', en: 'Professional Profile' },
                    { iconComp: BarChart3, theme: 'purple', ar: 'CRM والأتمتة', en: 'CRM & Automation' },
                  ].map((feat) => (
                    <div key={feat.en} className="flex items-center gap-3 bg-[#F5EEE1] px-4 py-2.5 rounded-xl">
                      <Icon3D icon={feat.iconComp} theme={feat.theme} size="xs" hoverable={false} />
                      <span className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily }}>
                        {isEn ? feat.en : feat.ar}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2AA676]/20"
                  style={{ fontFamily }}>
                  <Download className="w-4 h-4" />
                  {isEn ? 'Download the App' : 'حمّل التطبيق'}
                </button>

                <button onClick={() => setShowAppCTA(false)}
                  className="mt-3 text-sm font-bold text-[#1F3D2B]/30 hover:text-[#1F3D2B]/50 transition-colors"
                  style={{ fontFamily }}>
                  {isEn ? 'Continue Browsing' : 'استمر في التصفح'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ SERVICES OVERLAY ═══ */}
        <AnimatePresence>
          {showServicesOverlay && servicesSection?.subSections && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0 bg-white z-60 flex flex-col"
            >
              <div className="bg-white border-b border-[#E6DCC8] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowServicesOverlay(false)} className="p-1.5 hover:bg-[#F5EEE1] rounded-lg transition-colors">
                    <ArrowRight className="w-5 h-5 text-[#1F3D2B]" />
                  </button>
                  <h2 className="text-[#1F3D2B] font-bold text-lg" style={{ fontFamily }}>
                    {isEn ? 'Services' : 'الخدمات'}
                  </h2>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#1F3D2B]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-[#F5EEE1]">
                <button onClick={handleViewAllServices}
                  className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] rounded-2xl p-4 mb-4 flex items-center justify-between group hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <Icon3D icon={Wrench} theme="green" size="xs" hoverable={false} />
                    </div>
                    <div className="text-right">
                      <h3 className="text-white font-bold text-sm" style={{ fontFamily }}>
                        {isEn ? 'All Services' : 'جميع الخدمات'}
                      </h3>
                      <p className="text-white/60 text-[10px]" style={{ fontFamily }}>
                        {isEn ? 'Browse all categories' : 'تصفح جميع الأقسام'}
                      </p>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-white/60 group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="grid grid-cols-3 gap-3">
                  {servicesSection.subSections.map((sub, idx) => (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => handleSubSectionClick(sub)}
                      className={`bg-white rounded-2xl p-3 flex flex-col items-center gap-2 border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
                        currentRoute?.includes(sub.id) ? 'border-[#2AA676] bg-[#2AA676]/5' : 'border-[#F5EEE1] hover:border-[#2AA676]/30'
                      }`}
                    >
                      {SERVICE_ICONS[sub.id] ? (
                        <Icon3D
                          icon={SERVICE_ICONS[sub.id].icon}
                          theme={SERVICE_ICONS[sub.id].theme}
                          size="md"
                          hoverable={false}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-[#F5EEE1] to-white rounded-xl flex items-center justify-center shadow-inner">
                          <span className="text-2xl">{sub.icon}</span>
                        </div>
                      )}
                      <span className="text-[#1F3D2B] text-center leading-tight line-clamp-2"
                        style={{ fontFamily, fontWeight: 600, fontSize: '11px' }}>
                        {isEn ? sub.nameEn : sub.nameAr}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ MAIN DRAWER ═══ */}

        {/* Header */}
        <div className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily }}>
            {t('mainMenu')}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Guest / User Card — 3D Clay Style */}
        <div className="p-3 border-b border-[#DDD4C4] bg-gradient-to-br from-[#F5EEE1] to-[#EDE5D5]">
          <button
            onClick={() => { onNavigate('/profile'); onClose(); }}
            className="w-full group"
          >
            {/* 3D Card */}
            <div
              className="relative rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] group-active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #2AA676 0%, #1F3D2B 100%)',
                boxShadow: `
                  0 4px 0 0 #16332A,
                  0 6px 16px rgba(42,166,118,0.3),
                  inset 0 1px 1px rgba(255,255,255,0.25),
                  inset 0 -1px 2px rgba(0,0,0,0.1)
                `,
                transform: 'translateY(-2px)',
              }}
            >
              {/* Shine overlay */}
              <div
                className="absolute top-0 left-0 w-1/2 h-2/5 pointer-events-none"
                style={{
                  borderRadius: '16px 16px 40px 4px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                }}
              />

              {/* Golden accent strip */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-[#D4AF37] via-[#FFD700] to-[#D4AF37] opacity-60" />

              <div className="relative z-10 p-4 flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.4) 0%, rgba(200,168,106,0.25) 100%)',
                    boxShadow: '0 2px 0 0 rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3)',
                    border: '2px solid rgba(212,175,55,0.3)',
                  }}
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <User className="w-7 h-7 text-white/90" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-right">
                  {/* 3D Welcome Text */}
                  <p
                    className="text-[13px] font-extrabold mb-0.5"
                    style={{
                      fontFamily,
                      color: '#FFD700',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 8px rgba(212,175,55,0.2)',
                    }}
                  >
                    {isEn ? 'Welcome to Al Dar' : 'مرحباً بك في الدار'}
                  </p>
                  <h3
                    className="font-bold text-white text-base truncate"
                    style={{
                      fontFamily,
                      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    {displayName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{
                        fontFamily,
                        background: 'rgba(212,175,55,0.2)',
                        color: '#FFD700',
                        border: '1px solid rgba(212,175,55,0.3)',
                        textShadow: '0 1px 1px rgba(0,0,0,0.15)',
                      }}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {/* Arrow to Profile */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.1)',
                  }}
                >
                  <ChevronLeft className="w-5 h-5 text-white/80" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Sections — all visible, no projects */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav>
            {visibleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentRoute === section.route
                    ? 'bg-[#2AA676]/10 border-r-4 border-[#2AA676] text-[#2AA676]'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {NAV_ICONS[section.id] ? (
                    <Icon3D
                      icon={NAV_ICONS[section.id].icon}
                      theme={NAV_ICONS[section.id].theme}
                      size="sm"
                      hoverable={false}
                    />
                  ) : (
                    <span className="text-2xl">{section.icon}</span>
                  )}
                  <span className="font-medium text-base" style={{ fontFamily }}>
                    {isEn ? section.nameEn : section.nameAr}
                  </span>
                </div>
                {section.expandable && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-[#2AA676]/10 text-[#2AA676] px-2 py-0.5 rounded-full">
                      {section.subSections?.length || 0}
                    </span>
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer — Download App + Theme Toggle next to Branding */}
        <div className="border-t border-gray-200 p-4 bg-[#F5EEE1]/30">
          {/* Download App CTA */}
          <button
            onClick={() => setShowAppCTA(true)}
            className="w-full bg-gradient-to-l from-[#1F3D2B] to-[#2A5A3B] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mb-4 shadow-md hover:shadow-lg transition-all"
            style={{ fontFamily }}
          >
            <Download className="w-3.5 h-3.5" />
            {isEn ? 'Download the Full App' : 'حمّل التطبيق الكامل'}
          </button>

          {/* Branding + Theme Toggle side by side */}
          <div className="flex items-center gap-3">
            {/* Logo & Branding */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <img src={bietAlreefLogo} alt="بيت الريف" className="w-11 h-11 object-contain shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-sm text-[#1F3D2B] truncate" style={{ fontFamily }}>
                  {isEn ? 'Beit Al Reef' : 'بيت الريف'}
                </p>
                <p className="text-[10px] text-gray-500 truncate" style={{ fontFamily }}>
                  {isEn ? 'Smart Building Platform' : 'منصة البناء الذكي'}
                </p>
              </div>
            </div>

            {/* Compact Theme Toggle */}
            <div className="flex items-center bg-white/80 border border-[#E6DCC8] rounded-full p-0.5 shadow-sm shrink-0">
              <button
                onClick={() => { if (theme.theme !== 'light') theme.toggleTheme(); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${
                  theme.theme === 'light' ? 'bg-[#2E7D50] text-white shadow-md' : 'text-gray-400 hover:text-[#2E7D50]'
                }`}
                style={{ fontFamily }}
              >
                <Sun className="w-3 h-3" />
                {isEn ? 'Light' : 'فاتح'}
              </button>
              <button
                onClick={() => { if (theme.theme !== 'dark') theme.toggleTheme(); }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all duration-200 ${
                  theme.theme === 'dark' ? 'bg-[#2E7D50] text-white shadow-md' : 'text-gray-400 hover:text-[#2E7D50]'
                }`}
                style={{ fontFamily }}
              >
                <Moon className="w-3 h-3" />
                {isEn ? 'Dark' : 'داكن'}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-center text-gray-400 mt-3" style={{ fontFamily }}>
            {isEn ? '© 2026 All Rights Reserved' : '© 2026 جميع الحقوق محفوظة'}
          </p>
        </div>
      </div>
    </>
  );
}