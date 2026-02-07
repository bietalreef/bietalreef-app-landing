import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  ArrowRight, ZoomIn, ZoomOut, Undo2, Redo2, Trash2,
  Grid3X3, Eye, RotateCcw, Maximize2, HelpCircle,
  Download, Share2, Smartphone, Sparkles, Home,
  Sofa, Bed, ChefHat, Bath, Monitor, Lamp,
  StickyNote, Type, X, Check, ChevronDown,
  Ruler, MoreHorizontal, Pencil, SlidersHorizontal,
  ArrowLeft, Layout, Star, Zap, Move,
} from 'lucide-react';

/* ═══════════════════ LANGUAGE HOOK ═══════════════════ */
// Simple inline language for browser (visitor context)
const useLang = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  return { lang, setLang, isEn: lang === 'en' };
};

const f = 'Cairo, sans-serif';

/* ═══════════════════ TYPES ═══════════════════ */
interface Pt { x: number; y: number }
interface Wall { id: string; p1: Pt; p2: Pt; thickness: number }
interface Door {
  id: string; wallId: string; pos: number; width: number;
  flipSide: boolean; flipSwing: boolean;
}
interface Win { id: string; wallId: string; pos: number; width: number }
interface Furn {
  id: string; x: number; y: number; w: number; h: number;
  rot: number; typeId: string; label: string;
}
interface RoomLabel { name: string; height: number; area: number; center: Pt }
interface Annotation { id: string; x: number; y: number; text: string }

/* ═══════════════════ CATALOG ═══════════════════ */
interface CatItem {
  id: string; ar: string; en: string;
  w: number; h: number; icon: string; cat: string;
}

const CATALOG: CatItem[] = [
  { id:'sofa3', ar:'كنبة 3 مقاعد', en:'3-Seat Sofa', w:2200, h:900, icon:'🛋️', cat:'living' },
  { id:'sofa2', ar:'كنبة 2 مقاعد', en:'2-Seat Sofa', w:1600, h:850, icon:'🛋️', cat:'living' },
  { id:'sofaL', ar:'كنبة L', en:'L-Sofa', w:2800, h:2000, icon:'🛋️', cat:'living' },
  { id:'arm', ar:'كرسي', en:'Armchair', w:800, h:800, icon:'💺', cat:'living' },
  { id:'ctable', ar:'طاولة قهوة', en:'Coffee Table', w:1200, h:600, icon:'☕', cat:'living' },
  { id:'tv', ar:'وحدة تلفزيون', en:'TV Unit', w:1800, h:400, icon:'📺', cat:'living' },
  { id:'shelf', ar:'مكتبة', en:'Bookshelf', w:1200, h:350, icon:'📚', cat:'living' },
  { id:'din4', ar:'طاولة طعام 4', en:'Dining 4P', w:1200, h:900, icon:'🍽️', cat:'dining' },
  { id:'din6', ar:'طاولة طعام 6', en:'Dining 6P', w:1800, h:900, icon:'🍽️', cat:'dining' },
  { id:'bking', ar:'سرير كينج', en:'King Bed', w:2000, h:2100, icon:'🛏️', cat:'bedroom' },
  { id:'bqueen', ar:'سرير كوين', en:'Queen Bed', w:1600, h:2000, icon:'🛏️', cat:'bedroom' },
  { id:'bsingle', ar:'سرير مفرد', en:'Single Bed', w:1000, h:2000, icon:'🛏️', cat:'bedroom' },
  { id:'ward', ar:'خزانة ملابس', en:'Wardrobe', w:1800, h:600, icon:'🗄️', cat:'bedroom' },
  { id:'night', ar:'كومودينو', en:'Nightstand', w:500, h:400, icon:'🔲', cat:'bedroom' },
  { id:'dresser', ar:'تسريحة', en:'Dresser', w:1200, h:500, icon:'🪞', cat:'bedroom' },
  { id:'desk', ar:'مكتب عمل', en:'Work Desk', w:1400, h:700, icon:'🖥️', cat:'office' },
  { id:'ochair', ar:'كرسي مكتب', en:'Office Chair', w:550, h:550, icon:'🪑', cat:'office' },
  { id:'filing', ar:'خزانة ملفات', en:'Filing Cabinet', w:400, h:600, icon:'🗄️', cat:'office' },
  { id:'kcounter', ar:'كاونتر مطبخ', en:'Kitchen Counter', w:2400, h:600, icon:'🍳', cat:'kitchen' },
  { id:'island', ar:'جزيرة مطبخ', en:'Kitchen Island', w:1500, h:800, icon:'🏝️', cat:'kitchen' },
  { id:'fridge', ar:'ثلاجة', en:'Fridge', w:700, h:700, icon:'🧊', cat:'kitchen' },
  { id:'stove', ar:'فرن', en:'Stove', w:600, h:600, icon:'🔥', cat:'kitchen' },
  { id:'ksink', ar:'حوض مطبخ', en:'Kitchen Sink', w:600, h:500, icon:'🚰', cat:'kitchen' },
  { id:'toilet', ar:'مرحاض', en:'Toilet', w:400, h:700, icon:'🚽', cat:'bathroom' },
  { id:'tub', ar:'بانيو', en:'Bathtub', w:800, h:1700, icon:'🛁', cat:'bathroom' },
  { id:'shower', ar:'دش', en:'Shower', w:900, h:900, icon:'🚿', cat:'bathroom' },
  { id:'basin', ar:'حوض غسيل', en:'Basin', w:500, h:450, icon:'🧼', cat:'bathroom' },
  { id:'washer', ar:'غسالة', en:'Washer', w:600, h:600, icon:'🫧', cat:'appliance' },
  { id:'ac', ar:'مكيف', en:'AC Unit', w:1000, h:200, icon:'❄️', cat:'appliance' },
];

const CATS = [
  { id:'living', ar:'غرفة المعيشة', en:'Living Room', icon: Sofa },
  { id:'dining', ar:'غرفة الطعام', en:'Dining', icon: ChefHat },
  { id:'bedroom', ar:'غرفة النوم', en:'Bedroom', icon: Bed },
  { id:'office', ar:'المكتب', en:'Office', icon: Monitor },
  { id:'kitchen', ar:'المطبخ', en:'Kitchen', icon: ChefHat },
  { id:'bathroom', ar:'الحمام', en:'Bathroom', icon: Bath },
  { id:'appliance', ar:'الأجهزة', en:'Appliances', icon: Lamp },
];

/* ═══════════════════ TEMPLATES ═══════════════════ */
interface Tpl {
  id: string; ar: string; en: string; icon: string; desc_ar: string; desc_en: string;
  walls: Omit<Wall,'id'>[];
  doors: { wallIdx: number; pos: number; width: number }[];
  windows: { wallIdx: number; pos: number; width: number }[];
  rooms: RoomLabel[];
}

