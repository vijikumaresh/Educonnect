# Username and Password Information

## 🔐 Default Credentials

### For Docker Setup (from init-db.sql):
- **Username**: `admin`
- **Password**: `admin123`
- **Note**: This is only created when using Docker with the `init-db.sql` script

### For Regular Setup:
**There are NO default credentials!** You must create your own account using the "Sign Up" feature.

## 📝 How Authentication Works

### Registration (Sign Up)
1. Go to the login page
2. Click "Sign Up"
3. Enter:
   - **Username**: Any unique username (e.g., `admin`, `test`, `user1`)
   - **Password**: At least 6 characters (e.g., `password`, `test123`, `admin123`)
   - **Confirm Password**: Must match password
4. Click "Sign Up"
5. You'll be automatically logged in

### Login
1. Enter your username and password
2. Click "Login"

## 🔍 Test Credentials (From Documentation)

These are examples mentioned in documentation, but you need to create these accounts first:

| Source | Username | Password | Notes |
|--------|----------|----------|-------|
| Docker README | `admin` | `admin123` | Only if using Docker init-db.sql |
| Quick Start Guide | `admin` | `password` | Example - create this account |
| Test Examples | `test` | `test` or `password123` | Example - create this account |
| Test Examples | `testuser` | `password123` | Example - create this account |

## 💾 Where Credentials Are Stored

### Database
- **Table**: `users`
- **Username**: Stored in plain text (unique)
- **Password**: Stored as bcrypt hash (never plain text)

### Frontend
- **Storage**: `localStorage` (browser)
- **Key**: `currentUser`
- **Contains**: Username and JWT token (not password)

## 🔑 Password Requirements

- **Minimum Length**: 6 characters
- **Hashing**: bcrypt with cost factor 12
- **Storage**: Never stored in plain text

## 📍 Code Locations

### Backend Authentication
- **File**: `backend/src/handlers/auth.rs`
- **Functions**: 
  - `register()` - Creates new user
  - `login()` - Authenticates user
  - Password hashing: `bcrypt::hash()`
  - Password verification: `bcrypt::verify()`

### Frontend Authentication
- **File**: `frontend/src/contexts/AuthContext.tsx`
- **Functions**:
  - `signup()` - Calls register API
  - `login()` - Calls login API
  - Stores user in `localStorage`

### API Endpoints
- **Register**: `POST /api/auth/register`
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Login**: `POST /api/auth/login`
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

## 🛠️ How to Check Existing Users

### Via Database (PostgreSQL)
```bash
# Connect to database
psql -U pc3 -d educonnect_app

# List all users
SELECT username, created_at FROM users;

# Exit
\q
```

### Via API
```bash
# This won't work - there's no endpoint to list users
# You can only register/login
```

## ⚠️ Important Notes

1. **No Default Users**: If you're not using Docker, there are NO default users. You must create one.

2. **Docker Only**: The `admin/admin123` user is ONLY created when using Docker with `init-db.sql`.

3. **Create Your Account**: Use the "Sign Up" button on the login page to create your first account.

4. **Password Security**: 
   - Passwords are hashed with bcrypt
   - Never stored in plain text
   - Cannot be recovered (only reset)

5. **Username Uniqueness**: Each username must be unique. If you get "Username already exists", try a different one.

## 🚀 Quick Start

### First Time Setup:
1. Start backend: `cd backend && cargo run`
2. Start frontend: `cd frontend && npm run dev`
3. Go to: `http://localhost:5173`
4. Click "Sign Up"
5. Create your account (e.g., username: `admin`, password: `admin123`)
6. Login with your new credentials

### If Using Docker:
- Default user `admin/admin123` may already exist
- Try logging in with those credentials first
- If it doesn't work, create a new account

## 🔒 Security Best Practices

1. **Change Default Passwords**: If using Docker, change the default `admin123` password
2. **Strong Passwords**: Use at least 8 characters with mix of letters, numbers, symbols
3. **Unique Usernames**: Don't use common usernames like "admin" in production
4. **JWT Tokens**: Tokens expire after 24 hours
5. **HTTPS**: Use HTTPS in production (not implemented in current setup)

## 📞 Troubleshooting

### "Invalid credentials"
- Username doesn't exist, OR
- Password is wrong
- Solution: Create account or use correct password

### "Username already exists"
- Someone (or you) already created this username
- Solution: Use a different username

### "Cannot connect to server"
- Backend is not running
- Solution: Start the backend server


