/**
 * Unified3DScene.tsx — مشهد 3D فخم موحّد
 * ─────────────────────────────────────────
 * حلقة العروض الدعائية (أعلى) + حلقة الخدمات (أسفل)
 * في فضاء واحد تفاعلي — سحب أفقي لتدوير، عمودي لإمالة
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star, Wrench, Zap, Droplets, Paintbrush, Wind, Award, Crown,
  TrendingUp, Heart, Bot, Home, Users, Gem, Flame, Gift, Sparkles,
  HardHat, Compass, Hammer, Truck, Package, Sofa, SparklesIcon,
  BadgeCheck, ShieldCheck,
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// ─── Figma Assets ───
import mascotImg from "figma:asset/20af6d62a39f1c858539f151117135f90fe0515b.png";
import logoImg from "figma:asset/67fe2af1d169e9257cfb304dda040baf67b4e599.png";
import meetingImg from "figma:asset/974a3f48f5d3dd71e0edcb044fd3a5ff786b8d0e.png";

// ═══════════════════════════════════════
// Card data types
// ═══════════════════════════════════════
interface CardData {
  id: string;
  type: 'offer' | 'featured' | 'service';
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  badge?: string;
  badgeColor: string;
  gradient: string;
  icon: React.ElementType;
  iconColor: string;
  image?: string;
  rating?: number;
  verified?: boolean;
}

// ═══════════════════════════════════════
// HERO RING — نصوص دعائية فخمة
// ═══════════════════════════════════════
const HERO_CARDS: CardData[] = [
  {
    id: 'h1', type: 'offer',
    titleAr: 'سباكة ذهبية',
    titleEn: 'Golden Plumbing',
    subtitleAr: 'وفّر 30% · عرض لا يُفوَّت',
    subtitleEn: 'Save 30% · Unmissable Deal',
    badge: '‎−30%', badgeColor: 'from-red-400 to-orange-400',
    gradient: 'from-emerald-400/70 to-teal-600/75',
    icon: Droplets, iconColor: 'text-cyan-100',
    image: 'https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?w=400&h=260&fit=crop',
  },
  {
    id: 'h2', type: 'featured',
    titleAr: 'شركة النور للكهرباء',
    titleEn: 'Al Nour Electrical Co.',
    subtitleAr: 'كهربائيون معتمدون · خدمة 24/7',
    subtitleEn: 'Certified Electricians · 24/7',
    badge: '4.9', badgeColor: 'from-amber-300 to-yellow-400',
    gradient: 'from-blue-400/70 to-indigo-600/75',
    icon: Zap, iconColor: 'text-yellow-200',
    image: 'https://images.unsplash.com/photo-1762330465376-b89b5584306d?w=400&h=260&fit=crop',
    rating: 4.9,
    verified: true,
  },
  {
    id: 'h3', type: 'offer',
    titleAr: 'بيتك يستاهل الأفضل',
    titleEn: 'Your Home Deserves the Best',
    subtitleAr: 'صيانة شاملة · وفّر 500 د.إ',
    subtitleEn: 'Full Maintenance · Save 500 AED',
    badge: '🔥 HOT', badgeColor: 'from-orange-400 to-red-400',
    gradient: 'from-violet-400/70 to-purple-600/75',
    icon: Wrench, iconColor: 'text-purple-100',
    image: 'https://images.unsplash.com/photo-1765253715686-784408c962c7?w=400&h=260&fit=crop',
  },
  {
    id: 'h4', type: 'featured',
    titleAr: 'دار الإعمار للمقاولات',
    titleEn: 'Dar Al Emar Contracting',
    subtitleAr: 'بناء فلل · عمارات · ترميم',
    subtitleEn: 'Villas · Buildings · Restoration',
    badge: '4.8', badgeColor: 'from-amber-300 to-yellow-400',
    gradient: 'from-emerald-400/70 to-green-600/75',
    icon: Award, iconColor: 'text-amber-200',
    image: 'https://images.unsplash.com/photo-1744405901062-d881973bc195?w=400&h=260&fit=crop',
    rating: 4.8,
    verified: true,
  },
  {
    id: 'h5', type: 'offer',
    titleAr: 'لمسة واحدة تُحيي بيتك',
    titleEn: 'One Touch Revives Your Home',
    subtitleAr: 'دهان + تنظيف مجاناً',
    subtitleEn: 'Paint + Free Cleaning',
    badge: 'مجاني', badgeColor: 'from-green-400 to-emerald-500',
    gradient: 'from-rose-400/70 to-pink-600/75',
    icon: Paintbrush, iconColor: 'text-pink-100',
    image: 'https://images.unsplash.com/photo-1762630221025-e8f1b2e3f1a6?w=400&h=260&fit=crop',
  },
  {
    id: 'h6', type: 'featured',
    titleAr: 'تبريد الخليج',
    titleEn: 'Gulf Cooling Co.',
    subtitleAr: 'تكييف مركزي · صيانة · تركيب',
    subtitleEn: 'Central AC · Service · Install',
    badge: '5.0', badgeColor: 'from-amber-300 to-yellow-400',
    gradient: 'from-sky-400/70 to-blue-600/75',
    icon: Wind, iconColor: 'text-sky-100',
    rating: 5.0,
    verified: true,
  },
  {
    id: 'h7', type: 'offer',
    titleAr: 'نوّر بيتك بأقل سعر',
    titleEn: 'Light Up Your Home for Less',
    subtitleAr: 'تمديدات كهرباء · خصم أول طلب',
    subtitleEn: 'Electrical Wiring · First Order Discount',
    badge: '‎−25%', badgeColor: 'from-yellow-400 to-amber-500',
    gradient: 'from-amber-400/70 to-orange-600/75',
    icon: Zap, iconColor: 'text-yellow-100',
  },
  {
    id: 'h8', type: 'featured',
    titleAr: 'واحة السباكة',
    titleEn: 'Oasis Plumbing',
    subtitleAr: 'سباكة احترافية · ضمان سنة',
    subtitleEn: 'Pro Plumbing · 1 Year Warranty',
    badge: '4.7', badgeColor: 'from-amber-300 to-yellow-400',
    gradient: 'from-teal-400/70 to-cyan-600/75',
    icon: Crown, iconColor: 'text-yellow-200',
    rating: 4.7,
    verified: true,
  },
  {
    id: 'h9', type: 'offer',
    titleAr: 'حوّل بيتك للمستقبل',
    titleEn: 'Transform Your Home',
    subtitleAr: 'باقة المنزل الذكي · تقنية + توفير',
    subtitleEn: 'Smart Home Package · Tech + Savings',
    badge: 'SMART', badgeColor: 'from-indigo-400 to-violet-500',
    gradient: 'from-indigo-400/70 to-violet-600/75',
    icon: TrendingUp, iconColor: 'text-indigo-100',
    image: 'https://images.unsplash.com/photo-1717323454555-f053c31ff4b4?w=400&h=260&fit=crop',
  },
  {
    id: 'h10', type: 'featured',
    titleAr: 'لمسة الديار للتصميم',
    titleEn: 'Lamsat Al Diyar Design',
    subtitleAr: 'تصميم · تأثيث · ديكور فاخر',
    subtitleEn: 'Design · Furnish · Luxury Decor',
    badge: '4.9', badgeColor: 'from-amber-300 to-yellow-400',
    gradient: 'from-fuchsia-400/70 to-pink-600/75',
    icon: Heart, iconColor: 'text-pink-100',
    rating: 4.9,
    verified: true,
  },
  {
    id: 'h11', type: 'featured',
    titleAr: 'وياك — ذكاء يفهمك',
    titleEn: 'Weyak — AI That Gets You',
    subtitleAr: 'مساعدك الذكي على مدار الساعة',
    subtitleEn: 'Your 24/7 Smart Assistant',
    badge: 'AI', badgeColor: 'from-emerald-400 to-teal-500',
    gradient: 'from-emerald-500/60 to-teal-700/65',
    icon: Bot, iconColor: 'text-emerald-100',
    image: mascotImg,
  },
  {
    id: 'h12', type: 'offer',
    titleAr: 'الدار الرقمية الأولى',
    titleEn: 'The #1 Digital Home',
    subtitleAr: 'بيت الريف · منصة الإمارات',
    subtitleEn: 'Biet Al Reef · UAE Platform',
    badge: '#1', badgeColor: 'from-[#D4AF37] to-[#B8962E]',
    gradient: 'from-white/70 to-gray-100/70',
    icon: Home, iconColor: 'text-green-800',
    image: logoImg,
  },
  {
    id: 'h13', type: 'featured',
    titleAr: 'مجتمعك ينتظرك',
    titleEn: 'Your Community Awaits',
    subtitleAr: 'غرفة الاجتماعات — انضم الآن',
    subtitleEn: 'Meeting Room — Join Now',
    badge: 'LIVE', badgeColor: 'from-purple-400 to-indigo-500',
    gradient: 'from-amber-600/70 to-yellow-800/75',
    icon: Users, iconColor: 'text-amber-100',
    image: meetingImg,
  },
];

// ═══════════════════════════════════════
// SERVICE RING — خدمات بيت الريف
// ══════════════════════════════════════
const SERVICE_CARDS: CardData[] = [
  {
    id: 'srv-1', type: 'service',
    titleAr: 'مقاولات البناء',
    titleEn: 'Construction',
    subtitleAr: 'فلل · نازل · عمارات',
    subtitleEn: 'Villas · Homes · Buildings',
    badge: '🏗️', badgeColor: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-700/85 to-orange-900/85',
    icon: HardHat, iconColor: 'text-amber-200',
    image: 'https://images.unsplash.com/photo-1640184713822-174b6e94df51?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-2', type: 'service',
    titleAr: 'استشارات هندسية',
    titleEn: 'Engineering',
    subtitleAr: 'تصاميم · مخططات · إشراف',
    subtitleEn: 'Designs · Plans · Supervision',
    badge: '📐', badgeColor: 'from-blue-500 to-indigo-600',
    gradient: 'from-blue-700/85 to-indigo-900/85',
    icon: Compass, iconColor: 'text-blue-200',
    image: 'https://images.unsplash.com/photo-1762146828422-50a8bd416d3c?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-3', type: 'service',
    titleAr: 'شركات الصيانة',
    titleEn: 'Maintenance',
    subtitleAr: 'صيانة دورية · طوارئ 24/7',
    subtitleEn: 'Regular · Emergency 24/7',
    badge: '🔧', badgeColor: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-700/85 to-teal-900/85',
    icon: Wrench, iconColor: 'text-emerald-200',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-4', type: 'service',
    titleAr: 'العمالة الحرفية',
    titleEn: 'Craftsmen',
    subtitleAr: 'معلمين · حرفيين · متخصصين',
    subtitleEn: 'Skilled · Expert · Certified',
    badge: '👷', badgeColor: 'from-yellow-500 to-amber-600',
    gradient: 'from-stone-600/85 to-stone-800/85',
    icon: Users, iconColor: 'text-yellow-200',
    image: 'https://images.unsplash.com/photo-1766499431068-7686d755cec7?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-5', type: 'service',
    titleAr: 'الورش المتخصصة',
    titleEn: 'Workshops',
    subtitleAr: 'حدادة · نجارة · ألمنيوم',
    subtitleEn: 'Metal · Wood · Aluminum',
    badge: '🔨', badgeColor: 'from-red-500 to-rose-600',
    gradient: 'from-red-700/85 to-rose-900/85',
    icon: Hammer, iconColor: 'text-red-200',
    image: 'https://images.unsplash.com/photo-1673201159941-68fcdbbb4fa1?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-6', type: 'service',
    titleAr: 'تأجير المعدات',
    titleEn: 'Equipment',
    subtitleAr: 'رافعات · حفارات · خلاطات',
    subtitleEn: 'Cranes · Excavators · Mixers',
    badge: '🚜', badgeColor: 'from-orange-500 to-amber-600',
    gradient: 'from-orange-700/85 to-amber-900/85',
    icon: Truck, iconColor: 'text-orange-200',
    image: 'https://images.unsplash.com/photo-1674558064214-a40da6370277?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-7', type: 'service',
    titleAr: 'مواد البناء',
    titleEn: 'Materials',
    subtitleAr: 'إسمنت · طوب · حديد',
    subtitleEn: 'Cement · Bricks · Steel',
    badge: '🧱', badgeColor: 'from-rose-500 to-red-600',
    gradient: 'from-slate-600/85 to-slate-800/85',
    icon: Package, iconColor: 'text-rose-200',
    image: 'https://images.unsplash.com/photo-1705214289208-ec900f8d8d35?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-8', type: 'service',
    titleAr: 'الأثاث الفاخر',
    titleEn: 'Furniture',
    subtitleAr: 'عصري · كلاسيكي · مودرن',
    subtitleEn: 'Modern · Classic · Premium',
    badge: '🪑', badgeColor: 'from-violet-500 to-purple-600',
    gradient: 'from-violet-700/85 to-purple-900/85',
    icon: Sofa, iconColor: 'text-violet-200',
    image: 'https://images.unsplash.com/photo-1762803841422-5b8cf8767cd9?w=400&h=260&fit=crop',
  },
  {
    id: 'srv-9', type: 'service',
    titleAr: 'النظافة الاحترافية',
    titleEn: 'Cleaning',
    subtitleAr: 'تنظيف شامل · تعقيم · تلميع',
    subtitleEn: 'Deep Clean · Sanitize · Polish',
    badge: '✨', badgeColor: 'from-sky-500 to-cyan-600',
    gradient: 'from-sky-600/85 to-cyan-800/85',
    icon: SparklesIcon, iconColor: 'text-sky-200',
    image: 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=400&h=260&fit=crop',
  },
];

// ═══════════════════════════════════════
// Premium Card Component
// ═══════════════════════════════════════
function PremiumCard({ card, isEn, size = 'normal' }: { card: CardData; isEn: boolean; size?: 'large' | 'normal' }) {
  const isLarge = size === 'large';

  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden relative cursor-pointer group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
        backdropFilter: 'blur(12px)',
        border: card.type === 'offer'
          ? '1.5px solid rgba(212,175,55,0.35)'
          : '1px solid rgba(255,255,255,0.22)',
        boxShadow: card.type === 'offer'
          ? '0 8px 32px rgba(212,175,55,0.15), 0 2px 8px rgba(0,0,0,0.2)'
          : '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      {/* Background image */}
      {card.image && (
        <div className="absolute inset-0">
          <ImageWithFallback
            src={card.image}
            alt={card.titleAr}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${card.gradient}`} />
        </div>
      )}
      {!card.image && (
        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
      )}

      {/* Premium top shine line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      {/* Badge */}
      {card.badge && (
        <div className={`absolute ${isLarge ? 'top-2 right-2' : 'top-1.5 right-1.5'} z-10`}>
          <span
            className={`bg-gradient-to-r ${card.badgeColor} text-white font-black shadow-lg flex items-center gap-0.5`}
            style={{
              fontSize: isLarge ? 10 : 9,
              padding: isLarge ? '3px 8px' : '2px 7px',
              borderRadius: 20,
              fontFamily: 'Cairo, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            {card.type === 'featured' && card.rating && <Star className="w-2.5 h-2.5 fill-white" />}
            {card.badge}
          </span>
        </div>
      )}

      {/* Content */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 ${isLarge ? 'p-3' : 'p-2.5'}`}>
        {/* Dark content background blur */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent rounded-b-2xl" />

        <div className="relative flex items-end gap-2">
          <div
            className="flex-shrink-0 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/15"
            style={{ width: isLarge ? 28 : 24, height: isLarge ? 28 : 24 }}
          >
            <card.icon className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${card.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h4
                className="text-white leading-tight truncate drop-shadow-lg"
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 800,
                  fontSize: isLarge ? 13 : 12,
                  letterSpacing: '-0.01em',
                }}
              >
                {isEn ? card.titleEn : card.titleAr}
              </h4>
              {card.verified && (
                <BadgeCheck
                  className="flex-shrink-0 text-[#3B9EFF] drop-shadow-md"
                  style={{ width: isLarge ? 14 : 12, height: isLarge ? 14 : 12 }}
                  fill="#3B9EFF"
                  stroke="white"
                  strokeWidth={2.5}
                />
              )}
            </div>
            <p
              className="text-white/80 truncate"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 600,
                fontSize: isLarge ? 10 : 9,
              }}
            >
              {isEn ? card.subtitleEn : card.subtitleAr}
            </p>
          </div>
        </div>

        {/* Rating stars */}
        {card.type === 'featured' && card.rating && (
          <div className="relative flex items-center gap-0.5 mt-1 mr-8">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`${isLarge ? 'w-2.5 h-2.5' : 'w-2 h-2'} ${i < Math.floor(card.rating!) ? 'text-amber-400 fill-amber-400' : 'text-white/25'}`}
              />
            ))}
            <span
              className="text-white/70 font-bold mr-1"
              style={{ fontSize: isLarge ? 9 : 8, fontFamily: 'Cairo, sans-serif' }}
            >
              {card.rating}
            </span>
          </div>
        )}
      </div>

      {/* Hover shine sweep */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)' }}
      />
    </div>
  );
}