const TEMPLATES: Tpl[] = [
  {
    id:'room1', ar:'غرفة واحدة', en:'Single Room', icon:'🏠', desc_ar:'غرفة بسيطة مع باب ونافذة', desc_en:'Simple room with door and window',
    walls:[
      { p1:{x:1000,y:1000}, p2:{x:5867,y:1000}, thickness:200 },
      { p1:{x:5867,y:1000}, p2:{x:5867,y:6955}, thickness:200 },
      { p1:{x:5867,y:6955}, p2:{x:1000,y:6955}, thickness:200 },
      { p1:{x:1000,y:6955}, p2:{x:1000,y:1000}, thickness:200 },
    ],
    doors:[{ wallIdx:2, pos:0.25, width:900 }],
    windows:[{ wallIdx:0, pos:0.5, width:1500 }],
    rooms:[{ name:'الغرفة', height:2800, area:26.60, center:{x:3434,y:3978} }],
  },
  {
    id:'apt1', ar:'شقة غرفة وصالة', en:'1 BHK Apartment', icon:'🏢', desc_ar:'شقة مع صالة وغرفة نوم ومطبخ', desc_en:'Apartment with living room, bedroom & kitchen',
    walls:[
      { p1:{x:500,y:500}, p2:{x:8500,y:500}, thickness:250 },
      { p1:{x:8500,y:500}, p2:{x:8500,y:7000}, thickness:250 },
      { p1:{x:8500,y:7000}, p2:{x:500,y:7000}, thickness:250 },
      { p1:{x:500,y:7000}, p2:{x:500,y:500}, thickness:250 },
      { p1:{x:4500,y:500}, p2:{x:4500,y:4500}, thickness:150 },
      { p1:{x:4500,y:4500}, p2:{x:8500,y:4500}, thickness:150 },
      { p1:{x:500,y:4500}, p2:{x:2500,y:4500}, thickness:150 },
    ],
    doors:[
      { wallIdx:4, pos:0.6, width:900 },
      { wallIdx:6, pos:0.5, width:800 },
    ],
    windows:[
      { wallIdx:0, pos:0.25, width:1500 },
      { wallIdx:0, pos:0.75, width:1200 },
    ],
    rooms:[
      { name:'الصالة', height:2800, area:24.0, center:{x:2500,y:2500} },
      { name:'غرفة النوم', height:2800, area:16.0, center:{x:6500,y:2500} },
      { name:'المطبخ', height:2700, area:12.0, center:{x:1500,y:5750} },
      { name:'الممر', height:2800, area:10.0, center:{x:6500,y:5750} },
    ],
  },
  {
    id:'villa', ar:'فيلا', en:'Villa', icon:'🏡', desc_ar:'فيلا واسعة مع مجلس وغرف متعددة', desc_en:'Spacious villa with majlis & multiple rooms',
    walls:[
      { p1:{x:500,y:500}, p2:{x:11000,y:500}, thickness:300 },
      { p1:{x:11000,y:500}, p2:{x:11000,y:9000}, thickness:300 },
      { p1:{x:11000,y:9000}, p2:{x:500,y:9000}, thickness:300 },
      { p1:{x:500,y:9000}, p2:{x:500,y:500}, thickness:300 },
      { p1:{x:5500,y:500}, p2:{x:5500,y:5500}, thickness:200 },
      { p1:{x:5500,y:5500}, p2:{x:11000,y:5500}, thickness:200 },
      { p1:{x:500,y:5500}, p2:{x:3500,y:5500}, thickness:200 },
      { p1:{x:3500,y:5500}, p2:{x:3500,y:9000}, thickness:200 },
      { p1:{x:8000,y:5500}, p2:{x:8000,y:9000}, thickness:200 },
    ],
    doors:[
      { wallIdx:4, pos:0.55, width:1000 },
      { wallIdx:7, pos:0.4, width:900 },
      { wallIdx:8, pos:0.4, width:900 },
    ],
    windows:[
      { wallIdx:0, pos:0.25, width:2000 },
      { wallIdx:0, pos:0.75, width:2000 },
      { wallIdx:1, pos:0.3, width:1500 },
    ],
    rooms:[
      { name:'المجلس', height:3200, area:25.0, center:{x:3000,y:3000} },
      { name:'الصالة', height:3200, area:27.5, center:{x:8250,y:3000} },
      { name:'المطبخ', height:2800, area:10.5, center:{x:2000,y:7250} },
      { name:'الماستر', height:3000, area:15.75, center:{x:5750,y:7250} },
      { name:'الضيوف', height:3000, area:10.5, center:{x:9500,y:7250} },
    ],
  },
];

/* ═══════════════════ UTILS ═══════════════════ */
let _uid = 0;
const uid = () => `b${++_uid}_${Date.now().toString(36)}`;
const snap = (v: number, g: number) => Math.round(v / g) * g;
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const wallVec = (w: { p1: Pt; p2: Pt }) => {
  const len = dist(w.p1, w.p2);
  if (len < 0.01) return { dx: 1, dy: 0, nx: 0, ny: 1, len };
  const dx = (w.p2.x - w.p1.x) / len;
  const dy = (w.p2.y - w.p1.y) / len;
  return { dx, dy, nx: -dy, ny: dx, len };
};

const projectOnWall = (pt: Pt, w: Wall): { t: number; d: number; closest: Pt } => {
  const v = wallVec(w);
  const t = Math.max(0.05, Math.min(0.95,
    ((pt.x - w.p1.x) * v.dx + (pt.y - w.p1.y) * v.dy) / v.len
  ));
  const closest = { x: lerp(w.p1.x, w.p2.x, t), y: lerp(w.p1.y, w.p2.y, t) };
  return { t, d: dist(pt, closest), closest };
};

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
type ViewState = 'landing' | 'editor';

export function DesignStudio() {
  const navigate = useNavigate();
  const { lang, setLang, isEn } = useLang();
  const [view, setView] = useState<ViewState>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<Tpl | null>(null);

  if (view === 'editor' && selectedTemplate) {
    return (
      <DesignEditor
        template={selectedTemplate}
        isEn={isEn}
        lang={lang}
        onBack={() => { setView('landing'); setSelectedTemplate(null); }}
        onSwitchLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
      />
    );
  }

  return <DesignLanding
    isEn={isEn}
    lang={lang}
    onSelectTemplate={(t) => { setSelectedTemplate(t); setView('editor'); }}
    onBack={() => navigate('/home')}
    onSwitchLang={() => setLang(lang === 'ar' ? 'en' : 'ar')}
  />;
}

