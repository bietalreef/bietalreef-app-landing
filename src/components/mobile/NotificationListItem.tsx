// ====================================
// 🔔 Notification List Item Component
// بيت الريف - بطاقة إشعار واحدة
// ====================================

import { NotificationItem, NOTIFICATION_ICONS, NOTIFICATION_COLORS, formatNotificationTime } from '../../data/notifications';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationListItemProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  onAction?: (notification: NotificationItem) => void;
}

export function NotificationListItem({ notification, onMarkAsRead, onAction }: NotificationListItemProps) {
  const icon = NOTIFICATION_ICONS[notification.type];
  const color = NOTIFICATION_COLORS[notification.type];

  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionTarget && onAction) {
      onAction(notification);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-2xl p-4 shadow-sm border-2 cursor-pointer transition-all ${
        notification.isRead 
          ? 'border-[#F5EEE1]' 
          : 'border-[#4A90E2]/30 bg-[#4A90E2]/5'
      }`}
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <span className="text-2xl">{icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm text-[#1F3D2B] flex-1" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
              {notification.title}
            </h3>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-[#4A90E2] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>

          <p className="text-xs text-[#1F3D2B]/70 mb-2 line-clamp-2" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#1F3D2B]/40" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {formatNotificationTime(notification.createdAt)}
            </span>

            {notification.actionLabel && (
              <div className="flex items-center gap-1 text-xs" style={{ color, fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}>
                {notification.actionLabel}
                <ChevronLeft className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
