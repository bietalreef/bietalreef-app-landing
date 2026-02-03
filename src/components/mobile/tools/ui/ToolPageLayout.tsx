import React, { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, Wand2, Info, Layout, 
  Check, ChevronDown, Box, Sparkles
} from 'lucide-react';
import { useTranslation } from '../../../../contexts/LanguageContext';
import { ImageWithFallback } from '../../../figma/ImageWithFallback';
import { PremiumCard, SectionHeader, UAE_PALETTE } from '../ui/DesignSystem';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
export type ToolId = 
  | 'ai-room-designer' | 'smart-furniture' | '2d-planner' 
  | '3d-builder' | '2d-to-3d' | 'material-tester' 
  | 'style-detector' | 'photo-measure' | 'vendor-3d' 
  | 'vr-walkthrough' | 'store-integration' | 'save-export';

interface ToolPageLayoutProps {
  toolId: ToolId;
  content: any; // The content object from ToolContent.ts
  onBack: () => void;
  children: React.ReactNode; // The Tool Logic (Tab 2)
  templates: any[]; // Templates (Tab 3)
  sampleImages: string[];
  onUseTemplate: (img: string) => void;
}

// --- Styles List ---
export const STYLES = [
  { id: 'classic', ar: 'كلاسيكي', en: 'Classic' },
  { id: 'islamic', ar: 'إسلامي', en: 'Islamic' },
  { id: 'neoclassic', ar: 'نيو كلاسيك', en: 'Neo-Classic' },
  { id: 'modern', ar: 'مودرن', en: 'Modern' },
  { id: 'minimal', ar: 'مينيمال', en: 'Minimal' },
  { id: 'scandi', ar: 'سكوندينافي', en: 'Scandinavian' },
  { id: 'industrial', ar: 'صناعي', en: 'Industrial' },
  { id: 'luxury', ar: 'فندقي / Luxury', en: 'Luxury' },
  { id: 'farmhouse', ar: 'ريفي / Farmhouse', en: 'Farmhouse' },
  { id: 'coastal', ar: 'شاطئي / Coastal', en: 'Coastal' },
  { id: 'emirati', ar: 'تراث إماراتي', en: 'Emirati Heritage' },
  { id: 'ai-suggest', ar: 'اقتراح ذكي', en: 'AI Smart Suggest' },
];

