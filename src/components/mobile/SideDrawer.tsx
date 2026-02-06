import { useState } from 'react';
import { X, ChevronDown, ChevronRight, User, LogOut } from 'lucide-react';
import { sectionsTree, MainSection, SubSection } from '../../data/sectionsTree';
import { useTranslation } from '../../contexts/LanguageContext';
import { useUser } from '../../utils/UserContext';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute?: string;
}

export function SideDrawer({ isOpen, onClose, onNavigate, currentRoute }: SideDrawerProps) {
  const { t, language } = useTranslation('common');
  const { profile, logout } = useUser();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionClick = (section: MainSection) => {
    if (section.expandable) {
      toggleSection(section.id);
    } else {
      onNavigate(section.route);
      onClose();
    }
  };

  const handleSubSectionClick = (subSection: SubSection) => {
    onNavigate(subSection.route);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    window.location.reload();
  };

  // Derive display info from actual profile
  const isLoggedIn = !!profile && !!profile.email;
  const userEmail = profile?.email || '';
  const displayName = profile?.full_name || userEmail.split('@')[0] || (language === 'en' ? 'Guest' : 'زائر');
  const userRole = profile?.role;
  
  const getRoleBadge = () => {
    const isEn = language === 'en';
    if (!isLoggedIn) return { text: isEn ? 'Guest User' : 'مستخدم زائر', bg: 'bg-gray-400', textColor: 'text-white' };
    if (userRole === 'admin') return { text: isEn ? 'System Admin' : 'مدير النظام', bg: 'bg-red-500', textColor: 'text-white' };
    if (userRole === 'provider') return { text: isEn ? 'Service Provider' : 'مزود خدمة', bg: 'bg-blue-500', textColor: 'text-white' };
    return { text: isEn ? 'Client' : 'عميل', bg: 'bg-[#2AA676]', textColor: 'text-white' };
  };

  const badge = getRoleBadge();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] p-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('mainMenu')}
          </h2>
          <button
            onClick={onClose}
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
            {/* Profile Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-white" />
              )}
              {/* Online Status */}
              {isLoggedIn && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0">
              {/* Welcome + Name */}
              <p className="text-[#2AA676] text-[11px] font-medium mb-0.5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {isLoggedIn ? 'مرحباً بك 👋' : 'مرحباً بك'}
              </p>
              <h3 className="font-bold text-[#1F3D2B] text-base truncate" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {displayName}
              </h3>
              
              {/* Email display for logged-in users */}
              {isLoggedIn && userEmail && (
                <p className="text-gray-500 text-[11px] truncate mt-0.5">{userEmail}</p>
              )}

              {/* Role badge */}
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`text-xs ${badge.bg} ${badge.textColor} px-2.5 py-0.5 rounded-full font-medium`} style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {badge.text}
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 rotate-180" />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex-1 overflow-y-auto p-2">
          <nav>
            {sectionsTree.map((section) => (
              <div key={section.id}>
                {/* Main Section */}
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
                    <span className="font-medium text-base">{language === 'ar' ? section.nameAr : section.nameEn}</span>
                  </div>
                  {section.expandable && (
                    expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )
                  )}
                </button>

                {/* Sub Sections */}
                {section.expandable && expandedSections.includes(section.id) && section.subSections && (
                  <div className="mr-8 mt-1 space-y-1 mb-2">
                    {section.subSections.map((subSection) => (
                      <button
                        key={subSection.id}
                        onClick={() => handleSubSectionClick(subSection)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                          transition-all duration-200
                          ${currentRoute === subSection.route
                            ? 'bg-[#2AA676]/10 text-[#2AA676] font-medium'
                            : 'hover:bg-gray-50 text-gray-600'
                          }
                        `}
                      >
                        <span className="text-lg">{subSection.icon}</span>
                        <span>{language === 'ar' ? subSection.nameAr : subSection.nameEn}</span>
                      </button>
                    ))}
                  </div>
                )}
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
              <span className="font-medium text-base">تسجيل الخروج</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-[#F5EEE1]/30">
          <div className="text-center mb-2">
            <div className="text-2xl mb-1">🏠</div>
            <p className="font-bold text-sm text-[#1F3D2B]">بيت الريف</p>
            <p className="text-xs text-gray-500">{language === 'ar' ? 'منصة البناء الذكي' : 'Smart Building Platform'}</p>
          </div>
          <p className="text-xs text-center text-gray-400 mt-2">
            {language === 'ar' ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All Rights Reserved'}
          </p>
        </div>
      </div>
    </>
  );
}