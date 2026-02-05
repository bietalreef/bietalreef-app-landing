import { useState } from 'react';
import { ArrowRight, Star, Search, Mic, SlidersHorizontal, Globe } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ServiceSEOHead } from '../SEOHead';

interface ServiceDetailExteriorProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailExterior({ onBack, onOpenSearch }: ServiceDetailExteriorProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [serviceNavTab, setServiceNavTab] = useState<'home' | 'projects' | 'maps' | 'recommend' | 'offers'>('home');

  const seoData = {
    title: 'تصميم خارجي وتنسيق حدائق في الإمارات | مصمم واجهات معتمد | بيت الريف',
    description: 'أفضل خدمات التصميم الخارجي في الإمارات. تصميم واجهات، تنسيق حدائق، مظلات، إنارة خارجية. احجز الآن!',
    serviceId: 'SRV-EXTER-001',
    serviceName: 'التصميم الخارجي',
    serviceType: 'خدمات التصميم الخارجي والحدائق',
    priceRange: '2000 - 100000 د.إ',
    rating: 4.8,
    reviewCount: 567,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: ['تصميم خارجي', 'تنسيق حدائق', 'واجهات منازل', 'مظلات', 'إنارة خارجية', 'بيت الريف'],
    faqs: [{ question: 'ما هي خدمات التصميم الخارجي؟', answer: 'تصميم واجهات، تنسيق حدائق، مظلات، نوافير، إنارة خارجية، أرضيات وممرات.' }],
    providerCount: 45,
    projectCount: 892
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir="rtl">
      <ServiceSEOHead {...seoData} />
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F5EEE1] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0 w-10 h-10"><BietAlreefLogo /></div>
            <button onClick={() => onOpenSearch?.()} className="flex-1 flex items-center gap-2 bg-[#F5EEE1] hover:bg-[#EAE3D6] rounded-full px-4 py-2.5 transition-colors max-w-md">
              <Search className="w-4 h-4 text-[#1F3D2B]/60" /><span className="text-sm text-[#1F3D2B]/60">ابحث هنا...</span>
              <div className="mr-auto flex items-center gap-2"><Mic className="w-4 h-4 text-[#2AA676]" /><SlidersHorizontal className="w-4 h-4 text-[#2AA676]" /></div>
            </button>
            <button className="flex-shrink-0 p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors"><Globe className="w-5 h-5 text-[#1F3D2B]" /></button>
          </div>
        </div>
      </div>

      <div className="pt-16">
        <div className="container mx-auto px-4 pt-4">
          <button onClick={onBack} className="inline-flex items-center gap-2 bg-gradient-to-l from-[#2AA676] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">
            <ArrowRight className="w-5 h-5" /><span>Back to Home</span>
          </button>
        </div>

        <div className="bg-white border-b border-[#F5EEE1] mt-4">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <button onClick={onBack} className="text-[#2AA676] hover:underline">الرئيسية</button><span className="text-gray-400">/</span>
              <button onClick={onBack} className="text-[#2AA676] hover:underline">الخدمات</button><span className="text-gray-400">/</span>
              <span className="text-[#1F3D2B] font-medium">التصميم الخارجي</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-l from-[#4CAF50]/10 to-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-3">التصميم الخارجي والحدائق | Exterior Design</h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">تصميم واجهات منازل، تنسيق حدائق، مظلات، نوافير، إنارة خارجية بأعلى جودة.</p>
              </div>
              <div className="text-6xl">🌳</div>
            </div>
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />)}</div>
                <span className="text-[#1F3D2B] font-semibold">4.8</span><span className="text-gray-500">(567 تقييم)</span>
              </div>
              <div className="bg-[#4CAF50] text-white px-4 py-1 rounded-full text-sm font-medium">معتمد ✓</div>
            </div>
            <button className="bg-gradient-to-l from-[#4CAF50] to-[#1F3D2B] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow">احصل على عرض سعر</button>
          </div>
        </div>

        <div className="bg-white border-b border-[#F5EEE1] sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-0">
              {(['details', 'providers', 'reviews'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 font-semibold transition-all ${activeTab === tab ? 'text-[#4CAF50] border-b-4 border-[#4CAF50]' : 'text-gray-500'}`}>
                  {tab === 'details' && 'التفاصيل'}{tab === 'providers' && 'المزودون'}{tab === 'reviews' && 'التقييمات'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {activeTab === 'details' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1F3D2B] mb-4">خدمات التصميم الخارجي</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['تصميم واجهات المنازل', 'تنسيق الحدائق والمسطحات', 'مظلات وبرجولات', 'نوافير وشلالات', 'إنارة خارجية', 'أرضيات وممرات', 'جلسات خارجية', 'نظام ري ذكي', 'زراعة أشجار ونباتات', 'ديكورات حجرية', 'حمامات سباحة', 'صيانة دورية'].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#4CAF50]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#4CAF50] text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'providers' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><p className="text-gray-600">45 مصمم معتمد</p></div>}
          {activeTab === 'reviews' && <div className="bg-white rounded-xl p-6 shadow-sm text-center"><div className="text-5xl font-bold text-[#4CAF50] mb-2">4.8</div><p className="text-sm text-gray-500">567 تقييم</p></div>}
        </div>

        <div className="bg-gradient-to-l from-[#4CAF50] to-[#1F3D2B] py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">حدائق أحلامك تبدأ هنا</h2>
            <p className="text-white/90 mb-6 text-lg">احصل على استشارة مجانية</p>
            <button className="bg-white text-[#4CAF50] px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-shadow">احجز الآن</button>
          </div>
        </div>
      </div>

    </div>
  );
}
