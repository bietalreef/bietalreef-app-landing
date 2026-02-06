// شجرة الأقسام الكاملة - بيت الريف (محدثة)
// 10 أقسام رئيسية فقط

export interface SubSection {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  route: string;
}

export interface MainSection {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  route: string;
  subSections?: SubSection[];
  expandable?: boolean;
}

export const sectionsTree: MainSection[] = [
  {
    id: 'home',
    nameAr: 'الرئيسية',
    nameEn: 'Home',
    icon: '🏠',
    route: '/home',
  },
  {
    id: 'services',
    nameAr: 'الخدمات',
    nameEn: 'Services',
    icon: '🔧',
    route: '/services',
    expandable: true,
    subSections: [
      { id: 'construction-contracting', nameAr: 'مقاولات البناء', nameEn: 'Construction Contracting', icon: '🏗️', route: '/services/construction-contracting' },
      { id: 'engineering-consultation', nameAr: 'الاستشارات الهندسية', nameEn: 'Engineering Consultation', icon: '📐', route: '/services/engineering-consultation' },
      { id: 'maintenance-companies', nameAr: 'شركات الصيانة', nameEn: 'Maintenance Companies', icon: '🔧', route: '/services/maintenance-companies' },
      { id: 'craftsmen', nameAr: 'العمالة الحرفية', nameEn: 'Craftsmen', icon: '👷', route: '/services/craftsmen' },
      { id: 'workshops', nameAr: 'الورش', nameEn: 'Workshops', icon: '🔨', route: '/services/workshops' },
      { id: 'equipment-rental', nameAr: 'تأجير المعدات', nameEn: 'Equipment Rental', icon: '🚜', route: '/services/equipment-rental' },
      { id: 'building-materials', nameAr: 'محلات مواد البناء', nameEn: 'Building Materials Stores', icon: '🧱', route: '/services/building-materials' },
      { id: 'furniture-stores', nameAr: 'محلات الأثاث', nameEn: 'Furniture Stores', icon: '🪑', route: '/services/furniture-stores' },
      { id: 'cleaning-services', nameAr: 'خدمات النظافة', nameEn: 'Cleaning Services', icon: '🧹', route: '/services/cleaning-services' },
    ],
  },
  {
    id: 'shop',
    nameAr: 'المتجر',
    nameEn: 'Shop',
    icon: '🛒',
    route: '/shop',
  },
  {
    id: 'wallet',
    nameAr: 'محفظة ريف',
    nameEn: 'Reef Wallet',
    icon: '🪙',
    route: '/wallet',
  },
  {
    id: 'maps',
    nameAr: 'الخرائط',
    nameEn: 'Maps',
    icon: '🗺️',
    route: '/maps',
  },
  {
    id: 'tools',
    nameAr: 'الأدوات',
    nameEn: 'Tools',
    icon: '🛠️',
    route: '/tools',
  },
  {
    id: 'yak',
    nameAr: 'وياك AI',
    nameEn: 'Weyaak AI',
    icon: '🤖',
    route: '/yak',
  },
  {
    id: 'profile',
    nameAr: 'الملف الشخصي',
    nameEn: 'Profile',
    icon: '👤',
    route: '/profile',
  },
];