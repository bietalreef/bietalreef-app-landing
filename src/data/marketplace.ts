// ====================================
// 🛒 Marketplace Data Model
// بيت الريف - نظام المتجر
// ====================================

export type MarketplaceCategory = 
  | 'materials'    // مواد بناء
  | 'tools'        // أدوات
  | 'furniture'    // أثاث
  | 'decor'        // ديكور
  | 'services'     // باقات خدمة
  | 'equipment';   // تأجير معدات

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  oldPrice?: number;
  unit: string; // متر مربع، كرتون، خدمة، إلخ
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  hasOffer?: boolean;
  providerId: string;
  providerName: string;
  images: string[];
  location?: { lat: number; lng: number; city: string };
}

export interface MarketplaceFilterState {
  category: MarketplaceCategory | 'all';
  sortBy: 'popular' | 'price_low' | 'price_high' | 'rating' | 'near_me';
  minPrice?: number;
  maxPrice?: number;
  hasOffer?: boolean;
  inStockOnly?: boolean;
}

// ====================================
// 📊 Mock Data - بيانات تجريبية
// ====================================

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  // مواد بناء
  {
    id: 'MAT-001',
    title: 'أسمنت بورتلاند',
    description: 'أسمنت عالي الجودة من الإمارات، مقاوم للرطوبة والحرارة، مناسب لجميع أنواع البناء',
    category: 'materials',
    price: 25,
    oldPrice: 30,
    unit: 'كيس 50 كجم',
    rating: 4.8,
    reviewsCount: 156,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-001',
    providerName: 'مواد البناء الإماراتية',
    images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },
  {
    id: 'MAT-002',
    title: 'طوب أحمر',
    description: 'طوب أحمر حراري عالي الجودة، مقاوم للعوامل الجوية',
    category: 'materials',
    price: 1.5,
    unit: 'طوبة',
    rating: 4.6,
    reviewsCount: 89,
    isAvailable: true,
    providerId: 'PROV-001',
    providerName: 'مواد البناء الإماراتية',
    images: ['https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },
  {
    id: 'MAT-003',
    title: 'رمل بناء ناعم',
    description: 'رمل بناء ناعم منخول، خالٍ من الشوائب',
    category: 'materials',
    price: 80,
    unit: 'طن',
    rating: 4.7,
    reviewsCount: 45,
    isAvailable: true,
    providerId: 'PROV-002',
    providerName: 'محجر الإمارات',
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800'],
    location: { lat: 24.4539, lng: 54.3773, city: 'أبوظبي' }
  },

  // أدوات
  {
    id: 'TOOL-001',
    title: 'دريل كهربائي احترافي',
    description: 'دريل كهربائي 750 واط مع ملحقات كاملة، ضمان سنتين',
    category: 'tools',
    price: 450,
    oldPrice: 550,
    unit: 'قطعة',
    rating: 4.9,
    reviewsCount: 234,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-003',
    providerName: 'أدوات الخليج',
    images: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },
  {
    id: 'TOOL-002',
    title: 'منشار كهربائي',
    description: 'منشار كهربائي عالي الأداء، مثالي للخشب والبلاستيك',
    category: 'tools',
    price: 320,
    unit: 'قطعة',
    rating: 4.7,
    reviewsCount: 112,
    isAvailable: true,
    providerId: 'PROV-003',
    providerName: 'أدوات الخليج',
    images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },

  // أثاث
  {
    id: 'FURN-001',
    title: 'طقم أريكة فاخر',
    description: 'طقم أريكة 7 مقاعد، قماش مخمل فاخر، ألوان متعددة',
    category: 'furniture',
    price: 8500,
    oldPrice: 10000,
    unit: 'طقم',
    rating: 4.8,
    reviewsCount: 67,
    isAvailable: true,
    hasOffer: true,
    providerId: 'PROV-004',
    providerName: 'أثاث الفخامة',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },
  {
    id: 'FURN-002',
    title: 'طاولة طعام خشبية',
    description: 'طاولة طعام خشب طبيعي، تتسع لـ 8 أشخاص',
    category: 'furniture',
    price: 2800,
    unit: 'قطعة',
    rating: 4.6,
    reviewsCount: 43,
    isAvailable: true,
    providerId: 'PROV-004',
    providerName: 'أثاث الفخامة',
    images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },

  // ديكور
  {
    id: 'DECOR-001',
    title: 'لوحة جدارية عصرية',
    description: 'لوحة جدارية حديثة، طباعة عالية الجودة، إطار خشبي',
    category: 'decor',
    price: 450,
    unit: 'قطعة',
    rating: 4.5,
    reviewsCount: 78,
    isAvailable: true,
    providerId: 'PROV-005',
    providerName: 'ديكور الإمارات',
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },
  {
    id: 'DECOR-002',
    title: 'إضاءة LED معلقة',
    description: 'ثريا LED حديثة، قابلة للتحكم بالريموت',
    category: 'decor',
    price: 890,
    oldPrice: 1100,
    unit: 'قطعة',
    rating: 4.7,
    reviewsCount: 92,
    isAvailable: true,
    hasOffer: true,
    isFeatured: true,
    providerId: 'PROV-005',
    providerName: 'ديكور الإمارات',
    images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },

  // خدمات
  {
    id: 'SRV-001',
    title: 'باقة صيانة شاملة',
    description: 'باقة صيانة سنوية شاملة: كهرباء، سباكة، تكييف',
    category: 'services',
    price: 1200,
    oldPrice: 1500,
    unit: 'باقة سنوية',
    rating: 4.9,
    reviewsCount: 145,
    isAvailable: true,
    isFeatured: true,
    hasOffer: true,
    providerId: 'PROV-006',
    providerName: 'خدمات الصيانة المتكاملة',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },
  {
    id: 'SRV-002',
    title: 'خدمة تنظيف عميق',
    description: 'خدمة تنظيف عميق للمنازل والفلل، فريق محترف',
    category: 'services',
    price: 350,
    unit: 'جلسة',
    rating: 4.8,
    reviewsCount: 267,
    isAvailable: true,
    providerId: 'PROV-007',
    providerName: 'التنظيف المثالي',
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800'],
    location: { lat: 25.2048, lng: 55.2708, city: 'دبي' }
  },

  // تأجير معدات
  {
    id: 'EQ-001',
    title: 'رافعة شوكية',
    description: 'رافعة شوكية حمولة 3 طن، سائق متوفر',
    category: 'equipment',
    price: 500,
    unit: 'يوم',
    rating: 4.7,
    reviewsCount: 56,
    isAvailable: true,
    providerId: 'PROV-008',
    providerName: 'تأجير المعدات الثقيلة',
    images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'],
    location: { lat: 24.4539, lng: 54.3773, city: 'أبوظبي' }
  },
  {
    id: 'EQ-002',
    title: 'خلاطة إسمنت',
    description: 'خلاطة إسمنت احترافية، سعة 350 لتر',
    category: 'equipment',
    price: 180,
    unit: 'يوم',
    rating: 4.6,
    reviewsCount: 34,
    isAvailable: true,
    providerId: 'PROV-008',
    providerName: 'تأجير المعدات الثقيلة',
    images: ['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800'],
    location: { lat: 24.4539, lng: 54.3773, city: 'أبوظبي' }
  }
];

// ====================================
// 🏷️ Category Labels
// ====================================

export const CATEGORY_LABELS: Record<MarketplaceCategory | 'all', string> = {
  all: 'الكل',
  materials: 'مواد بناء',
  tools: 'أدوات',
  furniture: 'أثاث',
  decor: 'ديكور',
  services: 'باقات خدمة',
  equipment: 'تأجير معدات'
};

export const CATEGORY_ICONS: Record<MarketplaceCategory, string> = {
  materials: '🧱',
  tools: '🔧',
  furniture: '🪑',
  decor: '🎨',
  services: '⚙️',
  equipment: '🚜'
};
