import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// Tools
import { MaterialCalculatorV2 } from './tools/MaterialCalculatorV2';
import { PaintFlooringCalc } from './tools/PaintFlooringCalc';
import { CostEstimatorTool } from './tools/CostEstimatorTool';
import { QuoteGeneratorTool } from './tools/QuoteGeneratorTool';
import { MarketingContentTool } from './tools/MarketingContentTool';
import { ContractGeneratorTool } from './tools/ContractGeneratorTool';
import { InvoiceGeneratorTool } from './tools/InvoiceGeneratorTool';
import { SocialMediaManager } from './tools/SocialMediaManager';
import { ColorPaletteTool } from './tools/ColorPaletteTool';
import { LightingCalcTool } from './tools/LightingCalcTool';
import { RoomLayoutTool } from './tools/RoomLayoutTool';
import { Design2DTool } from './tools/Design2DTool';
import { Design3DTool } from './tools/Design3DTool';
import { Convert2Dto3DTool } from './tools/Convert2Dto3DTool';

type ActiveTool = null
  | 'materials' | 'paint' | 'cost'
  | 'quote' | 'marketing' | 'contract' | 'invoice'
  | 'social-media'
  | 'color-palette' | 'lighting' | 'room-layout'
  | 'design-2d' | 'design-3d' | 'convert-2d-3d';

interface ToolDef {
  id: ActiveTool;
  icon: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  gradient: string;
  badgeAr?: string;
  badgeEn?: string;
}

// ═══════════════════════════════════════════════
// ترتيب الأدوات حسب الأهمية — الأهم أولاً
// ═══════════════════════════════════════════════
const PRIMARY_TOOLS: ToolDef[] = [
  {
    id: 'quote',
    icon: '📄',
    titleAr: 'مولّد عروض الأسعار',
    titleEn: 'Quotation Generator',
    subtitleAr: 'عرض سعر احترافي A4',
    subtitleEn: 'Professional A4 quotation',
    gradient: 'from-blue-500 to-indigo-500',
    badgeAr: 'مطوّر',
    badgeEn: 'Enhanced',
  },
  {
    id: 'invoice',
    icon: '🧾',
    titleAr: 'مولّد الفواتير',
    titleEn: 'Invoice Generator',
    subtitleAr: 'فواتير ضريبية احترافية',
    subtitleEn: 'Professional tax invoices',
    gradient: 'from-teal-600 to-emerald-500',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'contract',
    icon: '📝',
    titleAr: 'مولّد العقود',
    titleEn: 'Contract Generator',
    subtitleAr: 'عقود صيانة وبناء واستشارات',
    subtitleEn: 'Maintenance, construction & consulting',
    gradient: 'from-violet-500 to-purple-600',
    badgeAr: 'مطوّر',
    badgeEn: 'Enhanced',
  },
  {
    id: 'materials',
    icon: '🧮',
    titleAr: 'حاسبة مواد البناء',
    titleEn: 'Materials Calculator',
    subtitleAr: 'كميات وتكاليف تقديرية',
    subtitleEn: 'Quantities & cost estimates',
    gradient: 'from-emerald-500 to-green-600',
    badgeAr: 'الأكثر استخداماً',
    badgeEn: 'Most Used',
  },
  {
    id: 'cost',
    icon: '💰',
    titleAr: 'مقدّر تكلفة البناء',
    titleEn: 'Cost Estimator',
    subtitleAr: 'ميزانية شاملة للمشروع',
    subtitleEn: 'Complete project budget',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'paint',
    icon: '🎨',
    titleAr: 'حاسبة الدهانات والأرضيات',
    titleEn: 'Paint & Flooring',
    subtitleAr: 'دهان + بلاط + نعلات',
    subtitleEn: 'Paint + tiles + skirting',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'design-2d',
    icon: '✏️',
    titleAr: 'تصميم ثنائي الأبعاد',
    titleEn: '2D Floor Plan',
    subtitleAr: 'ارسم مخططات الغرف والأثاث',
    subtitleEn: 'Draw rooms, walls & furniture',
    gradient: 'from-indigo-500 to-blue-600',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'design-3d',
    icon: '🧊',
    titleAr: 'تصميم ثلاثي الأبعاد',
    titleEn: '3D Room Visualizer',
    subtitleAr: 'تصوّر الغرف بشكل ثلاثي',
    subtitleEn: 'Visualize rooms in 3D',
    gradient: 'from-purple-500 to-violet-600',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'convert-2d-3d',
    icon: '🔄',
    titleAr: 'تحويل 2D إلى 3D',
    titleEn: '2D to 3D Converter',
    subtitleAr: 'حوّل المخططات لنماذج ثلاثية',
    subtitleEn: 'Convert plans to 3D models',
    gradient: 'from-green-500 to-teal-600',
    badgeAr: 'جديد',
    badgeEn: 'New',
  },
  {
    id: 'room-layout',
    icon: '🏠',
    titleAr: 'تخطيط الغرفة',
    titleEn: 'Room Layout',
    subtitleAr: 'تصميم تخطيط غرفتك',
    subtitleEn: 'Design your room layout',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'color-palette',
    icon: '🎨',
    titleAr: 'لوحة الألوان',
    titleEn: 'Color Palette',
    subtitleAr: 'اختر الألوان المناسبة لمشروعك',
    subtitleEn: 'Select colors for your project',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'lighting',
    icon: '💡',
    titleAr: 'حاسبة الإضاءة',
    titleEn: 'Lighting Calculator',
    subtitleAr: 'حساب الإضاءة المناسبة',
    subtitleEn: 'Calculate room lighting',
    gradient: 'from-amber-400 to-yellow-600',
  },
  {
    id: 'marketing',
    icon: '📱',
    titleAr: 'مولّد المحتوى التسويقي',
    titleEn: 'Marketing Content',
    subtitleAr: 'منشورات جاهزة للنشر',
    subtitleEn: 'Ready-to-publish posts',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'social-media',
    icon: '👥',
    titleAr: 'مدير وسائل التواصل',
    titleEn: 'Social Media Manager',
    subtitleAr: 'إدارة حساباتك على التواصل',
    subtitleEn: 'Manage social accounts',
    gradient: 'from-blue-500 to-indigo-500',
  },
];

