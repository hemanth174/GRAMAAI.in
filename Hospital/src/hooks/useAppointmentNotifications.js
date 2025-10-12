// Real-Time Appointment Notification System
import { useEffect, useRef, useState } from 'react';

// Notification sound (you can replace with actual audio file path)
const NOTIFICATION_SOUND_URL = '/sounds/notify.mp3';

export function useAppointmentNotifications(onNewAppointment) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastAppointmentId, setLastAppointmentId] = useState(null);
  const audioRef = useRef(null);
  const eventSourceRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.volume = 0.7;

    // Fallback: Create notification sound if file doesn't exist
    audioRef.current.addEventListener('error', () => {
      console.log('Using fallback notification sound');
      // Create a simple beep using Web Audio API as fallback
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    });
  }, []);

  // Connect to real-time updates
  useEffect(() => {
    const connectToSSE = () => {
      try {
        // Connect to Patient Portal backend for real-time updates
        const eventSource = new EventSource('http://localhost:5001/api/appointments/stream');
        eventSourceRef.current = eventSource;

        eventSource.addEventListener('init', (event) => {
          console.log('🔌 Connected to appointment stream');
          setIsConnected(true);
          const appointments = JSON.parse(event.data);
          if (appointments.length > 0) {
            setLastAppointmentId(appointments[0].id);
          }
        });

        eventSource.addEventListener('created', (event) => {
          const newAppointment = JSON.parse(event.data);
          console.log('🆕 New appointment received:', newAppointment);
          
          // Check if it's actually new
          if (lastAppointmentId && newAppointment.id !== lastAppointmentId) {
            playNotificationSound();
            showNotificationToast(newAppointment);
            if (onNewAppointment) {
              onNewAppointment(newAppointment);
            }
          }
          
          setLastAppointmentId(newAppointment.id);
        });

        eventSource.addEventListener('updated', (event) => {
          const updatedAppointment = JSON.parse(event.data);
          console.log('🔄 Appointment updated:', updatedAppointment);
        });

        eventSource.onerror = (error) => {
          console.warn('⚠️ SSE connection error, reconnecting...', error);
          setIsConnected(false);
          eventSource.close();
          
          // Reconnect after 5 seconds
          setTimeout(connectToSSE, 5000);
        };
      } catch (error) {
        console.error('Failed to connect to SSE:', error);
        setIsConnected(false);
      }
    };

    connectToSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [lastAppointmentId, onNewAppointment]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('Could not play notification sound:', err);
      });
    }
  };

  const showNotificationToast = (appointment) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🩺 New Appointment Received!', {
        body: `${appointment.patient_name} - ${appointment.symptoms}`,
        icon: '/hospital-icon.png',
        badge: '/hospital-badge.png',
      });
    }
  };

  return { isConnected };
}

// Request notification permission
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
