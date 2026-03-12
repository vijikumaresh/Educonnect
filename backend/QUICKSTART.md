# EduConnect Rust Backend - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

Make sure you have Rust installed. If not, install it:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verify installation:
```bash
rustc --version
cargo --version
```

---

## 📦 Installation Steps

### Step 1: Navigate to Backend Directory

```bash
cd /home/pc3/Desktop/Educonnect/backend
```

### Step 2: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Or create `.env` manually with:

```env
DATABASE_URL=sqlite:./educonnect.db
JWT_SECRET=your-secret-key-change-this-in-production
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
RUST_LOG=info
```

**Important:** Change `JWT_SECRET` to a random string in production!

### Step 3: Build the Project

```bash
cargo build --release
```

This will:
- Download all dependencies
- Compile the Rust code
- Create an optimized binary

**Note:** First build may take 5-10 minutes.

### Step 4: Run the Server

```bash
cargo run --release
```

Or run the compiled binary:

```bash
./target/release/educonnect-backend
```

The server will start at: **http://127.0.0.1:8080**

---

## ✅ Verify Installation

### 1. Check Health Endpoint

```bash
curl http://localhost:8080/health
```

Should return: `OK`

### 2. Test Registration

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

Should return a JWT token and username.

### 3. Test Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

Should return a JWT token.

---

## 🔧 Development Commands

### Run in Development Mode
```bash
cargo run
```

### Build for Production
```bash
cargo build --release
```

### Check Code (Fast)
```bash
cargo check
```

### Format Code
```bash
cargo fmt
```

### Run Linter
```bash
cargo clippy
```

### Clean Build Files
```bash
cargo clean
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.rs               # Entry point & server setup
│   ├── models.rs             # Data structures & DTOs
│   ├── db.rs                 # Database connection & migrations
│   └── handlers/
│       ├── mod.rs            # Module exports
│       ├── auth.rs           # Authentication endpoints
│       └── students.rs       # Student CRUD endpoints
├── Cargo.toml                # Dependencies & project config
├── .env                      # Environment variables (create this)
├── .env.example              # Environment template
├── README.md                 # Main documentation
├── API_DOCUMENTATION.md      # API reference
└── QUICKSTART.md            # This file
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Authentication
- `POST /auth/register` - Create new user
- `POST /auth/login` - Login and get token

### Students (Requires Auth)
- `GET /students` - Get all students
- `POST /students` - Create student
- `GET /students/{id}` - Get single student
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student

### Health
- `GET /health` - Server health check

---

## 🔐 Authentication

All student endpoints require a JWT token:

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' | jq -r '.token')

# 2. Use token in requests
curl -X GET http://localhost:8080/api/students \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🗄️ Database

The backend uses SQLite with automatic migrations.

- Database file: `educonnect.db`
- Location: Backend directory
- Migrations: Run automatically on startup

### Reset Database

```bash
rm educonnect.db*
cargo run
```

---

## 🌐 Connecting Frontend

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`

To update the frontend to use the backend, see the frontend integration guide.

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in .env
SERVER_PORT=3000
```

### Database Locked

```bash
# Remove database files
rm educonnect.db*

# Restart server
cargo run
```

### Compilation Errors

```bash
# Clean and rebuild
cargo clean
cargo build --release
```

### CORS Issues

Check that the frontend origin is added in `src/main.rs`:

```rust
.allowed_origin("http://localhost:5173")
```

---

## 📊 Monitoring

### View Logs

The server logs all requests and important events:

```bash
cargo run
```

Logs include:
- Server startup
- Database connections
- API requests
- Errors and warnings

### Adjust Log Level

In `.env`:
```env
RUST_LOG=debug  # More verbose
RUST_LOG=info   # Normal
RUST_LOG=error  # Errors only
```

---

## 🚀 Production Deployment

### Build Optimized Binary

```bash
cargo build --release
```

### Binary Location

```bash
./target/release/educonnect-backend
```

### Run in Production

```bash
# Update .env with production values
JWT_SECRET=<strong-random-string>
SERVER_HOST=0.0.0.0
SERVER_PORT=8080

# Run the binary
./target/release/educonnect-backend
```

### Keep Running (systemd example)

Create `/etc/systemd/system/educonnect.service`:

```ini
[Unit]
Description=EduConnect Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/backend
ExecStart=/path/to/backend/target/release/educonnect-backend
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable educonnect
sudo systemctl start educonnect
```

---

## 📚 Additional Resources

- **README.md** - Full documentation
- **API_DOCUMENTATION.md** - Complete API reference
- [Actix-web Documentation](https://actix.rs/)
- [SQLx Documentation](https://docs.rs/sqlx/)
- [Rust Book](https://doc.rust-lang.org/book/)

---

## ✨ Features

✅ **User Authentication** - Secure registration and login  
✅ **JWT Tokens** - Stateless authentication  
✅ **Password Hashing** - Bcrypt with salt  
✅ **CRUD Operations** - Full student management  
✅ **Database** - SQLite with migrations  
✅ **CORS** - Configured for frontend  
✅ **Logging** - Request and error logging  
✅ **Type Safety** - Rust's strong type system  

---

**Ready to go!** 🎉

The backend is now set up and ready to handle requests from your frontend application.

For API details, see **API_DOCUMENTATION.md**























