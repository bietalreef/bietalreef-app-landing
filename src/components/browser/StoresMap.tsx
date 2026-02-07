import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Search, Filter, Star, Phone, Clock, ChevronLeft,
  ChevronRight, Store, Hammer, Paintbrush, Wrench, Sofa,
  Building2, Truck, X, Navigation, ExternalLink, Sparkles,
  ShoppingBag, ArrowLeft, ArrowRight,
} from 'lucide-react';

const f = 'Cairo, sans-serif';

/* ═══════════════════ TYPES ═══════════════════ */
interface StoreItem {
  id: string;
  name_ar: string;
  name_en: string;
  category: string;
  emirate: string;
  area_ar: string;
  area_en: string;
  rating: number;
  reviews: number;
  phone: string;
  hours_ar: string;
  hours_en: string;
  verified: boolean;
  lat: number;
  lng: number;
  tags_ar: string[];
  tags_en: string[];
}

interface EmirateRegion {
  id: string;
  name_ar: string;
  name_en: string;
  cx: number;
  cy: number;
  path: string;
  stores: number;
  color: string;
}

/* ═══════════════════ CATEGORIES ═══════════════════ */
const CATEGORIES = [
  { id: 'all', ar: 'الكل', en: 'All', Icon: Store, color: '#2AA676' },
  { id: 'building_materials', ar: 'مواد البناء', en: 'Building Materials', Icon: Building2, color: '#E67E22' },
  { id: 'tools', ar: 'أدوات وعدد', en: 'Tools & Hardware', Icon: Wrench, color: '#3498DB' },
  { id: 'paint', ar: 'دهانات', en: 'Paints', Icon: Paintbrush, color: '#9B59B6' },
  { id: 'furniture', ar: 'أثاث وديكور', en: 'Furniture & Decor', Icon: Sofa, color: '#1ABC9C' },
  { id: 'plumbing', ar: 'أدوات صحية', en: 'Plumbing & Sanitary', Icon: Hammer, color: '#E74C3C' },
  { id: 'equipment', ar: 'تأجير معدات', en: 'Equipment Rental', Icon: Truck, color: '#F39C12' },
];

/* ═══════════════════ UAE EMIRATES (SVG paths) ═══════════════════ */
const EMIRATES: EmirateRegion[] = [
  {
    id: 'abu_dhabi', name_ar: 'أبوظبي', name_en: 'Abu Dhabi',
    cx: 180, cy: 320, stores: 45,
    color: '#2AA676',
    path: 'M50,200 L120,160 L200,140 L280,180 L320,250 L340,350 L300,420 L220,450 L140,430 L80,380 L40,300 Z',
  },
  {
    id: 'dubai', name_ar: 'دبي', name_en: 'Dubai',
    cx: 380, cy: 180, stores: 78,
    color: '#D4AF37',
    path: 'M320,120 L370,100 L420,110 L450,150 L440,210 L400,240 L340,230 L310,190 Z',
  },
  {
    id: 'sharjah', name_ar: 'الشارقة', name_en: 'Sharjah',
    cx: 440, cy: 120, stores: 52,
    color: '#E67E22',
    path: 'M420,60 L470,50 L510,80 L520,130 L490,170 L450,160 L420,120 Z',
  },
  {
    id: 'ajman', name_ar: 'عجمان', name_en: 'Ajman',
    cx: 465, cy: 85, stores: 28,
    color: '#3498DB',
    path: 'M450,60 L475,55 L490,70 L485,95 L465,100 L450,85 Z',
  },
  {
    id: 'umm_al_quwain', name_ar: 'أم القيوين', name_en: 'Umm Al Quwain',
    cx: 490, cy: 55, stores: 15,
    color: '#9B59B6',
    path: 'M475,30 L505,25 L520,45 L515,70 L495,75 L478,55 Z',
  },
  {
    id: 'ras_al_khaimah', name_ar: 'رأس الخيمة', name_en: 'Ras Al Khaimah',
    cx: 510, cy: 30, stores: 22,
    color: '#E74C3C',
    path: 'M490,10 L530,5 L560,25 L555,60 L530,70 L505,50 L495,25 Z',
  },
  {
    id: 'fujairah', name_ar: 'الفجيرة', name_en: 'Fujairah',
    cx: 560, cy: 140, stores: 18,
    color: '#1ABC9C',
    path: 'M530,80 L570,70 L590,110 L585,170 L560,200 L535,180 L525,130 Z',
  },
];

