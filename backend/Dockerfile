# Backend Dockerfile for Educonnect
FROM rust:latest as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Create dummy main.rs to build dependencies
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY src ./src

# Build the application
RUN touch src/main.rs && \
    cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    libssl3 \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/educonnect-backend /app/educonnect-backend

# Create data directory for SQLite (if needed)
RUN mkdir -p /app/data

# Expose port
EXPOSE 8080

# Set environment variables (override these in docker-compose or at runtime)
# DATABASE_URL should be set at runtime, not in Dockerfile
ENV RUST_LOG=info
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=8080

# Run the binary
CMD ["/app/educonnect-backend"]

