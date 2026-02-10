# Educonnect - Docker Deployment Guide

## 🐳 Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### 🚀 One-Command Deployment

```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

The application will be available at:
- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### Default Credentials
- **Username**: admin
- **Password**: admin123

---

## 📦 Docker Services

### 1. PostgreSQL Database
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Database**: educonnect_app
- **User**: postgres
- **Password**: postgres
- **Volume**: Persistent data storage in `postgres_data`

### 2. Backend API (Rust/Actix)
- **Port**: 8080
- **Build**: Multi-stage Dockerfile
- **Dependencies**: PostgreSQL
- **Health Check**: `/health` endpoint

### 3. Frontend (React/Vite + Nginx)
- **Port**: 80
- **Build**: Multi-stage Dockerfile
- **Server**: Nginx
- **Features**: Gzip compression, SPA routing, API proxy

---

## 🛠️ Docker Commands

### Build and Start
```bash
# Build images and start containers
docker-compose up -d --build

# Start without rebuilding
docker-compose up -d

# Start specific service
docker-compose up -d backend
```

### Stop and Remove
```bash
# Stop all services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ deletes database data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### Container Management
```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d educonnect_app
```

### Database Operations
```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d educonnect_app

# Backup database
docker-compose exec postgres pg_dump -U postgres educonnect_app > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres educonnect_app < backup.sql
```

---

## 🔧 Configuration

### Environment Variables

**Backend (`docker-compose.yml`)**
```yaml
environment:
  DATABASE_URL: postgres://postgres:postgres@postgres:5432/educonnect_app
  RUST_LOG: info  # Options: error, warn, info, debug, trace
```

**Database (`docker-compose.yml`)**
```yaml
environment:
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_DB: educonnect_app
```

### Custom Ports

Edit `docker-compose.yml` to change ports:
```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Access frontend at http://localhost:3000
  
  backend:
    ports:
      - "8000:8080"  # Access backend at http://localhost:8000
  
  postgres:
    ports:
      - "5433:5432"  # Access database at localhost:5433
```

---

## 🏗️ Production Deployment

### 1. Update Configurations

**Frontend API URL**
Update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://your-domain.com/api';
```

**Environment Variables**
Create `.env` file:
```bash
# Database
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=strong_password_here
POSTGRES_DB=educonnect_app

# Backend
DATABASE_URL=postgres://your_db_user:strong_password_here@postgres:5432/educonnect_app
RUST_LOG=warn
```

Update `docker-compose.yml`:
```yaml
services:
  postgres:
    env_file: .env
  backend:
    env_file: .env
```

### 2. Enable HTTPS (with Nginx/Traefik/Caddy)

**Option A: Add Caddy to docker-compose.yml**
```yaml
services:
  caddy:
    image: caddy:alpine
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - frontend

volumes:
  caddy_data:
```

**Caddyfile**:
```
your-domain.com {
    reverse_proxy frontend:80
}
```

### 3. Resource Limits

Add resource limits to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 🧪 Development Mode

### With Hot Reload

**Backend**
```bash
# Run backend with hot reload (outside Docker)
cd backend
cargo watch -x run
```

**Frontend**
```bash
# Run frontend with hot reload (outside Docker)
cd frontend
npm run dev
```

**Database Only**
```bash
# Run only PostgreSQL in Docker
docker-compose up -d postgres
```

---

## 📊 Monitoring

### Check Service Health
```bash
# Backend health
curl http://localhost:8080/health

# Database health
docker-compose exec postgres pg_isready -U postgres

# View container stats
docker stats educonnect-backend educonnect-frontend educonnect-postgres
```

### View Database Data
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d educonnect_app

# SQL queries
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM folders;
SELECT COUNT(*) FROM users;
```

---

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs for errors
docker-compose logs backend

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database connection issues
```bash
# Verify database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d educonnect_app -c "SELECT 1;"
```

### Permission issues
```bash
# Fix volume permissions
docker-compose down
sudo chown -R $USER:$USER .
docker-compose up -d
```

### Reset everything
```bash
# ⚠️ WARNING: This deletes ALL data
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## 📝 File Structure

```
Educonnect/
├── docker-compose.yml          # Main orchestration file
├── init-db.sql                 # Database initialization
├── backend/
│   ├── Dockerfile             # Backend container config
│   ├── Cargo.toml
│   └── src/
├── frontend/
│   ├── Dockerfile             # Frontend container config
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json
│   └── src/
└── DOCKER_GUIDE.md            # This file
```

---

## 🎯 Next Steps

1. ✅ Deploy with Docker Compose
2. ⚙️ Configure environment variables
3. 🔒 Set up HTTPS (production)
4. 📊 Set up monitoring (optional)
5. 🔄 Set up CI/CD pipeline (optional)

---

## 📞 Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up -d --build`

