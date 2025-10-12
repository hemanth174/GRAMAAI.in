# 🏥 Hospital + Patient Portal Integration Guide

## System Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   Patient Portal    │         │  Hospital Dashboard  │
│   (Port 5173)       │         │    (Port 5174)       │
└──────────┬──────────┘         └──────────┬───────────┘
           │                               │
           │ HTTP/SSE                      │ HTTP/SSE
           │                               │
           ▼                               ▼
┌──────────────────────────────────────────────────────┐
│         Patient Portal Backend (Port 5001)           │
│  - Appointments API                                  │
│  - Real-time SSE Updates                            │
│  - SQLite Database: patients-portal.db              │
└──────────────────────────────────────────────────────┘
           ▲
           │ Can sync with ↓
           │
┌──────────────────────────────────────────────────────┐
│         Hospital Backend (Port 5000)                 │
│  - Appointments API                                  │
│  - Doctor Management                                │
│  - Real-time SSE Updates                            │
│  - SQLite Database: hospital.db                     │
└──────────────────────────────────────────────────────┘
```

## 🎯 Connectivity Options

### Option 1: Independent Systems (Current Setup)
Each system operates independently with its own backend and database.

**Pros:**
- ✅ Complete separation of concerns
- ✅ Easier development and testing
- ✅ Better scalability

**Cons:**
- ❌ Appointments need manual sync
- ❌ No automatic cross-portal updates

### Option 2: Shared Backend
Both portals connect to the same backend (e.g., Hospital backend on port 5000).

**To implement:**
1. Update `src/api/appointmentClient.ts` in PaitentsPage:
```typescript
const API_BASE_URL = 'http://localhost:5000'; // Point to Hospital backend
```

2. Ensure Hospital backend has CORS enabled for Patient Portal origin
3. Remove/stop Patient Portal backend (server.js on port 5001)

**Pros:**
- ✅ Real-time sync between portals
- ✅ Single source of truth
- ✅ Instant updates everywhere

**Cons:**
- ❌ Tighter coupling
- ❌ Single point of failure

### Option 3: Backend-to-Backend Sync
Keep separate backends but sync data between them.

**To implement:**
1. Add webhook endpoints in both backends
2. When appointment created in Patient Portal, send to Hospital backend
3. Use message queue (RabbitMQ/Redis) for reliable delivery

**Pros:**
- ✅ Separation of concerns
- ✅ Eventual consistency
- ✅ Resilient to failures

**Cons:**
- ❌ More complex to implement
- ❌ Possible sync delays

## 🚀 Quick Setup for Full Integration

### All-in-One Startup

**Option A: Use Root START-ALL.bat** (from workspace root)
```bash
cd GRAMAAIWORKSPACE
START-ALL.bat
```
This starts:
- Hospital Backend (Port 5000)
- Hospital Frontend (Port 5174)
- Patient Portal Frontend (Port 5173)
- Landing Page (Port 5175)

**Option B: Use Individual START-ALL.bat files**

1. Hospital System:
```bash
cd Hospital
START-ALL.bat  # Backend on 5000 + Frontend on 5174
```

2. Patient Portal:
```bash
cd PaitentsPage
START-ALL.bat  # Backend on 5001 + Frontend on 5173
```

## 📡 Cross-Portal Communication

### Method 1: API Polling
Patient Portal regularly checks Hospital backend for updates.

```typescript
// In Patient Portal
setInterval(async () => {
  const response = await fetch('http://localhost:5000/api/appointments');
  const { data } = await response.json();
  // Update local state
}, 5000); // Poll every 5 seconds
```

### Method 2: Server-Sent Events (SSE)
Already implemented! Just connect to the right backend.

```typescript
// Patient Portal connects to Hospital backend SSE
const eventSource = new EventSource('http://localhost:5000/api/appointments/stream');