/* ═══════════════════ LANDING PAGE ═══════════════════ */
function DesignLanding({ isEn, lang, onSelectTemplate, onBack, onSwitchLang }: {
  isEn: boolean; lang: string;
  onSelectTemplate: (t: Tpl) => void;
  onBack: () => void;
  onSwitchLang: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-[#1F3D2B] via-[#2A5A3B] to-[#1F3D2B]">
        {/* Geometric Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {/* Nav */}
          <div className="flex items-center justify-between mb-8 sm:mb-16">
            <button onClick={onBack} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              {isEn ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              <span className="text-sm font-semibold" style={{ fontFamily: f }}>
                {isEn ? 'Home' : 'الرئيسية'}
              </span>
            </button>
            <button onClick={onSwitchLang}
              className="px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold hover:bg-white/20 transition-colors"
              style={{ fontFamily: f }}>
              {isEn ? 'عربي' : 'EN'}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-[#2AA676]/20 text-[#2AA676] px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold" style={{ fontFamily: f }}>
                    {isEn ? 'Free for all visitors' : 'مجاني لجميع الزوّار'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
                  style={{ fontFamily: f }}>
                  {isEn ? (
                    <>Design Your <span className="text-[#2AA676]">Dream Home</span></>
                  ) : (
                    <>صمّم <span className="text-[#2AA676]">بيت أحلامك</span></>
                  )}
                </h1>

                <p className="text-base sm:text-lg text-white/70 mb-8 max-w-lg leading-relaxed"
                  style={{ fontFamily: f }}>
                  {isEn 
                    ? 'Choose a template, drag furniture, and visualize your space. No signup needed — start designing in seconds.'
                    : 'اختر قالب جاهز، اسحب الأثاث، وشاهد تصميمك يتحقق. بدون تسجيل — ابدأ التصميم في ثوانٍ.'}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  {[
                    { icon: Layout, text: isEn ? '3 Ready Templates' : '٣ قوالب جاهزة' },
                    { icon: Sofa, text: isEn ? '28+ Furniture Items' : '+٢٨ قطعة أثاث' },
                    { icon: Download, text: isEn ? 'Export as Image' : 'تصدير كصورة' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl">
                      <item.icon className="w-4 h-4 text-[#2AA676]" />
                      <span className="text-xs text-white/80 font-semibold" style={{ fontFamily: f }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1 max-w-md lg:max-w-lg"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-[#2AA676]/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1721244654195-943615c56ac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                    alt="Floor Plan"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 text-center">
                    <span className="text-white text-sm font-bold" style={{ fontFamily: f }}>
                      {isEn ? 'Interactive 2D Planner' : 'مخطط ثنائي الأبعاد تفاعلي'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Templates Section ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2B] mb-3" style={{ fontFamily: f }}>
            {isEn ? 'Choose Your Starting Point' : 'اختر نقطة البداية'}
          </h2>
          <p className="text-sm text-[#1F3D2B]/60 max-w-md mx-auto" style={{ fontFamily: f }}>
            {isEn 
              ? 'Pick a template that matches your space, then customize it your way'
              : 'اختر قالب يناسب مساحتك، ثم خصّصه على ذوقك'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {TEMPLATES.map((tpl, i) => (
            <motion.button
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelectTemplate(tpl)}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-[#1F3D2B]/8 hover:shadow-lg hover:border-[#2AA676]/40 transition-all duration-300 text-start"
            >
              {/* Template Preview Mini */}
              <div className="w-full aspect-[4/3] bg-[#F5EEE1] rounded-xl mb-4 flex items-center justify-center overflow-hidden relative">
                <TemplatePreview template={tpl} />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent" />
                <div className="absolute top-3 start-3">
                  <span className="text-3xl">{tpl.icon}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1F3D2B] mb-1" style={{ fontFamily: f }}>
                {isEn ? tpl.en : tpl.ar}
              </h3>
              <p className="text-xs text-[#1F3D2B]/50 mb-4" style={{ fontFamily: f }}>
                {isEn ? tpl.desc_en : tpl.desc_ar}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                  {tpl.rooms.length} {isEn ? 'rooms' : 'غرف'} •{' '}
                  {tpl.walls.length} {isEn ? 'walls' : 'جدران'}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-2xl bg-[#2AA676]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-[#2AA676] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                  style={{ fontFamily: f }}>
                  {isEn ? 'Start Designing' : 'ابدأ التصميم'} →
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="relative overflow-hidden bg-gradient-to-l from-[#111318] via-[#1C2026] to-[#111318] rounded-3xl p-8 sm:p-12">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-[#2AA676] via-[#D4AF37] to-[#2AA676]" />
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-start">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2" style={{ fontFamily: f }}>
                {isEn ? 'Want Professional Tools?' : 'تبي أدوات احترافية؟'}
              </h3>
              <p className="text-sm text-white/50" style={{ fontFamily: f }}>
                {isEn 
                  ? 'Download our app for wall drawing, 3D conversion, and direct connection with craftsmen'
                  : 'حمّل التطبيق لرسم الجدران، التحويل ثلاثي الأبعاد، والتواصل المباشر مع الحرفيين'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-[#2AA676] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#23925f] transition-colors shadow-lg shadow-[#2AA676]/30"
                style={{ fontFamily: f }}>
                <Smartphone className="w-4 h-4" />
                {isEn ? 'Download App' : 'حمّل التطبيق'}
              </button>
              <button className="flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
                style={{ fontFamily: f }}>
                <Star className="w-4 h-4 text-[#D4AF37]" />
                {isEn ? 'View Plans' : 'الباقات'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ TEMPLATE PREVIEW (SVG) ═══════════════════ */
function TemplatePreview({ template }: { template: Tpl }) {
  const allX = template.walls.flatMap(w => [w.p1.x, w.p2.x]);
  const allY = template.walls.flatMap(w => [w.p1.y, w.p2.y]);
  const minX = Math.min(...allX) - 200;
  const minY = Math.min(...allY) - 200;
  const maxX = Math.max(...allX) + 200;
  const maxY = Math.max(...allY) + 200;
  const vw = maxX - minX;
  const vh = maxY - minY;

  return (
    <svg viewBox={`${minX} ${minY} ${vw} ${vh}`} className="w-full h-full p-4">
      {template.walls.map((w, i) => (
        <line key={i} x1={w.p1.x} y1={w.p1.y} x2={w.p2.x} y2={w.p2.y}
          stroke="#1F3D2B" strokeWidth={w.thickness * 0.8} strokeLinecap="round" />
      ))}
      {template.rooms.map((r, i) => (
        <text key={i} x={r.center.x} y={r.center.y} textAnchor="middle"
          fill="#1F3D2B" fontSize="350" fontWeight="700" fontFamily={f} opacity="0.5">
          {r.name}
        </text>
      ))}
    </svg>
  );
}

/* ═══════════════════ DESIGN EDITOR ═══════════════════ */
function DesignEditor({ template, isEn, lang, onBack, onSwitchLang }: {
  template: Tpl; isEn: boolean; lang: string;
  onBack: () => void; onSwitchLang: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  /* ── state ── */
  const [walls, setWalls] = useState<Wall[]>([]);
  const [doors, setDoors] = useState<Door[]>([]);
  const [wins, setWins] = useState<Win[]>([]);
  const [furns, setFurns] = useState<Furn[]>([]);
  const [rooms, setRooms] = useState<RoomLabel[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [zoom, setZoom] = useState(0.045);
  const [offset, setOffset] = useState<Pt>({ x: 60, y: 40 });
  const [showGrid, setShowGrid] = useState(true);
  const [showDims, setShowDims] = useState(true);

  const [sel, setSel] = useState<{ type: 'furn' | 'annotation'; id: string } | null>(null);
  const [isPan, setIsPan] = useState(false);
  const [panPrev, setPanPrev] = useState<Pt | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOff, setDragOff] = useState<Pt>({ x: 0, y: 0 });

  const [activePanel, setActivePanel] = useState<'catalog' | 'notes' | null>('catalog');
  const [catalogCat, setCatalogCat] = useState('living');
  const [showHelp, setShowHelp] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const [cSize, setCSize] = useState({ w: 800, h: 600 });
  const gridSnap = 100;

  /* ── init template ── */
  useEffect(() => {
    const nw = template.walls.map(w => ({ ...w, id: uid() }));
    setWalls(nw);
    setDoors(template.doors.map(d => ({
      id: uid(), wallId: nw[d.wallIdx]?.id || '', pos: d.pos, width: d.width,
      flipSide: false, flipSwing: false,
    })));
    setWins(template.windows.map(w => ({
      id: uid(), wallId: nw[w.wallIdx]?.id || '', pos: w.pos, width: w.width,
    })));
    setRooms(template.rooms);
    setFurns([]);
    setAnnotations([]);
  }, [template]);

  /* ── canvas size ── */
  useEffect(() => {
    const onResize = () => {
      if (boxRef.current) {
        const r = boxRef.current.getBoundingClientRect();
        setCSize({ w: Math.floor(r.width), h: Math.floor(r.height) });
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── history ── */
  const histRef = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const pushH = useCallback(() => {
    const s = JSON.stringify({ walls, doors, wins, furns, rooms, annotations });
    histRef.current = histRef.current.slice(0, histIdx.current + 1);
    histRef.current.push(s);
    histIdx.current++;
  }, [walls, doors, wins, furns, rooms, annotations]);

  const restoreH = (idx: number) => {
    const s = JSON.parse(histRef.current[idx]);
    setWalls(s.walls); setDoors(s.doors); setWins(s.wins);
    setFurns(s.furns); setRooms(s.rooms); setAnnotations(s.annotations || []);
    histIdx.current = idx;
  };
  const undo = () => { if (histIdx.current > 0) restoreH(histIdx.current - 1); };
  const redo = () => { if (histIdx.current < histRef.current.length - 1) restoreH(histIdx.current + 1); };

  /* ── coordinate transforms ── */
  const w2s = useCallback((p: Pt): Pt => ({ x: p.x * zoom + offset.x, y: p.y * zoom + offset.y }), [zoom, offset]);
  const s2w = useCallback((sx: number, sy: number): Pt => ({ x: (sx - offset.x) / zoom, y: (sy - offset.y) / zoom }), [zoom, offset]);

  /* ═══════════════════ RENDER ═══════════════════ */
  const render = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = cv.width / dpr, H = cv.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    /* background */
    ctx.fillStyle = '#FAFAF8';
    ctx.fillRect(0, 0, W, H);

    /* grid */
    if (showGrid) {
      const tl = s2w(0, 0), br = s2w(W, H);
      if (zoom > 0.015) {
        ctx.strokeStyle = '#F0EDE6';
        ctx.lineWidth = 0.5;
        for (let x = snap(tl.x, 100); x <= br.x; x += 100) {
          const sx = w2s({ x, y: 0 }).x;
          ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
        }
        for (let y = snap(tl.y, 100); y <= br.y; y += 100) {
          const sy = w2s({ x: 0, y }).y;
          ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
        }
      }
      ctx.strokeStyle = '#E6E0D4';
      ctx.lineWidth = 0.8;
      for (let x = snap(tl.x, 1000); x <= br.x; x += 1000) {
        const sx = w2s({ x, y: 0 }).x;
        ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
      }
      for (let y = snap(tl.y, 1000); y <= br.y; y += 1000) {
        const sy = w2s({ x: 0, y }).y;
        ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      }
    }

    /* walls */
    walls.forEach(w => {
      const v = wallVec(w);
      const ht = w.thickness / 2;
      const pts = [
        w2s({ x: w.p1.x + v.nx * ht, y: w.p1.y + v.ny * ht }),
        w2s({ x: w.p2.x + v.nx * ht, y: w.p2.y + v.ny * ht }),
        w2s({ x: w.p2.x - v.nx * ht, y: w.p2.y - v.ny * ht }),
        w2s({ x: w.p1.x - v.nx * ht, y: w.p1.y - v.ny * ht }),
      ];
      ctx.fillStyle = '#3D4A52';
      ctx.strokeStyle = '#2A3238';
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });

    /* doors */
    doors.forEach(door => {
      const w = walls.find(ww => ww.id === door.wallId);
      if (!w) return;
      const v = wallVec(w);
      const cx = lerp(w.p1.x, w.p2.x, door.pos);
      const cy = lerp(w.p1.y, w.p2.y, door.pos);
      const hw = door.width / 2;
      const side = door.flipSide ? -1 : 1;

      // opening in wall
      const gapPts = [
        w2s({ x: cx - v.dx * hw + v.nx * w.thickness * 0.6, y: cy - v.dy * hw + v.ny * w.thickness * 0.6 }),
        w2s({ x: cx + v.dx * hw + v.nx * w.thickness * 0.6, y: cy + v.dy * hw + v.ny * w.thickness * 0.6 }),
        w2s({ x: cx + v.dx * hw - v.nx * w.thickness * 0.6, y: cy + v.dy * hw - v.ny * w.thickness * 0.6 }),
        w2s({ x: cx - v.dx * hw - v.nx * w.thickness * 0.6, y: cy - v.dy * hw - v.ny * w.thickness * 0.6 }),
      ];
      ctx.fillStyle = '#FAFAF8';
      ctx.beginPath();
      gapPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill();

      // arc
      const hingeX = cx - v.dx * hw * (door.flipSwing ? -1 : 1);
      const hingeY = cy - v.dy * hw * (door.flipSwing ? -1 : 1);
      const radius = door.width;
      const hs = w2s({ x: hingeX, y: hingeY });
      const rs = radius * zoom;
      const baseAngle = Math.atan2(v.dy, v.dx);
      const startA = baseAngle + (side > 0 ? 0 : Math.PI);
      const endA = startA + (door.flipSwing ? -Math.PI / 2 : Math.PI / 2);
      ctx.strokeStyle = '#2AA676';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(hs.x, hs.y, rs, Math.min(startA, endA), Math.max(startA, endA));
      ctx.stroke();
      ctx.setLineDash([]);

      // door line
      const doorEndX = hingeX + v.nx * side * radius;
      const doorEndY = hingeY + v.ny * side * radius;
      const de = w2s({ x: doorEndX, y: doorEndY });
      ctx.strokeStyle = '#2AA676';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(hs.x, hs.y); ctx.lineTo(de.x, de.y); ctx.stroke();
    });

    /* windows */
    wins.forEach(wi => {
      const w = walls.find(ww => ww.id === wi.wallId);
      if (!w) return;
      const v = wallVec(w);
      const cx = lerp(w.p1.x, w.p2.x, wi.pos);
      const cy = lerp(w.p1.y, w.p2.y, wi.pos);
      const hw = wi.width / 2;
      const ht = w.thickness / 2;

      const pts = [
        w2s({ x: cx - v.dx * hw + v.nx * ht, y: cy - v.dy * hw + v.ny * ht }),
        w2s({ x: cx + v.dx * hw + v.nx * ht, y: cy + v.dy * hw + v.ny * ht }),
        w2s({ x: cx + v.dx * hw - v.nx * ht, y: cy + v.dy * hw - v.ny * ht }),
        w2s({ x: cx - v.dx * hw - v.nx * ht, y: cy - v.dy * hw - v.ny * ht }),
      ];
      ctx.fillStyle = '#B8E6F0';
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();

      // center line
      const c1 = w2s({ x: cx + v.nx * ht * 0.3, y: cy + v.ny * ht * 0.3 });
      const c2 = w2s({ x: cx - v.nx * ht * 0.3, y: cy - v.ny * ht * 0.3 });
      ctx.strokeStyle = '#3498DB';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(c1.x - v.dx * hw * zoom, c1.y - v.dy * hw * zoom);
      ctx.lineTo(c1.x + v.dx * hw * zoom, c1.y + v.dy * hw * zoom);
      ctx.stroke();
    });

    /* room labels */
    rooms.forEach(r => {
      const sp = w2s(r.center);
      ctx.fillStyle = '#1F3D2B';
      ctx.font = `bold ${Math.max(10, 14 * zoom * 18)}px ${f}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(r.name, sp.x, sp.y - 8 * zoom * 18);
      ctx.fillStyle = '#6B8E7B';
      ctx.font = `600 ${Math.max(8, 10 * zoom * 18)}px ${f}`;
      ctx.fillText(`${r.area.toFixed(1)} m²`, sp.x, sp.y + 10 * zoom * 18);
    });

    /* dimensions */
    if (showDims) {
      walls.forEach(w => {
        const v = wallVec(w);
        const mid = w2s({ x: (w.p1.x + w.p2.x) / 2 + v.nx * 400, y: (w.p1.y + w.p2.y) / 2 + v.ny * 400 });
        const lenM = (v.len / 1000).toFixed(2);
        ctx.fillStyle = 'rgba(31,61,43,0.6)';
        ctx.font = `bold ${Math.max(8, 9 * zoom * 18)}px ${f}`;
        ctx.textAlign = 'center';
        ctx.fillText(`${lenM} m`, mid.x, mid.y);
      });
    }

    /* furniture */
    furns.forEach(fi => {
      const isSel = sel?.type === 'furn' && sel.id === fi.id;
      const tl = w2s({ x: fi.x, y: fi.y });
      const sw = fi.w * zoom;
      const sh = fi.h * zoom;

      ctx.save();
      ctx.translate(tl.x + sw / 2, tl.y + sh / 2);
      ctx.rotate((fi.rot * Math.PI) / 180);
      ctx.translate(-sw / 2, -sh / 2);

      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(2, 2, sw, sh);

      // body
      ctx.fillStyle = isSel ? 'rgba(42,166,118,0.15)' : 'rgba(255,255,255,0.9)';
      ctx.strokeStyle = isSel ? '#2AA676' : '#C5BFAE';
      ctx.lineWidth = isSel ? 2 : 1;
      ctx.fillRect(0, 0, sw, sh);
      ctx.strokeRect(0, 0, sw, sh);

      // icon
      const catItem = CATALOG.find(c => c.id === fi.typeId);
      if (catItem && sw > 20 && sh > 20) {
        ctx.font = `${Math.min(sw, sh) * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(catItem.icon, sw / 2, sh / 2);
      }

      // label
      if (sw > 40) {
        ctx.fillStyle = isSel ? '#1F3D2B' : '#7B8C80';
        ctx.font = `bold ${Math.max(6, Math.min(10, sw * 0.08))}px ${f}`;
        ctx.textAlign = 'center';
        ctx.fillText(fi.label, sw / 2, sh + 12);
      }

      ctx.restore();
    });

    /* annotations */
    annotations.forEach(an => {
      const sp = w2s({ x: an.x, y: an.y });
      const isSel2 = sel?.type === 'annotation' && sel.id === an.id;

      // pin
      ctx.fillStyle = isSel2 ? '#D4AF37' : '#E74C3C';
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📌', sp.x, sp.y);

      // text bubble
      if (an.text) {
        ctx.font = `bold 11px ${f}`;
        const tm = ctx.measureText(an.text);
        const bw = tm.width + 16;
        const bh = 24;
        const bx = sp.x - bw / 2;
        const by = sp.y - 35;
        
        ctx.fillStyle = isSel2 ? '#FFF8E1' : '#fff';
        ctx.strokeStyle = isSel2 ? '#D4AF37' : '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const rr = 6;
        ctx.moveTo(bx + rr, by);
        ctx.lineTo(bx + bw - rr, by);
        ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + rr);
        ctx.lineTo(bx + bw, by + bh - rr);
        ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - rr, by + bh);
        ctx.lineTo(bx + rr, by + bh);
        ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - rr);
        ctx.lineTo(bx, by + rr);
        ctx.quadraticCurveTo(bx, by, bx + rr, by);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = '#1F3D2B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(an.text, sp.x, by + bh / 2);
      }
    });

  }, [walls, doors, wins, furns, rooms, annotations, zoom, offset, showGrid, showDims, sel, w2s, s2w, cSize]);

  useEffect(() => { render(); }, [render]);

  /* ═══════════════════ INTERACTION ═══════════════════ */
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const cv = canvasRef.current;
    if (!cv) return { x: 0, y: 0 };
    const rect = cv.getBoundingClientRect();
    const touch = 'touches' in e ? e.touches[0] || (e as any).changedTouches?.[0] : null;
    const cx = touch ? touch.clientX : (e as React.MouseEvent).clientX;
    const cy = touch ? touch.clientY : (e as React.MouseEvent).clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const wp = s2w(pos.x, pos.y);

    // Adding note mode
    if (addingNote) {
      const newNote: Annotation = {
        id: uid(),
        x: snap(wp.x, gridSnap),
        y: snap(wp.y, gridSnap),
        text: noteText || (isEn ? 'Note' : 'ملاحظة'),
      };
      setAnnotations(prev => [...prev, newNote]);
      setSel({ type: 'annotation', id: newNote.id });
      setAddingNote(false);
      setNoteText('');
      pushH();
      return;
    }

    // Check furniture hit
    for (let i = furns.length - 1; i >= 0; i--) {
      const fi = furns[i];
      if (wp.x >= fi.x && wp.x <= fi.x + fi.w && wp.y >= fi.y && wp.y <= fi.y + fi.h) {
        setSel({ type: 'furn', id: fi.id });
        setDragId(fi.id);
        setDragOff({ x: wp.x - fi.x, y: wp.y - fi.y });
        return;
      }
    }

    // Check annotation hit
    for (const an of annotations) {
      if (dist(wp, { x: an.x, y: an.y }) < 300) {
        setSel({ type: 'annotation', id: an.id });
        setDragId(an.id);
        setDragOff({ x: wp.x - an.x, y: wp.y - an.y });
        return;
      }
    }

    // Pan
    setSel(null);
    setIsPan(true);
    setPanPrev(pos);
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const wp = s2w(pos.x, pos.y);

    if (dragId) {
      // dragging furniture
      const fi = furns.find(f2 => f2.id === dragId);
      if (fi) {
        setFurns(p => p.map(f2 => f2.id === dragId ? {
          ...f2, x: snap(wp.x - dragOff.x, gridSnap), y: snap(wp.y - dragOff.y, gridSnap)
        } : f2));
        return;
      }
      // dragging annotation
      const an = annotations.find(a => a.id === dragId);
      if (an) {
        setAnnotations(p => p.map(a => a.id === dragId ? {
          ...a, x: snap(wp.x - dragOff.x, gridSnap), y: snap(wp.y - dragOff.y, gridSnap)
        } : a));
        return;
      }
    }

    if (isPan && panPrev) {
      setOffset(o => ({ x: o.x + pos.x - panPrev.x, y: o.y + pos.y - panPrev.y }));
      setPanPrev(pos);
    }
  };

  const onUp = () => {
    if (isPan) { setIsPan(false); setPanPrev(null); }
    if (dragId) { setDragId(null); pushH(); }
  };

  const lastPinch = useRef(0);
  const onTouchMove2 = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastPinch.current > 0) {
        const factor = d / lastPinch.current;
        setZoom(z => Math.min(0.2, Math.max(0.008, z * factor)));
      }
      lastPinch.current = d;
      return;
    }
    onMove(e);
  };
  const onTouchEnd2 = () => { lastPinch.current = 0; onUp(); };

  /* ── zoom ── */
  const zoomIn = () => setZoom(z => Math.min(0.2, z * 1.3));
  const zoomOut = () => setZoom(z => Math.max(0.008, z / 1.3));
  const resetView = () => { setZoom(0.045); setOffset({ x: 60, y: 40 }); };

  /* ── add furniture ── */
  const addFurn = (c: CatItem) => {
    const center = s2w(cSize.w / 2, cSize.h / 2);
    const nf: Furn = {
      id: uid(), x: snap(center.x - c.w / 2, gridSnap), y: snap(center.y - c.h / 2, gridSnap),
      w: c.w, h: c.h, rot: 0, typeId: c.id, label: isEn ? c.en : c.ar,
    };
    setFurns(prev => [...prev, nf]);
    setSel({ type: 'furn', id: nf.id });
    pushH();
  };

  /* ── actions ── */
  const deleteSel = () => {
    if (!sel) return;
    if (sel.type === 'furn') setFurns(p => p.filter(f2 => f2.id !== sel.id));
    if (sel.type === 'annotation') setAnnotations(p => p.filter(a => a.id !== sel.id));
    setSel(null); pushH();
  };

  const rotateSel = () => {
    if (sel?.type === 'furn') {
      setFurns(p => p.map(it => it.id === sel.id ? { ...it, rot: (it.rot + 90) % 360, w: it.h, h: it.w } : it));
      pushH();
    }
  };

  /* ── export ── */
  const exportImage = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const link = document.createElement('a');
    link.download = `bait-alreef-design-${Date.now()}.png`;
    link.href = cv.toDataURL('image/png');
    link.click();
    setShowExport(false);
  };

  /* scroll wheel zoom */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom(z => Math.min(0.2, Math.max(0.008, z * factor)));
    };
    cv.addEventListener('wheel', handler, { passive: false });
    return () => cv.removeEventListener('wheel', handler);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#FAFAF8] flex flex-col z-50" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ═══ HEADER ═══ */}
      <div className="bg-white border-b border-[#E6E0D4] px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="flex items-center gap-2 text-[#1F3D2B]/60 hover:text-[#1F3D2B] transition-colors">
            {isEn ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#1F3D2B] flex items-center gap-2" style={{ fontFamily: f }}>
              <Layout className="w-4 h-4 text-[#2AA676]" />
              {isEn ? template.en : template.ar}
            </h1>
            <p className="text-[10px] text-[#1F3D2B]/40" style={{ fontFamily: f }}>
              {rooms.length} {isEn ? 'rooms' : 'غرف'} • {furns.length} {isEn ? 'items' : 'قطعة'} • {annotations.length} {isEn ? 'notes' : 'ملاحظة'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowHelp(true)}
            className="p-2 hover:bg-[#F5EEE1] rounded-xl transition-colors">
            <HelpCircle className="w-4 h-4 text-[#1F3D2B]/40" />
          </button>
          <button onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 bg-[#2AA676] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#23925f] transition-colors shadow-sm"
            style={{ fontFamily: f }}>
            <Download className="w-3.5 h-3.5" />
            {isEn ? 'Export' : 'تصدير'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* ═══ SIDE PANEL (Desktop) ═══ */}
        <div className="hidden md:flex w-72 bg-white border-e border-[#E6E0D4] flex-col shrink-0 overflow-hidden">
          {/* Panel Tabs */}
          <div className="flex border-b border-[#E6E0D4]">
            <button onClick={() => setActivePanel('catalog')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-colors ${
                activePanel === 'catalog' ? 'text-[#2AA676] border-b-2 border-[#2AA676] bg-[#2AA676]/5' : 'text-[#1F3D2B]/40'
              }`} style={{ fontFamily: f }}>
              <Sofa className="w-4 h-4" />
              {isEn ? 'Furniture' : 'الأثاث'}
            </button>
            <button onClick={() => setActivePanel('notes')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-colors ${
                activePanel === 'notes' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-[#D4AF37]/5' : 'text-[#1F3D2B]/40'
              }`} style={{ fontFamily: f }}>
              <StickyNote className="w-4 h-4" />
              {isEn ? 'Notes' : 'ملاحظات'}
            </button>
          </div>

          {/* Catalog Panel */}
          {activePanel === 'catalog' && (
            <div className="flex-1 overflow-y-auto">
              {/* Categories */}
              <div className="p-3 flex flex-wrap gap-1.5">
                {CATS.map(c => {
                  const Icon = c.icon;
                  return (
                    <button key={c.id} onClick={() => setCatalogCat(c.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                        catalogCat === c.id 
                          ? 'bg-[#2AA676] text-white shadow-sm' 
                          : 'bg-[#F5EEE1] text-[#1F3D2B]/60 hover:bg-[#EDE5D5]'
                      }`} style={{ fontFamily: f }}>
                      <Icon className="w-3.5 h-3.5" />
                      {isEn ? c.en : c.ar}
                    </button>
                  );
                })}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 pt-0">
                {CATALOG.filter(c => c.cat === catalogCat).map(item => (
                  <button key={item.id} onClick={() => addFurn(item)}
                    className="bg-[#F5EEE1]/50 border border-[#1F3D2B]/8 rounded-xl p-3 flex flex-col items-center gap-1.5 hover:border-[#2AA676]/40 hover:bg-[#2AA676]/5 active:scale-95 transition-all group">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-bold text-[#1F3D2B]/70 leading-tight text-center"
                      style={{ fontFamily: f }}>
                      {isEn ? item.en : item.ar}
                    </span>
                    <span className="text-[8px] text-[#1F3D2B]/30 font-semibold">
                      {(item.w / 10).toFixed(0)}×{(item.h / 10).toFixed(0)} cm
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Panel */}
          {activePanel === 'notes' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <div className="space-y-2">
                <input
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  placeholder={isEn ? 'Enter note text...' : 'اكتب نص الملاحظة...'}
                  className="w-full px-3 py-2 bg-[#F5EEE1] border border-[#1F3D2B]/10 rounded-xl text-xs text-[#1F3D2B] placeholder:text-[#1F3D2B]/30 focus:outline-none focus:border-[#D4AF37]"
                  style={{ fontFamily: f }}
                />
                <button
                  onClick={() => setAddingNote(true)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    addingNote 
                      ? 'bg-[#D4AF37] text-white animate-pulse' 
                      : 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                  }`}
                  style={{ fontFamily: f }}>
                  <StickyNote className="w-4 h-4" />
                  {addingNote 
                    ? (isEn ? 'Click on the plan...' : 'انقر على المخطط...')
                    : (isEn ? 'Add Note to Plan' : 'أضف ملاحظة على المخطط')}
                </button>
              </div>

              {/* Notes list */}
              {annotations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-[#1F3D2B]/40 uppercase" style={{ fontFamily: f }}>
                    {isEn ? 'Your Notes' : 'ملاحظاتك'} ({annotations.length})
                  </h4>
                  {annotations.map(an => (
                    <div key={an.id}
                      className={`flex items-start gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        sel?.id === an.id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#1F3D2B]/8 hover:bg-[#F5EEE1]'
                      }`}
                      onClick={() => setSel({ type: 'annotation', id: an.id })}>
                      <span className="text-sm">📌</span>
                      <span className="text-[11px] text-[#1F3D2B]/70 flex-1" style={{ fontFamily: f }}>{an.text}</span>
                      <button onClick={(e) => { e.stopPropagation(); setAnnotations(p => p.filter(a => a.id !== an.id)); pushH(); }}
                        className="p-1 hover:bg-red-50 rounded-lg">
                        <X className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {annotations.length === 0 && (
                <div className="text-center py-8">
                  <span className="text-3xl mb-2 block">📝</span>
                  <p className="text-xs text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                    {isEn ? 'Add notes to explain your vision' : 'أضف ملاحظات لشرح رؤيتك'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* App CTA in sidebar */}
          <div className="p-3 border-t border-[#E6E0D4] bg-gradient-to-b from-transparent to-[#2AA676]/5">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1F3D2B] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#2A5A3B] transition-colors"
              style={{ fontFamily: f }}>
              <Smartphone className="w-4 h-4" />
              {isEn ? 'Pro tools in the app' : 'أدوات احترافية في التطبيق'}
            </button>
          </div>
        </div>

        {/* ═══ CANVAS AREA ═══ */}
        <div className="flex-1 relative overflow-hidden">
          <div ref={boxRef} className="absolute inset-0 touch-none"
            style={{ cursor: addingNote ? 'crosshair' : (isPan ? 'grabbing' : 'grab') }}>
            <canvas ref={canvasRef}
              width={cSize.w * (window.devicePixelRatio || 1)}
              height={cSize.h * (window.devicePixelRatio || 1)}
              style={{ width: cSize.w, height: cSize.h }}
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
              onTouchStart={onDown} onTouchMove={onTouchMove2} onTouchEnd={onTouchEnd2}
            />
          </div>

          {/* Note mode indicator */}
          <AnimatePresence>
            {addingNote && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-full shadow-lg"
              >
                <StickyNote className="w-4 h-4" />
                <span className="text-xs font-bold" style={{ fontFamily: f }}>
                  {isEn ? 'Click where you want to place the note' : 'انقر حيث تريد وضع الملاحظة'}
                </span>
                <button onClick={() => setAddingNote(false)}
                  className="p-1 bg-white/20 rounded-full hover:bg-white/30">
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zoom Controls */}
          <div className="absolute top-4 start-4 flex flex-col gap-1.5 z-20">
            <button onClick={zoomIn}
              className="w-9 h-9 bg-white rounded-xl shadow-md border border-[#E6E0D4] flex items-center justify-center hover:bg-[#F5EEE1] transition-colors">
              <ZoomIn className="w-4 h-4 text-[#1F3D2B]" />
            </button>
            <button onClick={zoomOut}
              className="w-9 h-9 bg-white rounded-xl shadow-md border border-[#E6E0D4] flex items-center justify-center hover:bg-[#F5EEE1] transition-colors">
              <ZoomOut className="w-4 h-4 text-[#1F3D2B]" />
            </button>
            <button onClick={resetView}
              className="w-9 h-9 bg-white rounded-xl shadow-md border border-[#E6E0D4] flex items-center justify-center hover:bg-[#F5EEE1] transition-colors">
              <Maximize2 className="w-4 h-4 text-[#1F3D2B]" />
            </button>
            <div className="h-px bg-[#E6E0D4] mx-1" />
            <button onClick={() => setShowGrid(g => !g)}
              className={`w-9 h-9 rounded-xl shadow-md border flex items-center justify-center transition-colors ${
                showGrid ? 'bg-[#2AA676] border-[#2AA676] text-white' : 'bg-white border-[#E6E0D4] text-[#1F3D2B] hover:bg-[#F5EEE1]'
              }`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowDims(d => !d)}
              className={`w-9 h-9 rounded-xl shadow-md border flex items-center justify-center transition-colors ${
                showDims ? 'bg-[#2AA676] border-[#2AA676] text-white' : 'bg-white border-[#E6E0D4] text-[#1F3D2B] hover:bg-[#F5EEE1]'
              }`}>
              <Ruler className="w-4 h-4" />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="absolute bottom-4 start-4 flex flex-col gap-1.5 z-20">
            <button onClick={undo}
              className="w-9 h-9 bg-white rounded-xl shadow-md border border-[#E6E0D4] flex items-center justify-center hover:bg-[#F5EEE1] transition-colors">
              <Undo2 className="w-4 h-4 text-[#1F3D2B]" />
            </button>
            <button onClick={redo}
              className="w-9 h-9 bg-white rounded-xl shadow-md border border-[#E6E0D4] flex items-center justify-center hover:bg-[#F5EEE1] transition-colors">
              <Redo2 className="w-4 h-4 text-[#1F3D2B]" />
            </button>
          </div>

          {/* Selected Item Toolbar */}
          {sel && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white rounded-2xl shadow-lg border border-[#E6E0D4] px-2 py-1.5">
              {sel.type === 'furn' && (
                <button onClick={rotateSel}
                  className="p-2 hover:bg-[#2AA676]/10 rounded-xl transition-colors" title={isEn ? 'Rotate' : 'تدوير'}>
                  <RotateCcw className="w-4 h-4 text-[#2AA676]" />
                </button>
              )}
              <button onClick={deleteSel}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors" title={isEn ? 'Delete' : 'حذف'}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              <div className="w-px h-6 bg-[#E6E0D4] mx-1" />
              <button onClick={() => setSel(null)}
                className="p-2 hover:bg-[#F5EEE1] rounded-xl transition-colors">
                <X className="w-4 h-4 text-[#1F3D2B]/40" />
              </button>
            </div>
          )}

          {/* Status Bar */}
          <div className="absolute bottom-4 end-4 bg-white/90 rounded-xl px-3 py-1.5 shadow-sm border border-[#E6E0D4] z-20">
            <span className="text-[9px] text-[#1F3D2B]/40 font-bold" style={{ fontFamily: f }}>
              {furns.length} {isEn ? 'items' : 'قطعة'} • {Math.round(zoom * 1000)}% • {isEn ? 'Visitor Mode' : 'وضع الزائر'}
            </span>
          </div>

          {/* Mobile Catalog Toggle */}
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            {!sel && (
              <div className="flex items-center gap-2">
                <button onClick={() => setActivePanel(activePanel === 'catalog' ? null : 'catalog')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all ${
                    activePanel === 'catalog' ? 'bg-[#2AA676] text-white' : 'bg-white text-[#1F3D2B]'
                  }`} style={{ fontFamily: f }}>
                  <Sofa className="w-4 h-4" />
                  {isEn ? 'Furniture' : 'أثاث'}
                </button>
                <button onClick={() => { setActivePanel('notes'); setAddingNote(true); }}
                  className="flex items-center gap-2 bg-white text-[#D4AF37] px-4 py-2.5 rounded-full shadow-lg text-xs font-bold"
                  style={{ fontFamily: f }}>
                  <StickyNote className="w-4 h-4" />
                  {isEn ? 'Note' : 'ملاحظة'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ MOBILE BOTTOM PANEL ═══ */}
      <AnimatePresence>
        {activePanel === 'catalog' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden shrink-0 bg-white border-t border-[#E6E0D4] overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#E6E0D4]/50">
              <span className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                {isEn ? 'Furniture Catalog' : 'كتالوج الأثاث'}
              </span>
              <button onClick={() => setActivePanel(null)} className="p-1 hover:bg-[#F5EEE1] rounded-lg">
                <ChevronDown className="w-4 h-4 text-[#1F3D2B]/40" />
              </button>
            </div>
            <div className="flex gap-1.5 px-3 py-2 overflow-x-auto">
              {CATS.map(c => (
                <button key={c.id} onClick={() => setCatalogCat(c.id)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                    catalogCat === c.id ? 'bg-[#2AA676] text-white' : 'bg-[#F5EEE1] text-[#1F3D2B]/60'
                  }`} style={{ fontFamily: f }}>
                  {isEn ? c.en : c.ar}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1.5 px-3 pb-3 max-h-32 overflow-y-auto">
              {CATALOG.filter(c => c.cat === catalogCat).map(item => (
                <button key={item.id} onClick={() => addFurn(item)}
                  className="bg-[#F5EEE1]/50 border border-[#1F3D2B]/8 rounded-xl p-2 flex flex-col items-center gap-0.5 hover:border-[#2AA676]/40 active:scale-95 transition-all">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[8px] font-bold text-[#1F3D2B]/60 leading-tight text-center line-clamp-1"
                    style={{ fontFamily: f }}>
                    {isEn ? item.en : item.ar}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HELP MODAL ═══ */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4"
              dir={isEn ? 'ltr' : 'rtl'}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2AA676]/10 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-[#2AA676]" />
                </div>
                <h3 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                  {isEn ? 'How to Use' : 'كيفية الاستخدام'}
                </h3>
              </div>
              <div className="space-y-3 text-xs text-[#1F3D2B]/70" style={{ fontFamily: f }}>
                {[
                  { icon: '🛋️', text: isEn ? 'Choose furniture from the side panel and it will appear in the center of the plan' : 'اختر قطعة أثاث من اللوحة الجانبية وستظهر في وسط المخطط' },
                  { icon: '👆', text: isEn ? 'Click and drag furniture to move it around' : 'انقر واسحب الأثاث لتحريكه' },
                  { icon: '🔄', text: isEn ? 'Select an item then click the rotate button to rotate it' : 'حدد قطعة ثم اضغط زر التدوير لتدويرها' },
                  { icon: '📌', text: isEn ? 'Add notes to explain your ideas to the craftsman' : 'أضف ملاحظات لشرح أفكارك للحرفي' },
                  { icon: '✋', text: isEn ? 'Click and drag the empty space to pan. Scroll to zoom.' : 'انقر واسحب المساحة الفارغة للتحريك. مرر للتكبير.' },
                  { icon: '💾', text: isEn ? 'Export your design as an image to share with others' : 'صدّر تصميمك كصورة لمشاركتها مع الآخرين' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-base mt-0.5">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowHelp(false)}
                className="w-full py-2.5 bg-[#2AA676] text-white rounded-xl text-sm font-bold hover:bg-[#23925f] transition-colors"
                style={{ fontFamily: f }}>
                {isEn ? 'Got it!' : 'فهمت!'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ EXPORT MODAL ═══ */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowExport(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4"
              dir={isEn ? 'ltr' : 'rtl'}
              onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                {isEn ? 'Export Design' : 'تصدير التصميم'}
              </h3>

              <button onClick={exportImage}
                className="w-full flex items-center gap-3 p-4 bg-[#F5EEE1] rounded-xl hover:bg-[#EDE5D5] transition-colors text-start">
                <div className="w-10 h-10 bg-[#2AA676]/10 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-[#2AA676]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#1F3D2B] block" style={{ fontFamily: f }}>
                    {isEn ? 'Download as Image' : 'تحميل كصورة'}
                  </span>
                  <span className="text-[10px] text-[#1F3D2B]/40" style={{ fontFamily: f }}>PNG</span>
                </div>
              </button>

              <div className="relative">
                <div className="absolute inset-0 bg-[#F5EEE1] rounded-xl" />
                <div className="relative flex items-center gap-3 p-4 rounded-xl opacity-60">
                  <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-[#1F3D2B] block" style={{ fontFamily: f }}>
                      {isEn ? 'Send to Craftsman' : 'أرسل للحرفي'}
                    </span>
                    <span className="text-[10px] text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                      {isEn ? 'Available in the app' : 'متاح في التطبيق'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#D4AF37]/10 px-2 py-1 rounded-full">
                    <Smartphone className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[9px] font-bold text-[#D4AF37]" style={{ fontFamily: f }}>
                      {isEn ? 'App Only' : 'التطبيق فقط'}
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={() => setShowExport(false)}
                className="w-full py-2 text-xs text-[#1F3D2B]/40 font-semibold"
                style={{ fontFamily: f }}>
                {isEn ? 'Cancel' : 'إلغاء'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
