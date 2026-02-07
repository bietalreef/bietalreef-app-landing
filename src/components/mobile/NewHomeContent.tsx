import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner@2.0.3';
import { 
  Star, Award, Zap, FileText, ChevronLeft, ChevronRight,
  MessageSquareText, ClipboardList, Sparkles, Tag, Clock,
  Percent, ArrowUp, Check, ShieldCheck, Crown, UserPlus,
  Building2, User as UserIcon, Layout, Pencil, Download,
  CheckCircle, Phone
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useBrowserSession } from '../../contexts/BrowserSession';
import { GuestGateButton } from '../browser/GuestGuard';
import { PlatformShowcaseBanner } from './PlatformShowcaseBanner';
import { useNavigate } from 'react-router';
import { InquiryFormModal, RFQFormModal } from './InquiryRFQModals';

const fontCairo = 'Cairo, sans-serif';

export function NewHomeContent() {
  const { t, language } = useTranslation('home');
  const session = useBrowserSession();
  const navigate = useNavigate();
  const isEn = language === 'en';
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pkgTab, setPkgTab] = useState<'client' | 'provider'>('client');
  const [showInquiry, setShowInquiry] = useState(false);
  const [showRFQ, setShowRFQ] = useState(false);
  const [showDownloadCTA, setShowDownloadCTA] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const heroSlides = [
    {
      title: t('heroSlide1.title'),
      subtitle: t('heroSlide1.subtitle'),
      image: 'https://images.unsplash.com/photo-1759176959174-465ad72f3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      cta: t('heroSlide1.cta')
    },
    {
      title: t('heroSlide2.title'),
      subtitle: t('heroSlide2.subtitle'),
      image: 'https://images.unsplash.com/photo-1646592491963-07ff7e7c31f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      cta: t('heroSlide2.cta')
    },
    {
      title: t('heroSlide3.title'),
      subtitle: t('heroSlide3.subtitle'),
      image: 'https://images.unsplash.com/photo-1678803262992-d79d06dd5d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
      cta: t('heroSlide3.cta')
    }
  ];

  // Auto-slide hero banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Show/hide scroll-to-top
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => setShowScrollTop(el.scrollTop > 600);
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActionClick = (action: 'quick_rfq' | 'contact_providers' | 'create_project') => {
    // Guest-allowed actions
    if (action === 'contact_providers') {
      navigate('/services');
      return;
    }
    if (action === 'quick_rfq') {
      setShowRFQ(true);
      return;
    }
    // Verified-only → show download CTA
    if (action === 'create_project') {
      setShowDownloadCTA(true);
      return;
    }
  };

  /* ═══════════════════════════════════════════
     DATA: Recommended Providers
  ═══════════════════════════════════════════ */
  const recommendations = [
    {
      id: 'rec-1',
      name: isEn ? 'Emirates Contracting Est.' : 'مؤسسة الإمارات للمقاولات',
      specialty: isEn ? 'Luxury villas & houses' : 'بناء الفلل والمنازل الفاخرة',
      rating: 4.9,
      reviews: 245,
      badge: isEn ? 'Most Requested' : 'الأكثر طلباً',
      gradient: 'from-amber-500 to-orange-600',
      icon: Award,
    },
    {
      id: 'rec-2',
      name: isEn ? 'Dubai Engineering Office' : 'مكتب دبي الهندسي الاستشاري',
      specialty: isEn ? 'Smart modern designs' : 'التصاميم الحديثة والمعمار الذكي',
      rating: 4.8,
      reviews: 189,
      badge: isEn ? 'Top Rated' : 'الأعلى تقييماً',
      gradient: 'from-blue-500 to-indigo-600',
      icon: Star,
    },
    {
      id: 'rec-3',
      name: isEn ? 'Gulf Comprehensive Maint.' : 'الخليج للصيانة الشاملة',
      specialty: isEn ? 'Periodic & emergency 24/7' : 'صيانة دورية وطوارئ 24/7',
      rating: 4.7,
      reviews: 312,
      badge: isEn ? 'Fastest Response' : 'الأسرع استجابة',
      gradient: 'from-green-500 to-emerald-600',
      icon: Zap,
    },
    {
      id: 'rec-4',
      name: isEn ? 'Abu Ahmed – Master Builder' : 'أبو أحمد - معلم بناء',
      specialty: isEn ? 'Construction & finishing' : 'أعمال البناء والتشطيبات',
      rating: 4.9,
      reviews: 156,
      badge: isEn ? 'Most Experienced' : 'الأكثر خبرة',
      gradient: 'from-purple-500 to-violet-600',
      icon: Sparkles,
    },
    {
      id: 'rec-5',
      name: isEn ? 'Emirates Building Materials' : 'معرض الإمارات لمواد البناء',
      specialty: isEn ? 'Best prices guaranteed' : 'أفضل الأسعار وجودة مضمونة',
      rating: 4.6,
      reviews: 428,
      badge: isEn ? 'Best Price' : 'الأفضل سعراً',
      gradient: 'from-teal-500 to-cyan-600',
      icon: Tag,
    },
  ];

  /* ═══════════════════════════════════════════
     DATA: Offers
  ═══════════════════════════════════════════ */
  const offers = [
    {
      id: 'o1',
      title: isEn ? '30% Painting Discount' : 'خصم 30% على الدهانات',
      provider: isEn ? 'National Paints' : 'ناشيونال للدهانات',
      discount: '30%',
      validUntil: isEn ? 'Mar 31, 2026' : '31 مارس 2026',
      badge: isEn ? 'Ending Soon' : 'ينتهي قريباً',
      color: 'from-red-500 to-orange-500',
      icon: Percent,
    },
    {
      id: 'o2',
      title: isEn ? '20% on Materials' : 'خصم 20% على مواد البناء',
      provider: isEn ? 'Emirates Building Materials' : 'معرض الإمارات للمواد',
      discount: '20%',
      validUntil: isEn ? 'Apr 15, 2026' : '15 أبريل 2026',
      badge: isEn ? 'Most Requested' : 'الأكثر طلباً',
      color: 'from-blue-500 to-indigo-500',
      icon: Tag,
    },
    {
      id: 'o3',
      title: isEn ? 'Free Consultation' : 'استشارة هندسية مجانية',
      provider: isEn ? 'Dubai Engineering' : 'مكتب دبي الهندسي',
      discount: isEn ? 'FREE' : 'مجاناً',
      validUntil: isEn ? 'May 10, 2026' : '10 مايو 2026',
      badge: isEn ? 'New' : 'جديد',
      color: 'from-green-500 to-emerald-500',
      icon: Sparkles,
    },
    {
      id: 'o4',
      title: isEn ? '15% Equipment Rental' : 'خصم 15% على تأجير المعدات',
      provider: isEn ? 'Al Jazeera Rental' : 'الجزيرة لتأجير المعدات',
      discount: '15%',
      validUntil: isEn ? 'Mar 28, 2026' : '28 مارس 2026',
      badge: isEn ? 'Exclusive' : 'حصري',
      color: 'from-purple-500 to-pink-500',
      icon: Clock,
    },
  ];

  /* ═══════════════════════════════════════════
     DATA: Packages
  ═══════════════════════════════════════════ */
  const clientPackages = [
    {
      id: 'guest', titleKey: 'packageGuest.title', subtitleKey: 'packageGuest.subtitle',
      featuresKey: 'packageGuest.features', btnTextKey: 'packageGuest.btnText',
      Icon: UserPlus, color: 'bg-gray-50', textColor: 'text-gray-600', borderColor: 'border-gray-200',
    },
    {
      id: 'verified', titleKey: 'packageVerified.title', subtitleKey: 'packageVerified.subtitle',
      featuresKey: 'packageVerified.features', btnTextKey: 'packageVerified.btnText',
      Icon: ShieldCheck, color: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200',
    },
    {
      id: 'vip', titleKey: 'packageVIP.title', subtitleKey: 'packageVIP.subtitle',
      featuresKey: 'packageVIP.features', btnTextKey: 'packageVIP.btnText',
      Icon: Crown, color: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-300',
    },
  ];

  const providerPackages = [
    {
      id: 'freelancer', titleKey: 'packageFreelancer.title', subtitleKey: 'packageFreelancer.subtitle',
      featuresKey: 'packageFreelancer.features', btnTextKey: 'packageFreelancer.btnText',
      Icon: UserIcon, color: 'bg-gray-50', textColor: 'text-gray-600', borderColor: 'border-gray-200',
    },
    {
      id: 'pro', titleKey: 'packagePro.title', subtitleKey: 'packagePro.subtitle',
      featuresKey: 'packagePro.features', btnTextKey: 'packagePro.btnText',
      Icon: Zap, color: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-200',
    },
    {
      id: 'enterprise', titleKey: 'packageEnterprise.title', subtitleKey: 'packageEnterprise.subtitle',
      featuresKey: 'packageEnterprise.features', btnTextKey: 'packageEnterprise.btnText',
      Icon: Building2, color: 'bg-slate-50', textColor: 'text-slate-700', borderColor: 'border-slate-200',
    },
  ];

  const activePackages = pkgTab === 'client' ? clientPackages : providerPackages;

  /* ═══════════════════════════════════════════
     DATA: Community Posts
  ═══════════════════════════════════════════ */
  const communityPosts = [
    {
      id: '1',
      userName: isEn ? 'Eng. Khaled Al Maktoum' : 'م. خالد المكتوم',
      role: isEn ? 'Verified Contractor' : 'مقاول معتمد',
      avatar: 'https://images.unsplash.com/photo-1560072362-53f3810f8b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
      text: isEn ? 'Project completed: 4-bedroom villa in Al Barsha, delivered on time with premium finishes.' : 'تم إنجاز مشروع فيلا 4 غرف نوم في البرشاء — تسليم في الوقت المحدد بتطيبات فاخرة.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
      likes: 245, comments: 42,
      tags: isEn ? ['villa','construction','dubai'] : ['فيلا','بناء','دبي'],
    },
    {
      id: '2',
      userName: isEn ? 'Al Noor Company' : 'شركة النور للمقاولات',
      role: isEn ? 'Enterprise Partner' : 'شريك مؤسسي',
      avatar: 'https://images.unsplash.com/photo-1726796065558-aeb93a8709cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
      text: isEn ? 'Infrastructure project in Sharjah successfully completed: roads & drainage systems.' : 'مشروع بنية تحتية في الشارقة — تنفيذ شبكات الطر�� والصرف.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800',
      likes: 189, comments: 15,
      tags: isEn ? ['infrastructure','sharjah'] : ['بنية_تحتية','الشارقة'],
    },
    {
      id: '3',
      userName: isEn ? 'Sarah Interior Design' : 'سارة للتصميم الداخلي',
      role: isEn ? 'Interior Designer' : 'مصممة ديكور',
      avatar: 'https://images.unsplash.com/photo-1667842503541-965849144d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
      text: isEn ? 'Modern minimalist design for a penthouse apartment in Dubai Marina.' : 'تصميم مودرن بسيط لشقة بنتهاوس في دبي مارينا.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
      likes: 567, comments: 89,
      tags: isEn ? ['interior','modern','marina'] : ['ديكور','مودرن','مارينا'],
    },
  ];

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  return (
    <div ref={scrollRef} className="flex-1 bg-[#F5EEE1] overflow-y-auto relative">
      
      {/* ── HERO CAROUSEL ─────────────────── */}
      <div className="relative h-[280px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <ImageWithFallback 
              src={heroSlides[currentHeroSlide].image}
              alt={heroSlides[currentHeroSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h2 className="text-white mb-1.5" style={{ fontFamily: fontCairo, fontWeight: 800, fontSize: '24px', lineHeight: 1.3 }}>
                {heroSlides[currentHeroSlide].title}
              </h2>
              <p className="text-white/90 mb-4" style={{ fontFamily: fontCairo, fontWeight: 600, fontSize: '14px' }}>
                {heroSlides[currentHeroSlide].subtitle}
              </p>
              <button 
                onClick={() => handleActionClick('create_project')}
                className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2"
                style={{ fontFamily: fontCairo, fontWeight: 800, fontSize: '14px' }}
              >
                <Zap className="w-4 h-4" />
                <span>{heroSlides[currentHeroSlide].cta}</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-5 left-5 flex items-center gap-2 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroSlide(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentHeroSlide ? 'w-7 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <button 
          onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* ── 3 ACTION BUTTONS ─────────────────── */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-2.5">
          {/* 1) AI Agent */}
          <button
            onClick={() => navigate('/yak')}
            className="bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] flex flex-col items-center gap-2.5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-[14px] flex items-center justify-center shadow-lg relative z-10">
              <MessageSquareText className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#1A1A1A] text-center relative z-10" style={{ fontFamily: fontCairo, fontWeight: 700, fontSize: '12px', lineHeight: 1.3 }}>
              {isEn ? 'AI Agent' : 'وكيل ذكي'}
            </span>
          </button>

          {/* 2) Inquiry Form */}
          <button
            onClick={() => setShowInquiry(true)}
            className="bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] flex flex-col items-center gap-2.5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[14px] flex items-center justify-center shadow-lg relative z-10">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#1A1A1A] text-center relative z-10" style={{ fontFamily: fontCairo, fontWeight: 700, fontSize: '12px', lineHeight: 1.3 }}>
              {isEn ? 'Inquiry' : 'نموذج استفسار'}
            </span>
          </button>

          {/* 3) Request Quote */}
          <button
            onClick={() => setShowRFQ(true)}
            className="bg-white rounded-[20px] p-4 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] flex flex-col items-center gap-2.5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 bg-gradient-to-br from-[#C8A86A] to-[#A88B4A] rounded-[14px] flex items-center justify-center shadow-lg relative z-10">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-[#1A1A1A] text-center relative z-10" style={{ fontFamily: fontCairo, fontWeight: 700, fontSize: '12px', lineHeight: 1.3 }}>
              {isEn ? 'Request Quote' : 'طلب عرض سعر'}
            </span>
          </button>
        </div>
      </div>

      {/* ── DESIGN STUDIO BANNER ─────────────────── */}
      <div className="px-4 pb-2">
        <button
          onClick={() => navigate('/design')}
          className="w-full relative overflow-hidden bg-gradient-to-l from-[#1F3D2B] via-[#2A5A3B] to-[#1F3D2B] rounded-2xl p-5 shadow-lg group"
        >
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="homegrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#homegrid)" />
            </svg>
          </div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-[#2AA676] via-[#D4AF37] to-[#2AA676]" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
              <Layout className="w-7 h-7 text-[#2AA676]" />
            </div>
            <div className="flex-1 text-start">
              <h3 className="text-white text-base font-extrabold mb-0.5" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Design Your Dream Home' : 'صمّم بيت أحلامك'}
              </h3>
              <p className="text-white/50 text-[11px] font-semibold" style={{ fontFamily: fontCairo }}>
                {isEn ? 'Free interactive 2D planner — no signup needed' : 'مخطط تفاعلي مجاني — بدون تسجيل'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-[#2AA676] text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0 shadow-lg shadow-[#2AA676]/30 group-hover:bg-[#34C68D] transition-colors"
              style={{ fontFamily: fontCairo }}>
              <Pencil className="w-3.5 h-3.5" />
              {isEn ? 'Start' : 'ابدأ'}
            </div>
          </div>
        </button>
      </div>

      {/* ── PACKAGES SLIDER ─────────────────── */}
      <div className="py-4" style={{ fontFamily: fontCairo }}>
        <div className="px-4 mb-4">
          <h2 className="text-[#1A1A1A] text-xl font-bold mb-2">{t('chooseYourPlan')}</h2>
          <p className="text-gray-500 text-xs">{t('packagesSubtitle')}</p>
        </div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
            <button
              onClick={() => setPkgTab('client')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pkgTab === 'client' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              {t('clientJourney')}
            </button>
            <button
              onClick={() => setPkgTab('provider')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${pkgTab === 'provider' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
            >
              {t('providerJourney')}
            </button>
          </div>
        </div>

        {/* Horizontal slider */}
        <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
          {activePackages.map((pkg) => {
            const features = t(pkg.featuresKey).split(',');
            return (
              <div
                key={pkg.id}
                className={`min-w-[280px] max-w-[300px] snap-center rounded-2xl p-5 border-2 flex flex-col flex-shrink-0 ${pkg.borderColor} ${pkg.color}`}
              >
                <div className={`w-11 h-11 rounded-xl mb-3 flex items-center justify-center bg-white shadow-sm ${pkg.textColor}`}>
                  <pkg.Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-0.5">{t(pkg.titleKey)}</h3>
                <p className="text-[11px] text-gray-500 font-bold mb-3">{t(pkg.subtitleKey)}</p>

                <div className="flex-1 space-y-2 mb-4">
                  {features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <div className={`mt-0.5 p-0.5 rounded-full ${pkg.textColor} bg-white/50`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat.trim()}</span>
                    </div>
                  ))}
                  {features.length > 4 && (
                    <p className="text-[10px] text-gray-400 font-bold">+{features.length - 4} {isEn ? 'more' : 'المزيد'}</p>
                  )}
                </div>

                <button className={`w-full py-2.5 rounded-xl font-bold text-sm bg-white shadow-sm ${pkg.textColor}`}>
                  {t(pkg.btnTextKey)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── COMMUNITY SLIDER ─────────────────── */}
      <div className="py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[#1A1A1A] text-xl font-bold" style={{ fontFamily: fontCairo }}>
            {t('communityTitle')}
          </h2>
          <button className="text-sm font-bold text-[#2AA676]" style={{ fontFamily: fontCairo }}>
            {t('exploreMore')}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
          {communityPosts.map((post) => (
            <div
              key={post.id}
              className="min-w-[300px] max-w-[320px] snap-center bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex-shrink-0"
            >
              {/* Post Image */}
              <div className="h-[160px] relative">
                <ImageWithFallback src={post.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* User info on image */}
                <div className="absolute bottom-3 right-3 left-3 flex items-center gap-2">
                  <img src={post.avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold truncate" style={{ fontFamily: fontCairo }}>{post.userName}</p>
                    <p className="text-white/70 text-[10px]" style={{ fontFamily: fontCairo }}>{post.role}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-3">
                <p className="text-gray-800 text-xs leading-relaxed line-clamp-2 mb-2" style={{ fontFamily: fontCairo }}>
                  {post.text}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[#2AA676] text-[10px] font-bold">#{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold border-t border-gray-50 pt-2">
                  <span>{post.likes} {isEn ? 'likes' : 'إعجاب'}</span>
                  <span>{post.comments} {isEn ? 'comments' : 'تعليق'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECOMMENDED PROVIDERS ─────────────────── */}
      <div className="py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[#1A1A1A] text-xl font-bold" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Smart Recommendations' : 'التوصيات الذكية'}
          </h2>
          <button
            onClick={() => navigate('/recommendations')}
            className="text-sm font-bold text-[#2AA676]"
            style={{ fontFamily: fontCairo }}
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
          {recommendations.map((rec) => {
            const RecIcon = rec.icon;
            return (
              <div
                key={rec.id}
                className="min-w-[260px] max-w-[280px] snap-center bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex-shrink-0"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rec.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <RecIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#1A1A1A] text-sm font-bold truncate mb-0.5" style={{ fontFamily: fontCairo }}>
                      {rec.name}
                    </h3>
                    <p className="text-gray-500 text-[11px]" style={{ fontFamily: fontCairo }}>{rec.specialty}</p>
                  </div>
                </div>

                {/* Rating + Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-[#1A1A1A]">{rec.rating}</span>
                    <span className="text-[10px] text-gray-400">({rec.reviews})</span>
                    <CheckCircle className="w-3.5 h-3.5 text-[#4A90E2] ml-1" />
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-l ${rec.gradient} text-white`}>
                    {rec.badge}
                  </span>
                </div>

                {/* Verification Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#4A90E2]/10 text-[#4A90E2]"
                    style={{ fontFamily: fontCairo }}>
                    <CheckCircle className="w-3 h-3" />
                    {isEn ? 'Verified Provider' : 'مزود موثق'}
                  </span>
                </div>

                {/* CTA - Contact Now */}
                <button
                  onClick={() => handleActionClick('contact_providers')}
                  className="w-full bg-gradient-to-r from-[#2AA676] to-[#6FCF97] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  style={{ fontFamily: fontCairo }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {isEn ? 'Contact Now' : 'تواصل الآن'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── OFFERS SLIDER ─────────────────── */}
      <div className="py-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[#1A1A1A] text-xl font-bold" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Special Offers' : 'العروض والخصومات'}
          </h2>
          <button
            onClick={() => navigate('/offers')}
            className="text-sm font-bold text-[#C8A86A]"
            style={{ fontFamily: fontCairo }}
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
          {offers.map((offer) => {
            const OfferIcon = offer.icon;
            return (
              <div
                key={offer.id}
                className="min-w-[260px] max-w-[280px] snap-center rounded-2xl overflow-hidden shadow-lg flex-shrink-0"
              >
                {/* Top gradient bar */}
                <div className={`bg-gradient-to-l ${offer.color} p-4 relative`}>
                  <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {offer.badge}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-[10px] mb-1" style={{ fontFamily: fontCairo }}>{offer.provider}</p>
                      <h3 className="text-white text-sm font-bold leading-tight" style={{ fontFamily: fontCairo }}>
                        {offer.title}
                      </h3>
                    </div>
                    <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
                      <span className="text-white text-xl font-black">{offer.discount}</span>
                    </div>
                  </div>
                </div>
                {/* Bottom info */}
                <div className="bg-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px]" style={{ fontFamily: fontCairo }}>{isEn ? 'Valid until' : 'صالح حتى'} {offer.validUntil}</span>
                  </div>
                  <button className="text-[#2AA676] text-[11px] font-bold" style={{ fontFamily: fontCairo }}>
                    {isEn ? 'Claim' : 'حصل عليه'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SPECIAL OFFER BANNER ─────────────────── */}
      <div className="px-4 py-3">
        <div className="relative bg-white rounded-2xl p-5 shadow-sm overflow-hidden border border-[#E6DCC8]">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2AA676]/6 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#C8A86A]/6 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-lg flex items-center justify-center shadow-md">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[#1F3D2B]" style={{ fontFamily: fontCairo, fontWeight: 800, fontSize: '20px' }}>
                {t('specialOffersTitle')}
              </h3>
            </div>
            <p className="text-[#1F3D2B]/60 mb-4" style={{ fontFamily: fontCairo, fontWeight: 600, fontSize: '14px', lineHeight: 1.6 }}>
              {t('specialOffersDescription')}
            </p>
            <button className="bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2" style={{ fontFamily: fontCairo, fontWeight: 800, fontSize: '14px' }}>
              <Zap className="w-4 h-4" />
              <span>{t('bookNow')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── PLATFORM SHOWCASE ─────────────────── */}
      <div className="pb-0">
        <PlatformShowcaseBanner variant="full" />
      </div>

      {/* ── FLOATING SCROLL-TO-TOP BUTTON ─────────────────── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 left-4 z-30 w-12 h-12 bg-[#2AA676] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#1F3D2B] transition-colors border-2 border-white/30"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── INQUIRY FORM MODAL ─────────────────── */}
      <InquiryFormModal
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
      />

      {/* ── RFQ FORM MODAL ─────────────────── */}
      <RFQFormModal
        isOpen={showRFQ}
        onClose={() => setShowRFQ(false)}
      />

      {/* ── DOWNLOAD APP CTA MODAL (verified-only actions) ─── */}
      <AnimatePresence>
        {showDownloadCTA && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDownloadCTA(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden"
              dir={isEn ? 'ltr' : 'rtl'}>
              <div className="h-1.5 bg-gradient-to-l from-[#2AA676] via-[#D4AF37] to-[#2AA676]" />
              <div className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#2AA676] to-[#1F3D2B] rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#2AA676]/20">
                  <Download className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-xl font-extrabold text-[#1F3D2B] mb-2" style={{ fontFamily: fontCairo }}>
                  {isEn ? 'Manage Projects in the App' : 'أدر مشاريعك من التطبيق'}
                </h3>
                <p className="text-[#1F3D2B]/40 text-sm leading-relaxed mb-6" style={{ fontFamily: fontCairo }}>
                  {isEn
                    ? 'Download Beit Al Reef to create projects, manage teams, track progress and more.'
                    : 'حمّل تطبيق بيت الريف لإنشاء المشاريع، إدارة الفرق، متابعة التقدم وأكثر.'}
                </p>
                <button className="w-full bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg mb-3"
                  style={{ fontFamily: fontCairo }}>
                  <Download className="w-4 h-4" />
                  {isEn ? 'Download the App' : 'حمّل التطبيق'}
                </button>
                <button onClick={() => setShowDownloadCTA(false)}
                  className="w-full py-2 text-sm font-bold text-[#1F3D2B]/30" style={{ fontFamily: fontCairo }}>
                  {isEn ? 'Continue Browsing' : 'استمر في التصفح'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}