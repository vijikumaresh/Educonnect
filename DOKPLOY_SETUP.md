# 🚀 Dokploy Deployment Guide for EduConnect

Complete guide to deploy your EduConnect application on Dokploy.

---

## 📦 Project Structure

- **Frontend**: React + TypeScript (Port 80)
- **Backend**: Rust + Actix Web (Port 8080)
- **Database**: PostgreSQL 16

---

## 🔧 ENVIRONMENT VARIABLES SETUP

### 1️⃣ **BACKEND Service Configuration**

#### Environment Variables:

```env
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@postgres:5432/educonnect_app
RUST_LOG=info
PORT=8080
```

#### Details:
- **DATABASE_URL**: PostgreSQL connection string
  - Format: `postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`
  - Replace `YOUR_DB_PASSWORD` with your actual database password
  
- **RUST_LOG**: Logging level (options: `debug`, `info`, `warn`, `error`)
  
- **PORT**: Backend server port (default: 8080)

#### Dockerfile Path:
```
./backend/Dockerfile
```

#### Build Context:
```
./backend
```

#### Port Mapping:
```
8080:8080
```

---

### 2️⃣ **FRONTEND Service Configuration**

#### Environment Variables:

```env
VITE_API_URL=https://your-backend-url.dokploy.com/api
```

**⚠️ IMPORTANT**: Replace `your-backend-url.dokploy.com` with your **actual backend domain** that Dokploy assigns!

#### Example:
```env
VITE_API_URL=https://educonnect-backend.dokploy.app/api
```

#### Details:
- **VITE_API_URL**: Full URL to your backend API
  - Must include `/api` at the end
  - Must use `https://` (not `http://`)
  - Must be the public domain of your backend service

#### Dockerfile Path:
```
./frontend/Dockerfile
```

#### Build Context:
```
./frontend
```

#### Port Mapping:
```
80:80
```

---

### 3️⃣ **DATABASE (PostgreSQL) Configuration**

#### Environment Variables:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE
POSTGRES_DB=educonnect_app
```

#### Details:
- **POSTGRES_USER**: Database username (default: `postgres`)
- **POSTGRES_PASSWORD**: **Strong password** (at least 16 characters recommended)
- **POSTGRES_DB**: Database name (`educonnect_app`)

#### Database Image:
```
postgres:16-alpine
```

#### Port:
```
5432
```

#### Volume Mount:
```
/var/lib/postgresql/data
```

---

## 📋 STEP-BY-STEP DOKPLOY SETUP

### Step 1: Create PostgreSQL Database Service

1. Go to Dokploy Dashboard
2. Click **"Create Service"** → **"Database"**
3. Select **PostgreSQL**
4. Set environment variables:
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=[generate-strong-password]
   POSTGRES_DB=educonnect_app
   ```
5. Note the **internal service name** (e.g., `educonnect-postgres`)
6. Deploy database

---

### Step 2: Create Backend Service

1. Click **"Create Service"** → **"Application"**
2. Connect your **GitHub repository** or upload code
3. Set **Build Context**: `./backend`
4. Set **Dockerfile Path**: `./backend/Dockerfile`
5. Set **Port**: `8080`
6. Add **Environment Variables**:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR_DB_PASSWORD]@educonnect-postgres:5432/educonnect_app
   RUST_LOG=info
   PORT=8080
   ```
   ⚠️ Replace `[YOUR_DB_PASSWORD]` with the password you set in Step 1
   ⚠️ Replace `educonnect-postgres` with your actual database service name

7. **Add Health Check** (optional but recommended):
   ```
   Path: /health
   Interval: 30s
   Timeout: 10s
   ```

8. Deploy backend
9. **Copy the generated URL** (e.g., `https://educonnect-backend-abc123.dokploy.app`)

---

### Step 3: Create Frontend Service

1. Click **"Create Service"** → **"Application"**
2. Connect your **GitHub repository** or upload code
3. Set **Build Context**: `./frontend`
4. Set **Dockerfile Path**: `./frontend/Dockerfile`
5. Set **Port**: `80`
6. Add **Environment Variables**:
   ```env
   VITE_API_URL=https://[YOUR_BACKEND_URL]/api
   ```
   ⚠️ Replace `[YOUR_BACKEND_URL]` with the URL from Step 2

