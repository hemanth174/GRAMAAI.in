# 🚀 Quick Reference Card - Patient Portal Integration

## ⚡ Quick Start (30 seconds)

```batch
cd PaitentsPage
START-ALL.bat
```

**Open in browser:** http://localhost:5173

---

## 📦 What You Got

| Component | Location | Purpose |
|-----------|----------|---------|
| **Backend API** | `server.js` (Port 5001) | Appointment management |
| **Database** | `database.js` → `patients-portal.db` | Data storage |
| **API Client** | `src/api/appointmentClient.ts` | Frontend ↔ Backend |
| **Toast** | `src/utils/toast.ts` | Notifications |
| **Booking Form** | `src/pages/book-appointment/page.tsx` | User interface |

---

## 🎯 Common Commands

### Start Backend Only
```batch
cd PaitentsPage
node server.js
```

### Start Frontend Only
```batch
cd PaitentsPage
npm run dev
```

### Install Backend Dependencies
```batch
cd PaitentsPage
npm install express cors sqlite3 sqlite
```

### Check Backend Health
```
http://localhost:5001/health
```

---

## 📡 API Quick Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| List appointments | GET | `/api/appointments` |
| Create appointment | POST | `/api/appointments` |
| Update appointment | PATCH | `/api/appointments/:id` |
| Delete appointment | DELETE | `/api/appointments/:id` |
| Real-time stream | GET | `/api/appointments/stream` |

**Base URL:** `http://localhost:5001`

---

## 💻 Code Snippets

### Create Appointment
```typescript
import { appointmentClient } from '@/api/appointmentClient';
import { toast } from '@/utils/toast';

const appointment = await appointmentClient.createAppointment({
  patient_name: 'John Doe',
  symptoms: 'Fever',
  requested_doctor_name: 'Dr. Smith',
  appointment_time: '2025-10-15T14:30:00',
  priority: 'medium'
});

toast.success('Appointment booked!');
```

### Show Toast
```typescript
import { toast } from '@/utils/toast';

toast.success('Success message!');
toast.error('Error message!');
toast.info('Info message!');
toast.warning('Warning message!');
```

### Check Connection
```typescript
import { checkBackendConnection } from '@/api/appointmentClient';

const isConnected = await checkBackendConnection();
console.log(isConnected ? '✅ Connected' : '❌ Offline');
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5001 already in use | Change port in `server.js` |
| Can't connect to backend | Check if backend is running: `http://localhost:5001/health` |
| CORS errors | Verify CORS is enabled in `server.js` |
| Database locked | Close other connections to `patients-portal.db` |
| No toast showing | Check if `toast.ts` is imported correctly |

---

## 📊 Ports Overview

| Service | Port | URL |
|---------|------|-----|
| Patient Portal Backend | 5001 | http://localhost:5001 |
| Patient Portal Frontend | 5173 | http://localhost:5173 |
| Hospital Backend | 5000 | http://localhost:5000 |
| Hospital Frontend | 5174 | http://localhost:5174 |
| Landing Page | 5175 | http://localhost:5175 |

---

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend shows green "Connected" status
- [ ] Can book appointment successfully
- [ ] Toast notifications appear
- [ ] Database file `patients-portal.db` exists
- [ ] Console shows `✅ Appointment created`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `INTEGRATION_README.md` | Complete setup guide |
| `INTEGRATION_COMPLETE.md` | Summary of what was done |
| `VISUAL_INTEGRATION_MAP.md` | Architecture diagrams |
| `CONNECTIVITY_GUIDE.md` | Hospital integration |

---

## 🔗 Connect to Hospital Dashboard

**Quick Method:**
1. Open `src/api/appointmentClient.ts`
2. Change `API_BASE_URL` to `http://localhost:5000`
3. Restart frontend

Now Patient Portal → Hospital Backend ✅

**See:** `CONNECTIVITY_GUIDE.md` for more options

---

## 🎨 File Locations

```
PaitentsPage/
├── database.js              ← Database layer
├── server.js                ← API server
├── src/
│   ├── api/
│   │   └── appointmentClient.ts  ← API client
│   ├── utils/
│   │   └── toast.ts             ← Notifications
│   └── pages/
│       └── book-appointment/
│           └── page.tsx         ← Booking form
└── START-ALL.bat            ← Start everything
```

---

## 🚨 Emergency Commands

### Stop Everything
```batch
# Press Ctrl+C in each terminal window
# OR close all command prompt windows
```

### Reset Database
```batch
cd PaitentsPage
del patients-portal.db
node server.js  # Will recreate database
```

### Reinstall Dependencies
```batch
cd PaitentsPage
rmdir /s /q node_modules
npm install
npm install express cors sqlite3 sqlite
```

---

## 📞 Quick Help

**Backend not responding?**
```batch
curl http://localhost:5001/health
# Should return: {"status":"ok","service":"Patient Portal Backend",...}
```

**Check if port is in use:**
```batch
netstat -ano | findstr :5001
```

**View database:**
```bash
# Install SQLite CLI or use DB Browser for SQLite
sqlite3 patients-portal.db
.tables
SELECT * FROM appointments;
```

---

## 💡 Pro Tips

1. **Development:** Keep both backend and frontend terminals open to see logs
2. **Testing:** Open multiple browser tabs to test real-time updates
3. **Debugging:** Use browser DevTools → Network tab to inspect API calls
4. **Database:** Use DB Browser for SQLite to view/edit data visually
5. **Production:** Use PM2 or similar to run backend as service

---

## 🎯 One-Liners

**Full reset:**
```batch
cd PaitentsPage && del patients-portal.db && rmdir /s /q node_modules && npm install && START-ALL.bat
```

**Quick test:**
```batch
curl -X POST http://localhost:5001/api/appointments -H "Content-Type: application/json" -d "{\"patient_name\":\"Test\",\"symptoms\":\"Test\",\"appointment_time\":\"2025-10-15T14:30:00\",\"requested_doctor_name\":\"Dr. Test\"}"
```

**Check logs:**
```batch
# Backend: Check terminal running server.js
# Frontend: Browser F12 → Console
```

---

**Keep this card handy for quick reference! 📌**

*Last updated: October 12, 2025*
