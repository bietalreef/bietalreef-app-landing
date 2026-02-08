import { useState } from 'react';
import { Star, Heart, CheckCircle, Users, Sparkles, Building2, BookOpen, Info, Target, ChevronLeft, Share2, Send, AlertTriangle, MessageCircle, MapPin, Copy, Check, Hammer, Droplet } from 'lucide-react';
import { BietAlreefLogo } from '../BietAlreefLogo';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ServiceSEOHead } from '../SEOHead';
import { IDCopyBox } from './IDCopyBox';
import { ProvidersTabContent } from './ProviderProfileCard';
import { PlatformShowcaseBanner } from './PlatformShowcaseBanner';
import { Icon3D, SERVICE_ICONS } from '../ui/Icon3D';

interface ServiceDetailConstructionProps {
  onBack: () => void;
  onOpenSearch?: () => void;
}

export function ServiceDetailConstruction({ onBack, onOpenSearch }: ServiceDetailConstructionProps) {
  // ✅ PROOF: Construction page updated - Version 3.0
  console.log("🏗️ Construction Service - UPDATED v3.0 - " + new Date().toISOString());
  
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');
  const [serviceNavTab, setServiceNavTab] = useState<'home' | 'projects' | 'maps' | 'recommend' | 'offers'>('home');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
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

  const handleCopyId = () => {
    navigator.clipboard.writeText('SRV-CONST-001');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // SEO Data
  const seoData = {
    title: 'مقاولات البناء في الإمارات | مقاول معتمد | بيت الريف - بناء فلل وعمارات دبي أبوظبي الشارقة',
    description: 'أفضل خدمات مقاولات البناء في الإمارات. بناء فلل، عمارات سكنية وتجارية، توسعات، ترميمات. 456 مقاول معتمد. أعلى جودة وأفضل أسعار. احجز الآن!',
    serviceId: 'SRV-CONST-001',
    serviceName: 'مقاولات البناء',
    serviceType: 'خدمات مقاولات البناء والإنشاءات',
    priceRange: '5,000 - 15,000 د.إ',
    rating: 4.9,
    reviewCount: 2847,
    imageUrl: 'https://images.unsplash.com/photo-1762536859942-8076505f7c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    keywords: [
      'مقاولات بناء الإمارات',
      'مقاول بناء دبي',
      'مقاول بناء أبوظبي',
      'بناء فلل الإمارات',
      'بناء عمارات دبي',
      'مقاولات إنشاءات',
      'مقاول معتمد',
      'بناء فيلا',
      'ترميم مباني',
      'توسعة منزل',
      'بيت الريف مقاولات',
      'أفضل مقاول الإمارات'
    ],
    faqs: [
      {
        question: 'ما هي خدمات المقاولات المتوفرة؟',
        answer: 'نوفر جميع خدمات المقاولات: بناء فلل، عمارات سكنية وتجارية، توسعات وملاحق، ترميمات شاملة، أعمال الهيكل الإنشائي، التشطيبات الكاملة، مع إشراف هندسي واستخراج تراخيص.'
      },
      {
        question: 'كم تكلفة بناء فيلا؟',
        answer: 'التكلفة تعتمد على المساحة والتشطيبات. بشكل عام: فيلا صغيرة (200م²) تبدأ من 800,000 درهم، فيلا متوسطة (300م²) من 1,200,000 درهم، فيلا كبيرة (500م²) من 2,000,000 درهم. نقدم عروض أسعار مفصلة بعد المعاينة.'
      },
      {
        question: 'هل تقدمون التصاميم الهندسية؟',
        answer: 'نعم، نوفر خدمة التصميم الهندسي المعماري والإنشائي، رسومات تنفيذية، تصاميم ثلاثية الأبعاد، واستخراج جميع التراخيص والموافقات اللازمة.'
      },
      {
        question: 'كم مدة بناء فيلا كاملة؟',
        answer: 'فيلا صغيرة: 6-8 أشهر، فيلا متوسطة: 8-12 شهر، فيلا كبيرة أو عمارة: 12-18 شهر. المدة تعتمد على التعقيد والتشطيبات المطلوبة.'
      },
      {
        question: 'هل يوجد ضمان على الأعمال؟',
        answer: 'نعم، نقدم ضمان شامل لمدة 5 سنوات على الهيكل الإنشائي، وسنة على التشطيبات، مع صيانة دورية مجانية خلال فترة الضمان.'
      }
    ],
    providerCount: 456,
    projectCount: 8934
  };
  
  const topProviders = [
    {
      id: 'BR-CONST-001',
      name: 'مؤسسة البناء المتقدم',
      rating: 4.9,
      reviews: 567,
      price: '8,500',
      distance: '2.1 كم',
      availability: 'online',
      responseTime: '10 دقائق',
      projectsCount: 234,
      image: 'https://images.unsplash.com/photo-1758876734777-dcc6981f3671?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['بناء فلل', 'عمارات', 'ترميم']
    },
    {
      id: 'BR-CONST-002',
      name: 'شركة الإمارات للمقاولات',
      rating: 4.8,
      reviews: 423,
      price: '9,200',
      distance: '3.5 كم',
      availability: 'online',
      responseTime: '15 دقيقة',
      projectsCount: 189,
      image: 'https://images.unsplash.com/photo-1606309028742-4039c7b625b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['إنشاءات', 'توسعات', 'تشطيبات']
    },
    {
      id: 'BR-CONST-003',
      name: 'مجموعة البناء الحديث',
      rating: 5.0,
      reviews: 512,
      price: '10,000',
      distance: '4.2 كم',
      availability: 'busy',
      responseTime: '30 دقيقة',
      projectsCount: 298,
      image: 'https://images.unsplash.com/photo-1651596082386-f83cfa746e64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      specialties: ['مشاريع كبيرة', 'فلل فاخرة', 'عمارات']
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'خالد الشامسي',
      userId: 'BR-234567',
      rating: 5,
      date: 'منذ 3 أيام',
      comment: 'بنوا لي فيلا من الصفر، الشغل احترافي وملتزمين بالمواعيد. المقاول كان متعاون جداً والتشطيبات فوق الممتاز!',
      verified: true,
      helpful: 67
    },
    {
      id: 2,
      name: 'فاطمة المنصوري',
      userId: 'BR-345678',
      rating: 5,
      date: 'منذ أسبوع',
      comment: 'عملوا لنا توسعة للبيت مع تجديد كامل. الشغل نظيف والفريق محترف. ننصح فيهم بقوة!',
      verified: true,
      helpful: 45
    },
    {
      id: 3,
      name: 'محمد العلي',
      userId: 'BR-456789',
      rating: 4,
      date: 'منذ أسبوعين',
      comment: 'مقاول ممتاز، لكن كان في تأخير بسيط بسبب التراخيص. بشكل عام راضيين عن النتيجة النهائية.',
      verified: false,
      helpful: 28
    }
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#27AE60]';
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
            src="https://images.unsplash.com/photo-1762536859942-8076505f7c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="مقاولات البناء"
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
              <Users className="w-3.5 h-3.5 text-[#27AE60]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                456 مزود
              </span>
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-3 py-2 shadow-lg">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#27AE60]" />
              <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '12px' }}>
                8,934 مشروع
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-20">
          <div className="bg-white rounded-[28px] p-5 shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-[18px] flex items-center justify-center shadow-lg flex-shrink-0">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-[#1A1A1A] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
                  مقاولات البناء
                </h2>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1.5 text-[#27AE60] text-xs mb-2 hover:text-[#1F8B4D] transition-colors"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                >
                  <span>ID: SRV-CONST-001</span>
                  {copiedId ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#6FCF97] text-[#6FCF97]" />
                    <span className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '14px' }}>4.9</span>
                    <span className="text-[#1A1A1A]/40 text-xs">(2,847)</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white px-3 py-1 rounded-full text-xs shadow-md" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                    5,000 - 15,000 د.إ
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
                <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-[#6FCF97] text-[#6FCF97]' : 'text-[#1A1A1A]'}`} />
              </button>
              <button className="flex-1 bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white py-3 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}>
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
                ? 'bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white shadow-md'
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
                ? 'bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white shadow-md'
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
                ? 'bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white shadow-md'
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
                <div className="w-12 h-12 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-[16px] flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                  الشرح والتعريف
                </h2>
              </div>

              {/* ما هي الخدمة */}
              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  ما هي خدمات مقاولات البناء؟
                </h3>
                <p className="text-[#1A1A1A]/70 mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '15px', lineHeight: 1.8 }}>
                  خدمات مقاولات البناء تشمل جميع أعمال الإنشاءات من البداية حتى التسليم. نوفر مقاولين معتمدين لبناء الفلل، العمارات السكنية والتجارية، التوسعات، الترميمات، مع إشراف هندسي كامل وضمان على جميع الأعمال.
                </p>
                <div className="bg-gradient-to-br from-[#27AE60]/10 to-[#6FCF97]/10 rounded-[16px] p-4 border-2 border-[#27AE60]/20">
                  <div className="flex items-start gap-2">
                    <Icon3D icon={Building2} theme="green" size="xs" hoverable={false} />
                    <p className="text-[#1A1A1A] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                      <strong>هل تعلم؟</strong> الإشراف الهندسي المستمر يوفر 30% من التكاليف الإضافية ويضمن جودة البناء وفق المواصفات العالمية.
                    </p>
                  </div>
                </div>
              </div>

              {/* أنواع الخدمات */}
              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  أنواع خدمات المقاولات
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Building2,
                      title: 'بناء الفلل والعمارات',
                      desc: 'بناء فلل وعمارات سكنية وتجارية من الصفر، مع التصميم الهندسي، الإشراف الكامل، واستخراج التراخيص.',
                      tags: ['فلل سكنية', 'عمارات', 'مباني تجارية']
                    },
                    {
                      icon: CheckCircle,
                      title: 'التوسعات والملاحق',
                      desc: 'إضافة غرف، مجالس، ملاحق خارجية، توسعة المنزل، مع دراسة إنشائية وتنفيذ آمن.',
                      tags: ['توسعة منزل', 'ملاحق', 'غرف إضافية']
                    },
                    {
                      icon: Sparkles,
                      title: 'الترميم والتجديد',
                      desc: 'ترميم المباني القديمة، تقوية الهياكل الإنشائية، تجديد شامل للمبنى، مع ضمان السلامة.',
                      tags: ['ترميم', 'تقوية', 'تجديد']
                    }
                  ].map((service, idx) => {
                    const Icon = service.icon;
                    return (
                      <div key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 border-2 border-[#F5EEE1]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-[12px] flex items-center justify-center flex-shrink-0">
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
                                <span key={i} className="bg-[#27AE60]/10 text-[#27AE60] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
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
                  التوعية والسلامة
                </h2>
              </div>

              {/* مؤشرات الخطر */}
              <div className="bg-gradient-to-br from-[#F2994A]/10 to-[#EB5757]/10 rounded-[24px] p-6 shadow-md mb-4 border-2 border-[#F2994A]/30">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  علامات تحتاج مقاول محترف
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Building2, title: 'بناء جديد', desc: 'تخطط لبناء فيلا أو عمارة من الصفر وتحتاج مقاول معتمد' },
                    { icon: Hammer, title: 'شقوق في الجدران', desc: 'ظهور شقوق أو تصدعات في الجدران أو الأسقف' },
                    { icon: Droplet, title: 'تسربات المياه', desc: 'تسربات مياه مستمرة في الأسقف أو الجدران' },
                    { icon: AlertTriangle, title: 'تهالك المبنى', desc: 'مبنى قديم يحتاج ترميم شامل أو تقوية إنشائية' }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[16px] p-4 border-2 border-[#F2994A]/20">
                      <div className="flex items-start gap-3">
                        <Icon3D icon={item.icon} theme="orange" size="sm" hoverable={false} />
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
                  نصائح عند اختيار المقاول
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Target, text: 'تأكد من الترخيص والتأمين - مقاول معتمد من الجهات المختصة' },
                    { icon: Users, text: 'اطلب أمثلة من أعمال سابقة وتحدث مع عملاء سابقين' },
                    { icon: BookOpen, text: 'احصل على عقد مكتوب يوضح التكلفة والمدة الزمنية' },
                    { icon: Building2, text: 'تأكد من وجود مهندس إشراف معتمد على الموقع' },
                    { icon: CheckCircle, text: 'تحقق من الضمانات المقدمة على الهيكل والتشطيبات' }
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#F5EEE1]/50 to-transparent rounded-[16px]">
                      <Icon3D icon={tip.icon} theme="green" size="sm" hoverable={false} />
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
                  الإرشاد والدليل
                </h2>
              </div>

              {/* كيف تطلب الخدمة */}
              <div className="bg-white rounded-[24px] p-6 shadow-md mb-4">
                <h3 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '18px' }}>
                  كيف تطلب الخدمة؟
                </h3>
                <div className="space-y-3">
                  {[
                    { step: '1', text: 'اضغط "احجز الآن" واختر نوع المشروع', time: '1 د' },
                    { step: '2', text: 'تصفح قائمة المقاولين المعتمدين', time: '3 د' },
                    { step: '3', text: 'اطلب زيارة موقع للمعاينة والتسعير', time: '5 د' },
                    { step: '4', text: 'احصل على عروض أسعار مفصلة', time: '1-2 يوم' },
                    { step: '5', text: 'وقّع العقد وابدأ المشروع', time: 'يوم واحد' },
                    { step: '6', text: 'متابعة التنفيذ والإشراف', time: 'حسب المشروع' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#F5EEE1] to-white rounded-[16px] border-2 border-[#F5EEE1]">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}>
                          {item.step}
                        </span>
                      </div>
                      <p className="flex-1 text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                        {item.text}
                      </p>
                      <span className="bg-[#27AE60]/10 text-[#27AE60] px-3 py-1 rounded-full text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
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
                  {seoData.faqs.map((faq, idx) => (
                    <details key={idx} className="bg-gradient-to-r from-[#F5EEE1] to-white rounded-[18px] p-5 shadow-sm group border-2 border-[#F5EEE1]">
                      <summary className="cursor-pointer text-[#1A1A1A] list-none flex items-center justify-between" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                        <span className="flex-1">{faq.question}</span>
                        <ChevronLeft className="w-5 h-5 transform group-open:rotate-90 transition-transform text-[#27AE60]" />
                      </summary>
                      <p className="mt-3 text-[#1A1A1A]/70 pr-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
                        {faq.answer}
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
          <ProvidersTabContent />
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
                className="flex-1 bg-gradient-to-r from-[#27AE60] to-[#6FCF97] text-white py-4 rounded-[20px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
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
              <div className="bg-white rounded-[24px] p-6 shadow-lg mb-6 border-2 border-[#27AE60]">
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
                          className={`w-8 h-8 ${star <= newReview.rating ? 'fill-[#6FCF97] text-[#6FCF97]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`}
                        />
                      </button>
                    ))}
                    <span className="mr-3 text-[#27AE60]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '18px' }}>
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
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#27AE60] transition-all"
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
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#27AE60] transition-all resize-none"
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
                    placeholder="اكتب تفاصيل الشكوى أو المقترح..."
                    rows={4}
                    className="w-full bg-[#F5EEE1] border-2 border-[#F5EEE1] rounded-[16px] px-4 py-3 text-[#1A1A1A] focus:outline-none focus:border-[#EB5757] transition-all resize-none"
                    style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '15px', lineHeight: 1.7 }}
                  />
                </div>

                {/* زر الإرسال */}
                <button
                  onClick={handleSubmitComplaint}
                  disabled={!newComplaint.name || !newComplaint.userId || !newComplaint.message}
                  className="w-full bg-gradient-to-r from-[#EB5757] to-[#F2994A] text-white py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
                >
                  <Send className="w-5 h-5" />
                  <span>إرسال</span>
                </button>
              </div>
            )}

            {/* ملخص التقييمات */}
            {!showReviewForm && !showComplaintForm && (
              <>
                <div className="bg-white rounded-[24px] p-6 shadow-md mb-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-[#27AE60] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '48px' }}>
                        4.9
                      </div>
                      <div className="flex items-center gap-1 justify-center mb-2">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className="w-5 h-5 fill-[#6FCF97] text-[#6FCF97]" />
                        ))}
                      </div>
                      <p className="text-[#1A1A1A]/60 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        2,847 تقييم
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
                              className="h-full bg-gradient-to-r from-[#27AE60] to-[#6FCF97] transition-all"
                              style={{ width: rating === 5 ? '85%' : rating === 4 ? '10%' : rating === 3 ? '3%' : '2%' }}
                            />
                          </div>
                          <span className="text-[#1A1A1A]/60 text-xs w-10" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {rating === 5 ? '85%' : rating === 4 ? '10%' : rating === 3 ? '3%' : '2%'}
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
                        <div className="w-12 h-12 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-full flex items-center justify-center text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '15px' }}>
                              {review.name}
                            </h4>
                            {review.verified && (
                              <div className="w-5 h-5 bg-gradient-to-br from-[#27AE60] to-[#6FCF97] rounded-full flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-[#27AE60] text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            ID: {review.userId}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-1 mb-1">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? 'fill-[#6FCF97] text-[#6FCF97]' : 'fill-[#E5E7EB] text-[#E5E7EB]'}`} />
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
                      <button className="text-[#27AE60] text-sm flex items-center gap-1 hover:text-[#1F8B4D] transition-colors" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
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

      <PlatformShowcaseBanner variant="mini" className="pb-6" />
    </div>
  );
}