// ═══════════════════════════════════════
// Main Unified 3D Scene
// ═══════════════════════════════════════
interface Unified3DSceneProps {
  isEn?: boolean;
}

export function Unified3DScene({ isEn = false }: Unified3DSceneProps) {
  const [heroRotation, setHeroRotation] = useState(0);
  const [serviceRotation, setServiceRotation] = useState(180);
  const [tiltX, setTiltX] = useState(-12);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dragRef = useRef({
    startX: 0, startY: 0,
    startHeroRot: 0, startServiceRot: 0, startTilt: 0,
  });
  const animRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const heroAngleStep = 360 / HERO_CARDS.length;
  const serviceAngleStep = 360 / SERVICE_CARDS.length;

  // ─── Auto-rotation ───
  useEffect(() => {
    let lastTime = performance.now();
    const heroSpeed = 0.012;
    const serviceSpeed = 0.016;

    function animate(now: number) {
      if (!isPaused && !isDragging) {
        const dt = now - lastTime;
        setHeroRotation(prev => (prev + heroSpeed * dt) % 360);
        setServiceRotation(prev => (prev - serviceSpeed * dt) % 360);
      }
      lastTime = now;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPaused, isDragging]);

  // ─── Drag handling ───
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startHeroRot: heroRotation,
      startServiceRot: serviceRotation,
      startTilt: tiltX,
    };
  }, [heroRotation, serviceRotation, tiltX]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    setHeroRotation(dragRef.current.startHeroRot - dx * 0.4);
    setServiceRotation(dragRef.current.startServiceRot + dx * 0.4);

    const newTilt = Math.max(-35, Math.min(10, dragRef.current.startTilt - dy * 0.3));
    setTiltX(newTilt);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => setIsDragging(false), []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{
        height: 370,
        perspective: '1200px',
        perspectiveOrigin: '50% 45%',
      }}
      onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX, e.clientY); }}
      onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => { e.preventDefault(); handleDragMove(e.touches[0].clientX, e.touches[0].clientY); }}
      onTouchEnd={handleDragEnd}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-80 h-80 bg-[#2AA676]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[65%] left-1/3 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-[90px]" />
        <div className="absolute top-[15%] right-1/4 w-36 h-36 bg-[#8B5CF6]/8 rounded-full blur-[70px]" />
      </div>

      {/* ═══ 3D Scene Container ═══ */}
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateX(-50%) translateY(-50%) rotateX(${tiltX}deg)`,
          width: 0,
          height: 0,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {/* ─── RING 1: Hero / Premium Offers (top) ─── */}
        <div
          style={{
            position: 'absolute',
            transformStyle: 'preserve-3d',
            transform: `translateY(-78px) rotateY(${heroRotation}deg)`,
            width: 0, height: 0,
          }}
        >
          {HERO_CARDS.map((card, i) => {
            const angle = heroAngleStep * i;
            const radius = 300;
            return (
              <div
                key={card.id}
                className="absolute"
                style={{
                  width: 170,
                  height: 110,
                  left: -85,
                  top: -55,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <PremiumCard card={card} isEn={isEn} size="large" />
              </div>
            );
          })}
        </div>

        {/* ─── Center divider ─── */}
        <div
          style={{
            position: 'absolute',
            transformStyle: 'preserve-3d',
            transform: `translateY(0px) translateZ(140px) rotateX(${-tiltX}deg)`,
            width: 220,
            left: -110,
            top: -10,
            pointerEvents: 'none',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.7)]" />
            <span
              className="text-[#1F3D2B]/35 text-[10px] whitespace-nowrap"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
            >
              {isEn ? 'Beit Al Reef 3D' : 'بيت الريف ثلاثي الأبعاد'}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#2AA676] shadow-[0_0_6px_rgba(42,166,118,0.7)]" />
            <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#2AA676]/50" />
          </div>
        </div>

        {/* ─── RING 2: Services (bottom) ─── */}
        <div
          style={{
            position: 'absolute',
            transformStyle: 'preserve-3d',
            transform: `translateY(78px) rotateY(${serviceRotation}deg)`,
            width: 0, height: 0,
          }}
        >
          {SERVICE_CARDS.map((card, i) => {
            const angle = serviceAngleStep * i;
            const radius = 260;
            return (
              <div
                key={card.id}
                className="absolute"
                style={{
                  width: 155,
                  height: 100,
                  left: -77,
                  top: -50,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'hidden',
                }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <PremiumCard card={card} isEn={isEn} size="normal" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#F5EEE1] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#F5EEE1] to-transparent z-20 pointer-events-none" />

      {/* Interaction hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div
          className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#E6DCC8]/60"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
        >
          <span className="text-[#D4AF37] text-[9px]">◀</span>
          <span
            className="text-[#1F3D2B]/40 text-[9px]"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            {isEn ? 'drag to explore' : 'اسحب للاستكشاف'}
          </span>
          <span className="text-[#D4AF37] text-[9px]">▶</span>
        </div>
      </div>
    </div>
  );
}