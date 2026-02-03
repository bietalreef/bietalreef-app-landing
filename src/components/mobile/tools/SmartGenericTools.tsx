import { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, Zap, Download, Save, Share2, Copy, 
  Clock, FileText, CheckCircle, Plus, Link as LinkIcon, Coins, Eye, X,
  Palette, Layout, Box, Layers, Image as ImageIcon, Building2, Trees, Glasses,
  Scale, FileSignature, Receipt, ShieldCheck,
  Calculator, CreditCard, DollarSign, TrendingUp,
  Kanban, BarChart2, Users, CheckSquare, FolderOpen, Package,
  Megaphone, Video, PenTool, MessageCircle, Target, Cuboid
} from 'lucide-react';
import { useTranslation } from '../../../contexts/LanguageContext';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { ToolCategoryHeader, BottomAdBanner } from './ToolsComponents';

type ToolId = string;

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

interface GenericToolsProps {
  categoryId: 'design' | 'legal' | 'financial' | 'project' | 'marketing';
  onBack: () => void;
}

export function SmartGenericTools({ categoryId, onBack }: GenericToolsProps) {
  const { t, dir } = useTranslation('tools');
  const [currentTool, setCurrentTool] = useState<ToolId | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tool' | 'history'>('overview');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [coins, setCoins] = useState(150); 
  const [projects, setProjects] = useState<Project[]>([{ id: 'p1', name: 'Villa Al-Yasmeen' }]);
  
  // States for Analysis Flow
  const [pendingAnalysis, setPendingAnalysis] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Map icons to tool IDs
  const ICON_MAP: Record<string, any> = {
    // Design
    roomDesigner2d: Layout, 
    imageTo3dConverter: Cuboid, // New Tool Icon
    roomDesigner3d: Box, 
    furniturePlanner: Layers, 
    colorPaletteGenerator: Palette,
    styleDetection: Eye, 
    materialsVisualizer: ImageIcon, 
    facadeDesigner: Building2, 
    landscapeDesigner: Trees, 
    vrPreview: Glasses,
    // Legal
    contractTemplates: FileText, aiContractGenerator: FileSignature, quotationGenerator: Receipt, contractAnalyzer: ShieldCheck,
    // Financial
    invoiceManager: FileText, accountingBook: Calculator, paymentTracker: CreditCard, projectPricingTool: DollarSign, profitAnalyzer: TrendingUp,
    // Project
    projectDashboard: Kanban, progressReports: BarChart2, workforceTracker: Users, tasksManagement: CheckSquare, projectDocuments: FolderOpen, materialTracking: Package,
    // Marketing
    postGenerator: ImageIcon, reelsGenerator: Video, contentWizard: PenTool, whatsappBot: MessageCircle, autoPublishing: Share2, campaignAnalyzer: Target
  };

  const CATEGORY_BG_MAP: Record<string, string> = {
    design: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000",
    legal: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000",
    financial: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000",
    project: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=1000",
    marketing: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1000"
  };

  const CATEGORY_TOOLS_MAP: Record<string, string[]> = {
    design: ['roomDesigner2d', 'imageTo3dConverter', 'roomDesigner3d', 'furniturePlanner', 'colorPaletteGenerator', 'styleDetection', 'materialsVisualizer', 'facadeDesigner', 'landscapeDesigner', 'vrPreview'],
    legal: ['contractTemplates', 'aiContractGenerator', 'quotationGenerator', 'contractAnalyzer'], 
    financial: ['invoiceManager', 'accountingBook', 'paymentTracker', 'projectPricingTool', 'profitAnalyzer'],
    project: ['projectDashboard', 'progressReports', 'workforceTracker', 'tasksManagement', 'projectDocuments', 'materialTracking'],
    marketing: ['postGenerator', 'reelsGenerator', 'contentWizard', 'whatsappBot', 'autoPublishing', 'campaignAnalyzer']
  };

  const currentToolsList = CATEGORY_TOOLS_MAP[categoryId] || [];
  const generateId = () => `#BR-AI-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleToolClick = (id: ToolId) => {
    setCurrentTool(id);
    setActiveTab('overview');
    setPendingAnalysis(null);
    setIsSaved(false);
    window.scrollTo(0, 0);
  };

  const handleRunAnalysis = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setPendingAnalysis({ timestamp: new Date().toISOString() });
      setIsSaved(false);
      setIsProcessing(false);
      setTimeout(() => document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 2000);
  };

  const handleOpenPreview = () => setIsPreviewOpen(true);

  const handleConfirmSave = () => {
    if (coins < 50) {
      setIsPreviewOpen(false);
      setShowPaymentModal(true);
      return;
    }
    setCoins(prev => prev - 50);
    setIsSaved(true);
    setIsPreviewOpen(false);
    const newRecord: HistoryItem = {
      id: generateId(),
      toolId: currentTool!,
      date: new Date().toLocaleDateString('en-GB'),
      data: pendingAnalysis
    };
    setHistory(prev => [newRecord, ...prev]);
    setTimeout(() => setShowProjectModal(true), 500);
  };

  const handleLinkProject = (projectId?: string, newProjectName?: string) => {
    if (newProjectName) {
       const newId = `p${projects.length + 1}`;
       setProjects(prev => [...prev, { id: newId, name: newProjectName }]);
       projectId = newId;
    }
    if (history.length > 0) {
       const updated = [...history];
       updated[0].project = projects.find(p => p.id === projectId)?.name || newProjectName;
       setHistory(updated);
    }
    setShowProjectModal(false);
  };

  const handleAction = (action: string) => alert(`${action} - ${t('projects.savedSuccess')}`);

  const PrimaryButton = ({ onClick, icon: Icon, text, className = "", disabled = false }: any) => (
    <button onClick={onClick} disabled={disabled} className={`w-full bg-[#4DA3FF] text-white font-bold font-cairo py-4 rounded-[16px] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:scale-100 ${className}`}>
      {disabled ? <>Processing...</> : <>{Icon && <Icon className="w-5 h-5" />}<span>{text}</span></>}
    </button>
  );

  const AdBanner = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className={`w-full rounded-[20px] overflow-hidden relative my-4 shadow-sm ${position === 'top' ? 'h-32' : 'h-24 mb-20'}`}>
      <ImageWithFallback src={position === 'top' ? "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000" : "https://images.unsplash.com/photo-1600585154526-998dca770262?auto=format&fit=crop&q=80&w=1000"} alt="Ad Banner" className="w-full h-full object-cover" />
    </div>
  );

  const ToolCard = ({ id }: { id: string }) => {
    const Icon = ICON_MAP[id] || Zap;
    return (
      <button onClick={() => handleToolClick(id)} className="bg-white rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center gap-4 h-full group">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-1 shadow-inner group-hover:scale-110 transition-transform ${
             categoryId === 'design' ? 'bg-purple-50 text-purple-500' : 
             categoryId === 'legal' ? 'bg-blue-50 text-blue-500' :
             categoryId === 'financial' ? 'bg-green-50 text-green-500' :
             categoryId === 'marketing' ? 'bg-rose-50 text-rose-500' : 'bg-teal-50 text-teal-500'
        }`}>
           <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-[#1A1A1A] font-bold font-cairo text-sm leading-tight mb-2">{t(`items.${id}.name`)}</h3>
          <p className="text-gray-400 text-[10px] font-cairo line-clamp-2 leading-relaxed">{t(`items.${id}.desc`)}</p>
        </div>
      </button>
    );
  };

  const RenderInputs = () => {
    const commonInputClass = "w-full p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm outline-none focus:border-[#4DA3FF] transition-colors";
    const labelClass = "block text-xs font-bold text-gray-500 mb-1.5";
    
    const UploadBox = ({ label }: { label: string }) => (
      <div className="border-2 border-dashed border-gray-200 rounded-[20px] p-6 text-center flex flex-col items-center gap-2 hover:border-[#4DA3FF] hover:bg-blue-50/30 transition-colors cursor-pointer" onClick={() => alert("File Picker Mock")}>
         <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#4DA3FF]"><ImageIcon className="w-5 h-5" /></div>
         <span className="text-xs text-gray-400 font-cairo">{label}</span>
      </div>
    );

    const renderField = (key: string, label: string) => {
       if (key.toLowerCase().includes('upload') || key.toLowerCase().includes('image') || key.toLowerCase().includes('media') || key.toLowerCase().includes('photo')) {
         return <UploadBox key={key} label={label} />;
       }
       if (key.toLowerCase().includes('type') || key.toLowerCase().includes('style') || key.toLowerCase().includes('mode') || key.toLowerCase().includes('category')) {
          return (
             <label key={key} className="block">
               <span className={labelClass}>{label}</span>
               <select className={commonInputClass}>
                  <option>{t('actions.selectOption')}</option>
                  <option>Option 1</option><option>Option 2</option><option>Option 3</option>
               </select>
             </label>
          )
       }
       return (
          <label key={key} className="block">
             <span className={labelClass}>{label}</span>
             <input type="text" className={commonInputClass} placeholder="..." />
          </label>
       );
    };

    const inputs = t(`items.${currentTool}.inputs`, { returnObjects: true });
    if (!inputs || typeof inputs !== 'object') return <p className="text-red-500">Inputs configuration missing</p>;

    return (
       <div className="space-y-4">
          {Object.entries(inputs).map(([key, label]) => renderField(key, label as string))}
       </div>
    );
  };

  const RenderResults = () => {
     if (!pendingAnalysis) return null;
     const outputs = t(`items.${currentTool}.outputs`, { returnObjects: true });
     return (
       <div id="analysis-results" className="mt-8 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 mb-4">
             <Target className="w-5 h-5 text-[#4DA3FF]" />
             <h3 className="font-bold text-lg text-[#1A1A1A] font-cairo">{t('toolWorkArea')}</h3>
          </div>
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 mb-4">
             {outputs && typeof outputs === 'object' && Object.entries(outputs).map(([key, label]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                   <span className="text-gray-500 text-sm font-cairo">{label as string}</span>
                   <span className="font-bold text-[#1A1A1A] text-sm">-- Result --</span>
                </div>
             ))}
          </div>
          {!isSaved && <PrimaryButton onClick={handleOpenPreview} icon={Eye} text={t('actions.preview')} className="bg-[#1A1A1A] hover:bg-black mt-6" />}
          {isSaved && <div className="text-center text-green-500 font-bold mt-4">{t('projects.savedSuccess')}</div>}
       </div>
     );
  };

  const OverviewTab = () => {
    const features = Array.isArray(t(`items.${currentTool}.overview.features`, { returnObjects: true }))
      ? t(`items.${currentTool}.overview.features`, { returnObjects: true }) : [];
    return (
      <div className="space-y-6 pb-24">
        <AdBanner position="top" />
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold font-cairo text-lg mb-4 text-[#1A1A1A]">{t('overviewTitles.description')}</h2>
          <p className="text-gray-500 text-sm leading-relaxed text-justify font-cairo">{t(`items.${currentTool}.overview.description`)}</p>
        </div>
        <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold font-cairo text-lg mb-4 text-[#1A1A1A]">{t('overviewTitles.keyFeatures')}</h2>
          <ul className="space-y-3">
            {features.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-cairo">
                <div className="w-5 h-5 rounded-full bg-[#4DA3FF]/20 flex items-center justify-center text-[#4DA3FF] mt-0.5 flex-shrink-0"><CheckCircle className="w-3 h-3" /></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <PrimaryButton onClick={() => setActiveTab('tool')} text={t('overviewTitles.startNow')} icon={Zap} />
      </div>
    );
  };

  if (currentTool) {
    return (
      <div className="min-h-screen bg-[#FAFAF9]" dir={dir}>
         <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-20 shadow-sm">
            <button onClick={() => { setCurrentTool(null); setPendingAnalysis(null); }} className="flex items-center gap-2 text-gray-600 hover:text-[#4DA3FF] font-cairo font-bold text-sm transition-colors">
               {dir === 'rtl' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}{t('backToConstructionTools')}
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
                      <div className="mt-6"><PrimaryButton onClick={handleRunAnalysis} text={isProcessing ? t('actions.processing') : t('actions.runAnalysis')} icon={Zap} disabled={isProcessing} /></div>
                   </div>
                   <RenderResults />
                 </div>
               )}
               {activeTab === 'history' && <div className="py-20 text-center text-gray-400">{t('history.noHistory')}</div>}
            </motion.div>
         </div>
         
         <BottomAdBanner />
         
         <AnimatePresence>
            {isPreviewOpen && (
               <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
                  <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="bg-white rounded-t-[30px] md:rounded-[30px] w-full md:max-w-lg h-[85vh] md:h-auto overflow-y-auto p-6 relative">
                     <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
                     <div className="text-center mb-6"><h3 className="font-bold text-xl font-cairo text-[#1A1A1A]">{t('actions.preview')}</h3></div>
                     <div className="space-y-3"><PrimaryButton onClick={handleConfirmSave} text={t('actions.confirmSave')} icon={CheckCircle} /></div>
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
         title={t(`categories.${categoryId}.title`)}
         subtitle={t(`categories.${categoryId}.description`)}
         onBack={onBack}
         backgroundImage={CATEGORY_BG_MAP[categoryId]}
       />

       <div className="px-4 grid grid-cols-2 gap-4">
         {currentToolsList.map((id) => <ToolCard key={id} id={id} />)}
       </div>

       <BottomAdBanner />
    </div>
  );
}
