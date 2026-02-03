import { useState } from 'react';
import { ArrowRight, Star, Clipboard, Calculator, Building, Ruler, FileCheck, Users } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { ServiceSEOHead } from '../SEOHead';
import { GlassCard } from './GlassCard';
import { useTranslation } from '../../contexts/LanguageContext';

interface ServiceDetailEngineeringConsultationProps {
  onBack: () => void;
  onNavigate?: (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => void;
  onOpenSearch?: (category?: string) => void;
}

export function ServiceDetailEngineeringConsultation({ onBack, onNavigate, onOpenSearch }: ServiceDetailEngineeringConsultationProps) {
  const { t, dir, language } = useTranslation('services');
  const [activeTab, setActiveTab] = useState<'details' | 'providers' | 'reviews'>('details');

  const seoData = {
    title: language === 'ar' ? 'الاستشارات الهندسية في الإمارات | مهندس استشاري معتمد | بيت الريف' : 'Engineering Consultation in UAE | Certified Consultant | Biet Alreef',
    description: language === 'ar' ? 'أفضل المهندسين الاستشاريين في الإمارات. تصميم، إشراف، استشارات إنشائية ومعمارية.' : 'Best consulting engineers in UAE. Design, supervision, structural and architectural consultation.',
    serviceId: 'SRV-ENGI-002',
    serviceName: t('engineering.title'),
    serviceType: language === 'ar' ? 'خدمات هندسية واستشارية' : 'Engineering and Consulting Services',
    priceRange: language === 'ar' ? '5000 - 150000 د.إ' : '5,000 - 150,000 AED',
    rating: 4.9,
    reviewCount: 456,
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
    keywords: language === 'ar'
      ? ['استشارات هندسية', 'مهندس استشاري', 'تصميم معماري', 'إشراف هندسي', 'بيت الريف']
      : ['engineering consultation', 'consulting engineer', 'architectural design', 'engineering supervision', 'Biet Alreef'],
    faqs: [{ 
      question: language === 'ar' ? 'ما هي الاستشارات الهندسية؟' : 'What is engineering consultation?', 
      answer: language === 'ar' ? 'تصميم معماري، إشراف على التنفيذ، استشارات إنشائية، دراسات جدوى.' : 'Architectural design, execution supervision, structural consultations, feasibility studies.'
    }],
    providerCount: 45,
    projectCount: 890
  };

  const serviceItems = [
    { icon: Ruler, title: t('engineering.architecturalDesignItem'), description: t('engineering.architecturalDesignDesc') },
    { icon: Calculator, title: t('engineering.structuralDesignItem'), description: t('engineering.structuralDesignDesc') },
    { icon: Building, title: t('engineering.supervision'), description: t('engineering.supervisionDesc') },
    { emoji: '📋', title: t('engineering.feasibilityStudies'), description: t('engineering.feasibilityStudiesDesc') },
    { icon: FileCheck, title: t('engineering.buildingInspection'), description: t('engineering.buildingInspectionDesc') },
    { emoji: '📐', title: t('engineering.executionPlans'), description: t('engineering.executionPlansDesc') },
    { icon: Users, title: t('engineering.technicalConsultation'), description: t('engineering.technicalConsultationDesc') },
    { emoji: '✅', title: t('engineering.planApproval'), description: t('engineering.planApprovalDesc') },
    { emoji: '🔧', title: t('engineering.systemsDesign'), description: t('engineering.systemsDesignDesc') },
    { emoji: '🏗️', title: t('engineering.projectManagementItem'), description: t('engineering.projectManagementDesc') },
    { icon: Clipboard, title: t('engineering.technicalReports'), description: t('engineering.technicalReportsDesc') },
    { emoji: '⏱️', title: t('engineering.periodicFollowup'), description: t('engineering.periodicFollowupDesc') },
  ];

  const handleBottomNavChange = (tab: 'home' | 'services' | 'yak' | 'projects' | 'profile' | 'realestate' | 'shop' | 'maps' | 'tools' | 'recommendations' | 'offers') => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-24" dir={dir}>
      <ServiceSEOHead {...seoData} />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <button onClick={onBack} className="inline-flex items-center gap-2 bg-gradient-to-l from-[#2AA676] to-[#C8A86A] text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          <ArrowRight className="w-5 h-5" /><span>{t('backToHome')}</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-l from-[#4A90E2]/10 to-white py-8 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('engineering.title')}
              </h1>
              <p className="text-gray-600 leading-relaxed max-w-3xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('engineering.subtitle')}
              </p>
            </div>
            <div className="text-6xl">👨‍💼</div>
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C8A86A] text-[#C8A86A]" />
                ))}
              </div>
              <span className="text-[#1F3D2B]" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>4.9</span>
              <span className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>(456 {t('engineering.reviewsCount')})</span>
            </div>
            <div className="bg-[#4A90E2] text-white px-4 py-1 rounded-full text-sm" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('certified')} ✓
            </div>
          </div>
          <button className="bg-gradient-to-l from-[#4A90E2] to-[#1F3D2B] text-white px-8 py-3 rounded-full hover:shadow-lg transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('engineering.getConsultation')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#F5EEE1] sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-0">
            {(['details', 'providers', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 transition-all ${
                  activeTab === tab ? 'text-[#4A90E2] border-b-4 border-[#4A90E2]' : 'text-gray-500'
                }`}
                style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
              >
                {t(`tabs.${tab}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'details' && (
          <div>
            <h2 className="text-2xl text-[#1F3D2B] mb-6" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('engineering.servicesTitle')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {serviceItems.map((item, idx) => (
                <GlassCard
                  key={idx}
                  icon={item.icon}
                  emoji={item.emoji}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'providers' && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>45 {t('engineering.certifiedEngineers')}</p>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-5xl text-[#4A90E2] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              4.9
            </div>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>456 {t('engineering.reviewsCount')}</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-l from-[#4A90E2] to-[#1F3D2B] py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white mb-4" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('engineering.getConsultation')} {t('features.freeConsultation')}
          </h2>
          <p className="text-white/90 mb-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('contactProvider')}
          </p>
          <button className="bg-white text-[#4A90E2] px-10 py-4 rounded-full hover:shadow-2xl transition-shadow" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
            {t('contactUs')}
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="services" 
        onTabChange={handleBottomNavChange}
      />
    </div>
  );
}