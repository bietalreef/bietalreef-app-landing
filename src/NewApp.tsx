import { useState } from 'react';
import { NewHomeScreen } from './components/mobile/NewHomeScreen';
import { NewBottomNav } from './components/mobile/NewBottomNav';
import { WeyaakBubble } from './components/WeyaakBubble';

type TabType = 'home' | 'store' | 'projects' | 'profile' | 'yak';

export default function NewApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Main Content */}
      <div className="pb-20">
        {activeTab === 'home' && <NewHomeScreen />}
        {activeTab === 'store' && (
          <div className="pt-20 px-6">
            <h2 className="text-[#1A1A1A] text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              المتجر
            </h2>
          </div>
        )}
        {activeTab === 'projects' && (
          <div className="pt-20 px-6">
            <h2 className="text-[#1A1A1A] text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              المشاريع
            </h2>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="pt-20 px-6">
            <h2 className="text-[#1A1A1A] text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              الملف الشخصي
            </h2>
          </div>
        )}
      </div>

      {/* Weyaak AI Floating Bubble */}
      <WeyaakBubble 
        position="fixed" 
        onClick={() => setActiveTab('yak')}
      />

      {/* Bottom Navigation */}
      <NewBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