export function ToolPageLayout({
  toolId,
  content,
  onBack,
  children,
  templates,
  sampleImages,
  onUseTemplate
}: ToolPageLayoutProps) {
  const { dir } = useTranslation('tools');
  const isRTL = dir === 'rtl';
  
  // Default tab is 'overview' (Tab 1)
  const [activeTab, setActiveTab] = useState<'overview' | 'tool' | 'templates'>('overview');

  // --- OVERVIEW RENDERER ---
  const RenderOverview = () => (
    <div className="space-y-6 pb-12">
      
      {/* 1. Definition */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
         <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
             <Info className="w-5 h-5" />
           </div>
           <h2 className="font-bold font-cairo text-lg text-[#1A1A1A]">{content.definition.title}</h2>
         </div>
         <p className="text-gray-500 text-sm leading-relaxed text-justify font-cairo">
           {content.definition.text}
         </p>
      </div>

      {/* 2. Key Features */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
         <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
             <Sparkles className="w-5 h-5" />
           </div>
           <h2 className="font-bold font-cairo text-lg text-[#1A1A1A]">{content.features.title}</h2>
         </div>
         <div className="space-y-3">
            {content.features.list.map((feat: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                 <Check className="w-5 h-5 text-[#007AFF] shrink-0 mt-0.5" />
                 <span className="text-sm text-gray-600 font-cairo font-medium leading-relaxed">{feat}</span>
              </div>
            ))}
         </div>
      </div>

      {/* 3. How It Works */}
      <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
         <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
             <Layout className="w-5 h-5" />
           </div>
           <h2 className="font-bold font-cairo text-lg text-[#1A1A1A]">{content.howTo.title}</h2>
         </div>
         <div className="space-y-4">
            {content.howTo.steps.map((step: string, i: number) => (
              <div key={i} className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded-full bg-[#007AFF] text-white flex items-center justify-center font-bold text-sm font-cairo shadow-md shrink-0">
                   {i + 1}
                 </div>
                 <span className="font-bold text-[#1A1A1A] font-cairo text-sm">{step}</span>
              </div>
            ))}
         </div>
      </div>

      {/* 4. FAQ */}
      <div className="space-y-4">
         <SectionHeader title={content.faq.title} />
         {content.faq.list.map((item: any, i: number) => (
           <div key={i} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
              <h4 className="font-bold text-[#1A1A1A] font-cairo mb-2 text-base">{item.q}</h4>
              <p className="text-gray-500 text-sm font-cairo leading-relaxed">{item.a}</p>
           </div>
         ))}
      </div>

      {/* 5. Packages */}
      <div className="bg-[#FAFAF9] rounded-[24px] border-2 border-dashed border-gray-200 p-6">
         <div className="flex items-center justify-center gap-2 mb-6">
            <Box className="w-5 h-5 text-[#007AFF]" />
            <h3 className="font-bold text-lg font-cairo text-[#1A1A1A]">Packages Benefits</h3>
         </div>
         <div className="grid grid-cols-2 gap-4">
            {content.packages.map((pkg: any, i: number) => (
              <div key={i} className="bg-white p-4 rounded-[16px] text-center shadow-sm border border-gray-50 hover:border-[#007AFF]/30 transition-colors">
                 <div className="text-[#007AFF] font-bold text-xs uppercase mb-2 tracking-wider">{pkg.title}</div>
                 <div className="text-[#1A1A1A] font-bold text-xs font-cairo leading-tight">{pkg.desc}</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF9]" dir={dir}>
      {/* --- 1. UNIFIED BANNER --- */}
      <div className="relative h-[260px] w-full overflow-hidden bg-[#1A1A1A]">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-50" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-6 pb-8">
          <div className="flex justify-between items-start pt-4">
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 hover:bg-white/20 transition-all active:scale-95 group"
            >
              {isRTL ? <ArrowRight className="w-5 h-5 text-white" /> : <ArrowLeft className="w-5 h-5 text-white" />}
              <span className="text-white font-cairo font-bold text-sm">{isRTL ? "عودة" : "Back"}</span>
            </button>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-block px-3 py-1 bg-[#C8A86A] text-white text-[10px] font-bold rounded-full mb-3 tracking-wider uppercase shadow-lg shadow-[#C8A86A]/20">
              AI DESIGN STUDIO
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-cairo leading-tight mb-2 drop-shadow-lg">
              {content.title}
            </h1>
            <p className="text-gray-200 text-sm font-cairo font-medium leading-relaxed max-w-md opacity-90 drop-shadow-md">
              {content.desc}
            </p>
          </div>
        </div>
      </div>

      {/* --- 2. TABS --- */}
      <div className="sticky top-0 z-40 bg-[#FAFAF9]/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-[0_5px_20px_-10px_rgba(0,0,0,0.05)]">
         <div className="bg-white p-1.5 rounded-[20px] shadow-sm border border-gray-100 flex gap-1">
            {[
              { id: 'overview', label: isRTL ? "نظرة عامة" : "Overview", icon: Info },
              { id: 'tool', label: isRTL ? "الأداة" : "Tool", icon: Wand2 },
              { id: 'templates', label: isRTL ? "نماذج" : "Templates", icon: Layout },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 rounded-[16px] text-xs md:text-sm font-bold font-cairo transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id 
                    ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-200 scale-[1.02]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1A1A]'
                }`}
              >
                 <tab.icon className="w-4 h-4" />
                 <span className="line-clamp-1">{tab.label}</span>
              </button>
            ))}
         </div>
      </div>

      {/* --- 3. CONTENT --- */}
      <div className="px-4 py-6 max-w-3xl mx-auto pb-32">
        <AnimatePresence mode='wait'>
           <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
           >
              {/* TAB 1: OVERVIEW (SEO - Fixed Structure) */}
              {activeTab === 'overview' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                   <RenderOverview />
                </div>
              )}

              {/* TAB 2: TOOL LOGIC */}
              {activeTab === 'tool' && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                   {children}
                </div>
              )}

              {/* TAB 3: TEMPLATES */}
              {activeTab === 'templates' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                   {/* Samples */}
                   <div>
                     <SectionHeader 
                        title={isRTL ? "صور للتجربة" : "Sample Images"} 
                        subtitle={isRTL ? "جرب الأداة باستخدام هذه الصور" : "Try the tool with these images"} 
                     />
                     <div className="flex gap-3 overflow-x-auto pb-4 px-1 no-scrollbar">
                        {sampleImages.map((src, i) => (
                          <button 
                            key={i} 
                            onClick={() => {
                                onUseTemplate(src);
                                setActiveTab('tool');
                                window.scrollTo(0,0);
                            }}
                            className="relative w-28 h-28 rounded-[20px] overflow-hidden shrink-0 shadow-md hover:scale-105 transition-transform border-2 border-transparent hover:border-[#007AFF]"
                          >
                             <ImageWithFallback src={src} alt="Sample" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                          </button>
                        ))}
                     </div>
                   </div>

                   {/* Template Cards */}
                   <div>
                     <SectionHeader 
                        title={isRTL ? "تصميمات جاهزة" : "Ready Templates"} 
                        subtitle={isRTL ? "اختر قالباً وابدأ التصميم فوراً" : "Choose a template and start"} 
                     />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((tmpl, idx) => (
                          <PremiumCard key={idx} className="p-0 pb-4 flex flex-col gap-0 hover:shadow-xl transition-shadow">
                             <div className="h-40 w-full relative bg-gray-100">
                                <ImageWithFallback src={tmpl.image} alt="Template" className="w-full h-full object-cover" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold font-cairo shadow-sm text-[#1A1A1A]">
                                   AI Template
                                </div>
                             </div>
                             <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-[#1A1A1A] font-cairo text-base mb-1">
                                  {isRTL ? tmpl.title.ar : tmpl.title.en}
                                </h3>
                                <p className="text-gray-400 text-xs font-cairo mb-4 flex-1">
                                  {isRTL ? tmpl.desc.ar : tmpl.desc.en}
                                </p>
                                <button 
                                  onClick={() => {
                                      onUseTemplate(tmpl.image);
                                      setActiveTab('tool');
                                      window.scrollTo(0,0);
                                  }}
                                  className="w-full py-3 bg-gray-50 hover:bg-[#007AFF] hover:text-white text-[#1A1A1A] font-bold rounded-[14px] text-xs font-cairo transition-colors flex items-center justify-center gap-2"
                                >
                                   {isRTL ? "استخدم هذا التصميم" : "Use This Design"} <ArrowRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
                                </button>
                             </div>
                          </PremiumCard>
                        ))}
                     </div>
                   </div>
                </div>
              )}
           </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
