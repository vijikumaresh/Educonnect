# Educonnect Application URLs

## 🌐 Development URLs

### Frontend (React/Vite)
- **URL**: `http://localhost:5173`
- **Alternative**: `http://127.0.0.1:5173`
- **Port**: `5173` (Vite default)
- **Start Command**: 
  ```bash
  cd frontend
  npm run dev
  ```

### Backend API (Rust/Actix)
- **Base URL**: `http://localhost:8080`
- **API Endpoint**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/health`
- **Port**: `8080`
- **Start Command**:
  ```bash
  cd backend
  DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run
  ```

### Database (PostgreSQL)
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `educonnect_app`
- **Connection String**: `postgres://pc3@localhost/educonnect_app`

---

## 🐳 Docker URLs

### Frontend (Docker)
- **URL**: `http://localhost`
- **Port**: `80`
- **Container**: `educonnect-frontend`

### Backend API (Docker)
- **Base URL**: `http://localhost:8080`
- **API Endpoint**: `http://localhost:8080/api`
- **Health Check**: `http://localhost:8080/health`
- **Port**: `8080`
- **Container**: `educonnect-backend`

### Database (Docker)
- **Host**: `postgres` (internal) or `localhost` (external)
- **Port**: `5432`
- **Database**: `educonnect_app`
- **Container**: `educonnect-postgres`

---

## 📡 API Endpoints

### Authentication
- **Register**: `POST http://localhost:8080/api/auth/register`
- **Login**: `POST http://localhost:8080/api/auth/login`

### Students
- **Get All**: `GET http://localhost:8080/api/students`
- **Create**: `POST http://localhost:8080/api/students`
- **Get One**: `GET http://localhost:8080/api/students/{id}`
- **Update**: `PUT http://localhost:8080/api/students/{id}`
- **Delete**: `DELETE http://localhost:8080/api/students/{id}`

### Folders
- **Get All**: `GET http://localhost:8080/api/folders`
- **Create**: `POST http://localhost:8080/api/folders`
- **Update**: `PUT http://localhost:8080/api/folders/{id}`
- **Delete**: `DELETE http://localhost:8080/api/folders/{id}`
- **Move**: `PUT http://localhost:8080/api/folders/{id}/move`

### Seminars
- **Get All**: `GET http://localhost:8080/api/seminars`
- **Get By Folder**: `GET http://localhost:8080/api/seminars/folder/{folder_id}`
- **Create**: `POST http://localhost:8080/api/seminars`
- **Update**: `PUT http://localhost:8080/api/seminars/{id}`
- **Delete**: `DELETE http://localhost:8080/api/seminars/{id}`

### Recruitment
- **Get All**: `GET http://localhost:8080/api/recruitment`
- **Get By Folder**: `GET http://localhost:8080/api/recruitment/folder/{folder_id}`
- **Create**: `POST http://localhost:8080/api/recruitment`
- **Update**: `PUT http://localhost:8080/api/recruitment/{id}`
- **Delete**: `DELETE http://localhost:8080/api/recruitment/{id}`

### Book Orders
- **Get All**: `GET http://localhost:8080/api/book-orders`
- **Get By Folder**: `GET http://localhost:8080/api/book-orders/folder/{folder_id}`
- **Create**: `POST http://localhost:8080/api/book-orders`
- **Update**: `PUT http://localhost:8080/api/book-orders/{id}`
- **Delete**: `DELETE http://localhost:8080/api/book-orders/{id}`

---

## 🔧 Configuration

### Frontend API URL Configuration

**File**: `frontend/src/services/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

**To change backend URL:**
1. Create `.env` file in `frontend/` directory:
   ```
   VITE_API_URL=http://your-backend-url:8080/api
   ```
2. Or modify `frontend/src/services/api.ts` directly

### Backend Configuration

**File**: `backend/src/main.rs`

**Default Settings:**
- Host: `127.0.0.1` (configurable via `SERVER_HOST`)
- Port: `8080` (configurable via `SERVER_PORT`)

**Environment Variables:**
```bash
SERVER_HOST=127.0.0.1    # Default
SERVER_PORT=8080         # Default
DATABASE_URL=postgres://pc3@localhost/educonnect_app
JWT_SECRET=your-secret-key
```

---

## 🌍 Production URLs

### Frontend
- **URL**: `https://registerstudents.kattral.ai`
- **Domain**: `registerstudents.kattral.ai`

### Backend API
- **URL**: `https://educonnectapi.kattral.ai`
- **API Endpoint**: `https://educonnectapi.kattral.ai/api`
- **Domain**: `educonnectapi.kattral.ai`

For production deployment, update:

1. **Frontend**: Set `VITE_API_URL` to `https://educonnectapi.kattral.ai/api`
2. **Backend**: Update `SERVER_HOST` and `SERVER_PORT` as needed
3. **CORS**: Backend automatically allows `https://registerstudents.kattral.ai`

---

## ✅ Quick Test

### Test Frontend
```bash
curl http://localhost:5173
```

### Test Backend Health
```bash
curl http://localhost:8080/health
# Should return: OK
```

### Test Backend API
```bash
curl http://localhost:8080/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

---

## 📝 Notes

- **Frontend Port**: Vite uses port 5173 by default, but may use 5174 or another port if 5173 is busy
- **Backend Port**: Fixed at 8080 (configurable via environment variable)
- **CORS**: Backend allows `localhost:5173` and `localhost:5174` for development
- **HTTPS**: Not configured by default (add SSL certificates for production)

---

## 🔗 Quick Links

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/health
- **Database**: localhost:5432

