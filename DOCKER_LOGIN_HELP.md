# Docker Hub Login Help

## 🔐 Login Issue

If you're getting "unauthorized: incorrect username or password", try these methods:

### Method 1: Interactive Login (Recommended)

```bash
docker login
```

When prompted:
- **Username**: `svijikumaresh05@gmail.com` (or just `vijikumaresh05`)
- **Password**: `vijayalakshmi`

### Method 2: Login with Username

```bash
docker login -u vijikumaresh05
```

Then enter password when prompted.

### Method 3: Login with Email

```bash
docker login -u svijikumaresh05@gmail.com
```

Then enter password when prompted.

### Method 4: Using Password in Command (Less Secure)

```bash
echo "vijayalakshmi" | docker login -u vijikumaresh05 --password-stdin
```

## ✅ Verify Login

After logging in, verify:

```bash
docker info | grep Username
```

Or check:

```bash
cat ~/.docker/config.json
```

## 🔄 After Successful Login

Once logged in, you can run the push script:

```bash
cd /home/pc3/Desktop/Educonnect
./quick-push.sh
```

Or manually:

```bash
# Build and push backend
cd backend
docker build -t vijikumaresh05/educonnect-backend:latest .
docker push vijikumaresh05/educonnect-backend:latest

# Build and push frontend
cd ../frontend
docker build --build-arg VITE_API_URL=https://registerstudents.kattral.ai/api -t vijikumaresh05/educonnect-frontend:latest .
docker push vijikumaresh05/educonnect-frontend:latest
```

## ⚠️ Common Issues

1. **Wrong Username**: Try both `vijikumaresh05` and `svijikumaresh05@gmail.com`
2. **Password Typo**: Make sure password is exactly `vijayalakshmi`
3. **Account Not Verified**: Check your email for Docker Hub verification
4. **2FA Enabled**: If 2FA is enabled, you'll need an access token instead of password

## 🔑 Using Access Token (If 2FA Enabled)

If you have 2FA enabled:

1. Go to Docker Hub → Account Settings → Security
2. Create an access token
3. Use token as password:

```bash
docker login -u vijikumaresh05
# Enter access token as password
```

