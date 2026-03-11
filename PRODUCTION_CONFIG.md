# Production Configuration Guide

## 🌐 Production URLs

### Frontend
- **URL**: `https://registerstudents.kattral.ai`
- **Domain**: `registerstudents.kattral.ai`

### Backend API
- **URL**: `https://educonnectapi.kattral.ai`
- **API Endpoint**: `https://educonnectapi.kattral.ai/api`
- **Health Check**: `https://educonnectapi.kattral.ai/health`
- **Domain**: `educonnectapi.kattral.ai`

---

## 🔧 Frontend Configuration

### Environment Variables

Create `.env.production` file in `frontend/` directory:

```bash
# Frontend Production Environment
VITE_API_URL=https://educonnectapi.kattral.ai/api
```

### Build for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` directory.

### Deploy Frontend

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the `dist/` folder to your web server
3. Configure your web server (nginx/apache) to serve from `dist/`
4. Set up SSL certificate for `educonnect.kattral.ai`

---

## 🔧 Backend Configuration

### Environment Variables

Create `.env` file in `backend/` directory:

```bash
# Database
DATABASE_URL=postgres://your_user:your_password@your_db_host:5432/educonnect_app

# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=8080

# JWT Security (REQUIRED - Generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-jwt-secret-minimum-32-characters-long

# CORS Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://registerstudents.kattral.ai,http://localhost:5173,http://localhost:5174

# Logging
RUST_LOG=info
```

### Generate Secure JWT Secret

```bash
openssl rand -base64 32
```

### Build Backend for Production

```bash
cd backend
cargo build --release
```

The binary will be in `backend/target/release/educonnect-backend`

### Run Backend

```bash
cd backend
./target/release/educonnect-backend
```

Or use a process manager like systemd, PM2, or supervisor.

---

## 🔒 SSL/HTTPS Configuration

### Frontend (registerstudents.kattral.ai)

1. Obtain SSL certificate (Let's Encrypt recommended)
2. Configure your web server (nginx example):

```nginx
server {
    listen 443 ssl http2;
    server_name registerstudents.kattral.ai;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name registerstudents.kattral.ai;
    return 301 https://$server_name$request_uri;
}
```

### Backend (educonnectapi.kattral.ai)

1. Obtain SSL certificate
2. Configure reverse proxy (nginx example):

```nginx
server {
    listen 443 ssl http2;
    server_name educonnectapi.kattral.ai;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name educonnectapi.kattral.ai;
    return 301 https://$server_name$request_uri;
}
```

---

## ✅ Configuration Checklist

### Frontend
- [ ] Set `VITE_API_URL=https://educonnectapi.kattral.ai/api` in `.env.production`
- [ ] Build frontend: `npm run build`
- [ ] Deploy `dist/` folder to web server
- [ ] Configure SSL certificate for `educonnect.kattral.ai`
- [ ] Test frontend loads correctly
- [ ] Verify API calls work

### Backend
- [ ] Set `JWT_SECRET` (minimum 32 characters)
- [ ] Set `DATABASE_URL` to production database
- [ ] Set `ALLOWED_ORIGINS` to include `https://registerstudents.kattral.ai`
- [ ] Build backend: `cargo build --release`
- [ ] Configure SSL certificate for `educonnectapi.kattral.ai`
- [ ] Set up reverse proxy (nginx)
- [ ] Test health endpoint: `https://educonnectapi.kattral.ai/health`
- [ ] Test API endpoints

### Database
- [ ] Set up production PostgreSQL database
- [ ] Update `DATABASE_URL` in backend `.env`
- [ ] Run migrations
- [ ] Test database connection

### Security
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS for both frontend and backend
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Set up monitoring and logging

---

## 🧪 Testing Production URLs

### Test Frontend
```bash
curl https://registerstudents.kattral.ai
```

### Test Backend Health
```bash
curl https://educonnectapi.kattral.ai/health
# Should return: OK
```

### Test Backend API
```bash
curl https://educonnectapi.kattral.ai/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

---

## 🔄 Development vs Production

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080/api`
- Uses `.env.development` or no env file (defaults to localhost)

### Production
- Frontend: `https://registerstudents.kattral.ai`
- Backend: `https://educonnectapi.kattral.ai/api`
- Uses `.env.production` or production environment variables

---

## 📝 Notes

1. **CORS Configuration**: The backend now automatically allows `https://registerstudents.kattral.ai` in production
2. **Environment Variables**: Use `.env.production` for frontend and `.env` for backend
3. **SSL Required**: Both domains should use HTTPS in production
4. **JWT_SECRET**: Must be set and should be different from development
5. **Database**: Use production database credentials, not development

---

## 🆘 Troubleshooting

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes `https://registerstudents.kattral.ai`
- Check that frontend is using HTTPS
- Verify backend CORS configuration

### API Connection Errors
- Verify `VITE_API_URL` is set correctly in frontend
- Check backend is running and accessible
- Verify SSL certificates are valid
- Check firewall rules allow traffic

### JWT Errors
- Verify `JWT_SECRET` is set in backend
- Check JWT_SECRET is at least 32 characters
- Ensure JWT_SECRET is the same across all backend instances

