import { Wrench, Calculator, Ruler, Package, FileText, ClipboardList, DollarSign, Hammer } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';

export function ToolsScreen() {
  const { t, dir } = useTranslation('tools');

  const toolsList = [
    { id: 1, icon: Calculator, title: t('materialsCalculator'), description: t('materialsCalculatorDesc'), color: 'from-blue-500 to-blue-600' },
    { id: 2, icon: Ruler, title: t('areaCalculator'), description: t('areaCalculatorDesc'), color: 'from-green-500 to-green-600' },
    { id: 3, icon: DollarSign, title: t('costEstimator'), description: t('costEstimatorDesc'), color: 'from-purple-500 to-purple-600' },
    { id: 4, icon: FileText, title: t('contractTemplates'), description: t('contractTemplatesDesc'), color: 'from-orange-500 to-orange-600' },
    { id: 5, icon: ClipboardList, title: t('checklists'), description: t('checklistsDesc'), color: 'from-pink-500 to-pink-600' },
    { id: 6, icon: Package, title: t('priceComparison'), description: t('priceComparisonDesc'), color: 'from-teal-500 to-teal-600' },
    { id: 7, icon: Hammer, title: t('toolsGuide'), description: t('toolsGuideDesc'), color: 'from-indigo-500 to-indigo-600' },
    { id: 8, icon: Wrench, title: t('maintenanceTips'), description: t('maintenanceTipsDesc'), color: 'from-red-500 to-red-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1F3D2B] to-[#2AA676] px-5 py-8">
        <h1 className="text-white text-center mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '28px' }}>
          🛠️ {t('title')}
        </h1>
        <p className="text-white/90 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px' }}>
          {t('subtitle')}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="px-5 py-6">
        <div className="grid grid-cols-1 gap-4">
          {toolsList.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="bg-white rounded-[24px] p-6 shadow-lg hover:shadow-xl transition-all border-2 border-[#F5EEE1] hover:border-[#2AA676]/20 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-[18px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className={`flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '18px' }}>
                      {tool.title}
                    </h3>
                    <p className="text-[#1A1A1A]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                      {tool.description}
                    </p>
                  </div>
                  <div className="text-[#2AA676] opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={dir === 'rtl' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <div className="px-5 pb-6">
        <div className="bg-gradient-to-br from-[#4A90E2]/10 to-[#56CCF2]/10 rounded-[24px] p-6 border-2 border-[#4A90E2]/20">
          <h3 className="text-[#1A1A1A] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '16px' }}>
            {t('tipTitle')}
          </h3>
          <p className="text-[#1A1A1A]/70" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: 1.7 }}>
            {t('tipText')}
          </p>
        </div>
      </div>
    </div>
  );
}
