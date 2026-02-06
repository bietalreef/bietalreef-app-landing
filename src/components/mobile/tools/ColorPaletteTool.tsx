import { useState } from 'react';
import { SimpleToolShell } from './SimpleToolShell';
import { useLanguage } from '../../../contexts/LanguageContext';

const fontCairo = 'Cairo, sans-serif';

interface ColorScheme {
  name: string;
  nameEn: string;
  colors: string[];
  description: string;
  descriptionEn: string;
}

const ROOM_TYPES = [
  { id: 'living', ar: 'غرفة المعيشة', en: 'Living Room' },
  { id: 'bedroom', ar: 'غرفة النوم', en: 'Bedroom' },
  { id: 'kitchen', ar: 'المطبخ', en: 'Kitchen' },
  { id: 'bathroom', ar: 'الحمام', en: 'Bathroom' },
  { id: 'office', ar: 'المكتب', en: 'Office' },
  { id: 'kids', ar: 'غرفة الأطفال', en: 'Kids Room' },
  { id: 'majlis', ar: 'المجلس', en: 'Majlis' },
  { id: 'exterior', ar: 'الواجهة الخارجية', en: 'Exterior' },
];

const STYLES = [
  { id: 'modern', ar: 'مودرن', en: 'Modern' },
  { id: 'arabic', ar: 'عربي تقليدي', en: 'Traditional Arabic' },
  { id: 'minimal', ar: 'مينيمال', en: 'Minimalist' },
  { id: 'luxury', ar: 'فاخر', en: 'Luxury' },
  { id: 'coastal', ar: 'ساحلي', en: 'Coastal' },
  { id: 'desert', ar: 'صحراوي', en: 'Desert' },
];

