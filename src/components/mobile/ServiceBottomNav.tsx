import { Home, FolderKanban, MapPin, ThumbsUp, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceBottomNavProps {
  activeTab: 'home' | 'projects' | 'maps' | 'recommend' | 'offers';
  onTabChange: (tab: 'home' | 'projects' | 'maps' | 'recommend' | 'offers') => void;
  serviceName: string;
}

export function ServiceBottomNav({ activeTab, onTabChange, serviceName }: ServiceBottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'الرئيسية', labelEn: 'Home' },
    { id: 'projects' as const, icon: FolderKanban, label: 'المشاريع', labelEn: 'Projects' },
    { id: 'maps' as const, icon: MapPin, label: 'الخريطة', labelEn: 'Maps' },
    { id: 'recommend' as const, icon: ThumbsUp, label: 'توصية', labelEn: 'Recommend' },
    { id: 'offers' as const, icon: Tag, label: 'العروض', labelEn: 'Offers' },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
      dir="rtl"
    >
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-[#2AA676]/10 to-[#2AA676]/5'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`relative ${isActive ? 'text-[#2AA676]' : 'text-gray-500'}`}>
                <Icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2AA676] rounded-full"
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-[#2AA676]' : 'text-gray-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
