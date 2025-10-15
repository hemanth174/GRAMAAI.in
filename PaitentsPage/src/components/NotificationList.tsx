import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, AlertTriangle, Info, X } from 'lucide-react';

interface Notification {
  _id: string;
  hospitalId: string;
  message: string;
  sentBy: string;
  department: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  timestamp: string;
  status: 'active' | 'archived';
  readBy?: string[];
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  isConnected: boolean;
}

const priorityConfig = {
  low: { color: 'bg-gray-500', icon: Info, label: 'Low' },
  normal: { color: 'bg-blue-500', icon: Bell, label: 'Normal' },
  high: { color: 'bg-orange-500', icon: AlertTriangle, label: 'High' },
  urgent: { color: 'bg-red-500 animate-pulse', icon: AlertTriangle, label: 'URGENT' }
};

export default function NotificationList({ notifications, onMarkAsRead, isConnected }: NotificationListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'today'>('all');

  const unreadCount = notifications.filter(n => 
    !n.readBy || !n.readBy.includes('current-patient-id')
  ).length;

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notificationTime.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.readBy || !notification.readBy.includes('current-patient-id');
    }
    if (filter === 'today') {
      const today = new Date();
      const notificationDate = new Date(notification.timestamp);
      return notificationDate.toDateString() === today.toDateString();
    }
    return true;
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readBy || !notification.readBy.includes('current-patient-id')) {
      onMarkAsRead(notification._id);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className={`
            relative p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105
            ${isConnected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'}
            text-white
          `}
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
          {!isConnected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-600 rounded-full"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-white" />
              <div>
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-blue-100 text-sm">
                  {isConnected ? 'Live updates' : 'Disconnected'}
                  {unreadCount > 0 && ` • ${unreadCount} unread`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-blue-100 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'today', label: 'Today' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`
                  px-3 py-1 text-sm rounded-full transition-colors
                  ${filter === key 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-64 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const config = priorityConfig[notification.priority];
                  const IconComponent = config.icon;
                  const isRead = notification.readBy && notification.readBy.includes('current-patient-id');

                  return (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`
                        p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50
                        ${isRead ? 'bg-gray-50/50' : 'bg-white border border-blue-200/50'}
                      `}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex gap-3">
                        <div className={`p-1 rounded-full ${config.color} text-white flex-shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${config.color} text-white`}>
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {notification.department}
                            </span>
                            {!isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className={`text-sm line-clamp-2 ${isRead ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              by {notification.sentBy}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    // Mark all as read
                    notifications.forEach(n => {
                      if (!n.readBy || !n.readBy.includes('current-patient-id')) {
                        onMarkAsRead(n._id);
                      }
                    });
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}