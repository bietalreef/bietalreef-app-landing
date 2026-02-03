import { motion } from 'motion/react';
import { Home, Package, Sparkles, FolderKanban, User, Search, ShoppingCart, Globe, Mail, Phone, Check, X, ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';

// ===========================================
// 🎨 BEIT AL REEF DESIGN SYSTEM
// ===========================================

export function DesignSystemShowcase() {
  const [language, setLanguage] = useState<'AR' | 'EN'>('AR');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'AR' ? 'EN' : 'AR');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#2AA676] to-[#C8A86A] px-6 pt-12 pb-8 rounded-b-[40px]">
        <h1 className="text-white text-2xl mb-2 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
          نظام تصميم بيت الريف
        </h1>
        <p className="text-white/90 text-sm text-center" style={{ fontFamily: 'Cairo, sans-serif' }}>
          Beit Al Reef Design System
        </p>
      </div>

      <div className="px-6 py-8 space-y-12">
        {/* Colors Section */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الألوان الأساسية
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-[#F5EEE1] rounded-[24px] border border-[#1F3D2B]/20 shadow-sm" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                Desert Sand
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                #F5EEE1
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 bg-[rgb(54,110,131)] rounded-[24px] shadow-md" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                Deep Olive
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                #1F3D2B
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 bg-[#2AA676] rounded-[24px] shadow-md" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                Emerald Green
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                #2AA676
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="h-24 bg-[#C8A86A] rounded-[24px] shadow-md" />
              <p className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                Gold Accent
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                #C8A86A
              </p>
            </div>
          </div>

          <h3 className="text-[#1F3D2B] text-base mt-8 mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            التدرجات
          </h3>
          <div className="space-y-3">
            <div className="h-20 bg-gradient-to-b from-[#2AA676] to-[#C8A86A] rounded-[24px] shadow-lg" />
            <p className="text-sm text-[#1A1A1A] text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              Green → Gold Gradient
            </p>
          </div>
        </section>

        {/* Buttons Section */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الأزرار
          </h2>
          <div className="space-y-4">
            {/* Primary Button */}
            <motion.button
              className="w-full bg-gradient-to-b from-[#2AA676] to-[#C8A86A] text-white rounded-[28px] py-4 shadow-lg"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              whileTap={{ scale: 0.98 }}
            >
              زر رئيسي - Primary Button
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              className="w-full bg-white border-2 border-[#1F3D2B] text-[#1F3D2B] rounded-[28px] py-4 shadow-sm"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              whileTap={{ scale: 0.98 }}
            >
              زر ثانوي - Secondary Button
            </motion.button>

            {/* Ghost Button */}
            <motion.button
              className="w-full bg-transparent border-2 border-[#2AA676] text-[#2AA676] rounded-[28px] py-4"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              whileTap={{ scale: 0.98 }}
            >
              زر شفاف - Ghost Button
            </motion.button>

            {/* Disabled Button */}
            <button
              className="w-full bg-[#F5EEE1] text-[#1F3D2B]/40 rounded-[28px] py-4 cursor-not-allowed"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
              disabled
            >
              زر معطل - Disabled Button
            </button>
          </div>
        </section>

        {/* Inputs Section */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            حقول الإدخال
          </h2>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="bg-[#F5EEE1] rounded-[28px] px-4 py-3 flex items-center gap-3 border border-[#1F3D2B]/10">
              <Search className="w-5 h-5 text-[#1F3D2B]/60" />
              <input
                type="text"
                placeholder="ابحث..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder:text-[#1F3D2B]/60"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            {/* Phone Input */}
            <div className="bg-[#F5EEE1] rounded-[28px] px-4 py-3 flex items-center gap-3 border border-[#1F3D2B]/10">
              <Phone className="w-5 h-5 text-[#1F3D2B]/60" />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder:text-[#1F3D2B]/60"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            {/* Email Input */}
            <div className="bg-[#F5EEE1] rounded-[28px] px-4 py-3 flex items-center gap-3 border border-[#1F3D2B]/10">
              <Mail className="w-5 h-5 text-[#1F3D2B]/60" />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder:text-[#1F3D2B]/60"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>

            {/* Focused State */}
            <div className="bg-white rounded-[28px] px-4 py-3 flex items-center gap-3 border-2 border-[#2AA676] shadow-md">
              <Search className="w-5 h-5 text-[#2AA676]" />
              <input
                type="text"
                placeholder="حالة نشطة - Focused"
                className="flex-1 bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder:text-[#2AA676]"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              />
            </div>
          </div>
        </section>

        {/* Navigation Bars */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            شريط التنقل العلوي
          </h2>
          <div className="bg-white rounded-[28px] p-4 shadow-md">
            <div className="flex items-center justify-between">
              {/* Left Side - User Avatar */}
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2AA676] to-[#C8A86A] flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </button>

              {/* Right Side - Icons (RTL: Right → Left) */}
              <div className="flex items-center gap-4">
                {/* 1. Unified Inbox */}
                <button className="relative">
                  <Mail className="w-6 h-6 text-[#1F3D2B]" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-[9px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>3</span>
                  </div>
                </button>

                {/* 2. Cart Icon */}
                <button className="relative">
                  <ShoppingCart className="w-6 h-6 text-[#1F3D2B]" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-[9px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>2</span>
                  </div>
                </button>

                {/* 3. Language Switch (AR/EN) */}
                <button onClick={toggleLanguage} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full hover:bg-[#2AA676]/10 transition-colors shadow-sm">
                  <Globe className="w-4 h-4 text-[#1F3D2B]" />
                  <span className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{language}</span>
                </button>
              </div>
            </div>
          </div>

          <h2 className="text-[#1F3D2B] text-xl mt-8 mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            شريط التنقل السفلي
          </h2>
          <div className="bg-white rounded-t-[32px] p-4 shadow-lg">
            <div className="flex items-center justify-around">
              {[
                { icon: Home, label: 'الرئيسية', active: true },
                { icon: Package, label: 'الخدمات', active: false },
                { icon: Sparkles, label: 'وياك', active: false },
                { icon: FolderKanban, label: 'المشاريع', active: false },
                { icon: User, label: 'الملف', active: false },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button key={index} className="flex flex-col items-center gap-1">
                    <div className={`p-2 rounded-[16px] ${item.active ? 'bg-[#2AA676]/10' : ''}`}>
                      <Icon className={`w-6 h-6 ${item.active ? 'text-[#2AA676]' : 'text-[#1F3D2B]/40'}`} strokeWidth={item.active ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] ${item.active ? 'text-[#2AA676]' : 'text-[#1F3D2B]/60'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: item.active ? 600 : 500 }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            البطاقات
          </h2>
          
          {/* Service Card */}
          <div className="bg-white rounded-[32px] p-5 shadow-md mb-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-b from-[#2AA676] to-[#C8A86A] rounded-[24px] flex items-center justify-center">
                <Package className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="text-base text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  بطاقة خدمة
                </h3>
                <p className="text-sm text-[#1F3D2B]/70 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  وصف الخدمة يظهر هنا بشكل واضح ومفصل
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#C8A86A] text-[#C8A86A]" />
                    <span className="text-xs text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>4.9</span>
                  </div>
                  <span className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif' }}>(234)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Card */}
          <div className="bg-white rounded-[32px] overflow-hidden shadow-md">
            <div className="h-32 bg-gradient-to-b from-[#2AA676]/20 to-[#C8A86A]/20 relative">
              <div className="absolute top-3 right-3 bg-[#2AA676] text-white px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                نشط
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                بطاقة مشروع
              </h3>
              <div className="flex items-center justify-between text-xs text-[#1F3D2B]/70">
                <span style={{ fontFamily: 'Cairo, sans-serif' }}>الميزانية: 50,000 درهم</span>
                <span style={{ fontFamily: 'Cairo, sans-serif' }}>التقدم: 65%</span>
              </div>
              <div className="mt-3 h-2 bg-[#F5EEE1] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2AA676] to-[#C8A86A]" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Weyaak AI Bubble */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            مساعد وياك AI
          </h2>
          <div className="flex justify-center">
            <motion.button
              className="w-16 h-16 rounded-full bg-gradient-to-b from-[#2AA676] to-[#C8A86A] shadow-2xl flex items-center justify-center"
              style={{ 
                boxShadow: '0 0 30px rgba(42, 166, 118, 0.4)'
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.button>
          </div>
          <p className="text-center text-sm text-[#1F3D2B]/70 mt-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            فقاعة عائمة للمساعد الذكي
          </p>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-[#1F3D2B] text-xl mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الطباعة
          </h2>
          <div className="bg-white rounded-[28px] p-5 shadow-sm space-y-4">
            <div>
              <p className="text-2xl text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                عنوان كبير - Heading 1
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cairo Bold 24px
              </p>
            </div>
            <div>
              <p className="text-xl text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                عنوان متوسط - Heading 2
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cairo Bold 20px
              </p>
            </div>
            <div>
              <p className="text-base text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                عنوان صغير - Heading 3
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cairo SemiBold 16px
              </p>
            </div>
            <div>
              <p className="text-sm text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                نص عادي - Body Text
              </p>
              <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                Cairo Regular 14px
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}