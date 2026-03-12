# Docker Hub Setup - Fix "Access Denied" Error

## 🔍 Problem

Getting: `denied: requested access to the resource is denied`

This means Docker Hub doesn't recognize the repository or username.

## ✅ Solution: Create Repositories on Docker Hub

### Step 1: Login to Docker Hub Website

1. Go to: https://hub.docker.com
2. Login with:
   - Email: `svijikumaresh05@gmail.com`
   - Password: `vijayalakshmi`

### Step 2: Create Backend Repository

1. Click **"Create Repository"** button
2. Fill in:
   - **Repository Name**: `educonnect-backend`
   - **Visibility**: Public (or Private)
   - **Description**: (optional) "Educonnect Backend API"
3. Click **"Create"**

### Step 3: Create Frontend Repository

1. Click **"Create Repository"** button again
2. Fill in:
   - **Repository Name**: `educonnect-frontend`
   - **Visibility**: Public (or Private)
   - **Description**: (optional) "Educonnect Frontend"
3. Click **"Create"**

### Step 4: Verify Your Username

After creating repositories, check your profile:
- Your username appears in the URL: `https://hub.docker.com/u/YOUR_USERNAME`
- Note this username - it might be different from `vijikumaresh05`

### Step 5: Update Script with Correct Username

If your username is different, update the script:

```bash
# Edit the script
nano verify-and-push.sh

# Change line with DOCKER_USERNAME to your actual username
```

### Step 6: Run the Push Script

```bash
cd /home/pc3/Desktop/Educonnect
chmod +x verify-and-push.sh
./verify-and-push.sh
```

## 🔧 Alternative: Manual Push

If repositories are created, try manual push:

```bash
# 1. Login
docker login

# 2. Build Backend
cd /home/pc3/Desktop/Educonnect/backend
docker build -t YOUR_USERNAME/educonnect-backend:latest .
docker push YOUR_USERNAME/educonnect-backend:latest

# 3. Build Frontend
cd ../frontend
docker build --build-arg VITE_API_URL=https://registerstudents.kattral.ai/api -t YOUR_USERNAME/educonnect-frontend:latest .
docker push YOUR_USERNAME/educonnect-frontend:latest
```

## 📝 Important Notes

1. **Repository names must match exactly**: `educonnect-backend` and `educonnect-frontend`
2. **Username must match**: Use the exact username from Docker Hub
3. **Repositories must exist**: Create them on Docker Hub first
4. **Case sensitive**: `Educonnect` ≠ `educonnect`

## ✅ Checklist

- [ ] Logged into Docker Hub website
- [ ] Created `educonnect-backend` repository
- [ ] Created `educonnect-frontend` repository
- [ ] Verified Docker Hub username
- [ ] Updated script with correct username (if different)
- [ ] Logged in via `docker login`
- [ ] Run push script

---

**After creating repositories on Docker Hub, the push should work!**


