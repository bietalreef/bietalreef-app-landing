import { useState } from 'react';
import { motion } from 'motion/react';
import {
  SimpleToolShell, InputCard, SliderInput, OptionSelector, CounterInput,
  ActionButton, Divider, formatAED,
} from './SimpleToolShell';
import { calculatePaintFlooring, PaintFlooringResult, getFlooringName } from './logic/AllCalculators';

export function PaintFlooringCalc({ onBack }: { onBack: () => void }) {
  const [length, setLength] = useState(5);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(2);
  const [paintCoats, setPaintCoats] = useState('2');
  const [includeCeiling, setIncludeCeiling] = useState(true);
  const [flooringType, setFlooringType] = useState('ceramic');
  const [result, setResult] = useState<PaintFlooringResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      const res = calculatePaintFlooring({
        length, width, height, doors, windows,
        paintCoats: Number(paintCoats),
        includeCeiling,
        flooringType: flooringType as any,
      });
      setResult(res);
      setLoading(false);
      setTimeout(() => document.getElementById('pf-results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }, 500);
  };

  return (
    <SimpleToolShell
      title="حاسبة الدهانات والأرضيات"
      subtitle="احسب الكميات المطلوبة لتشطيب غرفتك"
      icon="🎨"
      gradientFrom="#6B21A8"
      gradientTo="#A855F7"
      onBack={onBack}
    >
      {/* Room Dimensions */}
      <InputCard title="📐 أبعاد الغرفة">
        <SliderInput label="الطول" value={length} onChange={setLength} min={2} max={15} step={0.5} suffix="م" />
        <SliderInput label="العرض" value={width} onChange={setWidth} min={2} max={15} step={0.5} suffix="م" />
        <SliderInput label="الارتفاع" value={height} onChange={setHeight} min={2.4} max={5} step={0.1} suffix="م" />

        {/* Room Preview */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mt-3 border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-cairo">مساحة الأرضية</div>
              <div className="text-lg font-bold text-purple-700 font-cairo">{(length * width).toFixed(1)} م²</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-cairo">مساحة الجدران</div>
              <div className="text-lg font-bold text-purple-700 font-cairo">{(2 * (length + width) * height).toFixed(1)} م²</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-500 font-cairo">المحيط</div>
              <div className="text-lg font-bold text-purple-700 font-cairo">{(2 * (length + width)).toFixed(1)} م</div>
            </div>
          </div>
        </div>
      </InputCard>

      {/* Openings */}
      <InputCard title="🚪 الفتحات (أبواب ونوافذ)">
        <CounterInput label="عدد الأبواب" value={doors} onChange={setDoors} min={0} max={6} />
        <CounterInput label="عدد النوافذ" value={windows} onChange={setWindows} min={0} max={8} />
        <p className="text-[10px] text-gray-400 font-cairo mt-1">
          * يتم خصم مساحة الأبواب والنوافذ من حساب الدهان تلقائياً
        </p>
      </InputCard>

      {/* Paint Options */}
      <InputCard title="🖌️ إعدادات الدهان">
        <OptionSelector
          label="عدد أوجه الدهان"
          options={[
            { id: '2', label: 'وجهين', icon: '🖌️', desc: 'قياسي' },
            { id: '3', label: '3 أوجه', icon: '🎨', desc: 'عالي الجودة' },
          ]}
          value={paintCoats}
          onChange={setPaintCoats}
        />

        <button
          onClick={() => setIncludeCeiling(!includeCeiling)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
            includeCeiling ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'
          }`}
        >
          <span className="font-cairo font-bold text-sm text-gray-700">تشمل دهان السقف؟</span>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${includeCeiling ? 'bg-purple-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${includeCeiling ? 'right-0.5' : 'left-0.5'}`} />
          </div>
        </button>
      </InputCard>

      {/* Flooring Type */}
      <InputCard title="🪵 نوع الأرضية">
        <OptionSelector
          label="اختر نوع البلاط/الأرضية"
          options={[
            { id: 'ceramic', label: 'سيراميك', icon: '🔲', desc: '45 د.إ/م²' },
            { id: 'porcelain', label: 'بورسلين', icon: '✨', desc: '75 د.إ/م²' },
            { id: 'marble', label: 'رخام', icon: '💎', desc: '180 د.إ/م²' },
            { id: 'parquet', label: 'باركيه', icon: '🪵', desc: '120 د.إ/م²' },
            { id: 'vinyl', label: 'فينيل', icon: '📋', desc: '55 د.إ/م²' },
          ]}
          value={flooringType}
          onChange={setFlooringType}
        />
      </InputCard>

      {/* Calculate Button */}
      <div className="mb-4">
        <ActionButton onClick={handleCalculate} text="احسب الكميات" icon="⚡" loading={loading} />
      </div>

      {/* Results */}
      {result && (
        <motion.div
          id="pf-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Divider text="النتائج" />

          {/* Total Cost */}
          <div className="bg-gradient-to-l from-purple-700 to-purple-900 rounded-[24px] p-6 mb-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-10 -mt-10" />
            <div className="relative z-10">
              <div className="text-purple-300 text-xs font-cairo mb-1">التكلفة الإجمالية للتشطيب</div>
              <div className="text-3xl font-bold font-cairo text-white mb-3">
                {formatAED(result.costs.total)}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-purple-300">الدهان</div>
                  <div className="text-sm font-bold text-white">{formatAED(result.costs.paint)}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-purple-300">{getFlooringName(flooringType)}</div>
                  <div className="text-sm font-bold text-white">{formatAED(result.costs.flooring)}</div>
                </div>
                <div className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-[10px] text-purple-300">النعلات</div>
                  <div className="text-sm font-bold text-white">{formatAED(result.costs.skirting)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Paint Details */}
          <InputCard title="🖌️ تفاصيل الدهان">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600 font-cairo">مساحة الجدران الصافية</span>
                <span className="font-bold text-sm font-cairo">{result.netWallArea} م²</span>
              </div>
              {includeCeiling && (
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-600 font-cairo">مساحة السقف</span>
                  <span className="font-bold text-sm font-cairo">{result.ceilingArea} م²</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600 font-cairo">كمية الدهان المطلوبة</span>
                <span className="font-bold text-sm text-purple-600 font-cairo">{result.paintLiters} لتر</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-purple-50 rounded-xl px-3">
                <span className="text-sm text-gray-600 font-cairo">عدد الدلاء (18 لتر)</span>
                <span className="font-bold text-lg text-purple-700 font-cairo">{result.paintBuckets} دلو</span>
              </div>
            </div>
          </InputCard>

          {/* Flooring Details */}
          <InputCard title="🪵 تفاصيل الأرضيات">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600 font-cairo">مساحة الأرضية</span>
                <span className="font-bold text-sm font-cairo">{result.floorArea} م²</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600 font-cairo">الكمية المطلوبة (مع 10% هالك)</span>
                <span className="font-bold text-sm text-purple-600 font-cairo">{result.flooringM2} م²</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-purple-50 rounded-xl px-3">
                <span className="text-sm text-gray-600 font-cairo">النوع: {getFlooringName(flooringType)}</span>
                <span className="font-bold text-lg text-purple-700 font-cairo">{formatAED(result.costs.flooring)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600 font-cairo">أمتار النعلات (Skirting)</span>
                <span className="font-bold text-sm font-cairo">{result.skirtingMeters} م</span>
              </div>
            </div>
          </InputCard>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
            <p className="text-amber-800 text-xs font-cairo leading-relaxed">
              ⚠️ الأسعار تقديرية. يتم خصم مساحات الأبواب ({doors}) والنوافذ ({windows}) من حساب الدهان تلقائياً.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <ActionButton onClick={() => {
              const text = `حاسبة الدهانات والأرضيات - بيت الريف\nالغرفة: ${length}×${width}×${height} م\nالدهان: ${result.paintLiters} لتر (${result.paintBuckets} دلو)\nالأرضية: ${result.flooringM2} م² ${getFlooringName(flooringType)}\nالتكلفة: ${formatAED(result.costs.total)}`;
              navigator.clipboard?.writeText(text).then(() => alert('تم نسخ النتائج'));
            }} text="نسخ" icon="📋" variant="secondary" />
            <ActionButton onClick={() => {
              const text = `حاسبة الدهانات - بيت الريف\nالغرفة: ${length}×${width}م\nالدهان: ${result.paintBuckets} دلو\nالبلاط: ${result.flooringM2}م²\nالتكلفة: ${formatAED(result.costs.total)}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }} text="واتساب" icon="📤" variant="dark" />
          </div>

          <ActionButton onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} text="حساب جديد" icon="🔄" variant="secondary" />
        </motion.div>
      )}
    </SimpleToolShell>
  );
}
