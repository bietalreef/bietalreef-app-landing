// ====================================
// 🔔 Notifications Screen Component
// بيت الريف - شاشة الإشعارات
// ====================================

import { useState } from 'react';
import { X, CheckCheck, Filter } from 'lucide-react';
import { MOCK_NOTIFICATIONS, NotificationItem, NotificationType } from '../../data/notifications';
import { NotificationListItem } from './NotificationListItem';
import { useTranslation } from 'react-i18next';

interface NotificationsScreenProps {
  onClose: () => void;
}

export function NotificationsScreen({ onClose }: NotificationsScreenProps) {
  const { t, dir } = useTranslation('notifications');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'offers'>('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    // TODO: Backend API call
    console.log('Mark as read:', id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    // TODO: Backend API call
    console.log('Mark all as read');
    alert(t('allMarkedAsRead'));
  };

  const handleAction = (notification: NotificationItem) => {
    console.log('Navigate to:', notification.actionTarget);
    // TODO: Implement navigation
    alert(`${t('redirectTo')}: ${notification.actionTarget?.screen || t('requestedPage')}`);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'offers') return notif.type === 'offer';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs = [
    { id: 'all', label: t('all'), count: notifications.length },
    { id: 'unread', label: t('unread'), count: unreadCount },
    { id: 'offers', label: t('flashOffers'), count: notifications.filter(n => n.type === 'offer').length }
  ] as const;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col" dir={dir}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4A90E2] via-[#56CCF2] to-[#4A90E2] px-5 pt-6 pb-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: '24px' }}>
            {t('title')}
          </h1>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#4A90E2]'
                  : 'bg-white/20 text-white'
              }`}
              style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`${dir === 'rtl' ? 'mr-1.5' : 'ml-1.5'} px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-[#4A90E2]/20' : 'bg-white/30'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Mark All As Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="w-full bg-white/20 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: '13px' }}
          >
            <CheckCheck className="w-4 h-4" />
            {t('markAllAsRead')} ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#F5EEE1] to-white">
        {filteredNotifications.length > 0 ? (
          <div className="p-4 space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onAction={handleAction}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg text-[#1F3D2B] mb-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {t('noNotifications')}
            </h3>
            <p className="text-sm text-[#1F3D2B]/60 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {t('noNotificationsMessage')}
            </p>
          </div>
        )}
      </div>

      {/* TODO Notice */}
      <div className="bg-white border-t border-[#F5EEE1] px-5 py-3">
        <p className="text-xs text-[#1F3D2B]/40 text-center" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          💡 TODO: {dir === 'rtl' ? 'سيتم ربط الإشعارات مع Backend API + Push Notifications لاحقاً' : 'Notifications will be connected to Backend API + Push Notifications later'}
        </p>
      </div>
    </div>
  );
}