
// --- Color Logic ---

export interface ColorPalette {
  base: string;
  main: string;
  accent: string;
  neutral: string;
  code: string[];
}

export const generateColorPalette = (baseColorHex: string, harmony: 'complementary' | 'analogous' | 'monochromatic'): ColorPalette => {
  // هذه دالة بسيطة لتحويل Hex إلى RGB للتلاعب بالألوان (محاكاة لمنطق الألوان)
  // في التطبيق الحقيقي نستخدم مكتبة مثل chroma.js أو tinycolor2
  
  // للمحاكاة، سنقوم بإرجاع لوحات ألوان ثابتة متناسقة بناءً على "نوع اللون" التقريبي
  // هذا مجرد نموذج، المنطق الحقيقي يحتاج معادلات HSL
  
  const palettes: Record<string, ColorPalette> = {
    // أزرق
    '#4A90E2': {
      base: '#4A90E2',
      main: '#2C3E50',
      accent: '#E67E22', // برتقالي (مكمل)
      neutral: '#ECF0F1',
      code: ['Blue Ocean', 'Midnight', 'Sunset', 'Cloud']
    },
    // بيج / كريمي
    '#F5F5DC': {
      base: '#F5F5DC',
      main: '#8D6E63', // بني
      accent: '#66BB6A', // أخضر نباتي
      neutral: '#FAFAFA',
      code: ['Cream', 'Earth', 'Nature', 'Pure White']
    },
    // رمادي
    '#808080': {
      base: '#808080',
      main: '#212121',
      accent: '#FFD700', // ذهبي/أصفر
      neutral: '#F5F5F5',
      code: ['Grey', 'Charcoal', 'Gold', 'Mist']
    }
  };

  // إرجاع قيمة افتراضية أو القيمة المحددة
  return palettes[baseColorHex] || {
    base: baseColorHex,
    main: '#333333',
    accent: '#D4AF37', // ذهبي افتراضي
    neutral: '#F9F9F9',
    code: ['Custom Base', 'Dark Contrast', 'Golden Accent', 'Light Neutral']
  };
};

// --- Furniture Planning Logic ---

export interface RoomDimensions {
  length: number;
  width: number;
  type: 'living' | 'bedroom' | 'dining';
}

export interface FurnitureSuggestion {
  item: string;
  count: number;
  maxDimensions: string;
  note: string;
}

export interface LayoutPlan {
  area: number;
  capacity: string;
  suggestions: FurnitureSuggestion[];
  circulationSpace: string; // مساحة الحركة
}

export const calculateFurnitureLayout = (dims: RoomDimensions): LayoutPlan => {
  const area = dims.length * dims.width;
  const suggestions: FurnitureSuggestion[] = [];
  
  // حساب مساحة الحركة (عادة 20-30% من الغرفة)
  const circulationRatio = 0.25;
  const usableArea = area * (1 - circulationRatio);

  if (dims.type === 'living') {
    // قاعدة تقريبية: الكنبة تحتاج 2-3 متر مربع، ��لكرسي 1 متر مربع
    if (area < 12) {
      suggestions.push({ item: 'Sofa (2-Seater)', count: 1, maxDimensions: '180x90cm', note: 'Small scale to fit layout' });
      suggestions.push({ item: 'Accent Chair', count: 1, maxDimensions: '80x80cm', note: 'Corner placement' });
      suggestions.push({ item: 'Coffee Table', count: 1, maxDimensions: 'Round 60cm', note: 'Round shape saves space' });
    } else if (area < 25) {
      suggestions.push({ item: 'Sofa (3-Seater)', count: 1, maxDimensions: '220x95cm', note: 'Main focal point' });
      suggestions.push({ item: 'Armchairs', count: 2, maxDimensions: '90x90cm', note: 'Facing sofa or angled' });
      suggestions.push({ item: 'Coffee Table', count: 1, maxDimensions: '120x60cm', note: 'Rectangular' });
      suggestions.push({ item: 'TV Unit', count: 1, maxDimensions: '180x40cm', note: 'Wall mounted preferred' });
    } else {
      suggestions.push({ item: 'L-Shape Sofa', count: 1, maxDimensions: '300x250cm', note: 'Define the zone' });
      suggestions.push({ item: 'Accent Chairs', count: 2, maxDimensions: '100x100cm', note: 'Statement pieces' });
      suggestions.push({ item: 'Coffee Table', count: 1, maxDimensions: 'Large Square 100cm', note: 'Central piece' });
      suggestions.push({ item: 'Side Tables', count: 2, maxDimensions: '45x45cm', note: 'For lamps/drinks' });
    }
  } else if (dims.type === 'bedroom') {
    // منطق غرف النوم
    const canFitKing = dims.width > 3.5 && dims.length > 3.5;
    suggestions.push({ 
      item: 'Bed', 
      count: 1, 
      maxDimensions: canFitKing ? 'King (180x200)' : 'Queen (160x200)', 
      note: canFitKing ? 'Centered on main wall' : 'Ensure 60cm clearance sides' 
    });
    
    if (area > 15) {
      suggestions.push({ item: 'Wardrobe', count: 1, maxDimensions: '200cm Width', note: 'Built-in or standalone' });
      suggestions.push({ item: 'Dressing Table', count: 1, maxDimensions: '120cm Width', note: 'Near natural light' });
    }
  }

  return {
    area: Number(area.toFixed(2)),
    capacity: area < 10 ? 'Small (Compact)' : area < 25 ? 'Medium (Standard)' : 'Large (Spacious)',
    suggestions,
    circulationSpace: `${Math.round(area * circulationRatio)} m²`
  };
};
