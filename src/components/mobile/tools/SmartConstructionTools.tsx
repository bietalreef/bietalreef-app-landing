import { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, Zap, X, CheckCircle, 
  Calculator, Ruler, DollarSign, ScanLine, Activity, HardHat, FileBarChart, FileSignature,
  Eye, Save, Check, RefreshCw, ChevronDown
} from 'lucide-react';
import { useTranslation } from '../../../contexts/LanguageContext';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { ToolCategoryHeader, BottomAdBanner } from './ToolsComponents';
import { calculateConstructionMaterials, MaterialResult } from './logic/ConstructionCalculators';

// Types
type ToolId = 
  | 'smartMaterialsCalculator' 
  | 'smartAreaCalculator' 
  | 'aiCostEstimator' 
  | 'floorPlanAnalyzer' 
  | 'constructionQualityChecker' 
  | 'mepInspector' 
  | 'boqGenerator' 
  | 'contractAnalyzer';

interface HistoryItem {
  id: string;
  toolId: ToolId;
  date: string;
  project?: string;
  data: any;
}

interface Project {
  id: string;
  name: string;
}

export function SmartConstructionTools({ onBack }: { onBack: () => void }) {
  const { t, dir } = useTranslation('tools');
  const [currentTool, setCurrentTool] = useState<ToolId | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tool' | 'history'>('overview');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [coins, setCoins] = useState(150); 
  const [projects, setProjects] = useState<Project[]>([{ id: 'p1', name: 'Villa Al-Yasmeen' }]);
  
  // --- INPUT STATES ---
  const [areaInput, setAreaInput] = useState<string>('');
  const [floorsInput, setFloorsInput] = useState<string>('1');
  const [finishQuality, setFinishQuality] = useState<'standard' | 'premium' | 'luxury'>('standard');

  // States for Analysis Flow
  const [analysisResult, setAnalysisResult] = useState<MaterialResult | null>(null); 
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
  const [isSaved, setIsSaved] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const [showProjectModal, setShowProjectModal] = useState(false);

  const TOOLS = [
    { id: 'smartMaterialsCalculator', icon: Calculator },
    { id: 'smartAreaCalculator', icon: Ruler },
    { id: 'aiCostEstimator', icon: DollarSign },
    { id: 'floorPlanAnalyzer', icon: ScanLine },
    { id: 'constructionQualityChecker', icon: Activity },
    { id: 'mepInspector', icon: HardHat },
    { id: 'boqGenerator', icon: FileBarChart },
    { id: 'contractAnalyzer', icon: FileSignature },
  ];

  const generateId = () => `#BR-AI-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleToolClick = (id: ToolId) => {
    setCurrentTool(id);
    setActiveTab('overview');
    setAnalysisResult(null);
    setAreaInput('');
    setIsSaved(false);
    window.scrollTo(0, 0);
  };

  const handleRunAnalysis = () => {
    if (!currentTool) return;

    // Validation
    if (!areaInput || isNaN(Number(areaInput))) {
      alert(t('validation.enterValidArea'));
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI Processing Time then Calculate
    setTimeout(() => {
      if (currentTool === 'smartMaterialsCalculator') {
        const result = calculateConstructionMaterials({
          area: Number(areaInput),
          floors: Number(floorsInput),
          finishQuality: finishQuality
        });
        setAnalysisResult(result);
      } else {
        // For other tools (placeholders for now)
        setAnalysisResult(null); // Or some dummy data
      }
      
      setIsSaved(false);
      setIsProcessing(false);
      setTimeout(() => document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 1500);
  };

  const handleOpenPreview = () => setIsPreviewOpen(true);

  const handleConfirmSave = () => {
    if (coins < 50) {
      alert("Not enough coins!"); // Simplify for now
      return;
    }
    setCoins(prev => prev - 50);
    setIsSaved(true);
    setIsPreviewOpen(false);
    
    const newRecord: HistoryItem = {
      id: generateId(),
      toolId: currentTool!,
      date: new Date().toLocaleDateString('en-GB'),
      data: analysisResult
    };
    setHistory(prev => [newRecord, ...prev]);
    setTimeout(() => setShowProjectModal(true), 500);
  };

  const PrimaryButton = ({ onClick, icon: Icon, text, className = "", disabled = false }: any) => (
    <button onClick={onClick} disabled={disabled} className={`w-full bg-[#4DA3FF] text-white font-bold font-cairo py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:scale-100 ${className}`}>
      {disabled ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>{Icon && <Icon className="w-5 h-5" />}<span>{text}</span></>}
    </button>
  );

  const AdBanner = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className={`w-full rounded-[20px] overflow-hidden relative my-4 shadow-sm ${position === 'top' ? 'h-32' : 'h-24 mb-20'}`}>
      <ImageWithFallback src={position === 'top' ? "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000" : "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1000"} alt="Ad Banner" className="w-full h-full object-cover" />
    </div>
  );

  const ToolCard = ({ tool }: { tool: any }) => (
    <button onClick={() => handleToolClick(tool.id as ToolId)} className="bg-white rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center gap-4 h-full group">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#4DA3FF] mb-1 shadow-inner group-hover:scale-110 transition-transform">
         <tool.icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-[#1A1A1A] font-bold font-cairo text-sm leading-tight mb-2">{t(`items.${tool.id}.name`)}</h3>
        <p className="text-gray-400 text-[10px] font-cairo line-clamp-2 leading-relaxed">{t(`items.${tool.id}.desc`)}</p>
      </div>
    </button>
  );

  const RenderInputs = () => {
    // Only implementing inputs for the Calculator for now to demonstrate logic
    if (currentTool === 'smartMaterialsCalculator' || currentTool === 'aiCostEstimator') {
       return (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
               <label className="block text-xs font-bold text-gray-500 mb-1.5 font-cairo">{t('inputs.area')} (m²)</label>
               <div className="relative">
                  <input 
                    type="number" 
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    placeholder="150"
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm outline-none focus:border-[#4DA3FF] transition-colors font-cairo"
                  />
                  <span className="absolute right-4 top-4 text-gray-400 text-xs font-bold">m²</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 font-cairo">{t('inputs.floors')}</label>
                  <input 
                    type="number" 
                    value={floorsInput}
                    onChange={(e) => setFloorsInput(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm outline-none focus:border-[#4DA3FF] transition-colors font-cairo"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 font-cairo">{t('inputs.finishQuality')}</label>
                  <div className="relative">
                     <select 
                        value={finishQuality}
                        onChange={(e) => setFinishQuality(e.target.value as any)}
                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm outline-none focus:border-[#4DA3FF] transition-colors appearance-none font-cairo"
                     >
                        <option value="standard">{t('quality.standard')}</option>
                        <option value="premium">{t('quality.premium')}</option>
                        <option value="luxury">{t('quality.luxury')}</option>
                     </select>
                     <ChevronDown className="absolute right-4 top-4 text-gray-400 w-4 h-4" />
                  </div>
               </div>
            </div>
         </div>
       );
    }

    // Fallback for other tools
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-[20px] p-8 text-center flex flex-col items-center gap-3 hover:border-[#4DA3FF] transition-colors">
         <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#4DA3FF]"><ScanLine className="w-6 h-6" /></div>
         <span className="text-sm text-gray-400 font-cairo">{t('inputs.uploadPlan')}</span>
      </div>
    );
  };

  const RenderResults = () => {
    if (!analysisResult && !isProcessing) return null;

    if (isProcessing) {
      return (
        <div className="mt-8 text-center py-8">
           <RefreshCw className="w-8 h-8 text-[#4DA3FF] animate-spin mx-auto mb-3" />
           <p className="text-gray-400 text-sm font-cairo animate-pulse">{t('actions.analyzing')}</p>
        </div>
      );
    }

    return (
       <div id="analysis-results" className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-[24px] p-6 shadow-xl mb-6 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DA3FF]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <div className="relative z-10">
                <h4 className="text-gray-400 text-xs font-cairo mb-1">{t('results.totalEstimatedCost')}</h4>
                <div className="text-3xl font-bold font-cairo text-[#4DA3FF] mb-4">
                  {analysisResult?.totalEstimatedCost.toLocaleString()} <span className="text-base font-normal text-white/60">AED</span>
                </div>
                <div className="h-px bg-white/10 w-full mb-4"></div>
                <div className="grid grid-cols-3 gap-4 text-center">
                   <div>
                      <div className="text-gray-400 text-[10px] mb-1">{t('results.area')}</div>
                      <div className="font-bold">{areaInput} m²</div>
                   </div>
                   <div>
                      <div className="text-gray-400 text-[10px] mb-1">{t('results.floors')}</div>
                      <div className="font-bold">{floorsInput}</div>
                   </div>
                   <div>
                      <div className="text-gray-400 text-[10px] mb-1">{t('results.quality')}</div>
                      <div className="font-bold capitalize text-[#4DA3FF]">{finishQuality}</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100">
             <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <h4 className="font-bold text-[#1A1A1A] font-cairo text-sm">{t('results.breakdown')}</h4>
                <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded-full border border-gray-200">{t('results.estimated')}</span>
             </div>
             <div className="divide-y divide-gray-50">
                {Object.entries(analysisResult || {}).map(([key, value]: [string, any]) => {
                  if (key === 'totalEstimatedCost') return null;
                  return (
                    <div key={key} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#4DA3FF] flex items-center justify-center">
                            {key === 'steel' ? <HardHat className="w-4 h-4" /> : 
                             key === 'cement' ? <Activity className="w-4 h-4" /> : 
                             <CheckCircle className="w-4 h-4" />}
                          </div>
                          <div>
                             <div className="font-bold text-xs md:text-sm text-[#1A1A1A] capitalize">{t(value.label) || key}</div>
                             <div className="text-[10px] text-gray-400">{value.unit}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="font-bold text-sm text-[#1A1A1A]">{value.amount}</div>
                          <div className="text-[10px] text-[#4DA3FF] font-medium">{value.estimatedCost.toLocaleString()} AED</div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {!isSaved && <PrimaryButton onClick={handleOpenPreview} icon={Eye} text={t('actions.previewReport')} className="bg-[#1A1A1A] hover:bg-black mt-6" />}
          {isSaved && (
             <div className="bg-green-50 border border-green-100 rounded-[16px] p-4 mt-4 flex items-center justify-center gap-2 text-green-600 font-bold font-cairo animate-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5" />
                {t('projects.savedSuccess')}
             </div>
          )}
       </div>
    );
  };

  const OverviewTab = () => (
      <div className="space-y-6 pb-24">
        <AdBanner position="top" />
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold font-cairo text-lg mb-4 text-[#1A1A1A]">{t('overviewTitles.description')}</h2>
          <p className="text-gray-500 text-sm leading-relaxed text-justify font-cairo">{t(`items.${currentTool}.overview.description`)}</p>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold font-cairo text-lg mb-4 text-[#1A1A1A]">{t('overviewTitles.keyFeatures')}</h2>
          <ul className="space-y-3">
             {(() => {
               const features = t(`items.${currentTool}.overview.features`, { returnObjects: true });
               return Array.isArray(features) ? features.map((f: string, i: number) => (
                 <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-cairo"><CheckCircle className="w-4 h-4 text-[#4DA3FF]" /> {f}</li>
               )) : <li className="text-sm text-gray-400 font-cairo">{t('noFeaturesAvailable')}</li>;
             })()}
          </ul>
        </div>
        <PrimaryButton onClick={() => setActiveTab('tool')} text={t('overviewTitles.startNow')} icon={Zap} />
      </div>
  );

  if (currentTool) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]" dir={dir}>
         <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
            <button onClick={() => { setCurrentTool(null); setAnalysisResult(null); }} className="flex items-center gap-2 text-gray-600 hover:text-[#4DA3FF] font-cairo font-bold text-sm transition-colors">
               {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
               {t('backToConstructionTools')}
             </button>
         </div>

         <div className="sticky top-[68px] z-10 bg-[#FAFAF9] px-4 pb-2 pt-4">
            <div className="bg-white p-1.5 rounded-[16px] shadow-sm border border-gray-100 flex">
               {(['overview', 'tool', 'history'] as const).map((tab) => (
                 <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 rounded-[12px] text-xs md:text-sm font-bold font-cairo transition-all ${activeTab === tab ? 'bg-[#4DA3FF] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>{t(`tabs.${tab}`)}</button>
               ))}
            </div>
         </div>

         <div className="px-4">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
               {activeTab === 'overview' && <OverviewTab />}
               {activeTab === 'tool' && (
                 <div className="space-y-6 pb-24 pt-4">
                   <AdBanner position="top" />
                   <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                      <RenderInputs />
                      <div className="mt-6"><PrimaryButton onClick={handleRunAnalysis} text={isProcessing ? t('actions.processing') : t('actions.calculate')} icon={Zap} disabled={isProcessing} /></div>
                   </div>
                   <RenderResults />
                 </div>
               )}
               {activeTab === 'history' && <div className="py-20 text-center text-gray-400 font-cairo">{t('history.noHistory')}</div>}
            </motion.div>
         </div>

         <BottomAdBanner />

         <AnimatePresence>
            {isPreviewOpen && (
               <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                  <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-white rounded-t-[30px] md:rounded-[30px] w-full md:max-w-lg h-[85vh] md:h-auto overflow-y-auto p-6 relative">
                     <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
                     <div className="text-center mb-6"><h3 className="font-bold text-xl font-cairo text-[#1A1A1A]">{t('actions.previewReport')}</h3></div>
                     
                     {/* Preview Summary */}
                     <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm font-cairo">
                        <p className="text-gray-500 mb-2">{t('results.summary')}</p>
                        <div className="flex justify-between items-center font-bold text-[#1A1A1A]">
                           <span>{t('results.totalEstimatedCost')}</span>
                           <span>{analysisResult?.totalEstimatedCost.toLocaleString()} AED</span>
                        </div>
                     </div>

                     <div className="space-y-3"><PrimaryButton onClick={handleConfirmSave} text={t('actions.confirmSave')} icon={Check} /></div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="pb-0" dir={dir}>
       <ToolCategoryHeader 
         title={t('categories.construction.title')}
         subtitle={t('categories.construction.description')}
         onBack={onBack}
         backgroundImage="https://images.unsplash.com/photo-1531834685032-c34bf0d84c7c?auto=format&fit=crop&q=80&w=1000"
       />

       <div className="px-4 grid grid-cols-2 gap-4">
         {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
         ))}
       </div>

       <BottomAdBanner />
    </div>
  );
}
