import { useState } from 'react';
import { Check, X, Shield, Star, Zap, Briefcase, ChevronRight, CheckCircle2, Crown, Building2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useUser } from '../../utils/UserContext';
import { toast } from 'sonner';

interface PlanFeature {
  label: string;
  included: boolean;
  limit?: string; // e.g., "1 Project", "Unlimited"
}

interface Plan {
  id: string; // internal code e.g., 'basic', 'advanced'
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number; // The "75" in "99 / 75" implies 75/mo if billed yearly
  color: string;
  badge?: string;
  features: {
    projects: string;
    legal: boolean;
    accounting: boolean;
    automation: boolean;
    voice_rooms: boolean;
    support: string;
  };
  uiFeatures: string[]; // List of text to display
}

export function SubscriptionsScreen({ onBack }: { onBack: () => void }) {
  const { profile } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Determine User Group (Zero-Trust Logic)
  // If role is 'company', show Company Plans. Otherwise (client, provider, etc.) show Individual Plans.
  const isCompany = profile?.role === 'company';
  
  // ==========================================
  // 1️⃣ INDIVIDUAL PLANS (Clients + Unlicensed Providers)
  // ==========================================
  const individualPlans: Plan[] = [
    {
      id: 'verified',
      name: 'موثّق (Verified)',
      description: 'دخول رسمي وبناء الثقة',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'bg-blue-500',
      features: {
        projects: 'limited',
        legal: false,
        accounting: false,
        automation: false,
        voice_rooms: false,
        support: 'basic'
      },
      uiFeatures: [
        'توثيق الحساب (OTP)',
        'تصفّح الخدمات والمتجر',
        'إنشاء/استقبال طلبات (محدود)',
        'مراسلة داخلية',
        'ملف شخصي موثّق'
      ]
    },
    {
      id: 'basic',
      name: 'باقة أساسية',
      description: 'للاستخدام الجاد',
      monthlyPrice: 99,
      yearlyPrice: 75,
      color: 'bg-[#2AA676]',
      badge: 'الأكثر شيوعاً',
      features: {
        projects: 'medium',
        legal: true, // Basic templates
        accounting: true, // Basic tracking
        automation: true, // Simple tasks
        voice_rooms: false,
        support: 'fast'
      },
      uiFeatures: [
        'ظهور مميّز في البحث',
        'عدد طلبات ومشاريع أعلى',
        'نماذج عقود قانونية بسيطة',
        'تتبع مصروفات بسيط',
        'تنبيهات آلية أساسية'
      ]
    },
    {
      id: 'advanced',
      name: 'باقة متقدمة',
      description: 'للمستقل النشط',
      monthlyPrice: 199,
      yearlyPrice: 150,
      color: 'bg-[#F2994A]',
      features: {
        projects: 'high',
        legal: true, // Advanced
        accounting: true, // Full
        automation: true, // Scenarios
        voice_rooms: false,
        support: 'priority'
      },
      uiFeatures: [
        'إدارة مشاريع كاملة',
        'عقود وموافقات قانونية',
        'فواتير وتتبع دخل/مصروف',
        'أتمتة سيناريوهات (Workflows)',
        'تحكم أكبر في الحساب'
      ]
    },
    {
      id: 'professional',
      name: 'باقة احترافية',
      description: 'أعلى باقة للأفراد',
      monthlyPrice: 500,
      yearlyPrice: 420,
      color: 'bg-[#1F3D2B]', // Dark / Black-ish
      badge: 'النخبة',
      features: {
        projects: 'unlimited',
        legal: true,
        accounting: true,
        automation: true, // Smart Workflows
        voice_rooms: true,
        support: 'dedicated'
      },
      uiFeatures: [
        'مشاريع غير محدودة',
        'إدارة قانونية كاملة',
        'محاسبة متقدمة + تقارير',
        'أتمتة كاملة (API)',
        'دخول الغرف الصوتية 🎧',
        'أولوية قصوى في الظهور'
      ]
    }
  ];

  // ==========================================
  // 2️⃣ COMPANY PLANS (Licensed Entities)
  // ==========================================
  const companyPlans: Plan[] = [
    {
      id: 'company_free',
      name: 'شركة (Start)',
      description: 'تجربة دخول للشركات',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'bg-gray-500',
      features: {
        projects: '1',
        legal: false,
        accounting: false,
        automation: false,
        voice_rooms: false,
        support: 'basic'
      },
      uiFeatures: [
        'حساب شركة رسمي',
        'مشروع واحد فقط',
        'ملف تعريفي للشركة',
        'الظهور في دليل الشركات'
      ]
    },
    {
      id: 'company_basic',
      name: 'شركة (Basic)',
      description: 'للمنشآت الصغيرة',
      monthlyPrice: 500,
      yearlyPrice: 390,
      color: 'bg-[#2AA676]',
      features: {
        projects: 'multi',
        legal: true,
        accounting: true,
        automation: true, // Limited
        voice_rooms: false,
        support: 'business'
      },
      uiFeatures: [
        'مشاريع متعددة',
        'عقود ونماذج قانونية',
        'محاسبة شركات أساسية',
        'أتمتة محدودة',
        'إدارة موظفين (محدود)'
      ]
    },
    {
      id: 'company_advanced',
      name: 'شركة (Advanced)',
      description: 'للمنشآت المتوسطة',
      monthlyPrice: 800,
      yearlyPrice: 650,
      color: 'bg-[#F2994A]',
      badge: 'الأفضل للشركات',
      features: {
        projects: 'teams',
        legal: true,
        accounting: true, // Full
        automation: true, // Operational
        voice_rooms: false,
        support: 'priority'
      },
      uiFeatures: [
        'إدارة فرق ومشاريع',
        'إدارة قانونية موسعة',
        'محاسبة كاملة',
        'أتمتة تشغيلية',
        'تقارير أداء'
      ]
    },
    {
      id: 'company_pro',
      name: 'شركة (Professional)',
      description: 'للكيانات الكبرى',
      monthlyPrice: 2000,
      yearlyPrice: 1800,
      color: 'bg-[#1A1A1A]',
      badge: 'Enterprise',
      features: {
        projects: 'unlimited',
        legal: true,
        accounting: true, // Tax reports
        automation: true, // API
        voice_rooms: true, // Private
        support: 'dedicated'
      },
      uiFeatures: [
        'مشاريع وفرق غير محدودة',
        'إدارة قانونية كاملة',
        'محاسبة + تقارير ضريبية',
        'أتمتة متقدمة + API',
        'غرف صوتية خاصة 🎧'
      ]
    }
  ];

  const plans = isCompany ? companyPlans : individualPlans;

  const handleSubscribe = (planId: string) => {
    if (planId === 'verified' || planId === 'company_free') {
      toast.success('أنت بالفعل على هذه الباقة');
      return;
    }
    toast.info(`جاري التحويل لبوابة الدفع للاشتراك في خطة: ${planId}`);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#F5EEE1] to-white overflow-y-auto pb-24" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-[#F5EEE1] z-10 px-5 py-4 flex items-center justify-between">
        <button onClick={onBack} className="text-[#1F3D2B] hover:text-[#2AA676] transition-colors">
            <ChevronRight className="w-6 h-6" /> {/* RTL Back Arrow */}
        </button>
        <h2 className="text-lg font-bold text-[#1F3D2B]">
          {isCompany ? 'باقات الشركات' : 'باقات الأفراد'}
        </h2>
        <div className="w-6" /> {/* Spacer */}
      </div>

      <div className="p-5">
        {/* Intro */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4A90E2] to-[#56CCF2] rounded-[24px] flex items-center justify-center mx-auto mb-4 shadow-lg">
             {isCompany ? <Building2 className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-2xl font-black text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {isCompany ? 'طوّر أعمال شركتك' : 'اختر الخطة المناسبة لك'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isCompany 
              ? 'حلول متكاملة للشركات المرخصة لإدارة المشاريع والفرق' 
              : 'باقات مصممة للأفراد، المستقلين، ومزودي الخدمات'
            }
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-full flex relative">
            <motion.div 
               className="absolute top-1 bottom-1 bg-white rounded-full shadow-sm"
               initial={false}
               animate={{ 
                 left: billingCycle === 'yearly' ? '4px' : '50%', 
                 right: billingCycle === 'yearly' ? '50%' : '4px',
                 width: '48%'
               }}
               transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-[#1F3D2B]' : 'text-gray-500'}`}
            >
              سنوي <span className="text-[10px] text-green-600 bg-green-100 px-1 rounded ml-1">وفر 20%</span>
            </button>
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-[#1F3D2B]' : 'text-gray-500'}`}
            >
              شهري
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-[32px] overflow-hidden border-2 ${
                profile?.tier === plan.id ? 'border-[#2AA676] ring-4 ring-[#2AA676]/10' : 'border-[#F5EEE1]'
              } shadow-xl`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 left-0 bg-[#F2994A] text-white text-xs font-bold px-4 py-1.5 rounded-br-[20px] z-10">
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className={`p-6 ${plan.color} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-xl font-black mb-1" style={{ fontFamily: 'Cairo, sans-serif' }}>{plan.name}</h3>
                <p className="text-white/80 text-sm mb-4 font-medium">{plan.description}</p>
                
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-sm text-white/80 mb-1 font-bold">
                     {plan.yearlyPrice === 0 ? 'مجاناً' : 'درهم / شهرياً'}
                  </span>
                </div>
                {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                   <p className="text-xs text-white/60 mt-1">يُفوتر {plan.yearlyPrice * 12} درهم سنوياً</p>
                )}
              </div>

              {/* Features */}
              <div className="p-6">
                <ul className="space-y-4 mb-8">
                  {plan.uiFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full ${plan.id === 'verified' || plan.id === 'company_free' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'} flex items-center justify-center flex-shrink-0`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-[#1A1A1A] text-sm font-semibold leading-tight">{feature}</span>
                    </li>
                  ))}
                  
                  {/* Visual Flags for Advanced Features */}
                  {(plan.features.voice_rooms || plan.features.automation) && (
                    <li className="pt-2 border-t border-gray-100 mt-2">
                       <div className="flex gap-3">
                          {plan.features.voice_rooms && (
                              <div className="flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-xs font-bold">
                                  <Zap size={12} /> غرف صوتية
                              </div>
                          )}
                          {plan.features.automation && (
                              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold">
                                  <Briefcase size={12} /> أتمتة
                              </div>
                          )}
                       </div>
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={profile?.tier === plan.id}
                  className={`w-full py-4 rounded-[20px] font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    profile?.tier === plan.id
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : `bg-gradient-to-r ${plan.color.replace('bg-', 'from-').replace('500', '400')} to-gray-900 text-white hover:shadow-xl`
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                >
                  {profile?.tier === plan.id ? (
                    <>
                      <CheckCircle2 size={20} />
                      باقتك الحالية
                    </>
                  ) : (
                    plan.yearlyPrice === 0 ? 'ابدأ مجاناً' : 'اشترك الآن'
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8">
          جميع الأسعار بالدرهم الإماراتي وتشمل ضريبة القيمة المضافة.
          <br/>
          يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </div>
  );
}
