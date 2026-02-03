import { useState } from 'react';
import { 
  Wand2, Layout, Box, Grid, Camera, 
  ScanLine, Ruler, ShoppingBag, Eye, 
  Layers, Save, ArrowRight, ChevronRight
} from 'lucide-react';
import { useTranslation } from '../../../contexts/LanguageContext';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { AiRoomDesigner } from './pages/AiRoomDesigner';
import { 
  SmartFurniture, RoomPlanner2D, RoomBuilder3D, Convert2DTo3D, 
  MaterialTester, StyleDetector, PhotoMeasure, Vendor3D, 
  VRWalkthrough, StoreIntegration, SaveExport 
} from './pages/ToolPlaceholders';

// --- Types ---
type ToolId = 
  | 'hub'
  | 'ai-room-designer' 
  | 'smart-furniture' 
  | '2d-planner' 
  | '3d-builder' 
  | '2d-to-3d' 
  | 'material-tester' 
  | 'style-detector' 
  | 'photo-measure' 
  | 'vendor-3d' 
  | 'vr-walkthrough' 
  | 'store-integration' 
  | 'save-export';

// --- Tool Definitions ---
const TOOLS = [
  { id: 'ai-room-designer', icon: Wand2, ar: 'أداة تصميم الغرف بالذكاء الاصطناعي', en: 'AI Room Designer', descAr: 'حول صورك إلى تصميم احترافي', descEn: 'Turn photos into pro designs' },
  { id: 'smart-furniture', icon: Layout, ar: 'أداة مخطط الأثاث الذكي', en: 'Smart Furniture Layout', descAr: 'توزيع ذكي للأثاث', descEn: 'Smart furniture arrangement' },
  { id: '2d-planner', icon: Layers, ar: 'مصمم الغرف ثنائي الأبعاد', en: '2D Room Planner', descAr: 'رسم المخططات بدقة', descEn: 'Precise floor planning' },
  { id: '3d-builder', icon: Box, ar: 'مصمم الغرف ثلاثي الأبعاد', en: '3D Room Builder', descAr: 'بناء وتصميم واقعي', descEn: 'Realistic 3D building' },
  { id: '2d-to-3d', icon: ScanLine, ar: 'تحويل المخطط 2D إلى 3D', en: '2D → 3D Auto Convert', descAr: 'تحويل تلقائي فوري', descEn: 'Instant auto conversion' },
  { id: 'material-tester', icon: Grid, ar: 'أداة تجربة المواد والألوان', en: 'Material Tester', descAr: 'اختبار الخامات والدهانات', descEn: 'Test materials & paints' },
  { id: 'style-detector', icon: Camera, ar: 'كشف نوع التصميم بالذكاء الاصطناعي', en: 'AI Style Detector', descAr: 'معرفة نمط الديكور من صورة', descEn: 'Identify decor style from photo' },
  { id: 'photo-measure', icon: Ruler, ar: 'أداة قياسات الصور', en: 'Photo Measurement AI', descAr: 'استخراج المقاسات من الصور', descEn: 'Extract dimensions from photos' },
  { id: 'vendor-3d', icon: Box, ar: 'إنشاء منتجات 3D للمزوّدين', en: 'Vendor 3D Product Builder', descAr: 'لأصحاب المعارض والمتاجر', descEn: 'For vendors and stores' },
  { id: 'vr-walkthrough', icon: Eye, ar: 'جولة افتراضية VR', en: 'VR Walkthrough', descAr: 'تجربة التصميم بالواقع الافتراضي', descEn: 'Virtual reality experience' },
  { id: 'store-integration', icon: ShoppingBag, ar: 'مكتبة الأثاث والمواد', en: 'Store Integration', descAr: 'ربط المنتجات بالمتجر', descEn: 'Link products to store' },
  { id: 'save-export', icon: Save, ar: 'حفظ / مشاركة / تصدير', en: 'Save/Share/Export', descAr: 'تصدير المخططات والملفات', descEn: 'Export plans and files' },
];