/* ═══════════════════ STORE DATA ═══════════════════ */
const STORES: StoreItem[] = [
  // Abu Dhabi
  { id:'s1', name_ar:'مصنع الإمارات لمواد البناء', name_en:'Emirates Building Materials Factory', category:'building_materials', emirate:'abu_dhabi', area_ar:'مصفح الصناعية', area_en:'Musaffah Industrial', rating:4.8, reviews:312, phone:'+971-2-555-1234', hours_ar:'٨ص - ٩م', hours_en:'8AM - 9PM', verified:true, lat:24.35, lng:54.50, tags_ar:['اسمنت','حديد','رمل'], tags_en:['cement','steel','sand'] },
  { id:'s2', name_ar:'معرض الخليج للأثاث', name_en:'Gulf Furniture Gallery', category:'furniture', emirate:'abu_dhabi', area_ar:'شارع المطار', area_en:'Airport Road', rating:4.6, reviews:189, phone:'+971-2-555-2345', hours_ar:'١٠ص - ١٠م', hours_en:'10AM - 10PM', verified:true, lat:24.45, lng:54.65, tags_ar:['أثاث','ديكور','مفروشات'], tags_en:['furniture','decor','furnishings'] },
  { id:'s3', name_ar:'مركز النخبة للدهانات', name_en:'Elite Paints Center', category:'paint', emirate:'abu_dhabi', area_ar:'المرور', area_en:'Al Muroor', rating:4.5, reviews:156, phone:'+971-2-555-3456', hours_ar:'٩ص - ٨م', hours_en:'9AM - 8PM', verified:false, lat:24.46, lng:54.37, tags_ar:['جوتن','ناشيونال','دهانات'], tags_en:['jotun','national','paints'] },
  // Dubai  
  { id:'s4', name_ar:'سوق الراس للأدوات', name_en:'Al Ras Tools Market', category:'tools', emirate:'dubai', area_ar:'ديرة', area_en:'Deira', rating:4.9, reviews:428, phone:'+971-4-222-1111', hours_ar:'٧ص - ١١م', hours_en:'7AM - 11PM', verified:true, lat:25.27, lng:55.30, tags_ar:['عدد يدوية','كهربائية','لحام'], tags_en:['hand tools','electric','welding'] },
  { id:'s5', name_ar:'الفارس لمواد البناء', name_en:'Al Fares Building Materials', category:'building_materials', emirate:'dubai', area_ar:'القوز الصناعية', area_en:'Al Quoz Industrial', rating:4.7, reviews:367, phone:'+971-4-222-2222', hours_ar:'٦ص - ١٠م', hours_en:'6AM - 10PM', verified:true, lat:25.15, lng:55.22, tags_ar:['بلاط','سيراميك','رخام'], tags_en:['tiles','ceramic','marble'] },
  { id:'s6', name_ar:'هوم سنتر', name_en:'Home Centre', category:'furniture', emirate:'dubai', area_ar:'فستيفال سيتي', area_en:'Festival City', rating:4.4, reviews:892, phone:'+971-4-222-3333', hours_ar:'١٠ص - ١٢م', hours_en:'10AM - 12AM', verified:true, lat:25.22, lng:55.35, tags_ar:['أثاث','مطابخ','حمامات'], tags_en:['furniture','kitchens','bathrooms'] },
  { id:'s7', name_ar:'دراغون مارت', name_en:'Dragon Mart', category:'building_materials', emirate:'dubai', area_ar:'المنطقة العالمية', area_en:'International City', rating:4.3, reviews:1200, phone:'+971-4-222-4444', hours_ar:'١٠ص - ١٠م', hours_en:'10AM - 10PM', verified:true, lat:25.17, lng:55.40, tags_ar:['جملة','إضاءة','أرضيات'], tags_en:['wholesale','lighting','flooring'] },
  // Sharjah
  { id:'s8', name_ar:'سوق الجبيل للأدوات', name_en:'Jubail Tools Souk', category:'tools', emirate:'sharjah', area_ar:'الجبيل', area_en:'Al Jubail', rating:4.6, reviews:245, phone:'+971-6-555-1111', hours_ar:'٨ص - ٩م', hours_en:'8AM - 9PM', verified:true, lat:25.36, lng:55.39, tags_ar:['أدوات','مسامير','براغي'], tags_en:['tools','nails','screws'] },
  { id:'s9', name_ar:'الصفا للأدوات الصحية', name_en:'Al Safa Sanitary', category:'plumbing', emirate:'sharjah', area_ar:'المنطقة الصناعية', area_en:'Industrial Area', rating:4.5, reviews:178, phone:'+971-6-555-2222', hours_ar:'٨ص - ٨م', hours_en:'8AM - 8PM', verified:true, lat:25.32, lng:55.41, tags_ar:['حنفيات','مراحيض','سخانات'], tags_en:['faucets','toilets','heaters'] },
  { id:'s10', name_ar:'ناشيونال بينتس الشارقة', name_en:'National Paints Sharjah', category:'paint', emirate:'sharjah', area_ar:'المنطقة الصناعية ١٨', area_en:'Industrial Area 18', rating:4.8, reviews:334, phone:'+971-6-555-3333', hours_ar:'٧:٣٠ص - ٧م', hours_en:'7:30AM - 7PM', verified:true, lat:25.30, lng:55.43, tags_ar:['دهانات','عوازل','ألوان'], tags_en:['paints','insulation','colors'] },
  // Ajman
  { id:'s11', name_ar:'سوق الصين عجمان', name_en:'China Mall Ajman', category:'building_materials', emirate:'ajman', area_ar:'الجرف', area_en:'Al Jurf', rating:4.2, reviews:567, phone:'+971-6-777-1111', hours_ar:'١٠ص - ١٠م', hours_en:'10AM - 10PM', verified:true, lat:25.42, lng:55.43, tags_ar:['جملة','إكسسوارات','إضاءة'], tags_en:['wholesale','accessories','lighting'] },
  // RAK
  { id:'s12', name_ar:'RAK سيراميكس شوروم', name_en:'RAK Ceramics Showroom', category:'building_materials', emirate:'ras_al_khaimah', area_ar:'المنطقة الحرة', area_en:'Free Zone', rating:4.9, reviews:445, phone:'+971-7-244-1111', hours_ar:'٩ص - ٦م', hours_en:'9AM - 6PM', verified:true, lat:25.78, lng:55.95, tags_ar:['سيراميك','بورسلين','بلاط'], tags_en:['ceramics','porcelain','tiles'] },
  // UAQ
  { id:'s13', name_ar:'مؤسسة الأمان للمعدات', name_en:'Al Aman Equipment Est.', category:'equipment', emirate:'umm_al_quwain', area_ar:'المنطقة الصناعية', area_en:'Industrial Area', rating:4.3, reviews:89, phone:'+971-6-766-1111', hours_ar:'٨ص - ٦م', hours_en:'8AM - 6PM', verified:false, lat:25.56, lng:55.55, tags_ar:['حفارات','رافعات','كمبريسور'], tags_en:['excavators','cranes','compressor'] },
  // Fujairah
  { id:'s14', name_ar:'معرض الفجيرة للبناء', name_en:'Fujairah Building Exhibition', category:'building_materials', emirate:'fujairah', area_ar:'مدينة الفجيرة', area_en:'Fujairah City', rating:4.4, reviews:123, phone:'+971-9-222-1111', hours_ar:'٩ص - ٨م', hours_en:'9AM - 8PM', verified:true, lat:25.12, lng:56.33, tags_ar:['بلوك','اسمنت','حصى'], tags_en:['blocks','cement','gravel'] },
];

