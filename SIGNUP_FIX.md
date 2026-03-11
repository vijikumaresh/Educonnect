# Signup/User Creation Fix

## Issues Fixed

### 1. Improved Error Handling
- **Problem**: Error messages from the API were not being displayed to users
- **Solution**: Updated `AuthContext` and `LoginPage` to properly pass and display error messages
- **Result**: Users will now see specific error messages like:
  - "Cannot connect to server. Please make sure the backend is running on port 8080."
  - "Username already exists"
  - "Invalid credentials"
  - Server error messages

### 2. Better Network Error Detection
- **Problem**: Network errors (like connection refused) were showing generic messages
- **Solution**: Added specific error handling in `api.ts` to detect network failures
- **Result**: Clear messages when backend is not running

## How to Create a New User

### Step 1: Make Sure Backend is Running

The backend must be running for signup to work. Start it in a terminal:

```bash
cd /home/pc3/Desktop/Educonnect/backend
DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run
```

Or use the startup script:
```bash
cd /home/pc3/Desktop/Educonnect
./start-backend-now.sh
```

You should see:
```
Starting EduConnect Backend Server...
Database pool created successfully
Server starting at http://127.0.0.1:8080
```

### Step 2: Make Sure Frontend is Running

In another terminal:
```bash
cd /home/pc3/Desktop/Educonnect/frontend
npm run dev
```

### Step 3: Create Account

1. Open your browser to `http://localhost:5173`
2. Click "Sign Up" button (if you're on the login page)
3. Enter:
   - **Username**: Choose a unique username
   - **Password**: At least 6 characters
   - **Confirm Password**: Must match password
4. Click "Sign Up"

### Step 4: Verify Success

- If successful: You'll be redirected to the dashboard
- If there's an error: You'll see a specific error message explaining what went wrong

## Common Issues and Solutions

### Issue: "Cannot connect to server"
**Solution**: Start the backend server (see Step 1 above)

### Issue: "Username already exists"
**Solution**: Choose a different username

### Issue: "Database error" or "Internal server error"
**Solutions**:
1. Make sure PostgreSQL is running:
   ```bash
   sudo systemctl start postgresql
   ```

2. Make sure the database exists:
   ```bash
   psql -U pc3 -d postgres -c "CREATE DATABASE educonnect_app;"
   ```

3. Check backend logs for specific error messages

### Issue: Password validation errors
- Password must be at least 6 characters
- Passwords must match in both fields

## Testing

After the fixes, you should be able to:
1. ✅ See specific error messages when something goes wrong
2. ✅ Create new user accounts successfully
3. ✅ Get clear feedback about connection issues
4. ✅ Understand why signup failed (if it does)

## What Changed

### Files Modified:
1. `frontend/src/contexts/AuthContext.tsx`
   - Changed return type to include error messages
   - Improved error handling and message extraction

2. `frontend/src/pages/LoginPage.tsx`
   - Updated to display specific error messages from API

3. `frontend/src/services/api.ts`
   - Added network error detection
   - Improved error message handling for both register and login

## Next Steps

If you still can't create a user:
1. Check the browser console (F12) for any errors
2. Check the backend terminal for error messages
3. Verify PostgreSQL is running and database exists
4. Try creating a user with a different username
5. Check that both frontend and backend are running

