import { Menu, Bell, ShoppingCart, Home, Briefcase, Bot, Folder, User, Search } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useTranslation } from '../../contexts/LanguageContext';

interface NewTopHeaderProps {
  isScrolled: boolean;
  onOpenNotificationsCenter?: (category?: 'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers' | 'all') => void;
  onOpenSearch?: () => void;
}

export function NewTopHeader({ isScrolled, onOpenNotificationsCenter, onOpenSearch }: NewTopHeaderProps) {
  const { t, dir } = useTranslation('common');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Language Toggle Logic
  const toggleLanguage = () => {
    const newLang = dir === 'rtl' ? 'en' : 'ar';
    window.location.search = `?lang=${newLang}`;
  };

  const menuItems = [
    { icon: Home, title: t('home'), path: '/' },
    { icon: Briefcase, title: t('services'), path: '/services' },
    { icon: Bot, title: t('weyaak'), path: '/weyaak' },
    { icon: Folder, title: t('projects'), path: '/projects' },
    { icon: User, title: t('profile'), path: '/profile' },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white shadow-sm'
      }`}
    >
      {/* Main Header Container: Reduced padding on mobile (px-3) and reduced gap (gap-2) */}
      <div className="px-3 md:px-6 py-3 flex items-center justify-between gap-2 md:gap-4" dir="rtl">
        
        {/* RIGHT SECTION: Menu + Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6 text-[#1A1A1A]" />
            </button>
             {/* Desktop Menu Dropdown */}
             {showMenu && (
                <div className="hidden md:block absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl p-2 border border-gray-100 z-50">
                  {menuItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button key={idx} className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors text-right">
                        <Icon className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-bold text-gray-700 font-cairo">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Logo */}
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] p-0.5 shadow-sm flex-shrink-0">
             <ImageWithFallback 
               src="https://images.unsplash.com/photo-1640184713822-174b6e94df51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
               alt="Logo"
               className="w-full h-full object-cover rounded-md"
             />
          </div>
        </div>

        {/* CENTER SECTION: Search Bar */}
        {/* Added min-w-0 to allow flex child to shrink properly below its content size */}
        <div className="flex-1 max-w-md min-w-0">
          <button 
            onClick={onOpenSearch}
            className="w-full h-9 md:h-10 bg-[#F3F4F6] rounded-full flex items-center px-3 md:px-4 gap-2 hover:bg-[#E5E7EB] transition-colors group border border-transparent hover:border-blue-200"
          >
            <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
            <span className="text-xs text-gray-400 font-cairo truncate text-right flex-1 group-hover:text-gray-600 block">
              {dir === 'rtl' ? 'بحث...' : 'Search...'}
            </span>
          </button>
        </div>

        {/* LEFT SECTION: Language + Icons */}
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0" dir="ltr">
           {/* Language Switch */}
           <button 
             onClick={toggleLanguage}
             className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold font-cairo text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
           >
             {dir === 'rtl' ? 'EN' : 'AR'}
           </button>

           {/* Notification */}
           <button 
             onClick={() => onOpenNotificationsCenter && onOpenNotificationsCenter()}
             className="w-9 h-9 rounded-full hover:bg-gray-50 flex items-center justify-center relative transition-colors"
           >
             <Bell className="w-5 h-5 text-gray-700" />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
           </button>
        </div>

      </div>
    </div>
  );
}
