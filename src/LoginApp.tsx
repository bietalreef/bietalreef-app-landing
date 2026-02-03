import { useState } from 'react';
import { User, Briefcase, Crown, ShieldCheck, UserPlus, Building2, Zap, ArrowRight, Home } from 'lucide-react';
import { useUser } from './utils/UserContext';
import { UserRole, UserTier } from './utils/uiPolicy';

interface LoginAppProps {
  onComplete: () => void;
}

export default function LoginApp({ onComplete }: LoginAppProps) {
  const { assignRole } = useUser();
  const [loadingCard, setLoadingCard] = useState<string | null>(null);

  const handleRoleSelect = async (role: UserRole, tier: UserTier, cardId: string) => {
    setLoadingCard(cardId);
    await assignRole(role, tier);
    setLoadingCard(null);
    onComplete();
  };

  const Card = ({ 
    id, title, desc, icon: Icon, role, tier, colorClass, borderClass 
  }: { 
    id: string, title: string, desc: string, icon: any, role: UserRole, tier: UserTier, colorClass: string, borderClass: string 
  }) => {
    const isLoading = loadingCard === id;
    
    return (
      <button
        onClick={() => handleRoleSelect(role, tier, id)}
        disabled={loadingCard !== null}
        className={`relative group flex flex-col items-center p-6 bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${borderClass} text-right disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-[24px]">
            <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin text-gray-500" />
          </div>
        )}
        
        <div className={`w-16 h-16 ${colorClass} rounded-[20px] flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>{title}</h3>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif' }}>{desc}</p>
        
        <div className="mt-auto flex items-center gap-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-gray-400">
          <span>دخول</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5EEE1] flex flex-col items-center justify-center p-6" dir="rtl">
      
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-10 h-10 text-[#5B7FE8]" />
            </div>
        </div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>بيت الريف</h1>
        <p className="text-gray-500" style={{ fontFamily: 'Cairo, sans-serif' }}>بوابة المطورين - اختر صلاحية الدخول (Real DB)</p>
      </div>

      <div className="w-full max-w-5xl grid gap-8">
        
        {/* SECTION A: CLIENTS */}
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <User className="w-6 h-6 text-[#5B7FE8]" />
            <span>رحلة العميل (Homeowner)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              id="c1"
              title="زائر (Guest)"
              desc="استكشاف، تصفح، بدون تواصل"
              icon={UserPlus}
              role="client"
              tier="guest"
              colorClass="bg-gray-400"
              borderClass="border-gray-100 hover:border-gray-400"
            />
            <Card 
              id="c2"
              title="موثق (Verified)"
              desc="3 مشاريع، تواصل، تقييم"
              icon={ShieldCheck}
              role="client"
              tier="verified"
              colorClass="bg-[#5B7FE8]"
              borderClass="border-[#5B7FE8]/20 hover:border-[#5B7FE8]"
            />
            <Card 
              id="c3"
              title="مميز (VIP)"
              desc="بلا حدود، مدير حساب، غرف خاصة"
              icon={Crown}
              role="client"
              tier="pro"
              colorClass="bg-gradient-to-br from-amber-400 to-amber-600"
              borderClass="border-amber-200 hover:border-amber-500"
            />
          </div>
        </div>

        {/* SECTION B: PROVIDERS */}
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-4 flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Briefcase className="w-6 h-6 text-[#10B981]" />
            <span>رحلة المزود (Provider)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              id="p1"
              title="مستقل (Freelancer)"
              desc="استقبال محدود، ملف بسيط"
              icon={User}
              role="provider"
              tier="free"
              colorClass="bg-gray-500"
              borderClass="border-gray-100 hover:border-gray-500"
            />
            <Card 
              id="p2"
              title="محترف (Pro)"
              desc="تقديم عروض، شارة توثيق، ظهور"
              icon={Zap}
              role="provider"
              tier="verified"
              colorClass="bg-[#10B981]"
              borderClass="border-[#10B981]/20 hover:border-[#10B981]"
            />
            <Card 
              id="p3"
              title="شركة (Enterprise)"
              desc="إدارة فريق، مناقصات، API"
              icon={Building2}
              role="provider"
              tier="enterprise"
              colorClass="bg-gradient-to-br from-slate-700 to-slate-900"
              borderClass="border-slate-200 hover:border-slate-800"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
