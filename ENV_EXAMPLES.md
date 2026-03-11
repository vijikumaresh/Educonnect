# Environment Variables Configuration Examples

## Backend (.env in backend folder)

```env
# Database connection string
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/educonnect_app

# Logging level (debug, info, warn, error)
RUST_LOG=info

# Server port
PORT=8080
```

## Frontend (.env in frontend folder)

```env
# Backend API URL
VITE_API_URL=https://your-backend-url.dokploy.com/api

# For local development:
# VITE_API_URL=http://localhost:8080/api
```

## Docker Compose (.env in root folder)

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=educonnect_app

# Backend
DATABASE_URL=postgresql://postgres:your_secure_password_here@postgres:5432/educonnect_app
RUST_LOG=info
```

---

**Note**: Never commit `.env` files to Git. These are examples only.

