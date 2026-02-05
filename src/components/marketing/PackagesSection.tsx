import { useState } from 'react';
import { User, ShieldCheck, Crown, UserPlus, Building2, Zap, Check } from 'lucide-react';

export function PackagesSection() {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');

  const clientPackages = [
    {
      id: 'guest',
      title: 'زائر (Guest)',
      subtitle: 'استكشاف، تصفح، بدون تواصل',
      icon: UserPlus,
      features: ['تصفح المشاريع العامة', 'الاطلاع على المتجر', 'استخدام الأدوات المجانية'],
      color: 'bg-gray-100',
      textColor: 'text-gray-600',
      btnText: 'التسجيل مجاناً'
    },
    {
      id: 'verified',
      title: 'موثق (Verified)',
      subtitle: '3 مشاريع، تواصل، تقييم',
      icon: ShieldCheck,
      features: ['إضافة 3 مشاريع', 'التواصل مع المزودين', 'تقييم الخدمات', 'شارة موثوق'],
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      btnText: 'تفعيل الحساب'
    },
    {
      id: 'vip',
      title: 'مميز (VIP)',
      subtitle: 'بلا حدود، مدير حساب، غرف خاصة',
      icon: Crown,
      features: ['مشاريع غير محدودة', 'مدير حساب شخصي', 'غرف دردشة خاصة', 'أولوية الدعم', 'خصومات حصرية'],
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      btnText: 'ترقية للعضوية'
    }
  ];

  const providerPackages = [
    {
      id: 'freelancer',
      title: 'مستقل (Freelancer)',
      subtitle: 'استقبال محدود، ملف بسيط',
      icon: User,
      features: ['ملف شخصي أساسي', 'استقبال 3 طلبات شهرياً', 'الظهور في البحث العام'],
      color: 'bg-gray-100',
      textColor: 'text-gray-600',
      btnText: 'ابدأ كمستقل'
    },
    {
      id: 'pro',
      title: 'محترف (Pro)',
      subtitle: 'تقديم عروض، شارة توثيق، ظهور',
      icon: Zap,
      features: ['تقديم عروض غير محدودة', 'شارة محترف', 'أولوية الظهور في البحث', 'معرض أعمال متقدم'],
      color: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      btnText: 'اشترك الآن'
    },
    {
      id: 'enterprise',
      title: 'شركة (Enterprise)',
      subtitle: 'إدارة فريق، مناقصات، API',
      icon: Building2,
      features: ['حسابات فريق عمل', 'دخول المناقصات الكبرى', 'ربط API', 'لوحة تحكم متقدمة', 'مدير علاقات'],
      color: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200',
      btnText: 'تواصل للمبيعات'
    }
  ];

  const currentPackages = activeTab === 'client' ? clientPackages : providerPackages;

  return (
    <div className="py-8 px-4 font-cairo" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر خطتك المناسبة</h2>
        <p className="text-gray-500 text-sm">باقات مصممة لتناسب احتياجاتك سواء كنت عميلاً أو مزود خدمة</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setActiveTab('client')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'client' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            رحلة العميل
          </button>
          <button 
            onClick={() => setActiveTab('provider')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'provider' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            رحلة المزود
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {currentPackages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div 
              key={pkg.id} 
              className={`relative rounded-2xl p-6 border-2 transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col ${pkg.borderColor || 'border-transparent'} ${pkg.color}`}
            >
              <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-white shadow-sm ${pkg.textColor}`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.title}</h3>
              <p className="text-xs text-gray-500 font-bold mb-4">{pkg.subtitle}</p>
              
              <div className="flex-1 space-y-3 mb-6">
                {pkg.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className={`mt-1 p-0.5 rounded-full ${pkg.textColor} bg-white/50`}>
                       <Check className="w-3 h-3" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-bold bg-white shadow-sm hover:shadow-md transition-all border border-transparent hover:border-gray-200 ${pkg.textColor}`}>
                {pkg.btnText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