const COLOR_PALETTES: Record<string, Record<string, ColorScheme[]>> = {
  living: {
    modern: [
      { name: 'أبيض وزيتي', nameEn: 'White & Olive', colors: ['#FFFFFF', '#E8E4D9', '#8B9A6F', '#4A5A3C', '#2C3424'], description: 'ألوان هادئة تعكس الطبيعة', descriptionEn: 'Calm nature-inspired colors' },
      { name: 'رمادي دافئ', nameEn: 'Warm Gray', colors: ['#F5F5F3', '#D4CFC4', '#A69B8D', '#7A6E62', '#4B4239'], description: 'تناسق دافئ وعصري', descriptionEn: 'Warm modern harmony' },
    ],
    arabic: [
      { name: 'ذهبي ملكي', nameEn: 'Royal Gold', colors: ['#FFF8E7', '#E8D5A3', '#C8A86A', '#8B6914', '#3D2E07'], description: 'فخامة عربية أصيلة', descriptionEn: 'Authentic Arabic luxury' },
      { name: 'أحمر بخاري', nameEn: 'Bukhara Red', colors: ['#FFF5F0', '#E8C4B8', '#B24D3D', '#7A2D21', '#3D1610'], description: 'دفء تقليدي مميز', descriptionEn: 'Distinctive traditional warmth' },
    ],
    minimal: [
      { name: 'أبيض نقي', nameEn: 'Pure White', colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#424242'], description: 'بساطة أنيقة', descriptionEn: 'Elegant simplicity' },
    ],
    luxury: [
      { name: 'كحلي وذهبي', nameEn: 'Navy & Gold', colors: ['#F8F6F0', '#E8D5A3', '#1B3A5C', '#0D1F30', '#C8A86A'], description: 'فخامة بلمسة ملكية', descriptionEn: 'Luxury with a royal touch' },
    ],
    coastal: [
      { name: 'أزرق بحري', nameEn: 'Ocean Blue', colors: ['#F0F8FF', '#B8D8E8', '#5B9BD5', '#2E5E8E', '#1B3650'], description: 'نسمات البحر', descriptionEn: 'Ocean breeze' },
    ],
    desert: [
      { name: 'رملي دافئ', nameEn: 'Warm Sand', colors: ['#FFF8E7', '#E8D8B8', '#C4A87A', '#8B7348', '#4A3D26'], description: 'دفء الصحراء', descriptionEn: 'Desert warmth' },
    ],
  },
};

// Fallback palettes for any room+style combo
const FALLBACK_PALETTES: ColorScheme[] = [
  { name: 'طبيعي متناغم', nameEn: 'Natural Harmony', colors: ['#F5EEE1', '#D4CFC4', '#8B9A6F', '#5C6B4A', '#2C3424'], description: 'ألوان أرضية طبيعية', descriptionEn: 'Natural earth tones' },
  { name: 'أنيق محايد', nameEn: 'Elegant Neutral', colors: ['#FAFAF8', '#E8E4D9', '#B8B0A2', '#7A7066', '#3D3833'], description: 'أناقة بلا تعقيد', descriptionEn: 'Effortless elegance' },
  { name: 'تباين حديث', nameEn: 'Modern Contrast', colors: ['#FFFFFF', '#F0F0F0', '#2AA676', '#1F3D2B', '#111111'], description: 'جرأة عصرية', descriptionEn: 'Bold modernity' },
];

export function ColorPaletteTool({ onBack }: { onBack: () => void }) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [roomType, setRoomType] = useState('');
  const [style, setStyle] = useState('');
  const [results, setResults] = useState<ColorScheme[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    const palettes = COLOR_PALETTES[roomType]?.[style] || FALLBACK_PALETTES;
    setResults(palettes);
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <SimpleToolShell
      title={isEn ? 'Color Palette Generator' : 'مولّد لوحات الألوان'}
      subtitle={isEn ? 'Design color schemes for your rooms' : 'صمّم تنسيقات ألوان لغرفك'}
      onBack={onBack}
      icon="🎨"
      gradientFrom="#EC4899"
      gradientTo="#E11D48"
      backLabel={isEn ? 'Back' : 'رجوع'}
    >
      <div className="space-y-5 p-4" dir="rtl">
        {/* Room Type */}
        <div>
          <label className="text-sm font-bold text-[#1F3D2B] mb-2 block" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Room Type' : 'نوع الغرفة'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ROOM_TYPES.map(room => (
              <button
                key={room.id}
                onClick={() => setRoomType(room.id)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  roomType === room.id
                    ? 'bg-[#2AA676] text-white shadow-md'
                    : 'bg-white text-[#1F3D2B] border border-gray-200'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? room.en : room.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="text-sm font-bold text-[#1F3D2B] mb-2 block" style={{ fontFamily: fontCairo }}>
            {isEn ? 'Design Style' : 'أسلوب التصميم'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  style === s.id
                    ? 'bg-[#C8A86A] text-white shadow-md'
                    : 'bg-white text-[#1F3D2B] border border-gray-200'
                }`}
                style={{ fontFamily: fontCairo }}
              >
                {isEn ? s.en : s.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button
          onClick={generate}
          disabled={!roomType || !style}
          className="w-full bg-gradient-to-l from-pink-500 to-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm disabled:opacity-40 shadow-lg"
          style={{ fontFamily: fontCairo }}
        >
          {isEn ? 'Generate Color Palettes' : 'توليد لوحات الألوان'}
        </button>

        {/* Results */}
        {results && (
          <div className="space-y-4 mt-4">
            <h3 className="text-base font-bold text-[#1F3D2B]" style={{ fontFamily: fontCairo }}>
              {isEn ? 'Suggested Palettes' : 'اللوحات المقترحة'}
            </h3>
            {results.map((palette, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h4 className="font-bold text-sm text-[#1F3D2B] mb-1" style={{ fontFamily: fontCairo }}>
                  {isEn ? palette.nameEn : palette.name}
                </h4>
                <p className="text-xs text-gray-400 mb-3" style={{ fontFamily: fontCairo }}>
                  {isEn ? palette.descriptionEn : palette.description}
                </p>
                <div className="flex gap-1.5 mb-2">
                  {palette.colors.map((color, ci) => (
                    <button
                      key={ci}
                      onClick={() => copyColor(color)}
                      className="flex-1 h-16 rounded-xl shadow-inner relative group transition-transform hover:scale-105"
                      style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #e0e0e0' : 'none' }}
                    >
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1 rounded ${
                        ci < 2 ? 'text-gray-600 bg-white/80' : 'text-white bg-black/30'
                      } ${copied === color ? 'bg-green-500 text-white' : ''}`}>
                        {copied === color ? '✓' : color}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-300 text-center" style={{ fontFamily: fontCairo }}>
                  {isEn ? 'Click a color to copy its code' : 'اضغط على اللون لنسخ الكود'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SimpleToolShell>
  );
}