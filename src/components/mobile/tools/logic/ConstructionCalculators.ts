
// أنواع البيانات للمدخلات والمخرجات
export interface MaterialInput {
  area: number; // المساحة بالمتر المربع
  floors: number; // عدد الطوابق
  finishQuality: 'standard' | 'premium' | 'luxury'; // نوع التشطيب
}

export interface MaterialResult {
  steel: { amount: number; unit: string; label: string; estimatedCost: number };
  cement: { amount: number; unit: string; label: string; estimatedCost: number };
  sand: { amount: number; unit: string; label: string; estimatedCost: number };
  aggregate: { amount: number; unit: string; label: string; estimatedCost: number }; // الحصى/الزلط
  blocks: { amount: number; unit: string; label: string; estimatedCost: number }; // الطوب
  paint: { amount: number; unit: string; label: string; estimatedCost: number };
  totalEstimatedCost: number;
}

// ثوابت الأسعار التقديرية (يمكن تحديثها من API لاحقاً) - بالريال/الدرهم
const PRICES = {
  steel_ton: 2800,
  cement_bag: 18,
  sand_m3: 45,
  aggregate_m3: 60,
  block_unit: 2.5,
  paint_liter: 35,
};

/**
 * دالة حساب مواد البناء التقديرية (الهيكل الأسود + التشطيب)
 * تعتمد على معدلات هندس��ة تقريبية شائعة
 */
export const calculateConstructionMaterials = (input: MaterialInput): MaterialResult => {
  const { area, floors, finishQuality } = input;
  const totalArea = area * floors;

  // 1. الحديد (Steel)
  // المعدل التقريبي: 40-50 كجم لكل متر مربع من مساحة البناء
  const steelKgPerMeter = 45; 
  const totalSteelKg = totalArea * steelKgPerMeter;
  const totalSteelTon = totalSteelKg / 1000;

  // 2. الأسمنت (Cement)
  // المعدل التقريبي: 0.4 شكارة لكل متر مربع (للخرسانة والمباني واللياسة)
  const cementBagsPerMeter = 0.4 * 8; // معدل تقريبي يشمل الهيكل
  const totalCementBags = Math.ceil(totalArea * cementBagsPerMeter);

  // 3. الرمل (Sand)
  // المعدل: 0.18 متر مكعب لكل متر مربع
  const sandPerMeter = 0.18;
  const totalSand = Math.ceil(totalArea * sandPerMeter);

  // 4. الحصى (Aggregate)
  // المعدل: 0.25 متر مكعب لكل متر مربع
  const aggPerMeter = 0.25;
  const totalAgg = Math.ceil(totalArea * aggPerMeter);

  // 5. الطوب/البلوك (Blocks)
  // المعدل: 12-13 طوبة للمتر المربع من المباني (تقدير مساحة الجدران كنسبة من المسطح)
  // نفترض مساحة الجدران تقريباً 1.5 ضعف مساحة الأرضية
  const blocksPerMeter = 12 * 1.5; 
  const totalBlocks = Math.ceil(totalArea * blocksPerMeter);

  // 6. الدهانات (Paint)
  // يعتمد على جودة التشطيب
  let paintFactor = 0.3; // لتر لكل متر مربع (وجهين)
  if (finishQuality === 'premium') paintFactor = 0.4;
  if (finishQuality === 'luxury') paintFactor = 0.5;
  const totalPaint = Math.ceil(totalArea * 3.5 * paintFactor); // 3.5 نسبة الحوائط والأسقف للمسطح

  // حساب التكاليف
  const steelCost = totalSteelTon * PRICES.steel_ton;
  const cementCost = totalCementBags * PRICES.cement_bag;
  const sandCost = totalSand * PRICES.sand_m3;
  const aggCost = totalAgg * PRICES.aggregate_m3;
  const blocksCost = totalBlocks * PRICES.block_unit;
  const paintCost = totalPaint * PRICES.paint_liter;

  // تكلفة العمالة والمصنعية (نسبة تقريبية تضاف للإجمالي)
  const laborFactor = finishQuality === 'luxury' ? 0.45 : finishQuality === 'premium' ? 0.35 : 0.30;
  const materialTotal = steelCost + cementCost + sandCost + aggCost + blocksCost + paintCost;
  const laborCost = materialTotal * laborFactor;

  return {
    steel: { amount: Number(totalSteelTon.toFixed(2)), unit: 'Ton', label: 'items.steel', estimatedCost: steelCost },
    cement: { amount: totalCementBags, unit: 'Bags', label: 'items.cement', estimatedCost: cementCost },
    sand: { amount: totalSand, unit: 'm³', label: 'items.sand', estimatedCost: sandCost },
    aggregate: { amount: totalAgg, unit: 'm³', label: 'items.aggregate', estimatedCost: aggCost },
    blocks: { amount: totalBlocks, unit: 'Blocks', label: 'items.blocks', estimatedCost: blocksCost },
    paint: { amount: totalPaint, unit: 'Liters', label: 'items.paint', estimatedCost: paintCost },
    totalEstimatedCost: Math.round(materialTotal + laborCost)
  };
};
