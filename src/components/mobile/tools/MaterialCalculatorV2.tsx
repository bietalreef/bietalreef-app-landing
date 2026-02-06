import { useState } from 'react';
import { motion } from 'motion/react';
import {
  SimpleToolShell, InputCard, SliderInput, OptionSelector,
  ActionButton, ResultCard, Divider, formatAED,
} from './SimpleToolShell';
import { calculateConstructionMaterials, MaterialResult } from './logic/AllCalculators';

export function MaterialCalculatorV2({ onBack }: { onBack: () => void }) {
  const [area, setArea] = useState(150);
  const [floors, setFloors] = useState('1');
  const [quality, setQuality] = useState('standard');
  const [result, setResult] = useState<MaterialResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const res = calculateConstructionMaterials({
        area,
        floors: Number(floors),
        finishQuality: quality as any,
      });
      setResult(res);
      setLoading(false);
      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }, 600);
  };

  return (
    <SimpleToolShell
      title="حاسبة مواد البناء"
      subtitle="احسب الكميات والتكاليف بدقة"
      icon="🧮"
      gradientFrom="#1F3D2B"
      gradientTo="#2AA676"
      onBack={onBack}
    >
      {/* Input Section */}
      <InputCard title="📐 بيانات المشروع">
        <SliderInput
          label="المساحة الإجمالية"
          value={area}
          onChange={setArea}
          min={50}
          max={2000}
          step={10}
          suffix="م²"
        />

        <OptionSelector
          label="عدد الأدوار"
          options={[
            { id: '1', label: 'دور واحد', icon: '🏠' },
            { id: '2', label: 'دورين', icon: '🏘️' },
            { id: '3', label: '3 أدوار', icon: '🏢' },
          ]}
          value={floors}
          onChange={setFloors}
        />

        <OptionSelector
          label="مستوى التشطيب"
          options={[
            { id: 'standard', label: 'عادي', icon: '🏠', desc: '~1,500 د.إ/م²' },
            { id: 'premium', label: 'ممتاز', icon: '⭐', desc: '~2,400 د.إ/م²' },
            { id: 'luxury', label: 'فاخر', icon: '👑', desc: '~3,800 د.إ/م²' },
          ]}
          value={quality}
          onChange={setQuality}
        />

        <div className="mt-5">
          <ActionButton
            onClick={handleCalculate}
            text="احسب الآن"
            icon="⚡"
            loading={loading}
          />
        </div>
      </InputCard>

      {/* Results Section */}
      {result && (
        <motion.div
          id="results-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Divider text="النتائج" />

          {/* Total Cost Card */}
          <div className="bg-gradient-to-l from-[#1A1A1A] to-[#2A2A2A] rounded-[24px] p-6 mb-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#2AA676]/10 rounded-full blur-3xl -ml-10 -mt-10" />
            <div className="relative z-10">
              <div className="text-gray-400 text-xs font-cairo mb-1">التكلفة التقديرية الإجمالية</div>
              <div className="text-3xl font-bold font-cairo text-[#2AA676] mb-1">
                {formatAED(result.totalEstimatedCost)}
              </div>
              <div className="text-gray-500 text-xs font-cairo">
                {formatAED(result.pricePerMeter)} / م²
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] font-cairo">المساحة</div>
                  <div className="text-white font-bold text-sm">{result.summary.area} م²</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] font-cairo">الأدوار</div>
                  <div className="text-white font-bold text-sm">{result.summary.floors}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-[10px] font-cairo">التشطيب</div>
                  <div className="text-[#C8A86A] font-bold text-sm capitalize">
                    {quality === 'standard' ? 'عادي' : quality === 'premium' ? 'ممتاز' : 'فاخر'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Materials Breakdown */}
          <InputCard title="📦 تفاصيل المواد">
            <div className="space-y-2">
              {result.items.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-[#1A1A1A] font-cairo">{item.nameAr}</div>
                      <div className="text-[10px] text-gray-400 font-cairo">
                        {item.amount.toLocaleString()} {item.unitAr}
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-sm text-[#2AA676] font-cairo">
                      {formatAED(item.estimatedCost)}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Labor Cost */}
              <div className="flex items-center justify-between py-3 px-3 rounded-xl bg-amber-50/50 mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">👷</span>
                  <div>
                    <div className="font-bold text-sm text-[#1A1A1A] font-cairo">أجور العمالة</div>
                    <div className="text-[10px] text-gray-400 font-cairo">تقدير شامل</div>
                  </div>
                </div>
                <div className="font-bold text-sm text-[#C8A86A] font-cairo">
                  {formatAED(result.laborCost)}
                </div>
              </div>
            </div>
          </InputCard>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-amber-800 text-xs font-cairo leading-relaxed">
              ⚠️ الأسعار تقديرية بناءً على متوسط أسعار السوق الإماراتي. الأسعار الفعلية تختلف حسب المورد والموقع والوقت. يُنصح بالحصول على عروض أسعار فعلية.
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <ActionButton onClick={() => {
              const text = `حاسبة مواد البناء - بيت الريف\nالمساحة: ${result.summary.area} م²\nالأدوار: ${result.summary.floors}\nالتكلفة التقديرية: ${formatAED(result.totalEstimatedCost)}\n\n${result.items.map(i => `${i.nameAr}: ${i.amount} ${i.unitAr} = ${formatAED(i.estimatedCost)}`).join('\n')}`;
              navigator.clipboard?.writeText(text).then(() => alert('تم نسخ النتائج'));
            }} text="نسخ" icon="📋" variant="secondary" />
            <ActionButton onClick={() => {
              const text = `حاسبة مواد البناء - بيت الريف\nالمساحة: ${result.summary.area} م²\nالتكلفة: ${formatAED(result.totalEstimatedCost)}`;
              const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
              window.open(url, '_blank');
            }} text="واتساب" icon="📤" variant="dark" />
          </div>

          {/* Re-calculate */}
          <ActionButton onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} text="حساب جديد" icon="🔄" variant="secondary" />
        </motion.div>
      )}
    </SimpleToolShell>
  );
}
