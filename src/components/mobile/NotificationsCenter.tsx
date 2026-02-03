import { useState } from 'react';
import { ArrowRight, Bell, Trash2, Check, CheckCheck } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { GlassCard } from './GlassCard';

interface NotificationsCenterProps {
  onBack: () => void;
  initialCategory?: 'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers' | 'all';
}

interface Notification {
  id: string;
  category: 'platform' | 'weyaak' | 'crm' | 'user' | 'alerts' | 'offers';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationsCenter({ onBack, initialCategory = 'all' }: NotificationsCenterProps) {
  const { t, dir } = useTranslation('notifications');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      category: 'platform',
      title: t('welcomeMessage'),
      message: dir === 'rtl' ? 'ابدأ باستكشاف خدماتنا المتنوعة' : 'Start exploring our diverse services',
      time: dir === 'rtl' ? 'منذ ساعة' : '1 hour ago',
      read: false
    },
    {
      id: '2',
      category: 'offers',
      title: t('newOfferAvailable'),
      message: dir === 'rtl' ? 'خصم 20% على جميع خدمات المقاولات' : '20% discount on all construction services',
      time: dir === 'rtl' ? 'منذ ساعتين' : '2 hours ago',
      read: false
    },
    {
      id: '3',
      category: 'weyaak',
      title: t('weyaakResponse'),
      message: dir === 'rtl' ? 'لديك رد جديد من وياك على استفسارك' : 'You have a new response from Weyaak',
      time: dir === 'rtl' ? 'منذ 3 ساعات' : '3 hours ago',
      read: true
    },
    {
      id: '4',
      category: 'user',
      title: dir === 'rtl' ? 'رسالة من مقاول' : 'Message from contractor',
      message: dir === 'rtl' ? 'أحمد المهندس أرسل لك عرض سعر' : 'Ahmed Engineer sent you a quote',
      time: dir === 'rtl' ? 'أمس' : 'Yesterday',
      read: true
    },
    {
      id: '5',
      category: 'alerts',
      title: dir === 'rtl' ? 'تذكير بموعد' : 'Appointment reminder',
      message: dir === 'rtl' ? 'لديك موعد غداً الساعة 10 صباحاً' : 'You have an appointment tomorrow at 10 AM',
      time: dir === 'rtl' ? 'منذ يومين' : '2 days ago',
      read: false
    },
  ]);

  const categories = [
    { id: 'all', label: t('all'), icon: Bell },
    { id: 'platform', label: t('platformMessages'), icon: Bell },
    { id: 'weyaak', label: t('weyaakMessages'), icon: Bell },
    { id: 'crm', label: t('crmMessages'), icon: Bell },
    { id: 'user', label: t('userMessages'), icon: Bell },
    { id: 'alerts', label: t('alerts'), icon: Bell },
    { id: 'offers', label: t('flashOffers'), icon: Bell },
  ];

  const filteredNotifications = notifications.filter(notif => {
    const categoryMatch = activeCategory === 'all' || notif.category === activeCategory;
    const filterMatch = filter === 'all' || (filter === 'unread' && !notif.read) || (filter === 'read' && notif.read);
    return categoryMatch && filterMatch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5EEE1] to-white pb-20" dir={dir}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-l from-[#2AA676] to-[#1F3D2B] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowRight className={`w-6 h-6 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
            </button>
            <h1 className="text-2xl" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('title')}
            </h1>
            <div className="relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF5722] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => {
              const Icon = cat.icon;
              const count = cat.id === 'all' 
                ? notifications.length 
                : notifications.filter(n => n.category === cat.id).length;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-white text-[#1F3D2B]'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                  {count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeCategory === cat.id
                        ? 'bg-[#2AA676] text-white'
                        : 'bg-white/30'
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

      {/* Actions Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'all'
                  ? 'bg-[#1F3D2B] text-white'
                  : 'bg-white text-[#1F3D2B] border border-[#1F3D2B]/20'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              {t('all')}
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'unread'
                  ? 'bg-[#1F3D2B] text-white'
                  : 'bg-white text-[#1F3D2B] border border-[#1F3D2B]/20'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              {t('unread')}
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-full transition-all ${
                filter === 'read'
                  ? 'bg-[#1F3D2B] text-white'
                  : 'bg-white text-[#1F3D2B] border border-[#1F3D2B]/20'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              {t('read')}
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[#2AA676] hover:text-[#1F3D2B] transition-colors flex items-center gap-1"
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
            >
              <CheckCheck className="w-4 h-4" />
              {t('markAllAsRead')}
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {t('noNotifications')}
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {t('noNotificationsMessage')}
              </p>
            </GlassCard>
          ) : (
            filteredNotifications.map(notif => (
              <GlassCard
                key={notif.id}
                className={`p-4 hover:shadow-lg transition-all cursor-pointer ${
                  !notif.read ? 'border-r-4 border-[#2AA676]' : ''
                }`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${
                    !notif.read ? 'bg-[#2AA676]' : 'bg-gray-200'
                  }`}>
                    <Bell className={`w-5 h-5 ${!notif.read ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`${!notif.read ? 'text-[#1F3D2B]' : 'text-gray-700'}`} style={{ fontFamily: 'Cairo, sans-serif', fontWeight: !notif.read ? 700 : 600 }}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap" style={{ fontFamily: 'Cairo, sans-serif' }}>
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="text-xs text-[#2AA676] hover:text-[#1F3D2B] flex items-center gap-1"
                          style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                        >
                          <Check className="w-3 h-3" />
                          {t('markAsRead')}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                        style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}
                      >
                        <Trash2 className="w-3 h-3" />
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
