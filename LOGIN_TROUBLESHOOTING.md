# Login Troubleshooting Guide

## Issue: Cannot Login to Educonnect

This guide will help you diagnose and fix login issues.

## Common Issues and Solutions

### 1. Backend Not Running

**Check if backend is running:**
```bash
# Check if port 8080 is in use
lsof -i :8080
# Or
netstat -tuln | grep 8080
```

**Start the backend:**
```bash
cd /home/pc3/Desktop/Educonnect/backend
./start-backend.sh
```

Or manually:
```bash
cd /home/pc3/Desktop/Educonnect/backend
DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run
```

### 2. PostgreSQL Database Not Running or Not Set Up

**Check if PostgreSQL is running:**
```bash
sudo systemctl status postgresql
# Or
pg_isready
```

**Start PostgreSQL:**
```bash
sudo systemctl start postgresql
```

**Create the database if it doesn't exist:**
```bash
# Connect to PostgreSQL
psql -U pc3 -d postgres

# Create database
CREATE DATABASE educonnect_app;

# Exit
\q
```

**Verify database exists:**
```bash
psql -U pc3 -l | grep educonnect_app
```

### 3. Database Connection Error

**Check the DATABASE_URL:**
- Default: `postgres://pc3@localhost/educonnect_app`
- If your PostgreSQL user/password is different, update it in:
  - `backend/.env` file (create if it doesn't exist)
  - Or pass it when running: `DATABASE_URL="postgres://USER:PASSWORD@localhost/educonnect_app" cargo run`

**Create .env file in backend directory:**
```bash
cd /home/pc3/Desktop/Educonnect/backend
cat > .env << EOF
DATABASE_URL=postgres://pc3@localhost/educonnect_app
JWT_SECRET=your-secret-key-change-this-in-production
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
RUST_LOG=info
EOF
```

### 4. Frontend Not Running

**Check if frontend is running:**
```bash
# Check if port 5173 is in use
lsof -i :5173
```

**Start the frontend:**
```bash
cd /home/pc3/Desktop/Educonnect/frontend
npm run dev
```

### 5. CORS Issues

The backend is configured to allow:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

Make sure you're accessing the frontend from one of these URLs.

### 6. No User Account Exists

**If you haven't created an account yet:**
1. Go to the login page
2. Click "Sign Up" 
3. Create a new account with username and password
4. Then try logging in

### 7. Check Browser Console for Errors

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any error messages
4. Go to Network tab
5. Try logging in and check if the request to `/api/auth/login` is:
   - Being sent
   - Getting a response
   - What the response status is

### 8. Check Backend Logs

When running the backend, check the terminal output for:
- Database connection errors
- Authentication errors
- Any other error messages

## Quick Diagnostic Steps

1. **Verify Backend is Running:**
   ```bash
   curl http://localhost:8080/health
   ```
   Should return: `OK`

2. **Verify Frontend can reach Backend:**
   ```bash
   curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"test","password":"test"}'
   ```
   Should return a JSON response (either success or error)

3. **Check Database Connection:**
   ```bash
   psql -U pc3 -d educonnect_app -c "SELECT COUNT(*) FROM users;"
   ```

## Still Having Issues?

1. Check backend logs for specific error messages
2. Check browser console for frontend errors
3. Verify all services are running:
   - PostgreSQL
   - Backend (port 8080)
   - Frontend (port 5173)
4. Make sure you're using the correct database credentials
5. Try creating a new user account if login fails

## Expected Behavior

When everything is working:
1. Frontend loads at `http://localhost:5173`
2. Login page displays
3. You can create an account (Sign Up)
4. After creating account, you're automatically logged in
5. You can log in with your credentials
6. After login, you're redirected to the dashboard

