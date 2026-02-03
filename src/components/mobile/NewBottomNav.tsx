import { Home, Package, Sparkles, FolderKanban, User, Wrench } from 'lucide-react';

interface NewBottomNavProps {
  activeTab: 'home' | 'projects' | 'yak' | 'tools' | 'profile';
  onTabChange: (tab: 'home' | 'projects' | 'yak' | 'tools' | 'profile') => void;
}

export function NewBottomNav({ activeTab, onTabChange }: NewBottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'الرئيسية' },
    { id: 'projects' as const, icon: FolderKanban, label: 'المشاريع' },
    { id: 'yak' as const, icon: Sparkles, label: 'وياك' },
    { id: 'tools' as const, icon: Wrench, label: 'الأدوات' },
    { id: 'profile' as const, icon: User, label: 'الملف الشخصي' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAF2FF] px-4 py-3 z-40">
      <div className="flex items-center justify-around max-w-lg mx-auto" dir="rtl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
            >
              <div className={`p-2 rounded-2xl transition-all ${
                isActive 
                  ? 'bg-[#4A90E2] shadow-lg shadow-[#4A90E2]/30' 
                  : 'bg-transparent'
              }`}>
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-[#1A1A1A]/60'
                  }`}
                />
              </div>
              <span 
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-[#4A90E2]' : 'text-[#1A1A1A]/60'
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