# URL Updates Summary

## ✅ Updated Files

### 1. Frontend Configuration

#### `frontend/vite.config.ts`
- ✅ Added server configuration with port 5173
- ✅ Added proxy configuration for API requests in development
- ✅ Configured build settings for production

#### `frontend/src/services/api.ts`
- ✅ Updated to use production URL: `https://educonnectapi.kattral.ai/api`
- ✅ Falls back to `http://localhost:8080/api` in development
- ✅ Updated error messages to show correct backend URL based on environment

#### `frontend/public/troubleshoot.html`
- ✅ Updated backend URL display to show both production and development URLs

### 2. Backend Configuration

#### `backend/src/main.rs`
- ✅ Added CORS support for `https://registerstudents.kattral.ai`
- ✅ Maintains localhost support for development
- ✅ Configured to allow both production and development origins

---

## 🌐 Production URLs

| Service | Production URL | Development URL |
|---------|--------------|-----------------|
| **Frontend** | `https://registerstudents.kattral.ai` | `http://localhost:5173` |
| **Backend API** | `https://educonnectapi.kattral.ai/api` | `http://localhost:8080/api` |
| **Health Check** | `https://educonnectapi.kattral.ai/health` | `http://localhost:8080/health` |

---

## 🔧 Environment Variables

### Frontend

Create `.env.production` in `frontend/` directory:
```bash
VITE_API_URL=https://educonnectapi.kattral.ai/api
```

Create `.env.development` in `frontend/` directory (optional):
```bash
VITE_API_URL=http://localhost:8080/api
```

### Backend

Update `.env` in `backend/` directory:
```bash
ALLOWED_ORIGINS=https://registerstudents.kattral.ai,http://localhost:5173,http://localhost:5174
```

---

## 📝 How It Works

### Development Mode
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:8080`
- Frontend automatically uses `http://localhost:8080/api` for API calls
- CORS allows localhost origins

### Production Mode
- Frontend deployed at `https://registerstudents.kattral.ai`
- Backend deployed at `https://educonnectapi.kattral.ai`
- Frontend uses `https://educonnectapi.kattral.ai/api` for API calls
- CORS allows `https://registerstudents.kattral.ai` origin

---

## 🚀 Deployment Steps

1. **Set Frontend Environment Variable:**
   ```bash
   cd frontend
   echo "VITE_API_URL=https://educonnectapi.kattral.ai/api" > .env.production
   ```

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Deploy Frontend:**
   - Deploy `dist/` folder to `registerstudents.kattral.ai`

4. **Set Backend Environment Variables:**
   ```bash
   cd backend
   # Add to .env file:
   ALLOWED_ORIGINS=https://registerstudents.kattral.ai,http://localhost:5173
   ```

5. **Deploy Backend:**
   - Deploy backend to `educonnectapi.kattral.ai`
   - Ensure SSL certificates are configured

---

## ✅ Verification

### Test Production URLs

**Frontend:**
```bash
curl https://registerstudents.kattral.ai
```

**Backend Health:**
```bash
curl https://educonnectapi.kattral.ai/health
# Should return: OK
```

**Backend API:**
```bash
curl https://educonnectapi.kattral.ai/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

---

## 📋 Checklist

- [x] Frontend API URL updated in `api.ts`
- [x] Frontend vite.config.ts updated
- [x] Backend CORS updated for production domain
- [x] Error messages updated with correct URLs
- [x] Troubleshoot page updated
- [ ] SSL certificates configured
- [ ] Environment variables set in production
- [ ] Frontend built and deployed
- [ ] Backend deployed and running
- [ ] URLs tested and verified

---

## 🔍 Files Modified

1. `frontend/vite.config.ts` - Added server and build configuration
2. `frontend/src/services/api.ts` - Updated API base URL and error messages
3. `frontend/public/troubleshoot.html` - Updated backend URL display
4. `backend/src/main.rs` - Updated CORS configuration

All URLs have been updated to use your production domains!

