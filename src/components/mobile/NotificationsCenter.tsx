import { useState, useCallback } from 'react';
import { ArrowRight, Bell, Trash2, Check, CheckCheck, Clock, X } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner@2.0.3';

const fontCairo = 'Cairo, sans-serif';

interface NotificationsCenterProps {
  onBack: () => void;
  initialCategory?: 'platform' | 'weyaak' | 'other' | 'all';
}

interface Notification {
  id: string;
  category: 'platform' | 'weyaak' | 'other';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  time: string;
  timeEn: string;
  read: boolean;
  icon: string;
}

// ─── 3 Categories Only ───
const CATEGORY_META: Record<string, { icon: string; labelAr: string; labelEn: string; color: string; bg: string }> = {
  all:       { icon: '📬', labelAr: 'الكل',     labelEn: 'All',      color: 'from-[#2AA676] to-[#1F3D2B]', bg: 'bg-[#2AA676]/10' },
  platform:  { icon: '📨', labelAr: 'المنصة',   labelEn: 'Platform', color: 'from-blue-500 to-blue-600',    bg: 'bg-blue-50' },
  weyaak:    { icon: '🤖', labelAr: 'وياك',     labelEn: 'Weyaak',   color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  other:     { icon: '🔔', labelAr: 'أخرى',     labelEn: 'Other',    color: 'from-amber-500 to-amber-600',  bg: 'bg-amber-50' },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', category: 'platform',
    titleAr: 'مرحباً بك في بيت الريف', titleEn: 'Welcome to Beit Al Reef',
    messageAr: 'ابدأ باستكشاف الخدمات والأدوات الذكية المتاحة لك', messageEn: 'Start exploring services and smart tools available to you',
    time: 'منذ 5 دقائق', timeEn: '5 min ago', read: false, icon: '🏠',
  },
  {
    id: 'n2', category: 'platform',
    titleAr: 'تحديث التطبيق v2.0', titleEn: 'App Update v2.0',
    messageAr: 'ميزات جديدة: الأدوات الذكية، مدير السوشيال ميديا، وتحسينات الأداء', messageEn: 'New features: Smart tools, Social media manager, and performance improvements',
    time: 'منذ ساعة', timeEn: '1 hour ago', read: false, icon: '🚀',
  },
  {
    id: 'n3', category: 'weyaak',
    titleAr: 'وياك جاهز لمساعدتك', titleEn: 'Weyaak is ready to help',
    messageAr: 'جرّب السؤال عن تكلفة تجديد منزلك أو تصميم الديكور الداخلي', messageEn: 'Try asking about your home renovation cost or interior design',
    time: 'منذ ساعتين', timeEn: '2 hours ago', read: false, icon: '🤖',
  },
  {
    id: 'n4', category: 'weyaak',
    titleAr: 'رد جديد من وياك', titleEn: 'New reply from Weyaak',
    messageAr: 'تم الرد على استفسارك حول أسعار مواد البناء في دبي', messageEn: 'Your query about construction material prices in Dubai has been answered',
    time: 'منذ 3 ساعات', timeEn: '3 hours ago', read: true, icon: '💬',
  },
  {
    id: 'n5', category: 'other',
    titleAr: 'تذكير: موعد الصيانة غداً', titleEn: 'Reminder: Maintenance tomorrow',
    messageAr: 'لديك موعد صيانة تكييف الساعة 10 صباحاً', messageEn: 'AC maintenance appointment at 10 AM',
    time: 'منذ 5 ساعات', timeEn: '5 hours ago', read: true, icon: '🔔',
  },
  {
    id: 'n6', category: 'other',
    titleAr: 'عرض حصري: خصم 30%', titleEn: 'Exclusive: 30% Off',
    messageAr: 'خصم على جميع خدمات المقاولات هذا الأسبوع', messageEn: 'Discount on all contracting services this week',
    time: 'أمس', timeEn: 'Yesterday', read: true, icon: '🔥',
  },
  {
    id: 'n7', category: 'platform',
    titleAr: 'رسالة من مقاول', titleEn: 'Message from contractor',
    messageAr: 'أحمد المهندس أرسل لك عرض سعر جديد لمشروع تجديد الفيلا', messageEn: 'Ahmed Engineer sent you a new quote for the villa renovation project',
    time: 'أمس', timeEn: 'Yesterday', read: true, icon: '👤',
  },
];

