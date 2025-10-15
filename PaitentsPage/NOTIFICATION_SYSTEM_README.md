# 🏥 Real-Time Hospital Notification System with AI Assistant

A complete hospital-to-patient communication system with real-time notifications, AI assistant, and MongoDB integration.

## 🌟 Features

### 🔔 Real-Time Notifications
- **Hospital-to-Patient Broadcasting**: Instant notifications from hospital staff to all patients
- **Real-Time Delivery**: WebSocket-based notifications with sound and animations  
- **Priority Levels**: Low, Normal, High, and Urgent notifications with different styling
- **Auto-Dismiss**: Notifications auto-hide after 7 seconds with countdown timer
- **Sound Alerts**: Built-in notification sounds with vibration support
- **Read Status**: Mark notifications as read/unread
- **Notification History**: View all past notifications with filtering

### 🤖 AI Health Assistant
- **Health Guidance**: Medical information and symptom guidance
- **Emergency Detection**: Recognizes emergency keywords and provides immediate guidance
- **Appointment Help**: Assists with booking appointments and finding doctors
- **Wellness Tips**: Preventive care and lifestyle advice
- **Medication Info**: General medication guidance (not prescriptions)
- **Mental Health**: Stress and anxiety support resources

### 📊 Database & Backend
- **MongoDB Integration**: Real database storage for notifications
- **Rate Limiting**: Prevents spam with 10 notifications per minute limit
- **RESTful APIs**: Complete API endpoints for all operations
- **Socket.IO**: Real-time bidirectional communication
- **Data Persistence**: 30-day automatic cleanup with indexes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Hospital      │    │   Notification  │    │    Patient      │
│   Portal        │───▶│     Server      │───▶│    Portal       │
│  (Sender)       │    │   (MongoDB)     │    │  (Receiver)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   AI Assistant  │
                       │     Server      │
                       │   (Gemini API)  │ 
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Modern web browser with WebSocket support

### 1. Setup MongoDB
```bash
# Run the MongoDB setup script
setup-mongodb.bat
```

### 2. Install Dependencies
```bash
cd PatientsPage
npm install mongodb socket.io express-rate-limit framer-motion lucide-react
```

### 3. Start All Services
```bash
# Run the complete startup script
start-all-services.bat
```

This will start:
- 📊 MongoDB (Port 27017)
- 🔔 Notification Server (Port 5002)  
- 🤖 AI Assistant Server (Port 5003)
- 🏥 Patient Backend (Port 5001)
- 🌐 Patient Frontend (Port 5173)

### 4. Access Applications
- **Patient Portal**: http://localhost:5173
- **Hospital Portal**: http://localhost:5174 (navigate to /notifications)

## 📋 Usage Guide

### For Hospital Staff

1. **Navigate to Notifications Center**
   - Go to Hospital Portal → Notifications
   - Select target hospital from dropdown
   - Choose department and priority level

2. **Send Notifications**
   - Type your message (up to 500 characters)
   - Select priority: Low, Normal, High, or Urgent
   - Click "Send Notification"
   - View delivery statistics

3. **Monitor Activity**
   - See connected patient count
   - View notification history
   - Archive old notifications

### For Patients

1. **Receive Notifications**
   - Notifications appear automatically with sound
   - Different animations based on priority
   - Auto-dismiss after 7 seconds

2. **Manage Notifications**
   - Click bell icon to view all notifications
   - Filter by: All, Unread, Today
   - Mark as read by clicking
   - "Mark all read" for bulk actions

3. **Use AI Assistant**
   - Navigate to AI Assistant page
   - Ask health-related questions
   - Get emergency guidance
   - Receive appointment booking help

## 🔧 Configuration

### Hospital IDs
Update `hospitalId` in `NotificationWrapper.tsx` to match patient's hospital:
```typescript
const hospitalId = 'HOSP001'; // Change based on patient context
```

### Notification Server
Configure in `notification-server.js`:
```javascript
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'hospital_notifications';
const PORT = 5002;
```

### AI Assistant
Update Gemini API key in `ai-assistant-server.js`:
```javascript
const GEMINI_API_KEY = "your-api-key-here";
```

## 📡 API Endpoints

### Notification Service (Port 5002)
- `POST /api/notifications/send` - Send notification
- `GET /api/notifications/:hospitalId` - Get notifications  
- `GET /api/notifications/:hospitalId/stats` - Get statistics
- `POST /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/:id/archive` - Archive notification

### AI Assistant (Port 5003)  
- `POST /api/ai/ask` - Text-based AI chat
- `GET /api/ai/health-tips` - Daily health tips
- `GET /api/ai/emergency-guide` - Emergency procedures
- `GET /api/health` - Service health check

## 🔌 Socket.IO Events

### Notification Events
- `joinHospital` - Patient joins hospital room
- `newNotification` - Real-time notification broadcast
- `recentNotifications` - Recent notifications on connect

### AI Assistant Events  
- `startAISession` - Begin AI conversation
- `sendMessage` - Send message to AI
- `aiResponse` - Receive AI response
- `endAISession` - End conversation

## 🛡️ Security Features

- **Rate Limiting**: 10 notifications/minute, 30 AI requests/minute
- **Input Validation**: Message length limits and sanitization
- **CORS Protection**: Configured for specific origins
- **Error Handling**: Graceful fallbacks for all services

## 📱 Mobile Support

- **Responsive Design**: Works on all screen sizes
- **Touch Gestures**: Swipe to dismiss notifications
- **Vibration**: Notification vibration on mobile devices
- **Offline Graceful**: Handles network disconnections

## 🔍 Troubleshooting

### MongoDB Issues
```bash
# If MongoDB fails to start:
1. Check if port 27017 is available
2. Verify data directory permissions
3. Run: mongod --dbpath "C:\data\db" --repair
```

### Connection Issues
```bash
# If Socket.IO fails to connect:
1. Check firewall settings for ports 5001-5003
2. Verify CORS configuration
3. Check browser console for errors
```

### AI Assistant Issues
```bash
# If AI responses fail:
1. Verify Gemini API key is valid
2. Check rate limiting (30 requests/minute)
3. Review server logs for errors
```

## 🧪 Testing

### Test Notification Flow
1. Open Hospital Portal in one browser tab
2. Open Patient Portal in another tab/window  
3. Send a test notification from hospital
4. Verify instant delivery to patient with sound/animation

### Test AI Assistant
1. Navigate to AI Assistant page
2. Try sample queries:
   - "I have a fever"
   - "Book appointment"  
   - "Emergency help"
   - "Wellness tips"

## 🚀 Production Deployment

### Environment Variables
```bash
MONGO_URI=mongodb://production-server:27017
GEMINI_API_KEY=your-production-api-key
NODE_ENV=production
```

### Security Hardening
- Use HTTPS in production
- Implement authentication/authorization
- Set up proper MongoDB security
- Configure production CORS origins
- Use environment variables for sensitive data

## 📈 Monitoring

### Health Checks
- Notification Server: `GET /api/health`
- AI Assistant: `GET /api/health`  
- MongoDB: Connection status in server logs

### Metrics Tracked
- Connected patients per hospital
- Notification delivery rates  
- AI conversation volumes
- System performance metrics

---

## 🎯 Next Steps

1. **Authentication**: Add user login and hospital assignment
2. **Push Notifications**: Browser push notifications when tab not active
3. **File Attachments**: Support images/documents in notifications
4. **Voice AI**: Integrate Gemini Live API for voice conversations
5. **Analytics Dashboard**: Comprehensive reporting and analytics
6. **Mobile App**: React Native companion app

---

**Built with ❤️ for better hospital-patient communication**