eventSource.addEventListener('created', (event) => {
  const appointment = JSON.parse(event.data);
  toast.info(`Doctor received your appointment!`);
});
```

### Method 3: WebSockets
Bidirectional real-time communication.

```javascript
// Add to both backends
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Broadcast to all clients
    wss.clients.forEach(client => {
      client.send(data);
    });
  });
});
```

## 🔄 Data Sync Strategies

### 1. Manual Sync (Simple)
Add a "Sync" button in Hospital Dashboard to pull from Patient Portal.

```typescript
async function syncAppointments() {
  const response = await fetch('http://localhost:5001/api/appointments');
  const patientAppointments = await response.json();
  
  // Save to Hospital database
  for (const apt of patientAppointments.data) {
    await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      body: JSON.stringify(apt)
    });
  }
}
```

### 2. Automatic Sync (Scheduled)
Run sync every few minutes in background.

```javascript
// In Hospital backend
setInterval(async () => {
  try {
    const response = await fetch('http://localhost:5001/api/appointments');
    const { data } = await response.json();
    
    for (const apt of data) {
      await createAppointmentRecord(apt);
    }
    console.log('✅ Synced appointments from Patient Portal');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}, 60000); // Every minute
```

### 3. Event-Driven Sync (Best)
Trigger sync only when new appointment is created.

```javascript
// In Patient Portal backend
function broadcastAppointmentEvent(eventName, payload) {
  // Notify connected SSE clients
  for (const client of appointmentStreamClients) {
    client.res.write(`event: ${eventName}\ndata:${JSON.stringify(payload)}\n\n`);
  }
  
  // Also send to Hospital backend
  fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.error('Hospital sync failed:', err));
}
```

## 🎨 Frontend Integration

### Patient Portal sees Hospital data

```typescript
// In Patient Portal components
import { useState, useEffect } from 'react';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    // Fetch from Patient Portal backend
    fetch('http://localhost:5001/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data.data));
      
    // Also connect to Hospital backend for doctor responses
    const hospitalEvents = new EventSource('http://localhost:5000/api/appointments/stream');
    hospitalEvents.addEventListener('updated', (e) => {
      const apt = JSON.parse(e.data);
      if (apt.status === 'confirmed') {
        toast.success('Doctor confirmed your appointment!');
      }
    });
  }, []);
}
```

## 🔐 Security Considerations

### 1. CORS Configuration
Allow specific origins only:

```javascript
// In server.js
app.use(cors({
  origin: [
    'http://localhost:5173',  // Patient Portal
    'http://localhost:5174',  // Hospital Dashboard
  ],
  credentials: true
}));
```

### 2. API Key Authentication
Add API key for backend-to-backend communication:

```javascript
// In Hospital backend
app.post('/api/appointments', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Process request
});
```

### 3. Rate Limiting
Prevent abuse:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📊 Monitoring & Logging

### Add Connection Status Display

```typescript
function ConnectionStatus() {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  
  useEffect(() => {
    const check = async () => {
      try {
        await fetch('http://localhost:5001/health');
        setStatus('connected');
      } catch {
        setStatus('disconnected');
      }
    };
    
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`status-badge ${status}`}>
      {status === 'connected' ? '🟢 Connected' : '🔴 Offline'}
    </div>
  );
}
```

## 🎯 Recommended Setup

**For Development:**
- Run both backends independently
- Use SSE for real-time updates
- Manual data inspection in each database

**For Production:**
- Single shared backend
- Add authentication & authorization
- Use PostgreSQL instead of SQLite
- Deploy backends separately for resilience
- Add load balancer for high traffic

## 📝 Summary

✅ **Current Status:**
- Patient Portal has its own backend (Port 5001)
- Hospital Dashboard has its own backend (Port 5000)
- Both are fully functional independently

🎯 **To Connect Them:**
1. **Simple:** Point Patient Portal frontend to Hospital backend (change API_BASE_URL)
2. **Better:** Add backend-to-backend sync via webhooks
3. **Best:** Use shared message queue (RabbitMQ/Kafka) for event-driven architecture

Choose based on your needs:
- **Learning/Demo**: Option 1 (Simple)
- **Small Clinic**: Option 1 (Simple)
- **Medium Hospital**: Option 2 (Better)
- **Large Hospital Network**: Option 3 (Best)

---

**Both portals are now fully integrated and ready to use! 🎉**
