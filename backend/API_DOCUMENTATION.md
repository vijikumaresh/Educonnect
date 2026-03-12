# EduConnect API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string (required, unique)",
  "password": "string (required, min 6 chars)"
}
```

**Response:** `201 Created`
```json
{
  "token": "string",
  "username": "string"
}
```

**Error Responses:**
- `409 Conflict` - Username already exists
- `500 Internal Server Error` - Server error

---

### 2. Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "token": "string",
  "username": "string"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### 3. Create Student

Add a new student.

**Endpoint:** `POST /students`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (required)",
  "college_name": "string (required)",
  "address": "string (required)",
  "exam_preferences": ["string"] (required, array)
}
```

**Example:**
```json
{
  "name": "Alice Johnson",
  "phone": "1234567890",
  "email": "alice@example.com",
  "college_name": "MIT",
  "address": "123 Main St, Boston, MA",
  "exam_preferences": ["UPSC", "NEET", "BANKING"]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "college_name": "string",
  "address": "string",
  "exam_preferences": ["string"],
  "created_at": "ISO 8601 datetime"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

### 4. Get All Students

Retrieve all students for the authenticated user.

**Endpoint:** `GET /students`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "string",
    "phone": "string",
    "email": "string",
    "college_name": "string",
    "address": "string",
    "exam_preferences": ["string"],
    "created_at": "ISO 8601 datetime"
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

### 5. Get Single Student

Retrieve a specific student by ID.

**Endpoint:** `GET /students/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` - Student UUID

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "college_name": "string",
  "address": "string",
  "exam_preferences": ["string"],
  "created_at": "ISO 8601 datetime"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Student not found
- `500 Internal Server Error` - Server error

---

### 6. Update Student

Update an existing student.

**Endpoint:** `PUT /students/{id}`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `id` - Student UUID

**Request Body:**
```json
{
  "name": "string (required)",
  "phone": "string (required)",
  "email": "string (required)",
  "college_name": "string (required)",
  "address": "string (required)",
  "exam_preferences": ["string"] (required)
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "college_name": "string",
  "address": "string",
  "exam_preferences": ["string"],
  "created_at": "ISO 8601 datetime"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Student not found
- `500 Internal Server Error` - Server error

---

### 7. Delete Student

Delete a student.

**Endpoint:** `DELETE /students/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id` - Student UUID

**Response:** `200 OK`
```json
{
  "message": "Student deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Student not found
- `500 Internal Server Error` - Server error

---

### 8. Health Check

Check if the server is running.

**Endpoint:** `GET /health`

**Response:** `200 OK`
```
OK
```

---

## Data Models

### User
```typescript
{
  id: string (UUID)
  username: string
  password_hash: string (hidden)
  created_at: DateTime
}
```

### Student
```typescript
{
  id: string (UUID)
  name: string
  phone: string
  email: string
  college_name: string
  address: string
  exam_preferences: string[] // ["UPSC", "TNPSC", "SSC", "NEET", "BANKING", "RRB"]
  created_at: DateTime
  updated_at: DateTime
  user_id: string (UUID)
}
```

### JWT Claims
```typescript
{
  sub: string (user_id)
  username: string
  exp: number (unix timestamp)
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Authentication Flow

1. **Register** or **Login** to receive a JWT token
2. Include the token in the `Authorization` header for all subsequent requests
3. Token expires after 24 hours
4. Re-login to get a new token

---

## Example Usage

### Complete Flow with cURL

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}' | jq -r '.token')

# 2. Create a student
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Alice Johnson",
    "phone":"1234567890",
    "email":"alice@example.com",
    "college_name":"MIT",
    "address":"123 Main St",
    "exam_preferences":["UPSC","NEET"]
  }'

# 3. Get all students
curl -X GET http://localhost:8080/api/students \
  -H "Authorization: Bearer $TOKEN"

# 4. Update a student (replace {id} with actual ID)
curl -X PUT http://localhost:8080/api/students/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name":"Alice Johnson",
    "phone":"9876543210",
    "email":"alice.j@example.com",
    "college_name":"MIT",
    "address":"456 Oak Ave",
    "exam_preferences":["UPSC","NEET","BANKING"]
  }'

# 5. Delete a student (replace {id} with actual ID)
curl -X DELETE http://localhost:8080/api/students/{id} \
  -H "Authorization: Bearer $TOKEN"
```

---

## Rate Limiting

Currently, there are no rate limits. In production, consider implementing rate limiting.

## CORS

The API allows requests from:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

To add more origins, update the CORS configuration in `main.rs`.

---

**Last Updated:** February 6, 2026  
**Version:** 1.0.0























