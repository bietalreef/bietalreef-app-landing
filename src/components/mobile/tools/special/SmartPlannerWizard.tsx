import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, Ruler, Layout, 
  Home, Maximize, Check, PenTool, 
  ChevronRight, ChevronLeft, Building2, 
  Grid3X3, Box, RotateCcw
} from 'lucide-react';
import { useTranslation } from '../../../../contexts/LanguageContext';
import { RoomPlanner2DLogic } from './RoomPlanner2DLogic';

// Types for the Planner Data
type Node = { id: string, x: number, y: number };
type Wall = { id: string, startNodeId: string, endNodeId: string, thickness: number, height: number };

interface SmartPlannerWizardProps {
  onBack: () => void;
}

export function SmartPlannerWizard({ onBack }: SmartPlannerWizardProps) {
  const { t, dir } = useTranslation('tools'); // Assuming 'tools' namespace exists
  const isRTL = dir === 'rtl';

  const [showPlanner, setShowPlanner] = useState(false);
  const [generatedData, setGeneratedData] = useState<{ nodes: Node[], walls: Wall[] } | null>(null);

  // Form State
  const [roomCount, setRoomCount] = useState<'1' | '2'>('1');
  const [activeTab, setActiveTab] = useState<'room1' | 'room2'>('room1');
  
  // Room 1 Data
  const [r1Width, setR1Width] = useState(500); // cm
  const [r1Length, setR1Length] = useState(400); // cm
  const [r1Height, setR1Height] = useState(280); // cm
  
  // Room 2 Data
  const [r2Width, setR2Width] = useState(400); // cm
  const [r2Length, setR2Length] = useState(400); // cm
  const [r2Height, setR2Height] = useState(280); // cm

  const [purpose, setPurpose] = useState('living');

  // Switch tab automatically when changing room count
  useEffect(() => {
    if (roomCount === '1') setActiveTab('room1');
  }, [roomCount]);

  // --- Logic to Generate Room ---
  const handleGenerate = () => {
    const nodes: Node[] = [];
    const walls: Wall[] = [];
    const wallThickness = 20;

    // Room 1 Construction
    const r1StartX = 0;
    const r1StartY = 0;
    
    // Nodes R1
    const n1 = { id: 'n1', x: r1StartX, y: r1StartY };
    const n2 = { id: 'n2', x: r1StartX + r1Width, y: r1StartY };
    const n3 = { id: 'n3', x: r1StartX + r1Width, y: r1StartY + r1Length };
    const n4 = { id: 'n4', x: r1StartX, y: r1StartY + r1Length };
    
    nodes.push(n1, n2, n3, n4);
    
    walls.push(
        { id: 'w1', startNodeId: 'n1', endNodeId: 'n2', thickness: wallThickness, height: r1Height },
        { id: 'w2', startNodeId: 'n2', endNodeId: 'n3', thickness: wallThickness, height: r1Height },
        { id: 'w3', startNodeId: 'n3', endNodeId: 'n4', thickness: wallThickness, height: r1Height },
        { id: 'w4', startNodeId: 'n4', endNodeId: 'n1', thickness: wallThickness, height: r1Height }
    );

    if (roomCount === '2') {
        // Room 2 Construction (Placed to the right with a gap)
        const gap = 100; // 1 meter gap to clearly separate
        const r2StartX = r1Width + gap;
        const r2StartY = 0;

        // Nodes R2
        const n5 = { id: 'n5', x: r2StartX, y: r2StartY };
        const n6 = { id: 'n6', x: r2StartX + r2Width, y: r2StartY };
        const n7 = { id: 'n7', x: r2StartX + r2Width, y: r2StartY + r2Length };
        const n8 = { id: 'n8', x: r2StartX, y: r2StartY + r2Length };
        
        nodes.push(n5, n6, n7, n8);
        
        walls.push(
            { id: 'w5', startNodeId: 'n5', endNodeId: 'n6', thickness: wallThickness, height: r2Height },
            { id: 'w6', startNodeId: 'n6', endNodeId: 'n7', thickness: wallThickness, height: r2Height },
            { id: 'w7', startNodeId: 'n7', endNodeId: 'n8', thickness: wallThickness, height: r2Height },
            { id: 'w8', startNodeId: 'n8', endNodeId: 'n5', thickness: wallThickness, height: r2Height }
        );
    }

    setGeneratedData({ nodes, walls });
    setShowPlanner(true);
  };

  if (showPlanner) {
    return <RoomPlanner2DLogic onBack={() => setShowPlanner(false)} initialData={generatedData} />;
  }

  // Determine current active values for inputs
  const currentWidth = activeTab === 'room1' ? r1Width : r2Width;
  const currentLength = activeTab === 'room1' ? r1Length : r2Length;
  const currentHeight = activeTab === 'room1' ? r1Height : r2Height;

  const setWidth = (v: number) => activeTab === 'room1' ? setR1Width(v) : setR2Width(v);
  const setLength = (v: number) => activeTab === 'room1' ? setR1Length(v) : setR2Length(v);
  const setHeight = (v: number) => activeTab === 'room1' ? setR1Height(v) : setR2Height(v);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF9] flex font-cairo" dir={dir}>
      
      {/* Left Preview Area */}
      <div className="hidden md:flex flex-1 bg-gray-100 items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
         <div className="relative transform scale-50 lg:scale-75 transition-transform duration-500 flex items-center justify-center gap-20">
             {/* Room 1 Preview */}
             <motion.div 
                className="border-4 border-gray-800 bg-white shadow-2xl relative flex items-center justify-center"
                animate={{ width: r1Width, height: r1Length }}
                transition={{ type: "spring", stiffness: 100 }}
             >
                 <div className="absolute -top-12 text-center w-full font-bold text-gray-500">الغرفة 1</div>
                 <span className="font-bold text-gray-300 text-4xl">1</span>
                 
                 {/* Dims */}
                 <div className="absolute -bottom-8 w-full text-center font-mono text-xs">{r1Width}cm</div>
                 <div className="absolute -left-8 h-full flex items-center font-mono text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>{r1Length}cm</div>
             </motion.div>

             {/* Room 2 Preview */}
             {roomCount === '2' && (
                 <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0, width: r2Width, height: r2Length }}
                    className="border-4 border-gray-800 bg-white shadow-2xl relative flex items-center justify-center"
                    transition={{ type: "spring", stiffness: 100 }}
                 >
                     <div className="absolute -top-12 text-center w-full font-bold text-gray-500">الغرفة 2</div>
                     <span className="font-bold text-gray-300 text-4xl">2</span>

                     {/* Dims */}
                     <div className="absolute -bottom-8 w-full text-center font-mono text-xs">{r2Width}cm</div>
                     <div className="absolute -left-8 h-full flex items-center font-mono text-xs rotate-180" style={{ writingMode: 'vertical-rl' }}>{r2Length}cm</div>
                 </motion.div>
             )}
         </div>

         <div className="absolute bottom-10 left-10">
             <h2 className="text-4xl font-bold text-gray-300">Live Preview</h2>
         </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-[450px] bg-white h-full shadow-[-10px_0_30px_rgba(0,0,0,0.05)] flex flex-col z-10 relative">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
             <div>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">مخطط الغرف الذكي</h1>
                <p className="text-sm text-gray-500">قم بإعداد مساحتك قبل البدء</p>
             </div>
             <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ArrowRight className={`w-5 h-5 text-gray-600 ${isRTL ? '' : 'rotate-180'}`} />
             </button>
          </div>

          {/* Wizard Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
             
             {/* Step 1: Room Count */}
             <section>
                 <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-[#1A1A1A]">
                     <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs">1</span>
                     عدد الغرف
                 </h3>
                 <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => setRoomCount('1')}
                       className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${roomCount === '1' ? 'border-[#C8A86A] bg-[#C8A86A]/5' : 'border-gray-100 hover:border-gray-200'}`}
                     >
                        <Box className={`w-8 h-8 ${roomCount === '1' ? 'text-[#C8A86A]' : 'text-gray-400'}`} />
                        <span className="font-bold text-sm">غرفة واحدة</span>
                     </button>
                     <button 
                       onClick={() => setRoomCount('2')}
                       className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${roomCount === '2' ? 'border-[#C8A86A] bg-[#C8A86A]/5' : 'border-gray-100 hover:border-gray-200'}`}
                     >
                        <Grid3X3 className={`w-8 h-8 ${roomCount === '2' ? 'text-[#C8A86A]' : 'text-gray-400'}`} />
                        <span className="font-bold text-sm">غرفتين متجاورتين</span>
                     </button>
                 </div>
             </section>

             {/* Step 2: Dimensions */}
             <section>
                 <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-[#1A1A1A]">
                     <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs">2</span>
                     الأبعاد والقياسات
                 </h3>
                 
                 {/* Room Tabs if 2 Rooms */}
                 {roomCount === '2' && (
                     <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                         <button 
                            onClick={() => setActiveTab('room1')}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'room1' ? 'bg-white shadow text-[#1A1A1A]' : 'text-gray-500 hover:text-gray-700'}`}
                         >
                            الغرفة الأولى
                         </button>
                         <button 
                            onClick={() => setActiveTab('room2')}
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'room2' ? 'bg-white shadow text-[#1A1A1A]' : 'text-gray-500 hover:text-gray-700'}`}
                         >
                            الغرفة الثانية
                         </button>
                     </div>
                 )}

                 <div className="space-y-6 bg-gray-50 p-5 rounded-2xl relative">
                     {/* Width */}
                     <div>
                         <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-gray-600">العرض (Width)</label>
                            <span className="text-sm font-bold text-[#C8A86A]">{currentWidth} cm</span>
                         </div>
                         <input 
                           type="range" 
                           min="200" 
                           max="1000" 
                           step="10" 
                           value={currentWidth} 
                           onChange={(e) => setWidth(Number(e.target.value))}
                           className="w-full accent-[#1A1A1A] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                         />
                     </div>

                     {/* Length */}
                     <div>
                         <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-gray-600">الطول (Length)</label>
                            <span className="text-sm font-bold text-[#C8A86A]">{currentLength} cm</span>
                         </div>
                         <input 
                           type="range" 
                           min="200" 
                           max="1000" 
                           step="10" 
                           value={currentLength} 
                           onChange={(e) => setLength(Number(e.target.value))}
                           className="w-full accent-[#1A1A1A] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                         />
                     </div>

                     {/* Height */}
                     <div>
                         <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-gray-600">الارتفاع (Height)</label>
                            <span className="text-sm font-bold text-[#C8A86A]">{currentHeight} cm</span>
                         </div>
                         <input 
                           type="range" 
                           min="200" 
                           max="500" 
                           step="10" 
                           value={currentHeight} 
                           onChange={(e) => setHeight(Number(e.target.value))}
                           className="w-full accent-[#1A1A1A] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                         />
                     </div>
                 </div>
             </section>

             {/* Step 3: Type */}
             <section>
                 <h3 className="flex items-center gap-2 font-bold text-lg mb-4 text-[#1A1A1A]">
                     <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs">3</span>
                     نوع المساحة
                 </h3>
                 <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                     {['living', 'bed', 'office', 'kitchen', 'bath'].map(p => (
                         <button 
                           key={p}
                           onClick={() => setPurpose(p)}
                           className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${
                               purpose === p 
                               ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                               : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                           }`}
                         >
                            {p === 'living' ? 'غرفة معيشة' : p === 'bed' ? 'غرفة نوم' : p === 'office' ? 'مكتب' : p === 'kitchen' ? 'مطبخ' : 'حمام'}
                         </button>
                     ))}
                 </div>
             </section>

          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
              <button 
                onClick={handleGenerate}
                className="w-full bg-[#1A1A1A] text-white text-lg font-bold py-4 rounded-2xl shadow-xl shadow-gray-200 flex items-center justify-center gap-3 hover:bg-black transition-transform active:scale-95"
              >
                 <PenTool className="w-5 h-5" />
                 <span>تنفيذ وإنشاء المخطط</span>
              </button>
              <p className="text-center text-xs text-gray-400 mt-3">
                  سيتم نقلك إلى محرر المخطط الاحترافي
              </p>
          </div>
      </div>
    </div>
  );
}
