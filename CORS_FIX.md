# CORS Error Fix

## Problem
You're getting a CORS error because:
- Frontend is running on `http://localhost:5174`
- Backend CORS only allowed `http://localhost:5173`

## Solution Applied
I've updated the backend CORS configuration to allow:
- `http://localhost:5173`
- `http://localhost:5174`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:5174`
- Any localhost origin (for development flexibility)

## What You Need to Do

### Restart the Backend
The backend needs to be restarted for the CORS changes to take effect:

1. **Stop the current backend** (if running):
   - Press `Ctrl+C` in the terminal where backend is running

2. **Restart the backend**:
   ```bash
   cd /home/pc3/Desktop/Educonnect/backend
   DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run
   ```

3. **Try logging in again** from the frontend

## Alternative: Use Port 5173

If you prefer, you can run the frontend on port 5173 instead:

```bash
cd /home/pc3/Desktop/Educonnect/frontend
npm run dev -- --port 5173
```

## Verify CORS is Working

After restarting the backend, you should see in the backend logs:
```
Server starting at http://127.0.0.1:8080
```

And the CORS error should be gone when you try to login.

## What Changed

**File**: `backend/src/main.rs`

**Before**:
```rust
.allowed_origin("http://localhost:5173")
.allowed_origin("http://127.0.0.1:5173")
```

**After**:
```rust
.allowed_origin("http://localhost:5173")
.allowed_origin("http://localhost:5174")
.allowed_origin("http://127.0.0.1:5173")
.allowed_origin("http://127.0.0.1:5174")
.allowed_origin_fn(|origin, _req_head| {
    // Allow any localhost origin for development
    origin.as_bytes().starts_with(b"http://localhost:") ||
    origin.as_bytes().starts_with(b"http://127.0.0.1:")
})
```

This allows any localhost port for development flexibility.


