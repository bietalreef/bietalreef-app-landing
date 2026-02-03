import { useState } from 'react';
import { 
  Upload, Check, Layers, RefreshCw, Lock
} from 'lucide-react';
import { useTranslation } from '../../../../contexts/LanguageContext';
import { ToolPageLayout, STYLES } from '../ui/ToolPageLayout';
import { SectionHeader, UploadBox, MainActionButton } from '../ui/DesignSystem';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { ImageWithFallback } from '../../../figma/ImageWithFallback';
import { TOOLS_CONTENT } from '../data/ToolContent';

// Mock Data for Templates
const TEMPLATES = [
  { id: 1, title: { ar: "غرفة نوم مودرن", en: "Modern Bedroom" }, image: "https://images.unsplash.com/photo-1616594039964-40891a909d20?auto=format&fit=crop&q=80&w=600", desc: { ar: "تصميم هادئ وأنيق", en: "Calm and elegant design" } },
  { id: 2, title: { ar: "غرفة جلوس فاخرة", en: "Luxury Living Room" }, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600", desc: { ar: "فخامة وراحة", en: "Luxury and comfort" } },
  { id: 3, title: { ar: "مجلس عربي كلاسيكي", en: "Classic Arab Majlis" }, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600", desc: { ar: "تراثي بلمسة عصرية", en: "Heritage with modern touch" } },
  { id: 4, title: { ar: "غرفة أطفال", en: "Kids Room" }, image: "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&q=80&w=600", desc: { ar: "ألوان مرحة وآمنة", en: "Fun and safe colors" } },
];

const SAMPLES = [
  "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300",
];

export function AiRoomDesigner({ onBack }: { onBack: () => void }) {
  const { language, dir } = useTranslation('tools');
  const isRTL = dir === 'rtl';
  const lang = language === 'ar' ? 'ar' : 'en';
  const content = TOOLS_CONTENT['ai-room-designer'][lang];

  // State
  const [image, setImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const [coins, setCoins] = useState(150);
  const [designId, setDesignId] = useState<string | null>(null);

  const handleStartAnalysis = () => {
    if (!image) return;
    if (coins < 20) {
      alert("Not enough coins!");
      return;
    }

    setCoins(prev => prev - 20);
    setIsProcessing(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsProcessing(false);
      setResultReady(true);
      setDesignId(`DR-AI-2025-${Math.floor(100000 + Math.random() * 900000)}`);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 3000);
  };

  const handleReset = () => {
    setResultReady(false);
    setImage(null);
    setDesignId(null);
  };

  return (
    <ToolPageLayout
      toolId="ai-room-designer"
      content={content}
      onBack={onBack}
      templates={TEMPLATES}
      sampleImages={SAMPLES}
      onUseTemplate={(img) => setImage(img)}
    >
      <div className="space-y-8">
        
        {/* 1. Upload & Settings */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
           <SectionHeader 
             title={isRTL ? "إعدادات التصميم" : "Design Settings"} 
             subtitle={isRTL ? "ارفع صورة واختر النمط المفضل" : "Upload image and choose style"} 
           />
           
           {/* Upload Box */}
           {!image ? (
              <UploadBox 
                label={isRTL ? "رفع صورة" : "Upload Image"}
                onUpload={() => setImage("https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?auto=format&fit=crop&q=80&w=1000")}
                icon={Upload}
              />
           ) : (
             <div className="relative h-64 rounded-[24px] overflow-hidden shadow-md mb-6 group border border-gray-100">
               <ImageWithFallback src={image} alt="Uploaded" className="w-full h-full object-cover" />
               <button 
                 onClick={handleReset} 
                 className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors shadow-sm"
               >
                 <RefreshCw className="w-5 h-5" />
               </button>
             </div>
           )}

           {/* Style Selector */}
           <div className="mt-8">
             <label className="text-sm font-bold text-[#1A1A1A] font-cairo mb-3 block px-1">
                {isRTL ? "اختر نمط التصميم (Style)" : "Choose Design Style"}
             </label>
             <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`flex-shrink-0 px-5 py-3 rounded-[16px] font-bold text-xs font-cairo transition-all border ${
                      selectedStyle === style.id 
                        ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-lg shadow-blue-200' 
                        : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    {isRTL ? style.ar : style.en}
                  </button>
                ))}
             </div>
           </div>

           {/* Action Button with Coin Logic */}
           <div className="mt-8">
             <div className="flex justify-between items-center mb-3 px-2">
                <span className="text-xs font-bold text-gray-400 font-cairo">
                  {isRTL ? "تكلفة العملية: 20 كوينز" : "Cost: 20 Coins"}
                </span>
                <span className="text-xs font-bold text-[#007AFF] font-cairo flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-[#007AFF] text-white flex items-center justify-center text-[10px]">$</div>
                  {isRTL ? `الرصيد: ${coins}` : `Balance: ${coins}`}
                </span>
             </div>
             
             {!isProcessing && !resultReady && (
               <MainActionButton 
                 onClick={handleStartAnalysis} 
                 text={isRTL ? "توليد التصميم – 20 كوينز ⚡" : "Generate – 20 Coins ⚡"}
                 disabled={!image}
               />
             )}

             {isProcessing && (
                <div className="py-6 text-center">
                   <div className="animate-spin w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full mx-auto mb-3"></div>
                   <p className="text-sm font-bold text-gray-500 font-cairo animate-pulse">
                     {isRTL ? "جاري تحليل المساحة وتوليد التصميم..." : "Analyzing space and generating design..."}
                   </p>
                </div>
             )}
           </div>
        </div>

        {/* 2. Results Section */}
        {resultReady && (
          <div id="result-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
             {/* Design ID Badge */}
             <div className="flex justify-center">
                <div className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-mono text-gray-500 flex items-center gap-2">
                   <Lock className="w-3 h-3" />
                   ID: {designId}
                </div>
             </div>

             {/* Before / After Slider */}
             <div className="bg-white p-2 rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
                <BeforeAfterSlider 
                  beforeImage={image || ""}
                  afterImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000" // Mock Result
                  height="h-[400px]"
                />
             </div>

             {/* Actions */}
             <div className="grid grid-cols-1 gap-3">
                <button className="w-full bg-[#007AFF] text-white py-4 rounded-[20px] font-bold font-cairo shadow-lg shadow-blue-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" /> {isRTL ? "استخدام هذا التصميم" : "Use This Design"}
                </button>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={handleStartAnalysis}
                     className="bg-white text-[#1A1A1A] border border-gray-200 py-4 rounded-[20px] font-bold font-cairo hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                   >
                     <RefreshCw className="w-5 h-5" /> {isRTL ? "إعادة – 20 كوينز" : "Regenerate"}
                   </button>
                   <button 
                     onClick={handleReset}
                     className="bg-white text-[#1A1A1A] border border-gray-200 py-4 rounded-[20px] font-bold font-cairo hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                   >
                     <Layers className="w-5 h-5" /> {isRTL ? "تعديل" : "Edit"}
                   </button>
                </div>
             </div>

             {/* Warning */}
             <p className="text-center text-[10px] text-gray-400 font-cairo mt-4">
               {isRTL 
                 ? "تنبيه: بعد الحفظ لا يمكن تعديل التصميم. أي تعديل يتطلب نسخة جديدة." 
                 : "Warning: After saving, the design cannot be edited. Any edit requires a new version."}
             </p>
          </div>
        )}

      </div>
    </ToolPageLayout>
  );
}
