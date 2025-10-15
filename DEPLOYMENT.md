# GRAMAAI Deployment Guide

## 🚀 Netlify Deployment Strategy

### Current Setup
- **Main Site**: https://gramaai.netlify.app (Landing Page)
- **Hospital Portal**: Deploy separately from `Hospital/` folder
- **Patient Portal**: Deploy separately from `PaitentsPage/` folder

### Deployment Instructions

#### 1. Main Landing Page (Current)
- ✅ Already configured in root `netlify.toml`
- Builds from `LandingPage1/` directory
- Publishes to `LandingPage1/out/`
- Includes SPA routing via `_redirects`

#### 2. Hospital Portal (Separate Site)
```
Site Name: gramaai-hospital
Base Directory: Hospital
Build Command: npm install && npm run build
Publish Directory: dist
```

#### 3. Patient Portal (Separate Site)
```
Site Name: gramaai-patients  
Base Directory: PaitentsPage
Build Command: npm install && npm run build
Publish Directory: out
```

### 🔧 Configuration Files

Each app has its own `netlify.toml` and `public/_redirects` for proper SPA routing.

### 🌐 Final URLs Structure
- Landing: https://gramaai.netlify.app
- Hospital: https://gramaai-hospital.netlify.app  
- Patients: https://gramaai-patients.netlify.app

### 🛠️ Build Status
- ✅ LandingPage1 - Built and ready
- ✅ Hospital - Built with _redirects  
- ✅ PaitentsPage - Built with _redirects
- ❌ Backend - Needs deployment to Render.com

### 📝 Next Steps
1. Deploy Hospital and Patient portals as separate Netlify sites
2. Deploy backend to Render.com
3. Update API URLs in production environment variables