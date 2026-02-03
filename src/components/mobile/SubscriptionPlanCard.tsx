// ====================================
// 💎 Subscription Plan Card Component
// بيت الريف - بطاقة خطة اشتراك
// ====================================

import { Check, X, Zap } from 'lucide-react';
import { SubscriptionPlan, calculateYearlySavings } from '../../data/subscriptionPlans';
import { motion } from 'motion/react';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onUpgrade?: () => void;
  showYearlyPrice?: boolean;
}

export function SubscriptionPlanCard({ 
  plan, 
  isCurrentPlan = false, 
  onUpgrade,
  showYearlyPrice = false 
}: SubscriptionPlanCardProps) {
  const yearlySavings = calculateYearlySavings(plan.id);
  const displayPrice = showYearlyPrice && plan.priceYearly 
    ? Math.round(plan.priceYearly / 12) 
    : plan.priceMonthly;

  return (
    <motion.div
      whileHover={{ scale: plan.popular ? 1.02 : 1 }}
      className={`relative bg-white rounded-3xl overflow-hidden shadow-lg border-2 transition-all ${
        plan.popular 
          ? 'border-[#4A90E2] shadow-xl' 
          : isCurrentPlan
          ? 'border-[#2AA676]'
          : 'border-[#F5EEE1]'
      }`}
      dir="rtl"
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] py-2 text-center">
          <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            ⭐ {plan.badge}
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 bg-[#2AA676] py-2 text-center">
          <span className="text-white text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            ✓ الخطة الحالية
          </span>
        </div>
      )}

      <div className={`p-6 ${plan.popular || isCurrentPlan ? 'pt-12' : ''}`}>
        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{plan.icon}</div>
          <h3 className="text-xl text-[#1F3D2B] mb-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            {plan.name}
          </h3>
          <p className="text-xs text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {plan.nameEn}
          </p>
        </div>

        {/* Price */}
        <div className="text-center mb-6 pb-6 border-b border-[#F5EEE1]">
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-4xl" style={{ color: plan.color, fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
              {displayPrice}
            </span>
            <span className="text-lg text-[#1F3D2B]/60" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              درهم
            </span>
          </div>
          <p className="text-sm text-[#1F3D2B]/60 mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            شهرياً
          </p>
          
          {showYearlyPrice && plan.priceYearly && (
            <div className="bg-[#2AA676]/10 text-[#2AA676] px-3 py-1.5 rounded-full inline-block text-xs" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              وفّر {yearlySavings} درهم سنوياً
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm text-[#1F3D2B] mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
            ✨ المميزات
          </h4>
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-[#2AA676]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#2AA676]" />
              </div>
              <span className="text-xs text-[#1F3D2B]/80 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Limitations */}
        {plan.limitations.length > 0 && (
          <div className="space-y-3 mb-6 pb-6 border-b border-[#F5EEE1]">
            <h4 className="text-sm text-[#1F3D2B]/60 mb-3" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}>
              ⚠️ القيود
            </h4>
            {plan.limitations.map((limitation, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-[#1F3D2B]/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-[#1F3D2B]/40" />
                </div>
                <span className="text-xs text-[#1F3D2B]/50 leading-relaxed" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
                  {limitation}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onUpgrade}
          disabled={isCurrentPlan}
          className={`w-full py-3.5 rounded-xl transition-all ${
            isCurrentPlan
              ? 'bg-[#F5EEE1] text-[#1F3D2B]/40 cursor-not-allowed'
              : plan.popular
              ? 'bg-gradient-to-r from-[#4A90E2] to-[#56CCF2] text-white hover:shadow-lg'
              : 'bg-white border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white'
          }`}
          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800 }}
        >
          {isCurrentPlan ? (
            'الخطة الحالية'
          ) : plan.priceMonthly === 0 ? (
            'البدء مجاناً'
          ) : (
            <>
              <Zap className="w-4 h-4 inline mr-1" />
              ترقية الآن
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