interface AIToolsDashboardProps {
  onFullscreenToggle?: (isFullscreen: boolean) => void;
  onBack?: () => void;
}

export function AIToolsDashboard({ onFullscreenToggle, onBack }: AIToolsDashboardProps) {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const { language } = useLanguage();
  const isEn = language === 'en';

  const handleBack = () => setActiveTool(null);

  // ══════════ Route to individual tools ══════════
  if (activeTool === 'materials') return <MaterialCalculatorV2 onBack={handleBack} />;
  if (activeTool === 'paint') return <PaintFlooringCalc onBack={handleBack} />;
  if (activeTool === 'cost') return <CostEstimatorTool onBack={handleBack} />;
  if (activeTool === 'quote') return <QuoteGeneratorTool onBack={handleBack} />;
  if (activeTool === 'invoice') return <InvoiceGeneratorTool onBack={handleBack} />;
  if (activeTool === 'marketing') return <MarketingContentTool onBack={handleBack} />;
  if (activeTool === 'contract') return <ContractGeneratorTool onBack={handleBack} />;
  if (activeTool === 'social-media') return <SocialMediaManager onBack={handleBack} />;
  if (activeTool === 'color-palette') return <ColorPaletteTool onBack={handleBack} />;
  if (activeTool === 'lighting') return <LightingCalcTool onBack={handleBack} />;
  if (activeTool === 'room-layout') return <RoomLayoutTool onBack={handleBack} />;
  if (activeTool === 'design-2d') return <Design2DTool onBack={handleBack} />;
  if (activeTool === 'design-3d') return <Design3DTool onBack={handleBack} />;
  if (activeTool === 'convert-2d-3d') return <Convert2Dto3DTool onBack={handleBack} />;

  // ══════════ Main Dashboard ══════════
  return (
    <div className="min-h-screen bg-background pb-32" dir="rtl">

      {/* Page Header */}
      <div className="bg-gradient-to-l from-[#1F3D2B] to-[#2AA676] px-5 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="relative z-10 text-center">
          <h1 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '26px' }}>
            {isEn ? 'Smart Tools' : 'الأدوات الذكية'}
          </h1>
          <p className="text-white/80" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '13px' }}>
            {isEn ? 'Real tools with instant results — no signup or waiting' : 'أدوات حقيقية بنتائج فورية — بدون تسجيل أو انتظار'}
          </p>
        </div>
      </div>

      {/* Primary Tools Grid — 2 per row on mobile */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[#1A1A1A] font-bold font-cairo text-lg">
            {isEn ? 'Core Tools' : 'الأدوات الأساسية'}
          </h3>
          <span className="text-xs font-bold text-[#2AA676] bg-[#2AA676]/10 px-2.5 py-1 rounded-full font-cairo">
            {PRIMARY_TOOLS.length} {isEn ? 'tools' : 'أداة'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRIMARY_TOOLS.map((tool, index) => {
            const badge = isEn ? tool.badgeEn : tool.badgeAr;
            return (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setActiveTool(tool.id)}
                className="bg-white rounded-[20px] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100/80 hover:shadow-md transition-all group active:scale-[0.97] flex flex-col items-center text-center relative"
              >
                {/* Badge */}
                {badge && (
                  <span className={`absolute top-2 left-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                    badge === 'جديد' || badge === 'New' ? 'bg-green-100 text-green-700' :
                    badge === 'الأكثر استخداماً' || badge === 'Most Used' ? 'bg-amber-100 text-amber-700' :
                    badge === 'مطوّر' || badge === 'Enhanced' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-2.5 group-hover:scale-110 transition-transform`}>
                  {tool.icon}
                </div>

                {/* Title */}
                <h4 className="font-bold font-cairo text-[12px] text-[#1A1A1A] leading-tight mb-1 line-clamp-2 min-h-[32px] flex items-center">
                  {isEn ? tool.titleEn : tool.titleAr}
                </h4>

                {/* Subtitle */}
                <p className="text-[10px] text-gray-400 font-cairo leading-tight line-clamp-2">
                  {isEn ? tool.subtitleEn : tool.subtitleAr}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer Note */}
      <div className="px-4 mt-8">
        <div className="bg-gradient-to-l from-[#F5EEE1] to-[#FFF8F0] rounded-[20px] p-5 border border-[#E8DCC8]">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-bold font-cairo text-sm text-[#1A1A1A] mb-1">
                {isEn ? 'Beit Al Reef Tip' : 'نصيحة بيت الريف'}
              </h4>
              <p className="text-xs text-gray-600 font-cairo leading-relaxed">
                {isEn
                  ? 'All core tools work fully and give you instant results. You can copy results or share them via WhatsApp directly. Print as PDF for professional A4 documents.'
                  : 'جميع الأدوات الأساسية تعمل بشكل كامل وتعطيك نتائج فورية. يمكنك نسخ النتائج أو مشاركتها عبر واتساب مباشرة. اطبع كـ PDF للحصول على مستندات A4 احترافية.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
