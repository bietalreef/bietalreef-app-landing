import { Home, Package, Sparkles, ShoppingBag, Wrench, User } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

interface BottomNavProps {
  activeTab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'recommendations' | 'offers';
  onTabChange: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'recommendations' | 'offers') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();
  
  // 🔥 النصوص تتغير حسب اللغة لكن الاتجاه يبقى RTL دائماً
  const navItems = [
    { id: 'home' as const, icon: Home, label: t('home') },
    { id: 'services' as const, icon: Package, label: t('services') },
    { id: 'yak' as const, icon: Sparkles, label: t('weyaak') },
    { id: 'shop' as const, icon: ShoppingBag, label: t('store') },
    { id: 'profile' as const, icon: User, label: 'لوحة التحكم' }, // Changed from 'tools' to 'profile' acting as Control Panel
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#1A5490]/10 px-4 py-3 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      {/* 🔥 دائماً RTL بغض النظر عن اللغة */}
      <div className="flex items-center justify-around" dir="rtl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className="flex flex-col items-center gap-1.5 py-2 px-3 rounded-[16px] transition-all hover:bg-[#F5EEE1] group"
            >
              <div className={`relative ${isActive ? 'transform scale-110' : ''} transition-transform`}>
                <Icon 
                  className={`w-6 h-6 transition-colors ${ 
                    isActive ? 'text-white' : 'text-[#1A5490]/60'
                  }`}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full -z-10 blur-sm" />
                )}
              </div>
              <span 
                className={`text-xs transition-colors ${ 
                  isActive ? 'text-[#4A90E2]' : 'text-[#1A5490]/60'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: isActive ? 700 : 600 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}