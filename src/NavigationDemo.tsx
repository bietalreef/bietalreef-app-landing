import { TopNav } from './components/mobile/TopNav';
import { BottomNav } from './components/mobile/BottomNav';
import { WeyaakBubble } from './components/WeyaakBubble';
import { useState } from 'react';
import { Sparkles, Package, Home as HomeIcon, Users, TrendingUp } from 'lucide-react';

type TabType = 'home' | 'search' | 'yak' | 'projects' | 'profile';

export function NavigationDemo() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white flex flex-col">
      {/* Top Navigation Bar */}
      <TopNav />

      {/* Main Content - Demo Area */}
      <div className="flex-1 overflow-y-auto pb-20 px-6 py-8">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-[#1F3D2B] text-2xl mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              نظام التنقل المحدّث
            </h1>
            <p className="text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
              Updated Navigation System
            </p>
          </div>

          {/* Top Bar Info */}
          <div className="bg-white rounded-[32px] p-6 shadow-md mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-b from-[#2AA676] to-[#C8A86A] rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  شريط التنقل العلوي
                </h3>
                <p className="text-sm text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Top Navigation Bar
                </p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center justify-between py-2 border-b border-[#1F3D2B]/10">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Left Side</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>صورة المستخدم</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1F3D2B]/10">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Right Side</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>البريد + السلة + اللغة</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Background</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>رملي شفاف</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar Info */}
          <div className="bg-white rounded-[32px] p-6 shadow-md mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-b from-[#2AA676] to-[#C8A86A] rounded-full flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  شريط التنقل السفلي
                </h3>
                <p className="text-sm text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Bottom Navigation Bar
                </p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="grid grid-cols-5 gap-2 mb-3">
                {[
                  { label: 'الرئيسية', position: '1' },
                  { label: 'الخدمات', position: '2' },
                  { label: 'وياك', position: '3' },
                  { label: 'المشاريع', position: '4' },
                  { label: 'الملف', position: '5' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="w-10 h-10 bg-[#F5EEE1] rounded-[16px] mx-auto mb-1 flex items-center justify-center">
                      <span className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {item.position}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-2 border-t border-[#1F3D2B]/10 pt-3">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Direction</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>من اليمين لليسار (RTL)</span>
              </div>
            </div>
          </div>

          {/* Weyaak Bubble Info */}
          <div className="bg-white rounded-[32px] p-6 shadow-md mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-b from-[#2AA676] to-[#C8A86A] rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  فقاعة وياك العائمة
                </h3>
                <p className="text-sm text-[#1F3D2B]/70" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  Weyaak AI Floating Bubble
                </p>
              </div>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center justify-between py-2 border-b border-[#1F3D2B]/10">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Position</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>أسفل اليمين</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#1F3D2B]/10">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Gradient</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>زمردي → ذهبي</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>Effect</span>
                <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>توهج نابض</span>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white rounded-[32px] p-6 shadow-md">
            <h3 className="text-[#1F3D2B] mb-4 text-right" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              لوحة الألوان
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="h-16 bg-[#F5EEE1] rounded-[20px] mb-2 border border-[#1F3D2B]/10" />
                <p className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>Desert Sand</p>
                <p className="text-[9px] text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>#F5EEE1</p>
              </div>
              <div className="text-center">
                <div className="h-16 bg-[#1F3D2B] rounded-[20px] mb-2" />
                <p className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>Deep Olive</p>
                <p className="text-[9px] text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>#1F3D2B</p>
              </div>
              <div className="text-center">
                <div className="h-16 bg-[#2AA676] rounded-[20px] mb-2" />
                <p className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>Emerald Green</p>
                <p className="text-[9px] text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>#2AA676</p>
              </div>
              <div className="text-center">
                <div className="h-16 bg-[#C8A86A] rounded-[20px] mb-2" />
                <p className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>Gold Accent</p>
                <p className="text-[9px] text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>#C8A86A</p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gradient-to-b from-[#2AA676]/10 to-[#C8A86A]/10 rounded-[32px] p-6 mt-6">
            <h3 className="text-[#1F3D2B] mb-4 text-right" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              ✨ المميزات الجديدة
            </h3>
            <div className="space-y-3 text-right">
              {[
                'شريط علوي نظيف مع أيقونات RTL',
                'شريط سفلي مع 5 أيقونات فقط',
                'الملف الشخصي في أقصى اليسار',
                'فقاعة وياك في الأسفل اليمين',
                'ألوان إماراتية راقية',
                'تدرجات زمردي → ذهبي',
                'تأثيرات توهج ناعمة',
                'تصميم RTL كامل',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 justify-end">
                  <span className="text-sm text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {feature}
                  </span>
                  <div className="w-2 h-2 bg-[#2AA676] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weyaak AI Floating Bubble - Bottom Right */}
      <WeyaakBubble position="fixed" />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
