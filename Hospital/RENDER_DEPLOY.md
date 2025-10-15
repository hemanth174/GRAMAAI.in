# 🚀 Hospital Backend Deployment Guide - Render.com

## 📋 Quick Setup Steps

### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub (recommended)

### 2. Deploy from GitHub
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select repository: `hemanth174/GRAMAAI.in`
4. Configure deployment:

```
Name: gramaai-hospital-backend
Region: Oregon (US West)
Branch: main
Runtime: Node
Build Command: cd Hospital && npm ci && npm rebuild
Start Command: cd Hospital && node server.js
```

### 3. Environment Variables
Add these in Render dashboard:

```
NODE_ENV = production
PORT = 10000
CORS_ORIGIN = https://gramaai.netlify.app,https://gramaai-hospital.netlify.app,https://gramaai-patients.netlify.app
```

### 4. Deploy!
- Click "Create Web Service"
- Render will automatically deploy from your GitHub repo
- Build takes ~2-5 minutes
- You'll get a URL like: `https://gramaai-hospital-backend.onrender.com`

## 🔧 After Deployment

### Update Frontend API URLs
Replace localhost URLs in your frontend apps:

**Hospital Portal** (`Hospital/src/api/base44Client.js`):
```javascript
return 'https://gramaai-hospital-backend.onrender.com';
```

**Patient Portal** (`PaitentsPage/src/api/appointmentClient.ts`):
```javascript
const API_BASE_URL = 'https://gramaai-hospital-backend.onrender.com';
```

## 🧪 Testing
- Backend URL: `https://your-app-name.onrender.com`
- Health check: `https://your-app-name.onrender.com/api/appointments`
- CORS enabled for all your frontend domains

## 💡 Features Included
- ✅ SQLite database (persistent storage)
- ✅ CORS configured for your domains
- ✅ Appointment management API
- ✅ Real-time SSE streaming
- ✅ Email notifications ready
- ✅ Production optimized

## 🔄 Auto-Deploy
Render automatically redeploys when you push to GitHub main branch!

---
**Cost**: Free tier (with some limitations)  
**Upgrade**: $7/month for better performance