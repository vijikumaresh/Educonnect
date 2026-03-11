# Final Production URLs

## 🌐 Production Domains

### Frontend
- **URL**: `https://registerstudents.kattral.ai`
- **Domain**: `registerstudents.kattral.ai`

### Backend API
- **URL**: `https://educonnectapi.kattral.ai`
- **API Endpoint**: `https://educonnectapi.kattral.ai/api`
- **Health Check**: `https://educonnectapi.kattral.ai/health`
- **Domain**: `educonnectapi.kattral.ai`

---

## ✅ Configuration Status

### Backend CORS
✅ Updated to allow: `https://registerstudents.kattral.ai`

### Frontend API Configuration
✅ Updated to use: `https://educonnectapi.kattral.ai/api` in production

---

## 🔧 Quick Setup

### Frontend Environment Variable
```bash
cd frontend
echo "VITE_API_URL=https://educonnectapi.kattral.ai/api" > .env.production
```

### Backend Environment Variable
```bash
cd backend
# Add to .env file:
ALLOWED_ORIGINS=https://registerstudents.kattral.ai,http://localhost:5173,http://localhost:5174
```

---

## 🧪 Test URLs

```bash
# Test Frontend
curl https://registerstudents.kattral.ai

# Test Backend Health
curl https://educonnectapi.kattral.ai/health

# Test Backend API
curl https://educonnectapi.kattral.ai/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

---

All URLs have been updated! 🎉

