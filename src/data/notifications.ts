// ====================================
// 🔔 Notifications System Data Model
// بيت الريف - نظام التنبيهات
// ====================================

export type NotificationType = 
  | 'booking'    // حجز
  | 'offer'      // عرض
  | 'system'     // نظام
  | 'review'     // تقييم
  | 'chat';      // رسالة

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  actionLabel?: string;
  actionTarget?: { 
    screen: 'projects' | 'maps' | 'shop' | 'profile' | 'services'; 
    id?: string 
  };
}

// ====================================
// 📊 Mock Data - بيانات تجريبية
// ====================================

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-001',
    type: 'booking',
    title: 'طلب خدمة جديد',
    message: 'تم استلام طلبك لخدمة السباكة. سيتم التواصل معك خلال 24 ساعة',
    createdAt: '2024-01-18T09:30:00Z',
    isRead: false,
    actionLabel: 'عرض الطلب',
    actionTarget: { screen: 'projects', id: 'PROJ-001' }
  },
  {
    id: 'NOTIF-002',
    type: 'offer',
    title: '🔥 عرض خاص - خصم 30%',
    message: 'عرض حصري على جميع مواد البناء! خصم يصل إلى 30% لفترة محدودة',
    createdAt: '2024-01-18T08:15:00Z',
    isRead: false,
    actionLabel: 'تسوق الآن',
    actionTarget: { screen: 'shop' }
  },
  {
    id: 'NOTIF-003',
    type: 'review',
    title: 'تقييم جديد',
    message: 'تلقيت تقييم 5 نجوم من العميل أحمد محمد',
    createdAt: '2024-01-17T16:45:00Z',
    isRead: false,
    actionLabel: 'عرض التقييم',
    actionTarget: { screen: 'profile' }
  },
  {
    id: 'NOTIF-004',
    type: 'system',
    title: 'تحديث النظام',
    message: 'تم تحديث التطبيق إلى الإصدار 2.0 مع ميزات جديدة',
    createdAt: '2024-01-17T14:00:00Z',
    isRead: true,
    actionLabel: 'اكتشف الجديد'
  },
  {
    id: 'NOTIF-005',
    type: 'chat',
    title: 'رسالة جديدة',
    message: 'لديك رسالة جديدة من مزود الخدمة',
    createdAt: '2024-01-17T11:30:00Z',
    isRead: true,
    actionLabel: 'فتح الرسالة'
  },
  {
    id: 'NOTIF-006',
    type: 'booking',
    title: 'تأكيد الحجز',
    message: 'تم تأكيد حجزك لخدمة التكييف يوم الأحد 10 صباحاً',
    createdAt: '2024-01-16T15:20:00Z',
    isRead: true,
    actionLabel: 'عرض التفاصيل',
    actionTarget: { screen: 'projects' }
  },
  {
    id: 'NOTIF-007',
    type: 'offer',
    title: '⚡ عرض سريع',
    message: 'باقة الصيانة الشاملة بسعر خاص لمدة 48 ساعة فقط',
    createdAt: '2024-01-16T10:00:00Z',
    isRead: true,
    actionLabel: 'احجز الآن',
    actionTarget: { screen: 'services' }
  },
  {
    id: 'NOTIF-008',
    type: 'system',
    title: 'نصيحة اليوم',
    message: 'استخدم فلاتر البحث المتقدمة للعثور على أفضل المزودين بالقرب منك',
    createdAt: '2024-01-15T09:00:00Z',
    isRead: true
  },
  {
    id: 'NOTIF-009',
    type: 'review',
    title: 'طلب تقييم',
    message: 'يرجى تقييم خدمة الكهرباء التي حصلت عليها',
    createdAt: '2024-01-14T13:45:00Z',
    isRead: true,
    actionLabel: 'تقييم الآن',
    actionTarget: { screen: 'services', id: 'electricity' }
  },
  {
    id: 'NOTIF-010',
    type: 'booking',
    title: 'اكتمال الخدمة',
    message: 'تم إنجاز خدمة الدهانات بنجاح. نتمنى أن تكون راضياً عن الخدمة',
    createdAt: '2024-01-13T17:00:00Z',
    isRead: true,
    actionLabel: 'تقييم الخدمة',
    actionTarget: { screen: 'services' }
  }
];

// ====================================
// 🎨 Helper Functions
// ====================================

export function getUnreadCount(): number {
  return MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
}

export function getNotificationsByType(type?: NotificationType): NotificationItem[] {
  if (!type) return MOCK_NOTIFICATIONS;
  return MOCK_NOTIFICATIONS.filter(n => n.type === type);
}

export function getUnreadNotifications(): NotificationItem[] {
  return MOCK_NOTIFICATIONS.filter(n => !n.isRead);
}

export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'الآن';
  } else if (diffMins < 60) {
    return `قبل ${diffMins} دقيقة`;
  } else if (diffHours < 24) {
    return `قبل ${diffHours} ساعة`;
  } else if (diffDays < 7) {
    return `قبل ${diffDays} يوم`;
  } else {
    return date.toLocaleDateString('ar-AE');
  }
}

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  booking: '📋',
  offer: '🎁',
  system: '⚙️',
  review: '⭐',
  chat: '💬'
};

export const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  booking: '#4A90E2',
  offer: '#F2994A',
  system: '#1F3D2B',
  review: '#F2C94C',
  chat: '#56CCF2'
};
