# 🎯 Dokploy Environment Settings - Visual Guide

## 📋 Complete Setup Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Step 1: DATABASE
   │
   ├─ Service Type: PostgreSQL Database
   ├─ Image: postgres:16-alpine
   ├─ Port: 5432
   │
   └─ Environment Variables:
      • POSTGRES_USER = postgres
      • POSTGRES_PASSWORD = [Generate Strong Password - Save This!]
      • POSTGRES_DB = educonnect_app
   
   ✅ Deploy & Note Service Name: ___________________________

───────────────────────────────────────────────────────────────────

Step 2: BACKEND
   │
   ├─ Service Type: Application (Docker)
   ├─ Repository: Connect your GitHub repo
   ├─ Build Context: ./backend
   ├─ Dockerfile Path: ./backend/Dockerfile
   ├─ Port: 8080
   │
   └─ Environment Variables:
      • DATABASE_URL = postgresql://postgres:[STEP1_PASSWORD]@[STEP1_SERVICE_NAME]:5432/educonnect_app
      • RUST_LOG = info
      • PORT = 8080
   
   Example DATABASE_URL:
   postgresql://postgres:mySecurePass123@educonnect-postgres:5432/educonnect_app
                        └──────┬──────┘  └────────┬────────┘
                           Step 1         Step 1 Service
                          Password            Name
   
   ✅ Deploy & Copy Generated URL: ___________________________

───────────────────────────────────────────────────────────────────

Step 3: FRONTEND
   │
   ├─ Service Type: Application (Docker)
   ├─ Repository: Connect your GitHub repo
   ├─ Build Context: ./frontend
   ├─ Dockerfile Path: ./frontend/Dockerfile
   ├─ Port: 80
   │
   └─ Environment Variables:
      • VITE_API_URL = https://[STEP2_URL]/api
                                         └──┬──┘
                                     MUST INCLUDE /api
   
   Example VITE_API_URL:
   https://educonnect-backend-abc123.dokploy.app/api
          └────────────────┬────────────────┘
                  Step 2 Backend URL
   
   ⚠️  CRITICAL: Include /api at the end!
   ⚠️  MUST use https:// (not http://)
   
   ✅ Deploy & Access Your App! 🎉
```

---

## 🔐 Password Generation

Generate a secure password for PostgreSQL:

```bash
# Option 1: Using openssl (32 characters)
openssl rand -base64 32

# Option 2: Using random
head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32

# Example output:
aB3$xK9mP2qR7vL5nW8jT4cY6fZ1dH0e
```

**Save this password!** You'll need it for the backend DATABASE_URL.

---

## 📝 Fill-in-the-Blanks Template

### For Database Service:
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=____________________________________
POSTGRES_DB=educonnect_app
```

### For Backend Service:
```
DATABASE_URL=postgresql://postgres:[PASTE_DB_PASSWORD]@[PASTE_DB_SERVICE_NAME]:5432/educonnect_app
RUST_LOG=info
PORT=8080
```

### For Frontend Service:
```
VITE_API_URL=https://[PASTE_BACKEND_URL]/api
```

---

## 🎨 Architecture Diagram

```
┌──────────────┐
│   FRONTEND   │  Port: 80
│  (React/TS)  │  Env: VITE_API_URL
└──────┬───────┘
       │
       │ HTTPS Request
       │ (to /api endpoints)
       ↓
┌──────────────┐
│   BACKEND    │  Port: 8080
│  (Rust API)  │  Env: DATABASE_URL, RUST_LOG
└──────┬───────┘
       │
       │ PostgreSQL Connection
       │ (internal network)
       ↓
┌──────────────┐
│  DATABASE    │  Port: 5432
│ (PostgreSQL) │  Env: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
└──────────────┘
```

---

## ⚡ Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `VITE_API_URL=https://backend.com` | `VITE_API_URL=https://backend.com/api` |
| `DATABASE_URL=...@localhost:5432/...` | `DATABASE_URL=...@educonnect-postgres:5432/...` |
| `VITE_API_URL=http://backend.com/api` | `VITE_API_URL=https://backend.com/api` |
| Forgetting to save DB password | Write it down before deploying! |

---

## 🧪 Testing After Deployment

### 1. Test Database Connection
In Dokploy, check Database logs for:
```
✅ "database system is ready to accept connections"
```

### 2. Test Backend API
Visit: `https://your-backend-url/health`
Should return:
```json
{"status": "ok"}
```

### 3. Test Frontend
Visit: `https://your-frontend-url`
- Should load the login page
- Open browser console (F12)
- Should see NO errors about "Failed to fetch"

### 4. Test Full Flow
1. Register a new user
2. Login
3. Create a folder
4. Add a student
5. View the student list

If all steps work → **Deployment Successful!** 🎉

---

## 🆘 Troubleshooting Guide

### Problem: Frontend shows "Failed to fetch"

**Diagnosis:**
- Open browser console (F12)
- Check Network tab
- Look for failed API calls

**Solutions:**
1. Verify `VITE_API_URL` in Dokploy frontend settings
2. Ensure it ends with `/api`
3. Ensure it uses `https://` (not `http://`)
4. Check backend is running (green status in Dokploy)

---

### Problem: Backend won't start

**Diagnosis:**
- Check Dokploy backend logs
- Look for "Database connection failed"

**Solutions:**
1. Verify `DATABASE_URL` format
2. Check database service name matches
3. Verify password is correct
4. Ensure database is running

---

### Problem: Database connection error

**Diagnosis:**
- Backend logs show: "role does not exist" or "authentication failed"

**Solutions:**
1. Check `POSTGRES_PASSWORD` matches in both services
2. Verify `POSTGRES_USER=postgres`
3. Ensure `POSTGRES_DB=educonnect_app`

---

## 🎯 Summary: What You Need

### Before Deploying:
- [ ] GitHub repository connected to Dokploy
- [ ] Strong password generated (saved somewhere safe)
- [ ] Understood the 3-step deployment order

### During Database Deployment:
- [ ] Service name noted
- [ ] Password saved

### During Backend Deployment:
- [ ] DATABASE_URL uses database service name
- [ ] DATABASE_URL uses correct password
- [ ] Backend URL copied after deployment

### During Frontend Deployment:
- [ ] VITE_API_URL uses backend URL
- [ ] VITE_API_URL includes `/api` suffix
- [ ] VITE_API_URL uses `https://`

### After All Deployments:
- [ ] All services show green (running) status
- [ ] Health check passes
- [ ] Can access frontend URL
- [ ] Can register/login successfully

---

## 📞 Need Help?

Refer to:
- 📚 Full Guide: `DOKPLOY_SETUP.md`
- 📋 Quick Reference: `DOKPLOY_QUICK_REFERENCE.txt`
- 📝 Environment Examples: `ENV_EXAMPLES.md`

---

**You're ready to deploy! Follow the steps carefully and you'll have your app running in no time! 🚀**

