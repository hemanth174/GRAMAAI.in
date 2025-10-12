import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastVariants = {
  initial: { opacity: 0, y: -50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
};

export default function NotificationToast({ message, type = 'info', isVisible, onClose }) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      emoji: '✅'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
      emoji: '❌'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      emoji: '🩺'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800',
      emoji: '⚠️'
    }
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor, emoji } = config[type] || config.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`${bgColor} ${borderColor} border-2 rounded-xl shadow-2xl overflow-hidden`}>
            <div className="p-4 flex items-start gap-3">
              <div className={`${iconColor} flex-shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{emoji}</span>
                  <p className={`font-semibold ${textColor}`}>
                    {type === 'info' ? 'New Appointment Received!' : 
                     type === 'success' ? 'Success!' :
                     type === 'error' ? 'Error!' : 'Warning!'}
                  </p>
                </div>
                <p className={`text-sm ${textColor} leading-relaxed`}>{message}</p>
              </div>
              <button
                onClick={onClose}
                className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              className={`h-1 ${iconColor.replace('text-', 'bg-')} origin-left`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
