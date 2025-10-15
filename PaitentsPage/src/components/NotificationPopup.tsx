import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Info, Clock } from 'lucide-react';

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

interface NotificationPopupProps {
  notification: Notification | null;
  onDismiss: () => void;
}

const priorityConfig = {
  low: { 
    color: 'from-gray-500 to-gray-600', 
    textColor: 'text-gray-800',
    bgColor: 'bg-gray-50',
    icon: Info,
    borderColor: 'border-gray-200'
  },
  normal: { 
    color: 'from-blue-500 to-blue-600', 
    textColor: 'text-blue-800',
    bgColor: 'bg-blue-50',
    icon: Bell,
    borderColor: 'border-blue-200'
  },
  high: { 
    color: 'from-orange-500 to-orange-600', 
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    icon: AlertTriangle,
    borderColor: 'border-orange-200'
  },
  urgent: { 
    color: 'from-red-500 to-red-600', 
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    icon: AlertTriangle,
    borderColor: 'border-red-200'
  }
};

export default function NotificationPopup({ notification, onDismiss }: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setTimeLeft(7);
      
      // Auto-dismiss timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsVisible(false);
            setTimeout(onDismiss, 300); // Wait for animation to complete
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [notification, onDismiss]);

  if (!notification) return null;

  const config = priorityConfig[notification.priority] || priorityConfig.normal;
  const IconComponent = config.icon;
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              duration: 0.6,
              bounce: 0.3
            }
          }}
          exit={{ 
            opacity: 0, 
            y: -100, 
            scale: 0.8,
            transition: { duration: 0.3 }
          }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
        >
          <motion.div
            animate={notification.priority === 'urgent' ? {
              scale: [1, 1.02, 1],
              transition: { repeat: Infinity, duration: 2 }
            } : {}}
            className={`
              ${config.bgColor} ${config.borderColor}
              border-2 rounded-2xl shadow-2xl overflow-hidden
              backdrop-blur-sm
            `}
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${config.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={notification.priority === 'urgent' ? {
                      rotate: [0, -10, 10, 0],
                      transition: { repeat: Infinity, duration: 1.5 }
                    } : {}}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="text-white">
                    <h3 className="font-semibold text-lg">Hospital Update</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <span>{notification.department}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(notification.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
              >
                <p className={`${config.textColor} text-sm leading-relaxed mb-3`}>
                  📢 {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">From:</span> {notification.sentBy}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className={`h-full bg-gradient-to-r ${config.color}`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 7, ease: 'linear' }}
                      />
                    </motion.div>
                    <span className="text-xs text-gray-500 font-mono min-w-[2ch]">
                      {timeLeft}s
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sound wave animation for urgent notifications */}
            {notification.priority === 'urgent' && (
              <div className="absolute top-0 left-0 w-full h-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{
                    x: [-100, 400],
                    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                  }}
                  style={{ width: '100px', opacity: 0.6 }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}