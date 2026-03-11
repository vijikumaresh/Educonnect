# 🐳 Docker Hub Push Guide

## ✅ Script Updated

The `push-to-dockerhub.sh` script has been updated with:
- ✅ Production API URL: `https://registerstudents.kattral.ai/api`
- ✅ Docker Hub Username: `vijikumaresh`

## 🚀 Quick Push to Docker Hub

### Option 1: Run the Script (Recommended)

```bash
cd /home/pc3/Desktop/Educonnect
./push-to-dockerhub.sh
```

The script will:
1. ✅ Check Docker installation
2. ✅ Login to Docker Hub
3. ✅ Build backend image
4. ✅ Build frontend image (with production API URL)
5. ✅ Push both images to Docker Hub

### Option 2: Manual Commands

If you prefer to run commands manually:

```bash
# 1. Login to Docker Hub
docker login

# 2. Build Backend
cd /home/pc3/Desktop/Educonnect/backend
docker build -t vijikumaresh/educonnect-backend:latest .

# 3. Build Frontend (with production API URL)
cd /home/pc3/Desktop/Educonnect/frontend
docker build \
  --build-arg VITE_API_URL=https://registerstudents.kattral.ai/api \
  -t vijikumaresh/educonnect-frontend:latest .

# 4. Push Backend
docker push vijikumaresh/educonnect-backend:latest

# 5. Push Frontend
docker push vijikumaresh/educonnect-frontend:latest
```

## 📦 Images Will Be Pushed As

- **Backend**: `vijikumaresh/educonnect-backend:latest`
- **Frontend**: `vijikumaresh/educonnect-frontend:latest`

## ⚙️ Configuration

### Frontend Build Args
- `VITE_API_URL=https://registerstudents.kattral.ai/api` (Production URL)

### Docker Hub Username
- Current: `vijikumaresh`
- To change: Edit line 9 in `push-to-dockerhub.sh`

## ✅ Verification

After pushing, verify your images:

```bash
# Check local images
docker images | grep vijikumaresh

# View on Docker Hub
# Visit: https://hub.docker.com/u/vijikumaresh
```

## 🔧 Troubleshooting

### Docker Not Running
```bash
# Start Docker Desktop or Docker daemon
sudo systemctl start docker  # Linux
```

### Login Issues
```bash
# Login with your Docker Hub credentials
docker login
# Enter username: vijikumaresh
# Enter password: [your password]
```

### Build Fails
- Check Docker is running: `docker info`
- Check you have enough disk space: `df -h`
- Check Dockerfile syntax: `docker build --dry-run .`

### Push Fails
- Verify you're logged in: `docker login`
- Check internet connection
- Verify Docker Hub account has push permissions

## 📝 Notes

1. **First Time**: The build may take several minutes
2. **Subsequent Builds**: Will be faster due to Docker layer caching
3. **Image Size**: Backend ~200MB, Frontend ~50MB
4. **Public by Default**: Images are public on Docker Hub unless you make them private

## 🎯 Next Steps After Push

1. **Pull Images** (on server):
   ```bash
   docker pull vijikumaresh/educonnect-backend:latest
   docker pull vijikumaresh/educonnect-frontend:latest
   ```

2. **Use in docker-compose**:
   Update `docker-compose.dockerhub.yml` to use the latest images

3. **Deploy**:
   Deploy using the Docker Hub images on your production server

---

**Ready to push? Run:** `./push-to-dockerhub.sh`

