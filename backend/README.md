# EduConnect Backend API

Rust backend for the EduConnect Student Management System.

## 🚀 Features

- **User Authentication** - Register and login with JWT tokens
- **Student Management** - Full CRUD operations for students
- **Secure** - Password hashing with bcrypt
- **Fast** - Built with Actix-web framework
- **Database** - SQLite with SQLx

## 📦 Tech Stack

- **Rust** - Systems programming language
- **Actix-web** - Web framework
- **SQLx** - SQL toolkit with compile-time verification
- **SQLite** - Embedded database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing

## 🛠️ Installation

### Prerequisites

- Rust (1.70 or higher)
- Cargo (comes with Rust)

### Setup

1. Navigate to backend directory:
```bash
cd /home/pc3/Desktop/Educonnect/backend
```

2. Create `.env` file:
```bash
DATABASE_URL=sqlite:./educonnect.db
JWT_SECRET=your-secret-key-change-this-in-production
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
RUST_LOG=info
```

3. Build the project:
```bash
cargo build --release
```

4. Run the server:
```bash
cargo run --release
```

The server will start at `http://127.0.0.1:8080`

## 📡 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john"
}
```

### Students

All student endpoints require authentication via Bearer token.

#### Create Student
```http
POST /api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "phone": "1234567890",
  "email": "alice@example.com",
  "college_name": "MIT",
  "address": "123 Main St, City",
  "exam_preferences": ["UPSC", "NEET"]
}
```

#### Get All Students
```http
GET /api/students
Authorization: Bearer <token>
```

#### Get Single Student
```http
GET /api/students/{id}
Authorization: Bearer <token>
```

#### Update Student
```http
PUT /api/students/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Johnson",
  "phone": "1234567890",
  "email": "alice@example.com",
  "college_name": "MIT",
  "address": "123 Main St, City",
  "exam_preferences": ["UPSC", "NEET", "BANKING"]
}
```

#### Delete Student
```http
DELETE /api/students/{id}
Authorization: Bearer <token>
```

### Health Check
```http
GET /health
```

Returns: `OK`

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
);
```

### Students Table
```sql
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    college_name TEXT NOT NULL,
    address TEXT NOT NULL,
    exam_preferences TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔐 Security

- Passwords are hashed using bcrypt (cost factor 12)
- JWT tokens expire after 24 hours
- Users can only access their own students
- CORS configured for frontend origin

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password123"}'
```

### Create Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name":"John Doe",
    "phone":"1234567890",
    "email":"john@example.com",
    "college_name":"MIT",
    "address":"123 Main St",
    "exam_preferences":["UPSC","NEET"]
  }'
```

### Get Students
```bash
curl -X GET http://localhost:8080/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.rs           - Entry point & server config
│   ├── models.rs         - Data models & DTOs
│   ├── db.rs             - Database setup & migrations
│   └── handlers/
│       ├── mod.rs        - Handler module exports
│       ├── auth.rs       - Authentication handlers
│       └── students.rs   - Student CRUD handlers
├── Cargo.toml            - Dependencies
├── .env                  - Environment variables
└── README.md             - This file
```

## 🚀 Development

### Run in development mode:
```bash
cargo run
```

### Build for production:
```bash
cargo build --release
./target/release/educonnect-backend
```

### Check code:
```bash
cargo check
```

### Format code:
```bash
cargo fmt
```

### Run linter:
```bash
cargo clippy
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | SQLite database path | sqlite:./educonnect.db |
| JWT_SECRET | Secret key for JWT tokens | secret |
| SERVER_HOST | Server host address | 127.0.0.1 |
| SERVER_PORT | Server port | 8080 |
| RUST_LOG | Logging level | info |

## 🔧 Troubleshooting

### Port already in use
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

### Database locked
```bash
# Remove database and restart
rm educonnect.db*
cargo run
```

## 📄 License

Copyright © 2026 ONE27 Educational Services Private Limited























