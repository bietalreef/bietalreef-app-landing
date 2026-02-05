import { useState } from 'react';
import { ArrowRight, Star, Search, Mic, SlidersHorizontal, Globe } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ServiceSEOHead } from '../SEOHead';

interface ServiceDetailInteriorProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailInterior({ onBack, onOpenSearch }: ServiceDetailInteriorProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [serviceNavTab, setServiceNavTab] = useState<'home' | 'projects' | 'maps' | 'recommend' | 'offers'>('home');

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  const seoData = {
    title: 'تصميم داخلي وديكور في الإمارات | مصمم ديكور معتمد | بيت الريف - أفضل مصممين دبي أبوظبي',
    description: 'أفضل خدمات التصميم الداخلي والديكور في الإمارات. تصميم فلل، شقق، مكاتب، محلات. مصممين معتمدين بأفضل الأسعار. احجز استشارة مجانية!',
    serviceId: 'SRV-INTER-001',
    serviceName: 'التصميم الداخلي والديكور',
    serviceType: 'خدمات التصميم الداخلي والديكور',
    priceRange: '1000 - 50000 د.إ',
    rating: 4.9,
    reviewCount: 856,
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: ['تصميم داخلي الإمارات', 'ديكور دبي', 'مصمم داخلي', 'تصميم فلل', 'ديكور منازل', 'بيت الريف ديكور'],
    faqs: [
      { question: 'ما هي خدمات التصميم الداخلي؟', answer: 'نوفر تصميم شامل للمنازل والفلل والمكاتب، اختيار الألوان والمواد، تصميم 3D، إشراف على التنفيذ، وتنسيق الأثاث والإضاءة.' },
      { question: 'كم تكلفة تصميم منزل؟', answer: 'تبدأ من 5000 درهم لشقة صغيرة، 15000-30000 لفيلا متوسطة، وقد تصل لـ 100000+ للمشاريع الفاخرة.' }
    ],
    providerCount: 78,
    projectCount: 1234
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir="rtl">
      <ServiceSEOHead {...seoData} />
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#F5EEE1] shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0 w-10 h-10"><BietAlreefLogo /></div>
            <button onClick={handleSearchClick} className="flex-1 flex items-center gap-2 bg-[#F5EEE1] hover:bg-[#EAE3D6] rounded-full px-4 py-2.5 transition-colors max-w-md">
              <Search className="w-4 h-4 text-[#1F3D2B]/60" />
              <span className="text-sm text-[#1F3D2B]/60">ابحث هنا...</span>
              <div className="mr-auto flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#2AA676]" />
                <SlidersHorizontal className="w-4 h-4 text-[#2AA676]" />
              </div>
            </button>
            <button className="flex-shrink-0 p-2 hover:bg-[#F5EEE1] rounded-lg transition-colors">
              <Globe className="w-5 h-5 text-[#1F3D2B]" />
            </button>
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
              <button onClick={onBack} className="text-[#2AA676] hover:underline">الرئيسية</button>
              <span className="text-gray-400">/</span>
              <button onClick={onBack} className="text-[#2AA676] hover:underline">الخدمات</button>
              <span className="text-gray-400">/</span>
              <span className="text-[#1F3D2B] font-medium">التصميم الداخلي</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-l from-[#9C27B0]/10 to-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1F3D2B] mb-3">
                  التصميم الداخلي والديكور | Interior Design
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
                  احصل على أفضل خدمات التصميم الداخلي في الإمارات. مصممين محترفين لتصميم فلل، شقق، مكاتب بأعلى جودة.
                </p>
              </div>
              <div className="text-6xl">🏠</div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />)}</div>
                <span className="text-[#1F3D2B] font-semibold">4.9</span>
                <span className="text-gray-500">(856 تقييم)</span>
              </div>
              <div className="bg-[#9C27B0] text-white px-4 py-1 rounded-full text-sm font-medium">معتمد ✓</div>
            </div>

            <button className="bg-gradient-to-l from-[#9C27B0] to-[#1F3D2B] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow">
              استشارة مجانية
            </button>
          </div>
        </div>

        <div className="bg-white border-b border-[#F5EEE1] sticky top-16 z-30">
          <div className="container mx-auto px-4">
            <div className="flex gap-0">
              {(['details', 'providers', 'reviews'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 font-semibold transition-all relative ${activeTab === tab ? 'text-[#9C27B0] border-b-4 border-[#9C27B0]' : 'text-gray-500 hover:text-[#1F3D2B]'}`}>
                  {tab === 'details' && 'التفاصيل'}{tab === 'providers' && 'المزودون'}{tab === 'reviews' && 'التقييمات'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {activeTab === 'details' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1F3D2B] mb-4">خدمات التصميم الداخلي</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {['تصميم فلل وشقق', 'تصميم مكاتب ومحلات', 'اختيار الألوان والمواد', 'تصميم 3D واقعي', 'تنسيق الأثاث', 'تصميم الإضاءة', 'إشراف على التنفيذ', 'استشارات ديكور', 'تصميم مودرن وكلاسيكي', 'تجديد المنازل', 'ديكورات جبس بورد', 'أعمال الدهان والأرضيات'].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#9C27B0]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#9C27B0] text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'providers' && (<div className="bg-white rounded-xl p-6 shadow-sm text-center"><p className="text-gray-600">78 مصمم معتمد</p></div>)}
          {activeTab === 'reviews' && (<div className="bg-white rounded-xl p-6 shadow-sm text-center"><div className="text-5xl font-bold text-[#9C27B0] mb-2">4.9</div><p className="text-sm text-gray-500">856 تقييم</p></div>)}
        </div>

        <div className="bg-gradient-to-l from-[#9C27B0] to-[#1F3D2B] py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">حوّل منزلك لتحفة فنية</h2>
            <p className="text-white/90 mb-6 text-lg">استشارة مجانية مع أفضل المصممين</p>
            <button className="bg-white text-[#9C27B0] px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-shadow">احجز استشارة</button>
          </div>
        </div>
      </div>

    </div>
  );
}
