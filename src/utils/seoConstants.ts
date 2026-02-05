export const EMIRATES_AND_CITIES = [
  { slug: 'al-ain', nameAr: 'العين', nameEn: 'Al Ain', region: 'Abu Dhabi' },
  { slug: 'abu-dhabi', nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', region: 'Abu Dhabi' },
  { slug: 'dubai', nameAr: 'دبي', nameEn: 'Dubai', region: 'Dubai' },
  { slug: 'sharjah', nameAr: 'الشارقة', nameEn: 'Sharjah', region: 'Sharjah' },
  { slug: 'ajman', nameAr: 'عجمان', nameEn: 'Ajman', region: 'Ajman' },
  { slug: 'umm-al-quwain', nameAr: 'أم القيوين', nameEn: 'Umm Al Quwain', region: 'Umm Al Quwain' },
  { slug: 'ras-al-khaimah', nameAr: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', region: 'Ras Al Khaimah' },
  { slug: 'fujairah', nameAr: 'الفجيرة', nameEn: 'Fujairah', region: 'Fujairah' },
];

export const AI_TOOLS_LINKS = [
  { 
    slug: 'wayak-ai-assistant', 
    nameAr: 'وياك - المساعد الذكي', 
    description: 'مساعد شخصي لإدارة مشاريع البناء والصيانة'
  },
  { 
    slug: 'building-cost-calculator', 
    nameAr: 'حاسبة تكاليف البناء', 
    description: 'حساب كميات الطابوق والأسمنت والحديد' 
  },
  { 
    slug: 'ai-interior-designer', 
    nameAr: 'مصمم الديكور الذكي', 
    description: 'تخيل مساحتك وتصميمك الداخلي بالذكاء الاصطناعي' 
  },
  { 
    slug: 'quote-analyzer', 
    nameAr: 'محلل عروض الأسعار', 
    description: 'مقارنة وتحليل فواتير المقاولين' 
  },
];

export const PRIORITY_SERVICES = [
  { slug: 'general-contracting', nameAr: 'مقاولات عامة' },
  { slug: 'building-materials', nameAr: 'مواد بناء' },
  { slug: 'interior-design', nameAr: 'تتصميم داخلي' },
  { slug: 'landscaping', nameAr: 'تنسيق حدائق' },
  { slug: 'plumbing', nameAr: 'سباكة وصحي' },
  { slug: 'electrical', nameAr: 'كهرباء' },
  { slug: 'hvac', nameAr: 'تكييف وتبريد' },
];

// Helper to generate SEO URL
export const generateServiceUrl = (serviceSlug: string, citySlug: string) => {
  return `/ae/${citySlug}/${serviceSlug}`;
};

export const generateToolUrl = (toolSlug: string) => {
  return `/tools/${toolSlug}`;
};
