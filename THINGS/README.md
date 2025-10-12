# Hospital Appointment Integration Package

**Complete integration code for connecting patient portals to the hospital appointment system**

## 📦 What's Inside

This package contains all the code needed to integrate appointment booking functionality into a patient portal:

- **Backend Database Code** - SQLite schema and CRUD operations
- **Backend API Code** - Express endpoints with real-time Server-Sent Events
- **Frontend API Client** - TypeScript client for all appointment operations
- **Toast Notifications** - Standalone notification system (no dependencies)
- **Integration Guide** - Complete step-by-step setup instructions

## 🚀 Quick Start

### 1. Backend Integration

Add to your `database.js`:
```javascript
import { randomUUID } from 'crypto';

// Copy code from: backend/database-appointments.js
```

Add to your `server.js`:
```javascript
import express from 'express';
import cors from 'cors';

// Copy code from: backend/server-appointments.js
```

Start server:
```bash
node server.js
```

### 2. Frontend Integration

Copy files to your project:
```bash
cp frontend/api/appointmentClient.ts src/api/
cp frontend/utils/toast.ts src/utils/
```

Use in your booking form:
```typescript
import { appointmentClient } from '@/api/appointmentClient';
import { toast } from '@/utils/toast';

// On form submit:
const appointment = await appointmentClient.createAppointment({
  patient_name: 'John Doe',
  patient_email: 'john@example.com',
  symptoms: 'Fever and headache',
  requested_doctor_name: 'Dr. Smith',
  appointment_time: '2024-01-15T14:30:00',
  priority: 'medium'
});

toast.success('Appointment booked successfully!');
```

## 📖 Full Documentation

See **INTEGRATION_GUIDE.md** for:
- Complete API reference
- Code examples
- Data flow diagrams
- Troubleshooting tips
- Best practices

## ✨ Features

✅ **Real-time Updates** - Appointments sync instantly between patient and doctor portals  
✅ **Type-Safe Client** - Full TypeScript support with interfaces  
✅ **Zero Dependencies** - Toast system works standalone  
✅ **Auto-Reconnect** - SSE connection recovers automatically  
✅ **SQLite Database** - Simple, reliable persistence  
✅ **RESTful API** - Standard CRUD operations  
✅ **Event Streaming** - Server-Sent Events for live updates  

## 🔌 API Endpoints

```
GET    /api/appointments          # List all appointments
GET    /api/appointments/stream   # Real-time SSE updates
POST   /api/appointments          # Create new appointment
PATCH  /api/appointments/:id      # Update appointment
DELETE /api/appointments/:id      # Delete appointment
```

## 🎯 Use Case

This integration was built to connect:
- **Patient Portal** → Books appointments, receives confirmations
- **Doctor Portal** → Receives real-time notifications with sound alerts
- **Backend Server** → Manages data, broadcasts updates

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js + Express |
| Database | SQLite |
| Real-time | Server-Sent Events (SSE) |
| Frontend Client | TypeScript |
| Notifications | Custom Toast (Vanilla JS) |

## 📋 Quick Example

```typescript
import { appointmentClient, checkBackendConnection } from '@/api/appointmentClient';
import { toast } from '@/utils/toast';

// Check if backend is available
const isConnected = await checkBackendConnection();

if (!isConnected) {
  toast.warning('Backend server is offline. Please try again later.');
  return;
}

// Create appointment
try {
  const appointment = await appointmentClient.createAppointment({
    patient_name: formData.name,
    patient_email: formData.email,
    symptoms: formData.symptoms,
    requested_doctor_name: formData.doctor,
    appointment_time: formData.dateTime,
    priority: 'medium',
    status: 'pending'
  });

  toast.success('Your appointment has been booked!');
  
  // Optionally connect to real-time updates
  appointmentClient.connectToUpdates((updatedAppointment) => {
    if (updatedAppointment.id === appointment.id) {
      toast.info(`Appointment ${updatedAppointment.status}`);
    }
  });

} catch (error) {
  toast.error('Failed to book appointment. Please try again.');
}
```

## 📁 File Structure

```
THINGS/
├── README.md                      # This file
├── INTEGRATION_GUIDE.md           # Detailed integration instructions
├── backend/
│   ├── database-appointments.js   # SQLite schema + CRUD functions
│   └── server-appointments.js     # Express API endpoints + SSE
└── frontend/
    ├── api/
    │   └── appointmentClient.ts   # TypeScript API client
    └── utils/
        └── toast.ts               # Toast notification utility
```

## 🔄 Data Models

### Appointment Interface (TypeScript)
```typescript
interface Appointment {
  id: string;
  patient_name: string;
  patient_email?: string;
  symptoms: string;
  requested_doctor_id?: string;
  requested_doctor_name: string;
  appointment_time: string;         // ISO 8601 format
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'confirmed' | 'cancelled';
  document_urls?: string[];
  uploaded_documents?: string[];
  created_date: string;
  updated_at: string;
}
```

### Database Schema (SQLite)
```sql
CREATE TABLE appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  symptoms TEXT,
  requested_doctor_id TEXT,
  requested_doctor_name TEXT,
  appointment_time TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  document_urls TEXT DEFAULT '[]',
  uploaded_documents TEXT DEFAULT '[]',
  created_date TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 🎨 Toast Notification Examples

```typescript
import { toast } from '@/utils/toast';

// Success
toast.success('Appointment booked!');

// Error
toast.error('Booking failed. Please try again.');

// Info
toast.info('Processing your request...');

// Warning
toast.warning('Please fill all required fields');

// With custom duration and position
toast.success('Saved!', {
  duration: 5000,              // 5 seconds
  position: 'top-right'
});
```

## 🔐 Security Notes

- Use HTTPS in production
- Validate all inputs on backend
- Sanitize user data before database storage
- Implement authentication/authorization as needed
- Use environment variables for sensitive config

## 📝 License

This code is provided as-is for integration with your hospital management system.

## 🤝 Support

For integration help, refer to:
1. **INTEGRATION_GUIDE.md** - Complete setup instructions
2. Backend server logs - Check for API errors
3. Browser console - Check for client-side errors

---

**Created:** January 2024  
**Version:** 1.0  
**Backend Port:** 5000 (default)
