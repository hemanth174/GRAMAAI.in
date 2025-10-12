# Hospital Appointment Integration Guide

Complete guide for integrating the appointment booking system into your new patient portal.

## 📁 File Structure

```
THINGS/
├── backend/
│   ├── database-appointments.js    # Database schema & CRUD operations
│   └── server-appointments.js      # Express API endpoints & SSE setup
└── frontend/
    ├── api/
    │   └── appointmentClient.ts    # TypeScript API client
    └── utils/
        └── toast.ts                # Toast notification utility
```

## 🎯 Overview

This integration provides:
- ✅ **Real-time appointment sync** between patient portal and doctor app
- ✅ **Server-Sent Events (SSE)** for instant updates
- ✅ **RESTful API** for CRUD operations
- ✅ **Toast notifications** for user feedback
- ✅ **SQLite database** for persistence
- ✅ **Type-safe client** with TypeScript

## 🔧 Backend Setup

### Step 1: Add Database Functions

Copy code from `backend/database-appointments.js` to your `database.js`:

```javascript
import { randomUUID } from 'crypto';

// 1. Create appointments table in your initDatabase() function:
await db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
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
  )
`);

// 2. Add these exports at the end:
export {
  listAppointments,
  getAppointmentById,
  createAppointmentRecord,
  updateAppointmentRecord,
  deleteAppointmentRecord
};
```

### Step 2: Add API Endpoints

Copy code from `backend/server-appointments.js` to your `server.js`:

```javascript
import {
  listAppointments,
  createAppointmentRecord,
  updateAppointmentRecord,
  deleteAppointmentRecord
} from './database.js';

// 1. Add SSE client storage at the top:
const appointmentStreamClients = new Set();

// 2. Add helper functions (broadcastAppointmentEvent, normalizeAppointmentPayload, validateAppointmentInput)

// 3. Add all 5 API routes:
//    - GET /api/appointments
//    - GET /api/appointments/stream
//    - POST /api/appointments
//    - PATCH /api/appointments/:id
//    - DELETE /api/appointments/:id
```

### Step 3: Start Backend Server

```bash
node server.js
```

Backend should now be running on `http://localhost:5000`

## 🎨 Frontend Integration

### Step 1: Copy Files to Your New Patient Portal

```bash
# Copy TypeScript client
cp frontend/api/appointmentClient.ts <your-patient-portal>/src/api/

# Copy toast utility
cp frontend/utils/toast.ts <your-patient-portal>/src/utils/
```

### Step 2: Import in Your Booking Form

```typescript
import { appointmentClient, checkBackendConnection } from '@/api/appointmentClient';
import { toast } from '@/utils/toast';
```

### Step 3: Create Appointment on Form Submit

```typescript
const handleBookAppointment = async (formData) => {
  // Show loading toast
  toast.info('Submitting appointment request...', { duration: 5000 });

  try {
    // Create appointment via API
    const appointment = await appointmentClient.createAppointment({
      patient_name: formData.patientName,
      patient_email: formData.email,
      symptoms: formData.symptoms,
      requested_doctor_name: formData.preferredDoctor,
      appointment_time: formData.appointmentDateTime, // ISO format: "2024-01-15T14:30:00"
      priority: formData.priority || 'medium',
      status: 'pending'
    });

    // Show success toast
    toast.success('Appointment booked successfully! You will receive a confirmation email shortly.', { 
      duration: 5000 
    });

    // Optionally reset form or redirect
    // resetForm();
    // router.push('/appointments');

  } catch (error) {
    console.error('Failed to book appointment:', error);
    toast.error('Failed to book appointment. Please try again.', { duration: 5000 });
  }
};
```

### Step 4: (Optional) Connect to Real-Time Updates

If you want to show live appointment updates in your patient portal:

```typescript
import { useEffect } from 'react';

useEffect(() => {
  // Connect to real-time updates
  appointmentClient.connectToUpdates();

  // Listen for new appointments
  const handleNewAppointment = (appointment) => {
    console.log('New appointment:', appointment);
    toast.info(`Appointment confirmed for ${appointment.appointment_time}`);
  };

  appointmentClient.addEventListener('created', handleNewAppointment);

  // Cleanup on unmount
  return () => {
    appointmentClient.removeEventListener('created', handleNewAppointment);
    appointmentClient.disconnect();
  };
}, []);
```

### Step 5: Check Backend Connection Status

```typescript
import { checkBackendConnection } from '@/api/appointmentClient';
import { useState, useEffect } from 'react';

const [isConnected, setIsConnected] = useState(false);

useEffect(() => {
  const checkConnection = async () => {
    const connected = await checkBackendConnection();
    setIsConnected(connected);
  };

  checkConnection();
  const interval = setInterval(checkConnection, 30000); // Check every 30s

  return () => clearInterval(interval);
}, []);

// Show connection status in UI
{isConnected ? (
  <span className="text-green-600">✓ Connected to hospital system</span>
) : (
  <span className="text-yellow-600">⚠ Offline mode</span>
)}
```

## 📋 API Reference

### TypeScript Client Methods

#### `appointmentClient.createAppointment(data)`
```typescript
const appointment = await appointmentClient.createAppointment({
  patient_name: 'John Doe',
  patient_email: 'john@example.com',
  symptoms: 'Fever and headache',
  requested_doctor_name: 'Dr. Smith',
  appointment_time: '2024-01-15T14:30:00',
  priority: 'medium', // 'low' | 'medium' | 'high'
  status: 'pending'   // 'pending' | 'confirmed' | 'cancelled'
});
```

