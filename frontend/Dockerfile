# Frontend Dockerfile for Educonnect
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Accept build-time environment variable
ARG VITE_API_URL
ENV VITE_API_URL=https://registerstudentsapi.kattral.ai/api

# Build the application
RUN npm run build

# Runtime stage without nginx
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only what is needed to run the preview server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# Vite preview runtime port
EXPOSE 6375

# Serve built frontend assets
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "6375"]