export function NotificationsCenter({ onBack, initialCategory = 'all' }: NotificationsCenterProps) {
  const { language } = useTranslation('notifications');
  const isEn = language === 'en';
  const fontFamily = isEn ? 'Inter, Segoe UI, sans-serif' : fontCairo;

  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = (() => {
    let result = notifications;
    if (activeCategory !== 'all') result = result.filter(n => n.category === activeCategory);
    if (filter === 'unread') result = result.filter(n => !n.read);
    if (filter === 'read') result = result.filter(n => n.read);
    return result;
  })();

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.category === catId && !n.read).length;
  };

  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); toast.success(isEn ? 'All marked as read' : 'تم تحديد الكل كمقروء'); };
  const removeNotification = (id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)); toast.info(isEn ? 'Notification removed' : 'تم حذف الإشعار'); };
  const clearAll = () => { setNotifications([]); toast.info(isEn ? 'All cleared' : 'تم حذف الكل'); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-20" dir="rtl">

      {/* ═══ HEADER ═══ */}
      <div className="sticky top-0 z-10 bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white shadow-lg">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6" />
                <h1 className="text-xl font-bold" style={{ fontFamily }}>{isEn ? 'Notifications' : 'الإشعارات'}</h1>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ fontFamily }}>
                {unreadCount} {isEn ? 'new' : 'جديد'}
              </span>
            )}
          </div>

          {/* 4 Category Chips: All + Platform + Weyaak + Other */}
          <div className="flex gap-2 pb-1">
            {Object.entries(CATEGORY_META).map(([catId, meta]) => {
              const count = getCategoryCount(catId);
              const isActive = activeCategory === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveCategory(catId as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive ? 'bg-white text-[#1F3D2B] shadow-md' : 'bg-white/15 text-white/90 hover:bg-white/25'
                  }`}
                  style={{ fontFamily }}
                >
                  <span className="text-sm">{meta.icon}</span>
                  <span>{isEn ? meta.labelEn : meta.labelAr}</span>
                  {count > 0 && (
                    <span className={`min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold ${
                      isActive ? 'bg-[#2AA676] text-white' : 'bg-white/25 text-white'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ FILTER BAR ═══ */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          {([
            ['all', isEn ? 'All' : 'الكل'],
            ['unread', isEn ? 'Unread' : 'غير مقروءة'],
            ['read', isEn ? 'Read' : 'مقروءة'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === key ? 'bg-[#1F3D2B] text-white' : 'bg-white text-[#1F3D2B] border border-[#1F3D2B]/15'
              }`}
              style={{ fontFamily }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-[#2AA676] text-[11px] font-bold flex items-center gap-1" style={{ fontFamily }}>
              <CheckCheck className="w-3.5 h-3.5" />{isEn ? 'Read all' : 'قراءة الكل'}
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="text-red-400 text-[11px] font-bold flex items-center gap-1" style={{ fontFamily }}>
              <Trash2 className="w-3.5 h-3.5" />{isEn ? 'Clear' : 'حذف'}
            </button>
          )}
        </div>
      </div>

      {/* ═══ LIST ═══ */}
      <div className="px-4 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Bell className="w-10 h-10 text-gray-300" /></div>
              <h3 className="text-lg text-[#1F3D2B] mb-2 font-bold" style={{ fontFamily }}>{isEn ? 'No Notifications' : 'لا توجد إشعارات'}</h3>
              <p className="text-sm text-gray-400 max-w-[250px]" style={{ fontFamily }}>{isEn ? 'You\'re all caught up!' : 'لا يوجد شيء جديد حالياً.'}</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notif, index) => {
              const catMeta = CATEGORY_META[notif.category];
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100, height: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all cursor-pointer ${
                    !notif.read ? 'border-[#2AA676]/20' : 'border-transparent'
                  }`}
                  onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${catMeta?.bg || 'bg-gray-50'}`}>
                      <span className="text-xl">{notif.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={`text-sm leading-tight ${!notif.read ? 'font-bold text-[#1F3D2B]' : 'font-semibold text-gray-600'}`} style={{ fontFamily }}>
                          {isEn ? notif.titleEn : notif.titleAr}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!notif.read && <div className="w-2 h-2 rounded-full bg-[#2AA676] animate-pulse" />}
                          <button onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }} className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2" style={{ fontFamily }}>{isEn ? notif.messageEn : notif.messageAr}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px]" style={{ fontFamily }}>{isEn ? notif.timeEn : notif.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-l ${catMeta?.color || ''} text-white`}>
                            {isEn ? catMeta?.labelEn : catMeta?.labelAr}
                          </span>
                          {!notif.read && (
                            <button onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }} className="text-[10px] text-[#2AA676] font-bold flex items-center gap-0.5" style={{ fontFamily }}>
                              <Check className="w-3 h-3" />{isEn ? 'Read' : 'قراءة'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-gray-300" style={{ fontFamily }}>
            {isEn ? `${notifications.length} notifications · ${unreadCount} unread` : `${notifications.length} إشعار · ${unreadCount} غير مقروء`}
          </p>
        </div>
      )}
    </div>
  );
}