#### `appointmentClient.getAppointments(sort)`
```typescript
const appointments = await appointmentClient.getAppointments('-created_date');
// Returns: Appointment[]
```

#### `appointmentClient.updateAppointment(id, updates)`
```typescript
await appointmentClient.updateAppointment('apt-123', {
  status: 'confirmed',
  appointment_time: '2024-01-16T10:00:00'
});
```

#### `appointmentClient.deleteAppointment(id)`
```typescript
await appointmentClient.deleteAppointment('apt-123');
```

#### `appointmentClient.connectToUpdates(onUpdate?)`
```typescript
appointmentClient.connectToUpdates((appointment) => {
  console.log('Appointment updated:', appointment);
});
```

#### `appointmentClient.addEventListener(event, callback)`
```typescript
appointmentClient.addEventListener('created', (appointment) => {
  toast.success(`New appointment: ${appointment.patient_name}`);
});

// Events: 'created' | 'updated' | 'deleted'
```

## 🎨 Toast Notification Usage

```typescript
import { toast } from '@/utils/toast';

// Success message
toast.success('Appointment booked successfully!');

// Error message
toast.error('Failed to book appointment');

// Info message
toast.info('Processing your request...');

// Warning message
toast.warning('Please fill all required fields');

// With custom options
toast.success('Saved!', {
  duration: 5000,              // 5 seconds
  position: 'top-right'        // 'top-right' | 'top-center' | 'bottom-right' etc.
});
```

## 🔌 REST API Endpoints

### `GET /api/appointments`
**Query Parameters:**
- `sort` (optional): `-created_date` for descending, `created_date` for ascending

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "apt-123",
      "patient_name": "John Doe",
      "patient_email": "john@example.com",
      "symptoms": "Fever and headache",
      "requested_doctor_name": "Dr. Smith",
      "appointment_time": "2024-01-15T14:30:00",
      "priority": "medium",
      "status": "pending",
      "created_date": "2024-01-10T09:00:00",
      "updated_at": "2024-01-10T09:00:00"
    }
  ]
}
```

### `POST /api/appointments`
**Request Body:**
```json
{
  "patient_name": "John Doe",
  "patient_email": "john@example.com",
  "symptoms": "Fever and headache",
  "requested_doctor_name": "Dr. Smith",
  "appointment_time": "2024-01-15T14:30:00",
  "priority": "medium",
  "status": "pending"
}
```

### `PATCH /api/appointments/:id`
**Request Body:** (any fields to update)
```json
{
  "status": "confirmed",
  "appointment_time": "2024-01-16T10:00:00"
}
```

### `DELETE /api/appointments/:id`
**Response:**
```json
{
  "success": true
}
```

### `GET /api/appointments/stream`
Server-Sent Events endpoint. Returns:
- `init` event: Initial snapshot of all appointments
- `created` event: New appointment created
- `updated` event: Appointment updated
- `deleted` event: Appointment deleted
- `ping` event: Heartbeat every 25 seconds

## 🚀 Quick Start Checklist

- [ ] Copy `database-appointments.js` code to your database.js
- [ ] Copy `server-appointments.js` code to your server.js
- [ ] Start backend server: `node server.js`
- [ ] Copy `appointmentClient.ts` to your patient portal
- [ ] Copy `toast.ts` to your patient portal
- [ ] Import both in your booking form component
- [ ] Call `appointmentClient.createAppointment()` on form submit
- [ ] Add toast notifications for success/error feedback
- [ ] (Optional) Connect to SSE for real-time updates
- [ ] Test end-to-end: Patient books → Doctor receives notification

## 🔄 Data Flow

```
Patient Portal                Backend                    Doctor Portal
──────────────                ────────                   ─────────────
     │                           │                            │
     │  POST /appointments       │                            │
     ├──────────────────────────>│                            │
     │                           │                            │
     │                    [Save to SQLite]                    │
     │                           │                            │
     │  201 Created              │                            │
     │<──────────────────────────┤                            │
     │                           │                            │
     │                           │  SSE: 'created' event      │
     │                           ├───────────────────────────>│
     │                           │                            │
     │                           │              [Toast + Sound Notification]
     │                           │                            │
```

## 💡 Tips & Best Practices

1. **Always use ISO 8601 format** for `appointment_time`: `2024-01-15T14:30:00`
2. **Check backend connection** before submitting forms
3. **Show loading states** during API calls
4. **Handle errors gracefully** with toast notifications
5. **Auto-reconnect SSE** is built-in (5 second delay)
6. **Keep backend running** for real-time features to work
7. **Use TypeScript** for type safety with the client

## 🐛 Troubleshooting

**Problem:** 404 errors on `/api/appointments`
- **Solution:** Make sure backend server is running (`node server.js`)

**Problem:** CORS errors
- **Solution:** Backend already has `app.use(cors())` - ensure it's enabled

**Problem:** Toast notifications not showing
- **Solution:** Verify `toast.ts` is imported and called correctly

**Problem:** Real-time updates not working
- **Solution:** Check `connectToUpdates()` is called and SSE endpoint is accessible

**Problem:** Appointment time format errors
- **Solution:** Use ISO 8601 format: `new Date().toISOString()` or `YYYY-MM-DDTHH:mm:ss`

## 📞 Integration Support

For issues or questions:
1. Check browser console for error messages
2. Verify backend logs for API errors
3. Test endpoints with curl or Postman
4. Ensure database file has write permissions

---

**Created:** January 2024  
**Backend Port:** 5000  
**Database:** SQLite (hospital.db)  
**Real-time:** Server-Sent Events (SSE)
