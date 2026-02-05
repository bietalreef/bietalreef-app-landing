import { useState } from 'react';
import { ArrowRight, Star, Search, Mic, SlidersHorizontal, Globe, ChevronLeft, Heart, CheckCircle, Zap, Users, Sparkles, Battery, Lightbulb, BookOpen, Info, Target, Share2, Send, AlertTriangle, MessageCircle, MapPin, Copy, Check } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ServiceSEOHead } from '../SEOHead';

interface ServiceDetailElectricityProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailElectricity({ onBack, onOpenSearch }: ServiceDetailElectricityProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [serviceNavTab, setServiceNavTab] = useState<'home' | 'projects' | 'maps' | 'recommend' | 'offers'>('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, name: '', comment: '' });
  const [newComplaint, setNewComplaint] = useState({ 
    name: '', 
    userId: '', 
    complaintType: 'provider', 
    subject: '', 
    message: '' 
  });

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  // SEO Data
  const seoData = {
    title: 'خدمات الكهرباء في الإمارات | كهربائي معتمد | بيت الريف - أفضل مزودي الكهرباء دبي أبوظبي الشارقة',
    description: 'أفضل خدمات الكهرباء في الإمارات العربية المتحدة. 342 كهربائي معتمد في دبي، أبوظبي، الشارقة. تمديدات كهربائية، إصلاح أعطال، صيانة دورية، تركيب إنارة. خدمة 24/7. أسعار منافسة 120-250 درهم. احجز الآن!',
    serviceId: 'SRV-ELEC-001',
    serviceName: 'خدمات الكهرباء',
    serviceType: 'خدمات الكهرباء والتمديدات الكهربائية',
    priceRange: '120 - 250 د.إ',
    rating: 4.9,
    reviewCount: 1247,
    imageUrl: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: [
      'كهربائي في الإمارات',
      'كهربائي دبي',
      'كهربائي أبوظبي',
      'كهربائي الشارقة',
      'تمديدات كهربائية',
      'إصلاح كهرباء',
      'صيانة كهرباء',
      'كهربائي معتمد',
      'فني كهرباء',
      'خدمات كهرباء منزلية',
      'كهربائي طوارئ',
      'تركيب إنارة',
      'كهربائي 24 ساعة',
      'بيت الريف كهرباء',
      'أفضل كهربائي الإمارات'
    ],
    faqs: [
      {
        question: 'كم تكلفة تركيب نقطة كهرباء في الإمارات؟',
        answer: 'تكلفة تركيب نقطة كهربائية واحدة تتراوح من 80-150 درهم إماراتي حسب نوع النقطة والموقع. تركيب مفتاح عادي 80-100 درهم، بينما المفاتيح الذكية أو المخصصة قد تكلف 120-150 درهم.'
      },
      {
        question: 'هل خدمة الكهرباء متوفرة في جميع إمارات الدولة؟',
        answer: 'نعم! خدمات الكهرباء متوفرة في جميع إمارات الدولة: دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، وأم القيوين. لدينا 342 كهربائي معتمد موزعين في كافة المناطق.'
      },
      {
        question: 'هل تتوفر خدمة كهربائي طوارئ 24 ساعة؟',
        answer: 'نعم! نوفر خدمة كهربائي طوارئ على مدار الساعة طيلة أيام الأسبوع. في حالات الطوارئ، يصل الفني خلال 30-60 دقيقة. خدمة الطوارئ متاحة لحالات انقطاع الكهرباء، الأعطال الخطرة، والماس الكهربائي.'
      },
      {
        question: 'كم يستغرق إصلاح عطل كهربائي؟',
        answer: 'مدة الإصلاح تعتمد على نوع العطل. الأعطال البسيطة (مفتاح تالف، فيوز محروق) تستغرق 15-30 دقيقة. الأعطال المتوسطة (دائرة كهربائية) 1-2 ساعة. الأعطال الكبيرة (إعادة توصيل لوحة) قد تحتاج 3-5 ساعات.'
      },
      {
        question: 'هل الكهربائيون معتمدون ومرخصون؟',
        answer: 'جميع الكهربائيين في منصة بيت الريف معتمدون ومرخصون من الجهات المختصة في الإمارات. نتأكد من حصولهم على الشهادات المهنية اللازمة والخبرة العملية. جميع الأعمال مضمونة وفق أعلى معايير السلامة.'
      }
    ],
    providerCount: 342,
    projectCount: 6789
  };
  
  const topProviders = [
    {
      id: 'BR-001234',
      name: 'محمد الكهربائي',
      rating: 4.9,
      reviews: 287,
      price: '180',
      distance: '1.5 كم',
      availability: 'online',
      responseTime: '5 دقائق',
      projectsCount: 234,
      image: 'https://i.pravatar.cc/400?img=12',
      specialties: ['تمديدات', 'إصلاح', 'صيانة']
    },
    {
      id: 'BR-002456',
      name: 'شركة النور الكهربائية',
      rating: 4.8,
      reviews: 412,
      price: '200',
      distance: '2.8 كم',
      availability: 'online',
      responseTime: '10 دقائق',
      projectsCount: 567,
      image: 'https://i.pravatar.cc/400?img=33',
      specialties: ['تركيبات', 'أعطال', 'تجديد']
    },
    {
      id: 'BR-003789',
      name: 'خالد المهندس',
      rating: 5.0,
      reviews: 198,
      price: '220',
      distance: '3.2 كم',
      availability: 'busy',
      responseTime: '20 دقيقة',
      projectsCount: 189,
      image: 'https://i.pravatar.cc/400?img=51',
      specialties: ['لوحات', 'تمديدات', 'ذكي']
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'سالم الشامسي',
      userId: 'BR-234567',
      rating: 5,
      date: 'منذ يومين',
      comment: 'كهربائي محترف جداً! حل مشكلة الكهرباء في البيت بسرعة وكفاءة. الشغل نظيف والأسعار معقولة.',
      verified: true,
      helpful: 34
    },
    {
      id: 2,
      name: 'منى المنصوري',
      userId: 'BR-345678',
      rating: 5,
      date: 'منذ 5 أيام',
      comment: 'ركبوا لي إضاءة LED في كل البيت. الشغل ممتاز والفريق محترم ونظيف.',
      verified: true,
      helpful: 28
    },
    {
      id: 3,
      name: 'أحمد العلي',
      userId: 'BR-456789',
      rating: 4,
      date: 'منذ أسبوع',
      comment: 'خدمة جيدة، لكن تأخروا قليلاً عن الموعد المحدد.',
      verified: false,
      helpful: 15
    }
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#4A90E2]';
      case 'busy': return 'bg-[#F2994A]';
      default: return 'bg-[#6B7280]';
    }
  };

  const getAvailabilityLabel = (status: string) => {
    switch (status) {
      case 'online': return 'متاح الآن';
      case 'busy': return 'مشغول';
      default: return 'غير متاح';
    }
  };

  const handleSubmitReview = () => {
    console.log('تم إرسال التقييم:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, name: '', comment: '' });
  };

  const handleSubmitComplaint = () => {
    console.log('تم إرسال الشكوى:', newComplaint);
    setShowComplaintForm(false);
    setNewComplaint({ name: '', userId: '', complaintType: 'provider', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir="rtl">
      
      {/* SEO Head */}
      <ServiceSEOHead {...seoData} />
      
      {/* HERO SECTION */}
      <div className="relative h-[320px]">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
            alt="خدمات الكهرباء"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        <button 
          onClick={onBack}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
        </button>

        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#4A90E2]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                428 مزود
              </span>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#4A90E2]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                6,891 مشروع
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-20">
          <div className="bg-white rounded-[28px] p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
                  خدمات الكهرباء
                </h2>
                <p className="text-[#4A90E2] text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  ID: SRV-ELEC-001
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#56CCF2] text-[#56CCF2]" />
                    <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>4.8</span>
                    <span className="text-[#1A1A1A]/40 text-xs">(1,248)</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-3 py-1 rounded-full text-xs shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    170 - 250 د.إ
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-white border-2 border-[#F5EEE1] rounded-[14px] flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95">
                <Share2 className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 bg-white border-2 border-[#F5EEE1] rounded-[14px] flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-[#56CCF2] text-[#56CCF2]' : 'text-[#1A1A1A]'}`} />
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-3 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}>
                <Sparkles className="w-4.5 h-4.5" />
                <span>احجز الآن</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#F5EEE1] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'details'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            تفاصيل الخدمة
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'providers'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            المزودون
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 px-4 rounded-[18px] transition-all ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white shadow-md'
                : 'bg-[#F5EEE1] text-[#1A1A1A] hover:bg-[#E8DFD0]'
            }`}
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}
          >
            التقييمات
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 py-6">
        
        {/* TAB 1: تفاصيل الخدمة (الشرح + التوعية + الإرشاد) */}
        {activeTab === 'details' && (
          <>
            {/* القسم 1: الشرح */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[16px] flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  📚 الشرح والتعريف
                </h2>
              </div>

              {/* ما هي الخدمة */}
              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  ما هي خدمات الكهرباء؟
                </h3>
                <p className="text-[#1A1A1A]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '15px', lineHeight: 1.8 }}>
                  خدمات الكهرباء تشمل جميع الأعمال المتعلقة بالأنظمة الكهربائية في المباني السكنية والتجارية. من التمديدات الأساسية إلى الصيانة الدورية والإصلاحات الطارئة، نحن نضمن سلامة وكفاءة النظام الكهربائي الخاص بك.
                </p>
                <div className="bg-gradient-to-br from-[#4A90E2]/10 to-[#56CCF2]/10 rounded-[16px] p-4 border-2 border-[#4A90E2]/20">
                  <p className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                    💡 <strong>هل تعلم؟</strong> 80% من حوادث الحرائق المنزلية تحدث بسبب مشاكل كهربائية يمكن تفاديها بالصيانة الدورية.
                  </p>
                </div>
              </div>

              {/* أنواع الخدمات */}
              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  أنواع الخدمات الكهربائية
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Lightbulb,
                      title: 'التمديدات الكهربائية',
                      desc: 'تمديد الأسلاك والكابلات، تركيب اللوحات الكهربائية، توزيع الدوائر الكهربائية، وتركيب المفاتيح والمخارج.',
                      tags: ['لوحات التوزيع', 'الأسلاك والكابلات', 'المفاتيح والمخارج']
                    },
                    {
                      icon: CheckCircle,
                      title: 'الصيانة والإصلاح',
                      desc: 'فحص دوري للنظام الكهربائي، إصلاح الأعطال، استبدال القطع التالفة، معالجة مشاكل التيار الكهربائي.',
                      tags: ['فحص دوري', 'إصلاح الأعطال', 'استبدال القطع']
                    },
                    {
                      icon: Battery,
                      title: 'الأنظمة الذكية',
                      desc: 'تركيب أنظمة الإضاءة الذكية، مفاتيح التحكم عن بعد، أنظمة توفير الطاقة، ودمج الأنظمة الكهربائية.',
                      tags: ['إضاءة ذكية', 'توفير الطاقة', 'التحكم عن بعد']
                    }
                  ].map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 border-2 border-[#F5EEE1]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[12px] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                              {service.title}
                            </h4>
                            <p className="text-[#1A1A1A]/70 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                              {service.desc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {service.tags.map((tag, i) => (
                                <span key={i} className="bg-[#4A90E2]/10 text-[#4A90E2] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* القسم 2: التوعية */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#F2994A] to-[#EB5757] rounded-[16px] flex items-center justify-center shadow-lg">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  ⚠️ التوعية والسلامة
                </h2>
              </div>

              {/* مؤشرات الخطر */}
              <div className="bg-gradient-to-br from-[#F2994A]/10 to-[#EB5757]/10 rounded-[24px] p-6 shadow-md mb-4 border-2 border-[#F2994A]/30">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  مؤشرات الخطر - اتصل فوراً!
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '🔥', title: 'رائحة احتراق', desc: 'إذا شممت رائحة احتراق أو دخان من المخارج أو اللوحة الكهربائية' },
                    { icon: '⚡', title: 'شرارات كهربائية', desc: 'ظهور شرارات أو أصوات طقطقة من المفاتيح أو المخارج' },
                    { icon: '🌡️', title: 'حرارة زائدة', desc: 'سخونة المفاتيح أو اللوحات الكهربائية أو الأسلاك' },
                    { icon: '💥', title: 'قطع متكرر', desc: 'انقطاع الكهرباء المتكرر أو سقوط القواطع باستمرار' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[16px] p-4 border-2 border-[#F2994A]/20">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-[#EB5757] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                            {item.title}
                          </h4>
                          <p className="text-[#1A1A1A]/70 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500 }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* نصائح السلامة */}
              <div className="bg-white rounded-[24px] p-6 shadow-md">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  نصائح السلامة الكهربائية
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '🔌', text: 'لا تحمّل المخارج زيادة - وزع الأحمال على دوائر مختلفة' },
                    { icon: '🔍', text: 'افحص الأسلاك بانتظام واستبدل التالف منها فوراً' },
                    { icon: '💧', text: 'الماء والكهرباء لا يجتمعان - جفف يديك قبل اللمس' },
                    { icon: '🛡️', text: 'استخدم قواطع حماية (Circuit Breakers) أصلية' },
                    { icon: '👨‍🔧', text: 'اعتمد على كهربائيين معتمدين ومرخصين فقط' }
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#F5EEE1]/50 to-transparent rounded-[16px]">
                      <span className="text-2xl">{tip.icon}</span>
                      <p className="text-[#1A1A1A] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* القسم 3: الإرشاد */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-[16px] flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  🎯 الإرشاد والدليل
                </h2>
              </div>

              {/* كيف تطلب الخدمة */}
              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  كيف تطلب الخدمة؟
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'اضغط "احجز الآن" واختر نوع الخدمة المطلوبة', time: '30 ث' },
                    { step: '2', text: 'تصفح قائمة المزودين واختر الأنسب لك', time: '2 د' },
                    { step: '3', text: 'حدد الموعد المناسب أو اطلب زيارة طارئة', time: '1 د' },
                    { step: '4', text: 'أكد الطلب وانتظر قبول المزود', time: '1 د' },
                    { step: '5', text: 'استقبل المزود في الموعد المحدد', time: 'حسب الموعد' },
                    { step: '6', text: 'قيّم الخدمة بعد الانتهاء', time: '1 د' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F5EEE1] to-white rounded-[16px] border-2 border-[#F5EEE1]">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                          {item.step}
                        </span>
                      </div>
                      <p className="flex-1 text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                        {item.text}
                      </p>
                      <span className="bg-[#4A90E2]/10 text-[#4A90E2] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* الأسئلة الشائعة */}
              <div className="bg-white rounded-[24px] p-6 shadow-md">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  الأسئلة الشائعة
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      q: 'كم يستغرق فحص الكهرباء الشامل؟',
                      a: 'الفحص الشامل للمنزل المتوسط يستغرق من 2-3 ساعات. يشمل فحص اللوحة الكهربائية، المفاتيح، المخارج، والأسلاك.'
                    },
                    {
                      q: 'هل السعر يشمل قطع الغيار؟',
                      a: 'السعر المعروض هو لأجر العمل والمعاينة فقط. قطع الغيار والمواد تحتسب بشكل منفصل حسب النوع والكمية.'
                    },
                    {
                      q: 'هل تقدمون خدمة الطوارئ؟',
                      a: 'نعم! نوفر خدمة طوارئ كهربائية على مدار الساعة. الاستجابة خلال 30 دقيقة في حالات الطوارئ الحرجة.'
                    },
                    {
                      q: 'ما هي مدة الضمان؟',
                      a: 'نقدم ضمان سنة كاملة على جميع أعمال الكهرباء وسنتين على قطع الغيار الأصلية.'
                    }
                  ].map((faq, idx) => (
                    <details key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 shadow-sm group border-2 border-[#F5EEE1]">
                      <summary className="cursor-pointer text-[#1A1A1A] list-none flex items-center justify-between" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                        <span className="flex-1">{faq.q}</span>
                        <ChevronLeft className="w-5 h-5 transform group-open:rotate-90 transition-transform text-[#4A90E2]" />
                      </summary>
                      <p className="mt-3 text-[#1A1A1A]/70 pr-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: المزودون */}
        {activeTab === 'providers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
                أفضل مزودي الكهرباء
              </h3>
              <span className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-4 py-2 rounded-full text-xs shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {topProviders.length} مزود
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {topProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="relative bg-white rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl transition-all border-2 border-[#F5EEE1]"
                >
                  <div className="flex">
                    <div className="flex flex-col w-[140px] flex-shrink-0">
                      <div className="relative w-[140px] h-[120px] overflow-hidden">
                        <ImageWithFallback 
                          src={provider.image}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-2 left-2 w-3 h-3 ${getAvailabilityColor(provider.availability)} rounded-full shadow-lg animate-pulse`} />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                            <p className="text-white text-xs text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                              {getAvailabilityLabel(provider.availability)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-2 pt-2">
                        <button className="w-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-2 py-2 rounded-[14px] text-xs shadow-md hover:shadow-lg transition-all active:scale-95" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                          عرض التفاصيل
                        </button>
                      </div>

                      <div className="px-2 pt-1.5 pb-2">
                        <div className="w-full bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[14px] py-2 px-2 shadow-md flex items-center justify-center gap-1">
                          <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: '18px', lineHeight: 1 }}>
                            {provider.price}
                          </p>
                          <p className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '10px' }}>
                            د.إ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-4 flex flex-col">
                      <h4 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                        {provider.name}
                      </h4>
                      <p className="text-[#4A90E2] text-xs mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        ID: {provider.id}
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#56CCF2] text-[#56CCF2]" />
                          <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                            {provider.rating}
                          </span>
                          <span className="text-[#1A1A1A]/40 text-xs">({provider.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#4A90E2]" />
                          <span className="text-[#1A1A1A]/70 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {provider.distance}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-auto">
                        <button className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-3 py-2 rounded-[12px] text-xs shadow-md hover:shadow-lg transition-all active:scale-95" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                          طلب الآن
                        </button>
                        <button className="w-9 h-9 bg-[#25D366] rounded-[12px] flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95">
                          <MessageCircle className="w-4.5 h-4.5 text-white" />
                        </button>
                        <button className="w-9 h-9 bg-white border-2 border-[#F5EEE1] rounded-[12px] flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95">
                          <Share2 className="w-4.5 h-4.5 text-[#1A1A1A]/50" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: التقييمات + فورم إضافة تقييم + فورم الشكاوى */}
        {activeTab === 'reviews' && (
          <>
            {/* أزرار التقييم والشكاوى */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                  setShowComplaintForm(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white py-4 rounded-[20px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}
              >
                <Star className="w-5 h-5" />
                <span>{showReviewForm ? 'إلغاء' : 'أضف تقييمك'}</span>
              </button>
              <button
                onClick={() => {
                  setShowComplaintForm(!showComplaintForm);
                  setShowReviewForm(false);
                }}
                className="flex-1 bg-gradient-to-r from-[#EB5757] to-[#F2994A] text-white py-4 rounded-[20px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}
              >
                <AlertTriangle className="w-5 h-5" />
                <span>{showComplaintForm ? 'إلغاء' : 'شكوى أو مقترح'}</span>
              </button>
            </div>

            {/* فورم إضافة تقييم */}
            {showReviewForm && (
              <div className="bg-white rounded-[24px] p-6 shadow-lg mb-6 border-2 border-[#4A90E2]">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  شارك تجربتك
                </h3>
                
                {/* التقييم بالنجوم */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    تقييمك
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-all active:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= newReview.rating ? 'fill-[#56CCF2] text-[#56CCF2]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`}
                        />
                      </button>
                    ))}
                    <span className="mr-3 text-[#4A90E2]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '18px' }}>
                      {newReview.rating}/5
                    </span>
                  </div>
                </div>

                {/* الاسم */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#4A90E2] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                {/* التعليق */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    تعليقك
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="شاركنا تجربتك مع هذه الخدمة..."
                    rows={4}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#4A90E2] transition-all resize-none"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: 1.7 }}
                  />
                </div>

                {/* زر الإرسال */}
                <button
                  onClick={handleSubmitReview}
                  disabled={!newReview.name || !newReview.comment}
                  className="w-full bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
                >
                  <Send className="w-5 h-5" />
                  <span>إرسال التقييم</span>
                </button>
              </div>
            )}

            {/* فورم الشكاوى والمقترحات */}
            {showComplaintForm && (
              <div className="bg-white rounded-[24px] p-6 shadow-lg mb-6 border-2 border-[#EB5757]">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  تقديم شكوى أو مقترح
                </h3>
                
                {/* الاسم */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={newComplaint.name}
                    onChange={(e) => setNewComplaint({ ...newComplaint, name: e.target.value })}
                    placeholder="أدخل اسمك"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                {/* رقم المستخدم ID */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    رقم المستخدم (User ID)
                  </label>
                  <input
                    type="text"
                    value={newComplaint.userId}
                    onChange={(e) => setNewComplaint({ ...newComplaint, userId: e.target.value })}
                    placeholder="مثال: BR-123456"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                {/* نوع الشكوى */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    نوع البلاغ
                  </label>
                  <select
                    value={newComplaint.complaintType}
                    onChange={(e) => setNewComplaint({ ...newComplaint, complaintType: e.target.value })}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  >
                    <option value="provider">شكوى عن مزود خدمة</option>
                    <option value="service">شكوى عن الخدمة</option>
                    <option value="suggestion">مقترح أو تحسين</option>
                  </select>
                </div>

                {/* الموضوع */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    الموضوع
                  </label>
                  <input
                    type="text"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                    placeholder="عنوان الشكوى أو المقترح"
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px' }}
                  />
                </div>

                {/* الرسالة */}
                <div className="mb-4">
                  <label className="text-[#1A1A1A] mb-2 block" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                    التفاصيل
                  </label>
                  <textarea
                    value={newComplaint.message}
                    onChange={(e) => setNewComplaint({ ...newComplaint, message: e.target.value })}
                    placeholder="اشرح لنا بالتفصيل..."
                    rows={5}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all resize-none"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: 1.7 }}
                  />
                </div>

                {/* زر الإرسال */}
                <button
                  onClick={handleSubmitComplaint}
                  disabled={!newComplaint.name || !newComplaint.userId || !newComplaint.subject || !newComplaint.message}
                  className="w-full bg-gradient-to-r from-[#EB5757] to-[#F2994A] text-white py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
                >
                  <Send className="w-5 h-5" />
                  <span>إرسال البلاغ</span>
                </button>
              </div>
            )}

            {/* ملخص التقييمات */}
            {!showReviewForm && !showComplaintForm && (
              <>
                <div className="bg-white rounded-[24px] p-6 shadow-md mb-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '48px', lineHeight: 1 }}>
                        4.8
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'fill-[#56CCF2] text-[#56CCF2]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`} />
                        ))}
                      </div>
                      <p className="text-[#1A1A1A]/60 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        1,248 تقييم
                      </p>
                    </div>
                    <div className="flex-1">
                      {[5,4,3,2,1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2 mb-2">
                          <span className="text-[#1A1A1A] text-sm w-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {rating}
                          </span>
                          <div className="flex-1 h-2 bg-[#F5EEE1] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] transition-all"
                              style={{ width: rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : '2%' }}
                            />
                          </div>
                          <span className="text-[#1A1A1A]/60 text-xs w-10" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {rating === 5 ? '78%' : rating === 4 ? '15%' : rating === 3 ? '5%' : '2%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* قائمة التقييمات */}
                <div className="space-y-4">
                  <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                    آراء العملاء
                  </h3>
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-[24px] p-5 shadow-md">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                              {review.name}
                            </h4>
                            {review.verified && (
                              <div className="w-5 h-5 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-[#4A90E2] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            ID: {review.userId}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-[#56CCF2] text-[#56CCF2]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`} />
                            ))}
                          </div>
                          <p className="text-[#1A1A1A]/50 text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <p className="text-[#1A1A1A]/80 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                        {review.comment}
                      </p>
                      <button className="text-[#4A90E2] text-sm flex items-center gap-1 hover:text-[#56CCF2] transition-colors" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        مفيد ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>

    </div>
  );
}