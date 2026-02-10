# 🔧 Blank Screen Fix Guide

## The Problem

Your frontend is showing a blank screen because the development server isn't running properly or the built application has issues.

---

## ✅ Solution: Start Development Servers

### Step 1: Stop Everything

```bash
# Stop any running processes
# Press Ctrl+C in terminals running backend/frontend
```

### Step 2: Start Backend

```bash
# Open Terminal 1
cd /home/pc3/Desktop/Educonnect/backend
cargo run
```

**Wait for**: `"Server running on http://127.0.0.1:8080"`

### Step 3: Start Frontend

```bash
# Open Terminal 2  
cd /home/pc3/Desktop/Educonnect/frontend
npm run dev
```

**Wait for**: `"Local: http://localhost:5173"`

### Step 4: Open in Browser

```
http://localhost:5173
```

---

## 🐛 Troubleshooting

### Issue 1: "Port already in use"

**Frontend (5173):**
```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Backend (8080):**
```bash
lsof -ti:8080 | xargs kill -9
cargo run
```

### Issue 2: Still Blank Screen

1. **Open Browser DevTools** (F12)
2. **Check Console tab** for errors
3. **Check Network tab** - should see requests to `localhost:8080`

### Issue 3: "Cannot connect to backend"

**Problem**: Backend running on `127.0.0.1` only

**Fix**: Update backend to bind to `0.0.0.0`:

```bash
# Check backend/src/main.rs
# Should have: HttpServer::new().bind("0.0.0.0:8080")
# Not: bind("127.0.0.1:8080")
```

### Issue 4: CORS Errors in Console

**Fix**: Backend should have CORS enabled (already configured)

---

## 📊 Verify Everything is Working

### Test Backend:
```bash
curl http://localhost:8080/health
# Should return: OK
```

### Test Frontend:
```bash
# Open browser to:
http://localhost:5173
# Should see login page
```

### Test Troubleshooting Page:
```bash
# Open browser to:
http://localhost:5173/troubleshoot.html
# Click "Test Backend Connection"
```

---

## 🎯 Expected Result

When working correctly, you should see:

1. **Backend Terminal**:
   ```
   Server running on http://127.0.0.1:8080
   ```

2. **Frontend Terminal**:
   ```
   VITE v5.4.21  ready in 500 ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

3. **Browser**:
   - Login page appears
   - No errors in console (F12)
   - Can login and use the app

---

## 🚨 Current Issue from Screenshot

From your screenshot, I see:
- Network tab shows `educonnect-frontend-skvse...`
- This looks like a remote/cloud URL
- Blank/dark screen

**This means**:
- You're accessing a deployed version OR
- Using some proxy/tunnel URL
- NOT accessing `localhost:5173` directly

**Quick Fix**:
1. Close that browser tab
2. Start fresh: `npm run dev` in frontend directory
3. Open new tab to: `http://localhost:5173`

---

## 💡 Pro Tip

Create this startup script (`start-dev.sh`):

```bash
#!/bin/bash

echo "🚀 Starting Educonnect Development Environment"

# Start backend in background
cd /home/pc3/Desktop/Educonnect/backend
cargo run &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in background
cd /home/pc3/Desktop/Educonnect/frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Open: http://localhost:5173"
echo ""
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"

# Wait for user interrupt
wait
```

Make it executable:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 📝 Summary

**The blank screen is because**:
- Frontend dev server isn't running on `localhost:5173`
- You're accessing some other URL

**Solution**:
1. `cd frontend && npm run dev`
2. Open `http://localhost:5173`
3. Should see login page!

**If still blank**:
- Check browser console (F12)
- Share the error messages
- Make sure backend is running

