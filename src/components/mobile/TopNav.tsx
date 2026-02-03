import image_1d3f7ac269fcb8922cef991f788ec0c45ba06aa3 from 'figma:asset/1d3f7ac269fcb8922cef991f788ec0c45ba06aa3.png';
import { ShoppingCart, Search, Bell, Menu, Mic, Download } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { useTranslation } from '../../contexts/LanguageContext';
import { useSearchStore } from '../../stores/search-store';

interface TopNavProps {
  activeTab?: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers';
  onTabChange?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenDrawer?: () => void;
  onOpenNotificationsCenter?: (category?: 'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers' | 'all') => void;
  onInstallClick?: () => void;
  isInstalled?: boolean;
}

export function TopNav({ activeTab, onTabChange, onOpenDrawer, onOpenNotificationsCenter, onInstallClick, isInstalled = false }: TopNavProps) {
  const { t } = useTranslation('common');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Fix: Split selectors to avoid "getSnapshot" infinite loop
  const setOpen = useSearchStore((state) => state.setOpen);
  const scope = useSearchStore((state) => state.scope);
  const openSearch = () => setOpen(true);

  const getPlaceholder = () => {
      switch(scope) {
          case 'PROJECTS': return t('search.placeholderProjects') || 'بحث في المشاريع...';
          case 'MATERIALS': return t('search.placeholderMaterials') || 'بحث في المواد...';
          case 'CLIENTS': return t('search.placeholderClients') || 'بحث في العملاء...';
          default: return t('search.placeholder');
      }
  };

  const notificationCategories = [
    { id: 'platform', icon: '📨', title: t('platformMessages'), count: 5 },
    { id: 'weyaak', icon: '🤖', title: t('weyaakMessages'), count: 2 },
    { id: 'crm', icon: '📊', title: t('crmMessages'), count: 3 },
    { id: 'user', icon: '👥', title: t('userMessages'), count: 8 },
    { id: 'alerts', icon: '🔔', title: t('alerts'), count: 4 },
    { id: 'offers', icon: '⚡', title: t('flashOffers'), count: 6 },
  ];

  const handleNotificationClick = (categoryId: string) => {
    setShowNotifications(false);
    if (onOpenNotificationsCenter) {
      onOpenNotificationsCenter(categoryId as any);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md px-3 md:px-6 py-3 sticky top-0 z-40 shadow-sm border-b border-[#F5EEE1]">
      {/* Single Row: Logo | Search | Icons - 🔥 دائماً RTL بغض النظر عن اللغة */}
      <div className="flex items-center justify-between gap-2 md:gap-4" dir="rtl">
        {/* Right Side (RTL) - Side Drawer Button + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Side Drawer Button */}
          <button 
            onClick={onOpenDrawer}
            className="p-2 hover:bg-[#2AA676]/10 rounded-lg transition-colors"
            aria-label={t('openMenu')}
          >
            <Menu className="w-6 h-6 text-[#1F3D2B]" />
          </button>

          {/* Logo */}
          <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <ImageWithFallback 
              src={image_1d3f7ac269fcb8922cef991f788ec0c45ba06aa3}
              alt="بيت الريف"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Center - Search Bar - Optimized for Mobile */}
        <div className="flex-1 min-w-0 max-w-xl mx-2 md:mx-4">
          <button
            onClick={openSearch}
            className="w-full bg-gradient-to-r from-[#F5EEE1] to-[#E5DED1] rounded-2xl px-3 md:px-4 py-2 md:py-2.5 flex items-center gap-2 md:gap-3 hover:shadow-md transition-all border border-[#4A90E2]/20 h-9 md:h-11"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#4A90E2] flex-shrink-0" />
            <span 
              className="flex-1 text-[#1F3D2B]/60 text-xs md:text-sm truncate block" 
              style={{ 
                fontFamily: 'Cairo, sans-serif', 
                fontWeight: 600,
                textAlign: 'right'
              }}
            >
              {getPlaceholder()}
            </span>
            <Mic className="w-4 h-4 md:w-5 md:h-5 text-[#2AA676] flex-shrink-0" />
          </button>
        </div>

        {/* Left Side (RTL) - Icons */}
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          {/* INSTALL BUTTON - ONLY IF NOT INSTALLED */}
          {!isInstalled && onInstallClick && (
            <button 
              onClick={onInstallClick}
              className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm animate-pulse"
            >
               <Download className="w-3 h-3" />
               <span>تثبيت التطبيق</span>
            </button>
          )}
          
          {/* Mobile Install Icon */}
          {!isInstalled && onInstallClick && (
             <button 
               onClick={onInstallClick} 
               className="md:hidden p-1.5 text-blue-600 bg-blue-50 rounded-full"
             >
                <Download className="w-5 h-5" />
             </button>
          )}

          {/* Language Switch */}
          <div className="transform scale-90 md:scale-100">
             <LanguageSwitcher variant="compact" />
          </div>

          {/* Cart Icon */}
          <button className="relative flex-shrink-0 p-1.5 md:p-2">
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-[#1A5490]" />
            <div className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-[8px] md:text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                3
              </span>
            </div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex-shrink-0 p-1.5 md:p-2"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-[#1A5490]" />
              <div className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center shadow-md">
                <span className="text-white text-[8px] md:text-[9px]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  28
                </span>
              </div>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl p-4 border-2 border-[#F5EEE1]" dir="rtl">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  {t('notificationBox')}
                </h3>
                <div className="space-y-2">
                  {notificationCategories.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNotificationClick(cat.id)}
                      className="w-full flex items-center justify-between p-3 bg-[#F5EEE1] hover:bg-[#4A90E2]/10 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-[#1A1A1A] text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                          {cat.title}
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-2 py-1 rounded-full text-xs shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {cat.count}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
