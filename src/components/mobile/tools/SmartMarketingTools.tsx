import { useState } from 'react';
import { 
  Megaphone, Video, PenTool, MessageCircle, Share2, Target,
  ArrowRight, Sparkles, Download, Save, Copy, Upload, Calendar,
  Instagram, Facebook, Twitter, TrendingUp, Users, BarChart,
  Settings, Zap, Image as ImageIcon, FileText, Send, Youtube,
  Linkedin, Globe
} from 'lucide-react';
import { useTranslation } from '../../../contexts/LanguageContext';
import { SocialAccountsManager } from '../SocialAccountsManager';

interface SmartMarketingToolsProps {
  onBack: () => void;
}

type MarketingToolId = 
  | 'postGenerator'
  | 'reelsGenerator' 
  | 'contentWizard'
  | 'whatsappBot'
  | 'autoPublishing'
  | 'campaignAnalyzer';

type TabType = 'overview' | 'tool' | 'history';

interface HistoryItem {
  id: string;
  date: string;
  preview: string;
  type: string;
}

export function SmartMarketingTools({ onBack }: SmartMarketingToolsProps) {
  const { t, dir } = useTranslation('tools');
  
  const [selectedTool, setSelectedTool] = useState<MarketingToolId | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSocialManager, setShowSocialManager] = useState(false);

  // Marketing Tools Configuration
  const marketingTools = [
    {
      id: 'postGenerator' as MarketingToolId,
      icon: PenTool,
      color: 'from-pink-400 to-rose-500',
      price: 10
    },
    {
      id: 'reelsGenerator' as MarketingToolId,
      icon: Video,
      color: 'from-purple-400 to-pink-500',
      price: 15
    },
    {
      id: 'contentWizard' as MarketingToolId,
      icon: Sparkles,
      color: 'from-blue-400 to-purple-500',
      price: 20
    },
    {
      id: 'whatsappBot' as MarketingToolId,
      icon: MessageCircle,
      color: 'from-green-400 to-emerald-500',
      price: 25
    },
    {
      id: 'autoPublishing' as MarketingToolId,
      icon: Calendar,
      color: 'from-orange-400 to-red-500',
      price: 15
    },
    {
      id: 'campaignAnalyzer' as MarketingToolId,
      icon: Target,
      color: 'from-indigo-400 to-blue-500',
      price: 20
    }
  ];

  const handleToolSelect = (toolId: MarketingToolId) => {
    setSelectedTool(toolId);
    setActiveTab('overview');
    setResult(null);
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedTool(null);
    setActiveTab('overview');
    setResult(null);
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setResult(generateMockResult(selectedTool!));
      setIsProcessing(false);
      setActiveTab('tool');
    }, 2000);
  };

  const generateMockResult = (toolId: MarketingToolId) => {
    switch (toolId) {
      case 'postGenerator':
        return {
          designs: ['تصميم 1', 'تصميم 2', 'تصميم 3'],
          caption: '🏠 فيلا فاخرة للبيع في دبي\n✨ 5 غرف نوم | 6 حمامات\n📍 موقع مميز | تشطيبات راقية\n💰 سعر تنافسي\n📞 للاستفسار: واتساب',
          hashtags: '#فيلا_دبي #عقارات_الإمارات #بيت_للبيع #luxury_villa'
        };
      case 'reelsGenerator':
        return {
          video: 'https://example.com/reel.mp4',
          cover: 'https://example.com/cover.jpg',
          duration: '15 ثانية',
          effects: ['انتقالات سلسة', 'موسيقى تصويرية', 'نصوص متحركة']
        };
      case 'contentWizard':
        return {
          plan: {
            week1: ['نصائح عقارية', 'فيديو تعليمي', 'جولة افتراضية'],
            week2: ['قصة نجاح', 'مقارنة أسعار', 'أسئلة شائعة'],
            week3: ['معلومة سريعة', 'عقار الأسبوع', 'نصائح استثمارية'],
            week4: ['شهادات عملاء', 'خلف الكواليس', 'استشارة مجانية']
          },
          ideas: ['10 نصائح لشراء منزلك الأول', 'كيف تختار الموقع المناسب', 'دليل الاستثمار العقاري']
        };
      case 'whatsappBot':
        return {
          botConfig: {
            welcomeMessage: 'مرحباً بك! 👋\nكيف يمكنني مساعدتك اليوم؟',
            autoResponses: [
              { keyword: 'أسعار', response: 'تتراوح أسعارنا من... إلى...' },
              { keyword: 'موعد', response: 'يسعدني تحديد موعد زيارة، متى يناسبك؟' },
              { keyword: 'كتالوج', response: 'سأرسل لك الكتالوج فوراً 📁' }
            ]
          },
          testLink: 'wa.me/97150xxxxxxx'
        };
      case 'autoPublishing':
        return {
          schedule: {
            scheduled: 12,
            published: 8,
            pending: 4
          },
          bestTimes: ['9:00 صباحاً', '1:00 ظهراً', '8:00 مساءً'],
          platforms: ['Instagram', 'Facebook', 'Twitter']
        };
      case 'campaignAnalyzer':
        return {
          report: {
            totalSpend: '15,000 درهم',
            leads: 245,
            costPerLead: '61 درهم',
            roi: '285%',
            conversions: 18
          },
          optimization: [
            'زيادة الميزانية على الحملة A',
            'تحسين الاستهداف للفئة 25-35',
            'تجربة نسخ إعلانية جديدة'
          ]
        };
      default:
        return {};
    }
  };

  // Mock history data
  const getHistoryData = (toolId: MarketingToolId): HistoryItem[] => {
    return [
      { id: '1', date: '2025-01-07', preview: 'حملة عقارات دبي', type: toolId },
      { id: '2', date: '2025-01-05', preview: 'منشور فيلا الشارقة', type: toolId },
      { id: '3', date: '2025-01-03', preview: 'ريلز شقة أبوظبي', type: toolId }
    ];
  };

  if (!selectedTool) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white" dir={dir}>
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 pb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white mb-4 hover:gap-3 transition-all"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
          >
            <ArrowRight className="w-5 h-5" />
            <span>{t('backToSmartTools')}</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Megaphone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('categories.marketing.title')}
              </h1>
              <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('categories.marketing.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Pro Banner */}
        <div className="px-4 -mt-4 mb-6">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '17px' }}>
                  {t('proFeatures')}
                </h3>
                <p className="text-white/90 text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {t('proDescription')}
                </p>
                <button className="bg-white text-orange-600 px-6 py-2 rounded-full text-sm hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  {t('upgradeNow')}
                </button>
              </div>
              <Sparkles className="w-12 h-12 text-white/80" />
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="px-4 pb-8">
          <h2 className="text-[#1F3D2B] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '19px' }}>
            6 {t('tools')}
          </h2>
          
          <div className="grid gap-4">
            {marketingTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100 text-right"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 text-right">
                      <h3 className="text-[#1F3D2B] mb-1" style={{ fontWeight: 700, fontSize: '17px' }}>
                        {t(`items.${tool.id}.name`)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {t(`items.${tool.id}.desc`)}
                      </p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                          {tool.price} {t('overviewTitles.coins')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Integration Banner */}
        <div className="px-4 pb-24">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  ربط حساباتك
                </h3>
                <p className="text-gray-600 text-sm mb-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  قم بربط حساباتك على منصات التواصل الاجتماعي لتفعيل جميع مميزات الأتمتة
                </p>
                <button 
                  onClick={() => setShowSocialManager(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
                >
                  <Zap className="w-5 h-5" />
                  <span>إدارة الحسابات</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Accounts Manager Modal */}
        {showSocialManager && (
          <SocialAccountsManager 
            mode="modal"
            onClose={() => setShowSocialManager(false)}
          />
        )}
      </div>
    );
  }

  // Tool Detail View
  const tool = marketingTools.find(t => t.id === selectedTool)!;
  const Icon = tool.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${tool.color} p-6 pb-8`}>
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 text-white mb-4 hover:gap-3 transition-all"
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
        >
          <ArrowRight className="w-5 h-5" />
          <span>{t('backToConstructionTools')}</span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xl mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t(`items.${selectedTool}.name`)}
            </h1>
            <p className="text-white/90 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {t(`items.${selectedTool}.desc`)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex">
          {(['overview', 'tool', 'history'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center transition-all ${
                activeTab === tab
                  ? 'text-rose-600 border-b-4 border-rose-600'
                  : 'text-gray-500'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('overviewTitles.description')}
              </h3>
              <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t(`items.${selectedTool}.overview.description`)}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('overviewTitles.keyFeatures')}
              </h3>
              <div className="space-y-2">
                {t(`items.${selectedTool}.overview.features`, { returnObjects: true }).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700" style={{ fontFamily: 'Cairo, sans-serif' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Usage */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-200">
              <h3 className="text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('overviewTitles.howToUse')}
              </h3>
              <p className="text-gray-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t(`items.${selectedTool}.overview.usage`)}
              </p>
            </div>

            {/* Price & CTA */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 text-center">
              <p className="text-white/90 text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('overviewTitles.price')}
              </p>
              <p className="text-white text-3xl mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                {tool.price} {t('overviewTitles.coins')}
              </p>
              <button 
                onClick={() => setActiveTab('tool')}
                className="bg-white text-orange-600 px-8 py-3 rounded-full hover:shadow-xl transition-all inline-flex items-center gap-2"
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                <Zap className="w-5 h-5" />
                <span>{t('overviewTitles.startNow')}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tool' && (
          <div className="space-y-6">
            {/* Tool Interface */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-[#1F3D2B] mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                إعدادات الأداة
              </h3>
              
              {/* Dynamic inputs based on tool */}
              {selectedTool === 'postGenerator' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      صورة العقار
                    </label>
                    <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-rose-500 transition-all flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>انقر لرفع صورة</span>
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      المنصة
                    </label>
                    <select className="w-full border border-gray-300 rounded-xl p-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      <option>Instagram</option>
                      <option>Facebook</option>
                      <option>Twitter</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      النقاط المميزة
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-xl p-3 h-24" 
                      placeholder="مثال: 5 غرف نوم، مسبح خاص، موقع مميز..."
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'reelsGenerator' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الصور/الفيديو
                    </label>
                    <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-rose-500 transition-all flex flex-col items-center gap-2">
                      <Video className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>رفع ميديا (حتى 10 ملفات)</span>
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      النمط
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="border-2 border-rose-500 bg-rose-50 text-rose-600 rounded-xl p-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        سريع ⚡
                      </button>
                      <button className="border-2 border-gray-300 rounded-xl p-3 text-gray-600" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        هادئ 🎵
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'contentWizard' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      التخصص
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-xl p-3" 
                      placeholder="مثال: عقارات سكنية، تجارية..."
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الجمهور المستهدف
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-xl p-3" 
                      placeholder="مثال: المستثمرين، العائلات الشابة..."
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'whatsappBot' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الكلمة المفتاحية
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-xl p-3" 
                      placeholder="مثال: أسعار، موعد، كتالوج..."
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الرد الآلي
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-xl p-3 h-24" 
                      placeholder="اكتب الرد الذي سيظهر تلقائياً..."
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {selectedTool === 'autoPublishing' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      عدد المنشورات
                    </label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-xl p-3" 
                      placeholder="كم منشور تريد جدولته؟"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الحسابات المستهدفة
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-5 h-5 text-rose-500" />
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <span style={{ fontFamily: 'Cairo, sans-serif' }}>Instagram</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input type="checkbox" className="w-5 h-5 text-rose-500" />
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <span style={{ fontFamily: 'Cairo, sans-serif' }}>Facebook</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'campaignAnalyzer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      المنصة
                    </label>
                    <select className="w-full border border-gray-300 rounded-xl p-3" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      <option>Meta (Facebook & Instagram)</option>
                      <option>Google Ads</option>
                      <option>Snapchat</option>
                      <option>TikTok</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      الميزانية الإجمالية
                    </label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-xl p-3" 
                      placeholder="0"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      عدد العملاء المحتملين (Leads)
                    </label>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded-xl p-3" 
                      placeholder="0"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className={`w-full mt-6 ${
                  isProcessing 
                    ? 'bg-gray-400' 
                    : `bg-gradient-to-r ${tool.color}`
                } text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t('actions.processing')}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>{t('actions.runAnalysis')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="text-[#1F3D2B] mb-4 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  النتائج
                </h3>

                {selectedTool === 'postGenerator' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>النص الإعلاني:</h4>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-800 whitespace-pre-line" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {result.caption}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>الهاشتاقات:</h4>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-blue-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                          {result.hashtags}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        <Copy className="w-5 h-5" />
                        نسخ
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        <Download className="w-5 h-5" />
                        تحميل
                      </button>
                    </div>
                  </div>
                )}

                {selectedTool === 'campaignAnalyzer' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>ROI</p>
                        <p className="text-2xl text-green-600" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.report.roi}
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>تكلفة العميل</p>
                        <p className="text-2xl text-blue-600" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.report.costPerLead}
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>إجمالي الإنفاق</p>
                        <p className="text-2xl text-purple-600" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.report.totalSpend}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>العملاء المحتملون</p>
                        <p className="text-2xl text-orange-600" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.report.leads}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-orange-200">
                      <h4 className="text-[#1F3D2B] mb-3 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        <Target className="w-5 h-5 text-orange-500" />
                        توصيات التحسين:
                      </h4>
                      <ul className="space-y-2">
                        {result.optimization.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            <span className="text-orange-500 flex-shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedTool === 'contentWizard' && result.plan && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <h4 className="text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        خطة المحتوى الشهرية:
                      </h4>
                      {Object.entries(result.plan).map(([week, items]: [string, any]) => (
                        <div key={week} className="mb-3">
                          <p className="text-sm text-purple-600 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {week === 'week1' ? 'الأسبوع الأول' : week === 'week2' ? 'الأسبوع الثاني' : week === 'week3' ? 'الأسبوع الثالث' : 'الأسبوع الرابع'}:
                          </p>
                          <ul className="space-y-1">
                            {items.map((item: string, idx: number) => (
                              <li key={idx} className="text-gray-700 text-sm flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                                <span className="text-purple-400">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTool === 'whatsappBot' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <h4 className="text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        رسالة الترحيب:
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {result.botConfig.welcomeMessage}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                        الردود الآلية:
                      </h4>
                      <div className="space-y-2">
                        {result.botConfig.autoResponses.map((resp: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded-xl p-3">
                            <p className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              عند كتابة: <span className="font-bold text-gray-700">{resp.keyword}</span>
                            </p>
                            <p className="text-gray-800" style={{ fontFamily: 'Cairo, sans-serif' }}>
                              {resp.response}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-500 text-white py-3 rounded-xl flex items-center justify-center gap-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      <Send className="w-5 h-5" />
                      تفعيل البوت
                    </button>
                  </div>
                )}

                {selectedTool === 'autoPublishing' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 rounded-xl p-4 text-center">
                        <p className="text-2xl text-blue-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.schedule.scheduled}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>مجدولة</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <p className="text-2xl text-green-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.schedule.published}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>منشورة</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <p className="text-2xl text-orange-600 mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
                          {result.schedule.pending}
                        </p>
                        <p className="text-xs text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>قيد الانتظار</p>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <h4 className="text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                        أفضل أوقات النشر:
                      </h4>
                      <div className="flex gap-2 flex-wrap">
                        {result.bestTimes.map((time: string, idx: number) => (
                          <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {getHistoryData(selectedTool).length > 0 ? (
              getHistoryData(selectedTool).map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                      {item.preview}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {item.date}
                    </p>
                  </div>
                  <button className="text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                    عرض
                  </button>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>
                  {t('history.noHistory')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Powered By Footer */}
      <div className="px-4 py-6 text-center">
        <p className="text-gray-500 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
          {t('poweredBy')}
        </p>
      </div>
    </div>
  );
}