/* ═══════════════════ COMPONENT ═══════════════════ */
export function StoresMap({ isEn = false }: { isEn?: boolean }) {
  const [selectedEmirate, setSelectedEmirate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null);
  const [hoveredEmirate, setHoveredEmirate] = useState<string | null>(null);

  /* ── filtered stores ── */
  const filteredStores = useMemo(() => {
    return STORES.filter(s => {
      if (selectedEmirate && s.emirate !== selectedEmirate) return false;
      if (selectedCategory !== 'all' && s.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const name = isEn ? s.name_en.toLowerCase() : s.name_ar;
        const area = isEn ? s.area_en.toLowerCase() : s.area_ar;
        const tags = isEn ? s.tags_en.join(' ').toLowerCase() : s.tags_ar.join(' ');
        if (!name.includes(q) && !area.includes(q) && !tags.includes(q)) return false;
      }
      return true;
    });
  }, [selectedEmirate, selectedCategory, searchQuery, isEn]);

  const selectedEmirateData = EMIRATES.find(e => e.id === selectedEmirate);

  return (
    <div className="min-h-screen bg-[#F5EEE1]" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#E6E0D4] px-4 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2AA676]/10 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#2AA676]" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[#1F3D2B]" style={{ fontFamily: f }}>
                {isEn ? 'Stores & Shops Map' : 'خريطة المحلات والمتاجر'}
              </h1>
              <p className="text-[11px] text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                {filteredStores.length} {isEn ? 'stores across the UAE' : 'محل في الإمارات'}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-[#1F3D2B]/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search stores, materials, areas...' : 'ابحث عن محل، مادة، منطقة...'}
              className="w-full ps-10 pe-4 py-2.5 bg-[#F5EEE1] border border-[#1F3D2B]/8 rounded-xl text-sm text-[#1F3D2B] placeholder:text-[#1F3D2B]/30 focus:outline-none focus:border-[#2AA676] focus:ring-2 focus:ring-[#2AA676]/10"
              style={{ fontFamily: f }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3">
                <X className="w-4 h-4 text-[#1F3D2B]/30" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const Icon = cat.Icon;
              const active = selectedCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-all ${
                    active ? 'text-white shadow-md' : 'bg-white text-[#1F3D2B]/60 border border-[#1F3D2B]/8 hover:bg-[#F5EEE1]'
                  }`}
                  style={{ fontFamily: f, backgroundColor: active ? cat.color : undefined }}>
                  <Icon className="w-3.5 h-3.5" />
                  {isEn ? cat.en : cat.ar}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ═══ MAP SECTION ═══ */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-[#1F3D2B]/8 p-4 sm:p-6 shadow-sm">
              {/* Emirate chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button onClick={() => setSelectedEmirate(null)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    !selectedEmirate ? 'bg-[#1F3D2B] text-white' : 'bg-[#F5EEE1] text-[#1F3D2B]/60 hover:bg-[#EDE5D5]'
                  }`} style={{ fontFamily: f }}>
                  {isEn ? 'All Emirates' : 'كل الإمارات'}
                </button>
                {EMIRATES.map(e => (
                  <button key={e.id} onClick={() => setSelectedEmirate(e.id === selectedEmirate ? null : e.id)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                      selectedEmirate === e.id 
                        ? 'text-white shadow-md' 
                        : 'bg-[#F5EEE1] text-[#1F3D2B]/60 hover:bg-[#EDE5D5]'
                    }`}
                    style={{ fontFamily: f, backgroundColor: selectedEmirate === e.id ? e.color : undefined }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedEmirate === e.id ? '#fff' : e.color }} />
                    {isEn ? e.name_en : e.name_ar}
                    <span className={`text-[9px] ${selectedEmirate === e.id ? 'text-white/70' : 'text-[#1F3D2B]/30'}`}>
                      ({STORES.filter(s => s.emirate === e.id && (selectedCategory === 'all' || s.category === selectedCategory)).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* SVG Map */}
              <div className="relative aspect-[5/4] sm:aspect-[3/2]">
                <svg viewBox="-10 -20 640 500" className="w-full h-full">
                  {/* Sea */}
                  <defs>
                    <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B8E6F0" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#87CEEB" stopOpacity="0.15" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <rect x="-10" y="-20" width="640" height="500" fill="url(#seaGrad)" rx="16" />

                  {/* Emirates regions */}
                  {EMIRATES.map(em => {
                    const isSelected = selectedEmirate === em.id;
                    const isHovered = hoveredEmirate === em.id;
                    const storeCount = STORES.filter(s => s.emirate === em.id && (selectedCategory === 'all' || s.category === selectedCategory)).length;
                    return (
                      <g key={em.id}
                        onClick={() => setSelectedEmirate(em.id === selectedEmirate ? null : em.id)}
                        onMouseEnter={() => setHoveredEmirate(em.id)}
                        onMouseLeave={() => setHoveredEmirate(null)}
                        className="cursor-pointer transition-all duration-300"
                      >
                        <path
                          d={em.path}
                          fill={isSelected ? em.color : isHovered ? `${em.color}30` : '#EDE5D5'}
                          stroke={isSelected || isHovered ? em.color : '#C5BFAE'}
                          strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
                          opacity={(!selectedEmirate || isSelected) ? 1 : 0.4}
                          filter={isSelected ? 'url(#glow)' : undefined}
                          className="transition-all duration-300"
                        />
                        {/* Label */}
                        <text x={em.cx} y={em.cy - 8}
                          textAnchor="middle" dominantBaseline="middle"
                          fill={isSelected ? '#fff' : '#1F3D2B'}
                          fontSize={isSelected ? 14 : 11}
                          fontWeight="800"
                          fontFamily={f}
                          className="pointer-events-none select-none transition-all">
                          {isEn ? em.name_en : em.name_ar}
                        </text>
                        {/* Store count badge */}
                        {storeCount > 0 && (
                          <>
                            <circle cx={em.cx} cy={em.cy + 14} r={12}
                              fill={isSelected ? '#fff' : em.color}
                              opacity={(!selectedEmirate || isSelected) ? 0.9 : 0.3}
                              className="pointer-events-none" />
                            <text x={em.cx} y={em.cy + 15}
                              textAnchor="middle" dominantBaseline="middle"
                              fill={isSelected ? em.color : '#fff'}
                              fontSize={9} fontWeight="900"
                              className="pointer-events-none select-none">
                              {storeCount}
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}

                  {/* Store pins for selected emirate */}
                  {selectedEmirate && filteredStores.map((store, i) => {
                    const em = EMIRATES.find(e => e.id === store.emirate);
                    if (!em) return null;
                    // position pins around the emirate center
                    const angle = (i * 2.4) + 0.5;
                    const radius = 25 + (i % 3) * 15;
                    const px = em.cx + Math.cos(angle) * radius;
                    const py = em.cy + Math.sin(angle) * radius + 30;
                    const cat = CATEGORIES.find(c => c.id === store.category);
                    return (
                      <g key={store.id} 
                        onClick={(e) => { e.stopPropagation(); setSelectedStore(store); }}
                        className="cursor-pointer">
                        <circle cx={px} cy={py} r={7}
                          fill={cat?.color || '#2AA676'} stroke="#fff" strokeWidth={2}
                          className="transition-all hover:r-9" />
                        {store.verified && (
                          <circle cx={px + 5} cy={py - 5} r={3}
                            fill="#2AA676" stroke="#fff" strokeWidth={1} />
                        )}
                      </g>
                    );
                  })}

                  {/* Water label */}
                  <text x="100" y="100" fill="#87CEEB" fontSize="14" fontWeight="700" fontFamily={f} opacity="0.5"
                    transform="rotate(-15, 100, 100)">
                    {isEn ? 'Arabian Gulf' : 'الخليج العربي'}
                  </text>
                  <text x="500" y="380" fill="#87CEEB" fontSize="11" fontWeight="700" fontFamily={f} opacity="0.4">
                    {isEn ? 'Gulf of Oman' : 'خليج عمان'}
                  </text>
                </svg>

                {/* Hover tooltip */}
                <AnimatePresence>
                  {hoveredEmirate && !selectedEmirate && (() => {
                    const em = EMIRATES.find(e => e.id === hoveredEmirate);
                    if (!em) return null;
                    const storeCount = STORES.filter(s => s.emirate === em.id).length;
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bg-white rounded-xl shadow-lg border border-[#E6E0D4] px-3 py-2 pointer-events-none z-10"
                        style={{ left: `${(em.cx / 620) * 100}%`, top: `${(em.cy / 460) * 100 - 15}%`, transform: 'translate(-50%, -100%)' }}>
                        <p className="text-xs font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                          {isEn ? em.name_en : em.name_ar}
                        </p>
                        <p className="text-[10px] text-[#1F3D2B]/50" style={{ fontFamily: f }}>
                          {storeCount} {isEn ? 'stores' : 'محل'}
                        </p>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>

              {/* Selected emirate info */}
              {selectedEmirateData && (
                <div className="mt-4 p-3 rounded-xl border-2 flex items-center justify-between"
                  style={{ borderColor: selectedEmirateData.color, backgroundColor: `${selectedEmirateData.color}08` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedEmirateData.color }} />
                    <span className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                      {isEn ? selectedEmirateData.name_en : selectedEmirateData.name_ar}
                    </span>
                    <span className="text-xs text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                      — {filteredStores.length} {isEn ? 'stores found' : 'محل'}
                    </span>
                  </div>
                  <button onClick={() => setSelectedEmirate(null)}
                    className="text-xs text-[#1F3D2B]/40 hover:text-red-500 font-bold"
                    style={{ fontFamily: f }}>
                    {isEn ? 'Clear' : 'مسح'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ═══ STORES LIST ═══ */}
          <div className="lg:w-96">
            <div className="space-y-3">
              {/* Results header */}
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-[#1F3D2B]" style={{ fontFamily: f }}>
                  {isEn ? 'Stores' : 'المحلات'}
                  <span className="text-[#1F3D2B]/30 ms-1">({filteredStores.length})</span>
                </h2>
                {selectedEmirate && (
                  <button onClick={() => setSelectedEmirate(null)}
                    className="text-xs text-[#2AA676] font-bold" style={{ fontFamily: f }}>
                    {isEn ? 'Show all' : 'عرض الكل'}
                  </button>
                )}
              </div>

              {/* Store cards */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pe-1">
                {filteredStores.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-[#1F3D2B]/8">
                    <ShoppingBag className="w-10 h-10 text-[#1F3D2B]/20 mx-auto mb-3" />
                    <p className="text-sm font-bold text-[#1F3D2B]/40" style={{ fontFamily: f }}>
                      {isEn ? 'No stores found' : 'لا توجد محلات'}
                    </p>
                    <p className="text-[11px] text-[#1F3D2B]/25 mt-1" style={{ fontFamily: f }}>
                      {isEn ? 'Try changing the filters' : 'جرب تغيير الفلاتر'}
                    </p>
                  </div>
                ) : (
                  filteredStores.map(store => {
                    const cat = CATEGORIES.find(c => c.id === store.category);
                    const em = EMIRATES.find(e => e.id === store.emirate);
                    const isActive = selectedStore?.id === store.id;
                    return (
                      <motion.button
                        key={store.id}
                        layout
                        onClick={() => setSelectedStore(isActive ? null : store)}
                        className={`w-full bg-white rounded-2xl p-4 border text-start transition-all ${
                          isActive 
                            ? 'border-[#2AA676] shadow-lg shadow-[#2AA676]/10' 
                            : 'border-[#1F3D2B]/8 hover:shadow-md hover:border-[#2AA676]/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${cat?.color}15` }}>
                            {cat && <cat.Icon className="w-5 h-5" style={{ color: cat.color }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-[#1F3D2B] truncate" style={{ fontFamily: f }}>
                                {isEn ? store.name_en : store.name_ar}
                              </h3>
                              {store.verified && (
                                <span className="w-4 h-4 bg-[#2AA676] rounded-full flex items-center justify-center shrink-0">
                                  <span className="text-white text-[8px]">✓</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#1F3D2B]/40 mt-0.5" style={{ fontFamily: f }}>
                              {isEn ? store.area_en : store.area_ar} • {isEn ? em?.name_en : em?.name_ar}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                                <span className="text-[11px] font-bold text-[#1F3D2B]">{store.rating}</span>
                                <span className="text-[10px] text-[#1F3D2B]/30">({store.reviews})</span>
                              </div>
                              <div className="flex items-center gap-1 text-[#1F3D2B]/30">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px]" style={{ fontFamily: f }}>
                                  {isEn ? store.hours_en : store.hours_ar}
                                </span>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(isEn ? store.tags_en : store.tags_ar).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-[#F5EEE1] rounded-full text-[9px] font-semibold text-[#1F3D2B]/50">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Expanded details */}
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-3 pt-3 border-t border-[#E6E0D4] space-y-2">
                                <a href={`tel:${store.phone}`}
                                  className="flex items-center gap-2 text-[#2AA676] text-xs font-bold"
                                  style={{ fontFamily: f }}>
                                  <Phone className="w-3.5 h-3.5" />
                                  <span dir="ltr">{store.phone}</span>
                                </a>
                                <button className="w-full flex items-center justify-center gap-2 bg-[#2AA676] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#23925f] transition-colors"
                                  style={{ fontFamily: f }}>
                                  <Navigation className="w-3.5 h-3.5" />
                                  {isEn ? 'Get Directions' : 'الاتجاهات'}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-l from-[#1F3D2B] to-[#2A5A3B] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <Sparkles className="w-8 h-8 text-[#D4AF37] shrink-0" />
          <div className="flex-1 text-center sm:text-start">
            <h3 className="text-white text-sm font-bold" style={{ fontFamily: f }}>
              {isEn ? 'Want to list your store?' : 'تبي تضيف محلك؟'}
            </h3>
            <p className="text-white/40 text-xs" style={{ fontFamily: f }}>
              {isEn ? 'Download the app and register as a provider' : 'حمّل التطبيق وسجّل كمزوّد خدمة'}
            </p>
          </div>
          <button className="bg-[#D4AF37] text-[#1F3D2B] px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#E5C048] transition-colors shrink-0"
            style={{ fontFamily: f }}>
            {isEn ? 'Register Now' : 'سجّل الآن'}
          </button>
        </div>
      </div>
    </div>
  );
}