export function SmartDesignTools({ onBack, onFullscreenToggle }: { onBack: () => void, onFullscreenToggle?: (v: boolean) => void }) {
  const { t, dir } = useTranslation('tools');
  const isRTL = dir === 'rtl';
  const [currentPage, setCurrentPage] = useState<ToolId>('hub');

  // --- ROUTER ---
  const handleBack = () => setCurrentPage('hub');

  switch (currentPage) {
    case 'ai-room-designer': return <AiRoomDesigner onBack={handleBack} />;
    case 'smart-furniture': return <SmartFurniture onBack={handleBack} />;
    case '2d-planner': return <RoomPlanner2D onBack={handleBack} onFullscreenToggle={onFullscreenToggle} />;
    case '3d-builder': return <RoomBuilder3D onBack={handleBack} onFullscreenToggle={onFullscreenToggle} />;
    case '2d-to-3d': return <Convert2DTo3D onBack={handleBack} />;
    case 'material-tester': return <MaterialTester onBack={handleBack} />;
    case 'style-detector': return <StyleDetector onBack={handleBack} />;
    case 'photo-measure': return <PhotoMeasure onBack={handleBack} onFullscreenToggle={onFullscreenToggle} />;
    case 'vendor-3d': return <Vendor3D onBack={handleBack} />;
    case 'vr-walkthrough': return <VRWalkthrough onBack={handleBack} />;
    case 'store-integration': return <StoreIntegration onBack={handleBack} />;
    case 'save-export': return <SaveExport onBack={handleBack} />;
    case 'hub':
    default:
      break; // Render Hub
  }

  // --- HUB VIEW ---

  return (
    <div className="min-h-screen bg-[#FAFAF9]" dir={dir}>
       {/* Hero Section */}
       <div className="relative h-[280px] bg-[#1A1A1A] rounded-b-[40px] overflow-hidden shadow-2xl z-10">
          <ImageWithFallback src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000" alt="Header" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-black/30" />
          
          <div className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-start">
             <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
               {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronRight className="w-6 h-6 rotate-180" />}
             </button>
          </div>

          <div className="absolute bottom-8 left-6 right-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <span className="inline-block px-3 py-1 bg-[#C8A86A] text-white text-[10px] font-bold rounded-full mb-3 tracking-wider uppercase shadow-lg">
               Premium Design Studio
             </span>
             <h1 className="text-3xl md:text-4xl font-bold text-white font-cairo leading-tight mb-2">
               {t('categories.design.title')}
             </h1>
             <p className="text-gray-300 text-sm font-cairo max-w-xs leading-relaxed opacity-90">
               {t('categories.design.description')}
             </p>
          </div>
       </div>

       {/* Tools Grid */}
       <div className="px-4 -mt-6 relative z-20 pb-32 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-lg font-bold text-[#1A1A1A] font-cairo">{isRTL ? "جميع الأدوات" : "All Tools"}</h3>
             <span className="text-xs font-bold text-[#C8A86A] bg-[#C8A86A]/10 px-2 py-1 rounded-full">12 Tools</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {TOOLS.map((tool) => (
               <button 
                 key={tool.id}
                 onClick={() => setCurrentPage(tool.id as ToolId)}
                 className="bg-white p-4 rounded-[24px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#C8A86A]/30 hover:shadow-lg transition-all group text-right flex flex-col items-start h-full relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full -mr-6 -mt-6 z-0" />
                  
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#1A1A1A] mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                     <tool.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  
                  <div className="relative z-10 w-full">
                    <h4 className="font-bold text-[#1A1A1A] font-cairo text-sm leading-tight mb-1.5 min-h-[40px] flex items-center">
                      {isRTL ? tool.ar : tool.en}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-cairo line-clamp-2 leading-relaxed">
                      {isRTL ? tool.descAr : tool.descEn}
                    </p>
                  </div>

                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                     <ArrowRight className={`w-4 h-4 text-[#C8A86A] ${isRTL ? "rotate-180" : ""}`} />
                  </div>
               </button>
             ))}
          </div>
       </div>
    </div>
  );
}