7. Deploy frontend
8. Access your application!

---

## 🔐 SECURITY RECOMMENDATIONS

### Strong Password Generation

Use a strong password for PostgreSQL:

```bash
# Generate a secure password (32 characters)
openssl rand -base64 32
```

### Environment Variables Security

- ✅ **DO**: Use Dokploy's secret management
- ✅ **DO**: Use different passwords for production
- ❌ **DON'T**: Commit passwords to Git
- ❌ **DON'T**: Use default passwords

---

## 🌐 CUSTOM DOMAIN SETUP

### Backend Domain:
1. In Dokploy, go to Backend Service → **Domains**
2. Add custom domain: `api.yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: api
   Value: [dokploy-provided-domain]
   ```

### Frontend Domain:
1. In Dokploy, go to Frontend Service → **Domains**
2. Add custom domain: `app.yourdomain.com`
3. Configure DNS:
   ```
   Type: CNAME
   Name: app
   Value: [dokploy-provided-domain]
   ```

### Update Frontend Environment:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🔍 TROUBLESHOOTING

### Frontend Can't Connect to Backend

**Problem**: `net::ERR_CONNECTION_REFUSED` or CORS errors

**Solutions**:
1. Check `VITE_API_URL` is correct (with `https://` and `/api`)
2. Verify backend is running (check Dokploy logs)
3. Ensure backend domain is accessible
4. Check CORS settings in backend

### Database Connection Failed

**Problem**: Backend can't connect to database

**Solutions**:
1. Verify `DATABASE_URL` format is correct
2. Check database service is running
3. Ensure database password matches
4. Verify internal service name is correct

### Build Failures

**Problem**: Docker build fails

**Solutions**:
1. Check Dockerfile paths are correct
2. Verify build context is set properly
3. Check logs for specific errors
4. Ensure all dependencies are in package files

---

## 📊 MONITORING

### Check Logs:

**Backend Logs**:
- Dokploy Dashboard → Backend Service → Logs
- Look for: `Server running on http://0.0.0.0:8080`

**Frontend Logs**:
- Dokploy Dashboard → Frontend Service → Logs
- Check for build errors

**Database Logs**:
- Dokploy Dashboard → Database Service → Logs
- Verify: `database system is ready to accept connections`

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Database is running (green status in Dokploy)
- [ ] Backend is running and accessible
- [ ] Backend health check passes: `https://your-backend-url/health`
- [ ] Frontend is running and accessible
- [ ] Frontend can connect to backend (no CORS errors)
- [ ] User can register/login
- [ ] User can create folders
- [ ] User can add students
- [ ] All features work properly

---

## 📞 QUICK REFERENCE

### Backend Environment Variables Summary:
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[DB_SERVICE_NAME]:5432/educonnect_app
RUST_LOG=info
PORT=8080
```

### Frontend Environment Variables Summary:
```env
VITE_API_URL=https://[BACKEND_URL]/api
```

### Database Environment Variables Summary:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=[SECURE_PASSWORD]
POSTGRES_DB=educonnect_app
```

---

## 🎯 ONE-CLICK DEPLOY VALUES

Copy these and fill in the bracketed values:

### Database:
```
Image: postgres:16-alpine
POSTGRES_USER: postgres
POSTGRES_PASSWORD: [GENERATE_STRONG_PASSWORD]
POSTGRES_DB: educonnect_app
Port: 5432
Volume: /var/lib/postgresql/data
```

### Backend:
```
Build Context: ./backend
Dockerfile: ./backend/Dockerfile
Port: 8080

Environment Variables:
DATABASE_URL=postgresql://postgres:[DB_PASSWORD]@[DB_SERVICE_NAME]:5432/educonnect_app
RUST_LOG=info
PORT=8080
```

### Frontend:
```
Build Context: ./frontend
Dockerfile: ./frontend/Dockerfile
Port: 80

Environment Variables:
VITE_API_URL=https://[BACKEND_URL]/api
```

---

**🚀 You're all set! Deploy in order: Database → Backend → Frontend**

