import { useNotifications } from '../hooks/useNotifications';
import NotificationPopup from './NotificationPopup';
import NotificationList from './NotificationList';

interface NotificationWrapperProps {
  children: React.ReactNode;
}

export default function NotificationWrapper({ children }: NotificationWrapperProps) {
  // In a real app, this would come from user context/auth
  // For demo, using a sample hospital ID
  const hospitalId = 'HOSP001'; // This should be dynamic based on patient's hospital
  
  const { 
    notifications, 
    newNotification, 
    isConnected, 
    markAsRead, 
    dismissNotification 
  } = useNotifications(hospitalId);

  return (
    <>
      {children}
      
      {/* Notification Popup for new notifications */}
      <NotificationPopup 
        notification={newNotification}
        onDismiss={dismissNotification}
      />
      
      {/* Notification List (Bell icon + popup) */}
      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
        isConnected={isConnected}
      />
    </>
  );
}