import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const NOTIFICATION_SERVER_URL = import.meta.env?.VITE_NOTIFICATION_SERVER_URL ?? null;

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

export function useNotifications(hospitalId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio for notifications with a generated beep sound
    try {
      // Create a simple notification beep using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const createBeep = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      };
      
      audioRef.current = { play: createBeep } as any;
    } catch (error) {
      console.warn('Could not initialize audio context:', error);
      audioRef.current = null;
    }

    return () => {
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!hospitalId || !NOTIFICATION_SERVER_URL) {
      return;
    }

    // Initialize Socket.IO connection
    socketRef.current = io(NOTIFICATION_SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('🔌 Connected to notification server');
      setIsConnected(true);
      socket.emit('joinHospital', hospitalId);
    });

    socket.on('disconnect', () => {
      console.log('⚡ Disconnected from notification server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });

    // Receive recent notifications when first connecting
    socket.on('recentNotifications', (recentNotifications: Notification[]) => {
      console.log('📥 Received recent notifications:', recentNotifications.length);
      setNotifications(prev => {
        // Merge recent with existing, avoiding duplicates
        const existingIds = new Set(prev.map(n => n._id));
        const newOnes = recentNotifications.filter((n: Notification) => !existingIds.has(n._id));
        return [...newOnes, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    });

    // Receive new real-time notifications
    socket.on('newNotification', (notification: Notification) => {
      console.log('🔔 New notification received:', notification);
      
      // Add to notifications list
      setNotifications(prev => {
        // Avoid duplicates
        if (prev.some(n => n._id === notification._id)) {
          return prev;
        }
        return [notification, ...prev].slice(0, 50); // Keep last 50 notifications
      });

      // Set for UI animation
      setNewNotification(notification);

      // Play notification sound
      playNotificationSound();

      // Clear the new notification after animation
      setTimeout(() => {
        setNewNotification(null);
      }, 7000);
    });

    // Cleanup on unmount or hospitalId change
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('recentNotifications');
        socket.off('newNotification');
        socket.close();
      }
    };
  }, [hospitalId]);

  const playNotificationSound = async () => {
    try {
      if (audioRef.current && audioRef.current.play) {
        audioRef.current.play();
      }
      
      // Also try vibration on mobile devices
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      if (!NOTIFICATION_SERVER_URL) {
        return;
      }

      await fetch(`${NOTIFICATION_SERVER_URL}/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: 'current-patient-id' // This should come from user context
        }),
      });

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, readBy: [...(notification.readBy || []), 'current-patient-id'] }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = () => {
    setNewNotification(null);
  };

  return {
    notifications,
    newNotification,
    isConnected,
    markAsRead,
    dismissNotification,
    playNotificationSound
  };
}