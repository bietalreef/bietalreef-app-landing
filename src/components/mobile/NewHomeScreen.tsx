import { useState, useEffect } from 'react';
import { NewTopHeader } from './NewTopHeader';
import { ChevronLeft, Phone, MessageCircle, MapPin, Star, Users } from 'lucide-react';

export function NewHomeScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide for main banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mainSlides = [
    { title: 'مقاولات', bg: 'linear-gradient(135deg, #4A90E2 0%, #7AB8FF 100%)' },
    { title: 'استشارات هندسية', bg: 'linear-gradient(135deg, #7AB8FF 0%, #4A90E2 100%)' },
    { title: 'عقارات', bg: 'linear-gradient(135deg, #4A90E2 0%, #F2C94C 100%)' },
    { title: 'متجر مواد البناء', bg: 'linear-gradient(135deg, #F2C94C 0%, #4A90E2 100%)' },
    { title: 'عروض موردين', bg: 'linear-gradient(135deg, #4A90E2 0%, #7AB8FF 100%)' },
  ];

  const engineeringServices = [
    { icon: '🎨', title: 'تصميم داخلي' },
    { icon: '🏛️', title: 'تصميم خارجي' },
    { icon: '📐', title: 'مخططات هندسية' },
    { icon: '📊', title: 'BOQ' },
    { icon: '🏢', title: 'مكتب هندسي' },
    { icon: '👷', title: 'إشراف هندسي' },
  ];

  const contractingServices = [
    { icon: '🏗️', title: 'مقاولات عامة', image: '🏗️' },
    { icon: '🏠', title: 'بناء فيلا', image: '🏠' },
    { icon: '🧱', title: 'أعمال العظم', image: '🧱' },
    { icon: '✨', title: 'التشطيبات', image: '✨' },
    { icon: '🎨', title: 'الديكور', image: '🎨' },
    { icon: '➕', title: 'الإضافات', image: '➕' },
    { icon: '🔨', title: 'ترميم', image: '🔨' },
    { icon: '⛺', title: 'مظلات وهناجر', image: '⛺' },
  ];

  const storeCategories = [
    { icon: '🧱', title: 'مواد البناء' },
    { icon: '⚙️', title: 'الحديد' },
    { icon: '🔧', title: 'الأدوات' },
    { icon: '💡', title: 'الكهرباء' },
    { icon: '🚰', title: 'السباكة' },
    { icon: '🎨', title: 'البلاط' },
    { icon: '📱', title: 'الأجهزة' },
  ];

  const maintenanceServices = [
    { icon: '🚰', title: 'السباكة' },
    { icon: '💡', title: 'الكهرباء' },
    { icon: '❄️', title: 'التكييف' },
    { icon: '🪵', title: 'النجارة' },
    { icon: '🔩', title: 'الحدادة' },
    { icon: '🪟', title: 'الزجاج' },
    { icon: '🪟', title: 'الألومنيوم' },
    { icon: '🎨', title: 'الدهانات' },
    { icon: '⬜', title: 'الجبس' },
    { icon: '🏭', title: 'الورش الصناعية' },
  ];

  const workers = [
    { icon: '👷', title: 'عامل بناء' },
    { icon: '🧑‍🎨', title: 'عامل جبس' },
    { icon: '🎨', title: 'عامل دهانات' },
    { icon: '🔧', title: 'عامل تركيب' },
    { icon: '⚡', title: 'عامل كهرباء' },
    { icon: '🚰', title: 'عامل سباكة' },
  ];

  const chatRooms = [
    { icon: '🏗️', title: 'غرفة المقاولين' },
    { icon: '🧱', title: 'غرفة مواد البناء' },
    { icon: '💼', title: 'غرفة عروض الموردين' },
    { icon: '👥', title: 'غرفة العملاء' },
    { icon: '📐', title: 'غرفة استشارات هندسية' },
    { icon: '🤖', title: 'غرفة Weyaak AI' },
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Top Header */}
      <NewTopHeader isScrolled={isScrolled} />

      {/* Main Content - Starts below header */}
      <div className="pt-32 pb-24 md:pt-36">
        
        {/* SECTION 1 - Main Slider */}
        <div className="px-6 mb-6">
          <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg">
            {mainSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentSlide === idx ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ background: slide.bg }}
              >
                <div className="flex items-center justify-center h-full">
                  <h2 className="text-white text-3xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    {slide.title}
                  </h2>
                </div>
              </div>
            ))}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {mainSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2 - Golden Opportunity */}
        <div className="px-6 mb-6">
          <div className="bg-gradient-to-br from-[#4A90E2] via-[#7AB8FF] to-[#F2C94C] rounded-3xl p-8 shadow-xl">
            <h2 className="text-white text-2xl mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              احصل على عرض السعر الذهبي خلال دقائق
            </h2>
            <p className="text-white/90 text-sm mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
              ارفع صور مشروعك – واحصل على أفضل 3 عروض جاهزة للمقارنة
            </p>

            {/* Timeline */}
            <div className="space-y-4 mb-6">
              {[
                { num: '٢', text: 'ارفع صور الموقع' },
                { num: '٣', text: 'اختر نوع الخدمة' },
                { num: '٤', text: 'استلم العروض خلال 24 ساعة' },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <span className="text-[#4A90E2] text-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                      {step.num}
                    </span>
                  </div>
                  <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="w-full bg-white text-[#4A90E2] py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              ابدأ الآن
            </button>
          </div>
        </div>

        {/* SECTION 3 - Engineering Consultations */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الاستشارات الهندسية
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {engineeringServices.map((service, idx) => (
              <div key={idx} className="bg-[#EAF2FF] rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{service.icon}</div>
                <h3 className="text-[#1A1A1A] text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {service.title}
                </h3>
                <button className="text-[#4A90E2] text-xs flex items-center justify-center gap-1 mx-auto" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  عرض التفاصيل
                  <ChevronLeft className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4 - Contracting */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            المقاولات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contractingServices.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] h-32 flex items-center justify-center">
                  <span className="text-6xl">{service.image}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-[#1A1A1A] text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {service.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="flex-1 bg-[#25D366] text-white p-2 rounded-lg flex items-center justify-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="flex-1 bg-[#4A90E2] text-white p-2 rounded-lg flex items-center justify-center gap-1">
                      <MapPin className="w-4 h-4" />
                    </button>
                    <button className="flex-1 bg-[#F2C94C] text-[#1A1A1A] p-2 rounded-lg text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      تعاقد
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5 - Real Estate */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            العقارات
          </h2>
          
          {/* Properties Slider */}
          <div className="mb-4">
            <div className="bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    فيلا فاخرة في دبي
                  </h3>
                  <p className="text-sm opacity-90" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                    المساحة: 500 متر مربع
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    2.5M
                  </p>
                  <p className="text-xs opacity-90">درهم</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>دبي - البرشاء</span>
              </div>
            </div>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-[#EAF2FF] h-32 flex items-center justify-center">
                  <span className="text-5xl">🏠</span>
                </div>
                <div className="p-3">
                  <h4 className="text-[#1A1A1A] text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    فيلا للبيع
                  </h4>
                  <div className="flex items-center justify-between text-xs text-[#1A1A1A]/60 mb-2">
                    <span>300 م²</span>
                    <span style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>1.8M</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="flex-1 bg-[#4A90E2] text-white py-1.5 rounded-lg text-xs">
                      تفاصيل
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6 - Store & Offers */}
        <div className="bg-[#EAF2FF] px-6 py-8 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            المتجر والعروض
          </h2>

          {/* Offers Slider */}
          <div className="bg-gradient-to-r from-[#F2C94C] to-[#4A90E2] rounded-3xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  عرض خاص على مواد البناء
                </h3>
                <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                  خصم حتى 40% لفترة محدودة
                </p>
              </div>
              <div className="text-white text-4xl">🎁</div>
            </div>
          </div>

          {/* Store Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {storeCategories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="text-[#1A1A1A] text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {cat.title}
                </h3>
              </div>
            ))}
          </div>

          <button className="w-full bg-[#4A90E2] text-white py-3 rounded-2xl shadow-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            عرض الكل
          </button>
        </div>

        {/* SECTION 7 - Maintenance & Craftsmen */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الصيانة والحرفيين والورش
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {maintenanceServices.map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 text-center shadow-md">
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-[#1A1A1A] text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {service.title}
                </h3>
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#4A90E2] text-white p-2 rounded-lg">
                    <Phone className="w-4 h-4 mx-auto" />
                  </button>
                  <button className="flex-1 bg-[#25D366] text-white p-2 rounded-lg">
                    <MessageCircle className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8 - Workers */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            العمالة الحرفية
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {workers.map((worker, idx) => (
              <div key={idx} className="bg-[#EAF2FF] rounded-2xl p-4 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-3xl shadow-md">
                  {worker.icon}
                </div>
                <h3 className="text-[#1A1A1A] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {worker.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 9 - Maps */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            الخرائط
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['خريطة المقاولين', 'خريطة الورش', 'خريطة العقارات', 'خريطة المتاجر'].map((map, idx) => (
              <div key={idx} className="min-w-[280px] bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] rounded-2xl p-6 text-white shadow-lg">
                <MapPin className="w-8 h-8 mb-3" />
                <h3 className="text-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  {map}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 10 - Voice Chat Rooms */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            غرف الدردشة الصوتية
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {chatRooms.map((room, idx) => (
              <div key={idx} className="min-w-[200px] bg-white rounded-2xl p-4 text-center shadow-md">
                <div className="w-16 h-16 bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  {room.icon}
                </div>
                <h3 className="text-[#1A1A1A] text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {room.title}
                </h3>
                <button className="w-full bg-[#4A90E2] text-white py-2 rounded-xl text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  انضم الآن
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 11 - VIP Providers */}
        <div className="px-6 mb-6">
          <h2 className="text-[#1A1A1A] text-xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            مزودين VIP
          </h2>
          <div className="bg-gradient-to-br from-white to-[#EAF2FF] rounded-3xl p-6 border-2 border-[#F2C94C] shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4A90E2] to-[#7AB8FF] rounded-full flex items-center justify-center text-4xl shadow-lg">
                👑
              </div>
              <div className="flex-1">
                <h3 className="text-[#1A1A1A] text-lg mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  شركة النخبة للمقاولات
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-[#F2C94C] text-[#F2C94C]" />
                    ))}
                  </div>
                  <span className="text-xs text-[#1A1A1A]/60">5.0</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                  خبرة 15 عام في المقاولات والبناء
                </p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-[#4A90E2] to-[#7AB8FF] text-white py-3 rounded-2xl shadow-lg" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              عرض الملف
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}