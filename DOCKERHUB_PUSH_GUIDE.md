# 🐳 Docker Hub Push Guide for Educonnect

## 📋 Docker Image Names

**Choose your Docker Hub username** (replace `YOUR_USERNAME` with your actual Docker Hub username):

### Recommended Image Names:
```
Frontend: YOUR_USERNAME/educonnect-frontend:latest
Backend:  YOUR_USERNAME/educonnect-backend:latest
```

### Example (if your Docker Hub username is "vijikumaresh"):
```
Frontend: vijikumaresh/educonnect-frontend:latest
Backend:  vijikumaresh/educonnect-backend:latest
```

---

## 🚀 Step-by-Step Commands

### **Step 1: Login to Docker Hub**

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

---

### **Step 2: Build Frontend Image**

```bash
cd /home/pc3/Desktop/Educonnect/frontend

docker build \
  --build-arg VITE_API_URL=http://localhost:8080/api \
  -t YOUR_USERNAME/educonnect-frontend:latest \
  .
```

**Example:**
```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:8080/api \
  -t vijikumaresh/educonnect-frontend:latest \
  .
```

---

### **Step 3: Build Backend Image**

```bash
cd /home/pc3/Desktop/Educonnect/backend

docker build \
  -t YOUR_USERNAME/educonnect-backend:latest \
  .
```

**Example:**
```bash
docker build \
  -t vijikumaresh/educonnect-backend:latest \
  .
```

---

### **Step 4: Push Frontend to Docker Hub**

```bash
docker push YOUR_USERNAME/educonnect-frontend:latest
```

**Example:**
```bash
docker push vijikumaresh/educonnect-frontend:latest
```

---

### **Step 5: Push Backend to Docker Hub**

```bash
docker push YOUR_USERNAME/educonnect-backend:latest
```

**Example:**
```bash
docker push vijikumaresh/educonnect-backend:latest
```

---

## 📦 All Commands in One Script

Create a file `push-to-dockerhub.sh`:

```bash
#!/bin/bash

# Set your Docker Hub username
DOCKER_USERNAME="YOUR_USERNAME"  # Change this to your Docker Hub username

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Logging into Docker Hub...${NC}"
docker login

echo -e "${BLUE}🏗️  Building Backend Image...${NC}"
cd /home/pc3/Desktop/Educonnect/backend
docker build -t ${DOCKER_USERNAME}/educonnect-backend:latest .

echo -e "${BLUE}🏗️  Building Frontend Image...${NC}"
cd /home/pc3/Desktop/Educonnect/frontend
docker build \
  --build-arg VITE_API_URL=http://localhost:8080/api \
  -t ${DOCKER_USERNAME}/educonnect-frontend:latest \
  .

echo -e "${BLUE}📤 Pushing Backend to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/educonnect-backend:latest

echo -e "${BLUE}📤 Pushing Frontend to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/educonnect-frontend:latest

echo -e "${GREEN}✅ Done! Your images are now on Docker Hub!${NC}"
echo -e "${GREEN}Backend:  ${DOCKER_USERNAME}/educonnect-backend:latest${NC}"
echo -e "${GREEN}Frontend: ${DOCKER_USERNAME}/educonnect-frontend:latest${NC}"
```

**Make it executable:**
```bash
chmod +x push-to-dockerhub.sh
```

**Run it:**
```bash
./push-to-dockerhub.sh
```

---

## 🏷️ Versioning (Optional)

If you want to tag specific versions:

```bash
# Tag with version number
docker tag YOUR_USERNAME/educonnect-frontend:latest YOUR_USERNAME/educonnect-frontend:v1.0.0
docker tag YOUR_USERNAME/educonnect-backend:latest YOUR_USERNAME/educonnect-backend:v1.0.0

# Push versioned tags
docker push YOUR_USERNAME/educonnect-frontend:v1.0.0
docker push YOUR_USERNAME/educonnect-backend:v1.0.0
```

---

## 📋 Updated docker-compose.yml for Docker Hub Images

After pushing to Docker Hub, update your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: educonnect-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: educonnect_app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - educonnect-network

  backend:
    image: YOUR_USERNAME/educonnect-backend:latest
    container_name: educonnect-backend
    restart: unless-stopped
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/educonnect_app
      RUST_LOG: info
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - educonnect-network

  frontend:
    image: YOUR_USERNAME/educonnect-frontend:latest
    container_name: educonnect-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - educonnect-network

networks:
  educonnect-network:
    driver: bridge

volumes:
  postgres_data:
```

---

## ✅ Verify Images on Docker Hub

After pushing, verify your images:
1. Go to https://hub.docker.com
2. Login
3. Check your repositories
4. You should see:
   - `educonnect-frontend`
   - `educonnect-backend`

---

## 🔄 Pull Images from Docker Hub

Anyone can now pull your images:

```bash
docker pull YOUR_USERNAME/educonnect-frontend:latest
docker pull YOUR_USERNAME/educonnect-backend:latest
```

---

## 🎯 Quick Reference

| Component | Image Name | Size (Approx) |
|-----------|------------|---------------|
| Frontend | `YOUR_USERNAME/educonnect-frontend:latest` | ~50 MB |
| Backend | `YOUR_USERNAME/educonnect-backend:latest` | ~150 MB |
| Database | `postgres:16-alpine` | ~80 MB |

---

## 💡 Tips

1. **Private vs Public**: By default, Docker Hub repositories are public. To make them private, change settings on Docker Hub.

2. **Build Context**: Make sure you're in the correct directory when building images.

3. **Multi-architecture**: To build for multiple platforms (ARM, x86):
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 -t YOUR_USERNAME/educonnect-frontend:latest --push .
   ```

4. **CI/CD**: Consider automating builds with GitHub Actions or Bitbucket Pipelines.

---

## 🐛 Troubleshooting

**Issue: "denied: requested access to the resource is denied"**
- Solution: Make sure you're logged in: `docker login`

**Issue: Build fails due to memory**
- Solution: Increase Docker memory in Docker Desktop settings

**Issue: Push is slow**
- Solution: Your upload speed limits the push time. Be patient!

---

## 📞 Need Help?

- Docker Hub: https://hub.docker.com
- Docker Docs: https://docs.docker.com
- Educonnect Support: Contact your team

---

**Created**: February 28, 2026  
**Version**: 1.0

