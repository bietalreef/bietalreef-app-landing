import { useState, useEffect } from 'react';
import { Search, Bell, ShoppingCart, Globe2, Star, TrendingUp, Award, Zap, Camera, FileText, Phone, MapPin, Clock, Shield, ChevronLeft, ChevronRight, Heart, MessageCircle, Lock, Mic, User } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useUser } from '../../utils/UserContext';
import { checkPolicy } from '../../utils/uiPolicy';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabase/client';

export function NewHomeContent() {
  const { t, dir, language } = useTranslation('home');
  const { profile } = useUser();
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  
  // Real Data State
  const [realProviders, setRealProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Fetch Real Providers from DB
  useEffect(() => {
    async function fetchProviders() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'provider')
          .limit(5);

        if (error) throw error;
        setRealProviders(data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoadingProviders(false);
      }
    }

    fetchProviders();
  }, []);

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

  const handleActionClick = (action: 'quick_rfq' | 'contact_providers' | 'create_project') => {
      const policy = checkPolicy(profile, action);
      if (!policy.allowed) {
          toast.error(policy.reason || 'غير مسموح', {
             description: policy.actionRequired === 'upgrade' ? 'يرجى الترقية للباقة الاحترافية' : 'يرجى توثيق حسابك للاستمرار',
             action: {
                 label: policy.actionRequired === 'upgrade' ? 'ترقية' : 'توثيق',
                 onClick: () => console.log('Redirect to upgrade/verify')
             }
          });
          return;
      }
      
      // Action allowed logic here
      toast.success('جاري تنفيذ الطلب...');
  };

  const handleVoiceRoomJoin = (isProRoom: boolean) => {
      if (isProRoom) {
          const policy = checkPolicy(profile, 'voice_projects');
          if (!policy.allowed) {
            toast.error(policy.reason, {
                icon: <Lock className="w-4 h-4" />
            });
            return;
          }
      }
      toast.success(isProRoom ? 'جاري الدخول لغرفة المشاريع VIP...' : 'جاري الدخول لغرفة خدمة العملاء...');
  };

  // Featured Categories
  const featuredCategories = [
    {
      id: 1,
      title: t('featuredCategory1.title'),
      subtitle: t('featuredCategory1.subtitle'),
      image: 'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      gradient: 'from-[#4A90E2] to-[#56CCF2]',
      icon: '🏠'
    },
    {
      id: 2,
      title: t('featuredCategory2.title'),
      subtitle: t('featuredCategory2.subtitle'),
      image: 'https://images.unsplash.com/photo-1723107638858-331404b1a09a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      gradient: 'from-[#56CCF2] to-[#4A90E2]',
      icon: '🏗️'
    },
    {
      id: 3,
      title: t('featuredCategory3.title'),
      subtitle: t('featuredCategory3.subtitle'),
      image: 'https://images.unsplash.com/photo-1731694411560-050e5b91e943?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      gradient: 'from-[#4A90E2] to-[#56CCF2]',
      icon: '🔧'
    },
    {
      id: 4,
      title: t('featuredCategory4.title'),
      subtitle: t('featuredCategory4.subtitle'),
      image: 'https://images.unsplash.com/photo-1559354484-587384b2badc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      gradient: 'from-[#56CCF2] to-[#4A90E2]',
      icon: '🏢'
    },
    {
      id: 5,
      title: t('featuredCategory5.title'),
      subtitle: t('featuredCategory5.subtitle'),
      image: 'https://images.unsplash.com/photo-1581166418878-11f0dde922c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      gradient: 'from-[#4A90E2] to-[#56CCF2]',
      icon: '🛠️'
    },
    {
      id: 6,
      title: t('featuredCategory6.title'),
      subtitle: t('featuredCategory6.subtitle'),
      image: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
      gradient: 'from-[#56CCF2] to-[#4A90E2]',
      icon: '💼'
    }
  ];

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-[#4A90E2]';
      case 'busy': return 'bg-[#F2994A]';
      default: return 'bg-[#6B7280]';
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto" dir={dir}>
      
      {/* Hero Carousel */}
      <div className="relative h-[380px] overflow-hidden">
        <motion.div
          key={currentHeroSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-full"
        >
          <ImageWithFallback 
            src={heroSlides[currentHeroSlide].image}
            alt={heroSlides[currentHeroSlide].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white mb-2" 
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '28px', lineHeight: 1.3 }}
            >
              {heroSlides[currentHeroSlide].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 mb-5" 
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '16px' }}
            >
              {heroSlides[currentHeroSlide].subtitle}
            </motion.p>
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => handleActionClick('create_project')}
              className="bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-8 py-4 rounded-[20px] shadow-2xl flex items-center gap-2"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '16px' }}
            >
              <Zap className="w-5 h-5" />
              <span>{heroSlides[currentHeroSlide].cta}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentHeroSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Voice Rooms Integration (NEW) */}
      <div className="px-5 py-6">
        <h2 className="text-[#1A1A1A] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '20px' }}>
          الغرف الصوتية المباشرة 🎙️
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            
            {/* Free Room: Customer Support */}
            <div 
                onClick={() => handleVoiceRoomJoin(false)}
                className="min-w-[160px] h-[180px] bg-gradient-to-br from-[#5B7FE8] to-[#4A90E2] rounded-[24px] p-4 relative flex flex-col justify-between shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
                <div className="flex justify-between items-start">
                    <span className="bg-white/20 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm">مباشر</span>
                    <div className="bg-white/20 p-1.5 rounded-full">
                        <Mic className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>خدمة العملاء</h3>
                    <p className="text-white/80 text-xs">متاح للجميع</p>
                </div>
                <div className="flex -space-x-2 space-x-reverse">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#5B7FE8] bg-white overflow-hidden">
                             <ImageWithFallback src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-[#5B7FE8] bg-white/20 flex items-center justify-center text-white text-xs font-bold">+12</div>
                </div>
            </div>

            {/* Pro Room: VIP Projects */}
            <div 
                onClick={() => handleVoiceRoomJoin(true)}
                className="min-w-[160px] h-[180px] bg-[#1A1A1A] rounded-[24px] p-4 relative flex flex-col justify-between shadow-lg cursor-pointer hover:scale-105 transition-transform"
            >
                 <div className="flex justify-between items-start">
                    <span className="bg-amber-500/20 text-amber-500 text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border border-amber-500/30">VIP</span>
                    <div className="bg-white/10 p-1.5 rounded-full">
                        <Lock className="w-4 h-4 text-amber-500" />
                    </div>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>مشاريع كبرى</h3>
                    <p className="text-gray-400 text-xs">للباقة الاحترافية</p>
                </div>
                 <div className="flex -space-x-2 space-x-reverse opacity-50">
                    {[1,2].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] bg-gray-700 overflow-hidden">
                             <ImageWithFallback src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

             {/* Placeholder Room */}
            <div className="min-w-[160px] h-[180px] border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center text-gray-400">
                 <Mic className="w-8 h-8 mb-2 opacity-50" />
                 <span className="text-xs">قريباً</span>
            </div>

        </div>
      </div>

      {/* MAIN ACTION BUTTONS */}
      <div className="px-5 py-6">
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleActionClick('quick_rfq')}
            className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] flex flex-col items-center gap-3 relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[18px] flex items-center justify-center shadow-lg relative z-10">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <span className="text-[#1A1A1A] text-center relative z-10" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px', lineHeight: 1.4 }}>
              {t('requestQuote')}
            </span>
          </button>

          <button 
             onClick={() => handleActionClick('contact_providers')}
             className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] flex flex-col items-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gradient-to-br from-[#56CCF2] to-[#4A90E2] rounded-[18px] flex items-center justify-center shadow-lg relative z-10">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <span className="text-[#1A1A1A] text-center relative z-10" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px', lineHeight: 1.4 }}>
              {t('callExpert')}
            </span>
          </button>

          <button 
             onClick={() => handleActionClick('create_project')}
             className="bg-white rounded-[24px] p-5 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] flex flex-col items-center gap-3 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[18px] flex items-center justify-center shadow-lg relative z-10">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <span className="text-[#1A1A1A] text-center relative z-10" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px', lineHeight: 1.4 }}>
              {t('uploadPhotos')}
            </span>
          </button>
        </div>
      </div>

      {/* FEATURED CATEGORIES */}
      <div className="px-5 py-6">
        <h2 className="text-[#1A1A1A] mb-5" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
          {t('featuredCategories')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {featuredCategories.map((category) => (
            <div
              key={category.id}
              className="relative rounded-[28px] overflow-hidden shadow-lg hover:shadow-xl transition-all group h-[200px]"
            >
              <ImageWithFallback 
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-[16px] flex items-center justify-center">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <div>
                  <h3 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '17px', lineHeight: 1.3 }}>
                    {category.title}
                  </h3>
                  <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    {category.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BEST PROVIDERS (REAL DATA ONLY) */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#1A1A1A]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
            {t('bestProviders')}
          </h2>
          <button className="text-[#4A90E2] text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('viewAll')}
          </button>
        </div>

        {/* Real Data Container */}
        {loadingProviders ? (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
             {[1,2,3].map(i => (
               <div key={i} className="min-w-[280px] h-[200px] bg-slate-100 rounded-[24px] animate-pulse"></div>
             ))}
          </div>
        ) : realProviders.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-[24px] border border-slate-100">
             <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
             <p className="text-slate-400 font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>لا يوجد مزودين مسجلين حالياً</p>
             <p className="text-slate-300 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>سجل الآن كـ Provider لتظهر هنا!</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
            {realProviders.map((provider) => (
              <div
                key={provider.id}
                onClick={() => handleActionClick('contact_providers')}
                className="min-w-[280px] bg-white rounded-[24px] p-5 shadow-md hover:shadow-lg transition-all border border-[#F5EEE1] cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-[18px] overflow-hidden bg-slate-200 flex items-center justify-center">
                    {/* Placeholder Avatar since DB doesn't have image column yet */}
                    <User className="w-8 h-8 text-slate-400" />
                    {provider.is_verified && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#1A1A1A] mb-1 truncate" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                       {provider.email ? provider.email.split('@')[0] : 'مزود خدمة'}
                    </h3>
                    <p className="text-[#1A5490] text-xs mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      {(provider.tier || provider.plan || 'VERIFIED').toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleActionClick('contact_providers'); }}
                    className="flex-1 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white px-4 py-3 rounded-[16px] shadow-md text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                  >
                    {t('contactNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SPECIAL OFFERS BANNER */}
      <div className="px-5 py-6">
        <div className="relative bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] rounded-[28px] p-6 shadow-2xl overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-8 h-8 text-white" />
              <h3 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                {t('specialOffersTitle')}
              </h3>
            </div>
            <p className="text-white/90 mb-5" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: 1.6 }}>
              {t('specialOffersDescription')}
            </p>
            <button className="bg-white text-[#4A90E2] px-6 py-3 rounded-[18px] shadow-xl flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '15px' }}>
              <Zap className="w-5 h-5" />
              <span>{t('bookNow')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extra Padding for Bottom Navigation */}
      <div className="h-8" />

    </div>
  );
}
