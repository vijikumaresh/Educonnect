# 🐳 Educonnect - Dockerized Deployment

Complete Docker setup for the Educonnect educational management system.

## 📦 What's Included

- **Backend**: Rust/Actix Web API
- **Frontend**: React/TypeScript with Nginx
- **Database**: PostgreSQL 16
- **Networking**: Internal Docker network
- **Volumes**: Persistent database storage

---

## 🚀 Quick Start

### Option 1: Interactive Script (Recommended)

```bash
./docker-start.sh
```

This will show you a menu with options to:
- Start/Stop services
- View logs
- Check status
- Access database
- And more!

### Option 2: Manual Commands

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

## 🌐 Access the Application

Once started, access:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

**Default Login:**
- Username: `admin`
- Password: `admin123`

---

## 📋 Docker Files Overview

```
Educonnect/
├── docker-compose.yml          # Orchestrates all services
├── docker-start.sh             # Interactive helper script
├── init-db.sql                 # Database initialization
├── backend/
│   ├── Dockerfile             # Backend container
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Web server config
│   └── .dockerignore
└── DOCKER_GUIDE.md            # Detailed documentation
```

---

## 🔧 Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Restart services
docker-compose restart

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check service status
docker-compose ps

# Access database
docker-compose exec postgres psql -U postgres -d educonnect_app

# Rebuild and start
docker-compose up -d --build

# Stop and remove (keeps data)
docker-compose down

# Stop and remove (deletes data)
docker-compose down -v
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Host                         │
│                                                         │
│  ┌──────────────┐    ┌──────────────┐                 │
│  │   Frontend   │    │   Backend    │                 │
│  │   (Nginx)    │◄───┤   (Rust)     │                 │
│  │   Port: 80   │    │   Port: 8080 │                 │
│  └──────────────┘    └──────┬───────┘                 │
│         ▲                    │                          │
│         │                    ▼                          │
│         │           ┌──────────────┐                   │
│         │           │  PostgreSQL  │                   │
│         │           │  Port: 5432  │                   │
│         │           └──────────────┘                   │
│         │                    │                          │
│  ┌──────┴────────────────────┴──────────┐             │
│  │    educonnect-network (bridge)       │             │
│  └──────────────────────────────────────┘             │
│                                                         │
│  Volumes:                                              │
│  └── postgres_data (persistent storage)               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Notes

### For Production:

1. **Change default passwords** in `docker-compose.yml`:
   ```yaml
   POSTGRES_PASSWORD: your_secure_password
   ```

2. **Update default admin password** in `init-db.sql`

3. **Use environment files**:
   ```bash
   # Create .env file
   echo "POSTGRES_PASSWORD=secure_password" > .env
   ```

4. **Enable HTTPS** (see DOCKER_GUIDE.md)

5. **Restrict database port**:
   ```yaml
   # Remove external port mapping
   # ports:
   #   - "5432:5432"
   ```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8080/health

# Database health
docker-compose exec postgres pg_isready

# Container stats
docker stats
```

### Database Queries

```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d educonnect_app

# Check data
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM folders;
SELECT COUNT(*) FROM users;
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find and kill process on port 80
sudo lsof -ti:80 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "8000:80"  # Use port 8000 instead
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Cannot Connect to Backend

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up -d --build backend
```

### Reset Everything

```bash
# ⚠️ WARNING: Deletes all data!
docker-compose down -v
docker-compose up -d --build
```

---

## 📈 Scaling (Optional)

Scale backend instances:

```bash
docker-compose up -d --scale backend=3
```

Add load balancer in `docker-compose.yml`:

```yaml
services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push
        run: |
          docker-compose build
          docker-compose push
      - name: Deploy
        run: |
          ssh user@server 'cd /app && docker-compose pull && docker-compose up -d'
```

---

## 📝 Environment Variables

Create `.env` file:

```bash
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=educonnect_app

# Backend
DATABASE_URL=postgres://postgres:your_password@postgres:5432/educonnect_app
RUST_LOG=info

# Frontend
VITE_API_URL=http://localhost:8080
```

Update `docker-compose.yml`:

```yaml
services:
  postgres:
    env_file: .env
  backend:
    env_file: .env
```

---

## 📞 Support

For detailed documentation, see:
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Complete Docker guide
- [backend/README.md](./backend/README.md) - Backend documentation
- [frontend/README.md](./frontend/README.md) - Frontend documentation

**Need help?**
- Check logs: `docker-compose logs -f`
- Restart: `docker-compose restart`
- Reset: `docker-compose down -v && docker-compose up -d --build`

---

## ✅ Features

- ✅ Multi-stage builds (optimized image sizes)
- ✅ Health checks for all services
- ✅ Persistent database storage
- ✅ Automatic database initialization
- ✅ Production-ready Nginx configuration
- ✅ Docker networking (isolated network)
- ✅ Volume management
- ✅ Interactive management script

---

**Made with ❤️ for ONE27 Educational Services Private Limited**

