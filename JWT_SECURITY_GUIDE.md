# JWT Security Enhancement Guide

## 🔒 Security Improvements Made

### 1. **Required JWT_SECRET Environment Variable**
- **Before**: Defaulted to "secret" if not set (major security risk)
- **After**: Server will fail to start if JWT_SECRET is not set
- **Benefit**: Prevents accidental deployment with weak secrets

### 2. **Enhanced JWT Claims**
- **Added `iat` (Issued At)**: Tracks when token was issued
- **Added `jti` (JWT ID)**: Unique identifier for each token (prevents replay attacks)
- **Existing `exp`**: Token expiration (24 hours)
- **Benefit**: Better token tracking and security auditing

### 3. **Strict Token Validation**
- **Algorithm Validation**: Only accepts HS256 algorithm
- **Expiration Validation**: Strict expiration checking (no leeway)
- **Token Tampering Detection**: Additional checks for token integrity
- **Benefit**: Prevents algorithm confusion attacks and expired token usage

### 4. **Improved Error Handling**
- **Security Logging**: Logs security-related errors
- **No Information Leakage**: Generic error messages to prevent information disclosure
- **Benefit**: Better security monitoring without exposing internal details

## 🚀 Setup Instructions

### Step 1: Generate a Secure JWT Secret

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Option 3: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 4: Online Generator**
- Use a secure random string generator
- Minimum 32 characters recommended
- Use a mix of letters, numbers, and special characters

### Step 2: Set JWT_SECRET Environment Variable

**For Development (.env file):**
```bash
cd /home/pc3/Desktop/Educonnect/backend
cat >> .env << EOF
JWT_SECRET=your-generated-secret-here-minimum-32-characters-long
EOF
```

**For Production:**
```bash
export JWT_SECRET="your-generated-secret-here-minimum-32-characters-long"
```

**For Docker:**
Update `docker-compose.yml`:
```yaml
environment:
  JWT_SECRET: "your-generated-secret-here-minimum-32-characters-long"
```

### Step 3: Verify Setup

Start the backend and check logs:
```bash
cd /home/pc3/Desktop/Educonnect/backend
DATABASE_URL="postgres://pc3@localhost/educonnect_app" cargo run
```

**If JWT_SECRET is missing, you'll see:**
```
ERROR: JWT_SECRET environment variable is not set! This is a security risk.
```

**If JWT_SECRET is too short, you'll see:**
```
WARN: JWT_SECRET is too short (X chars). Minimum 32 characters recommended for security.
```

## 🔐 Security Best Practices

### 1. **JWT Secret Requirements**
- ✅ **Minimum 32 characters** (recommended: 64+)
- ✅ **Random and unpredictable**
- ✅ **Different for each environment** (dev, staging, production)
- ✅ **Never commit to version control**
- ✅ **Rotate periodically** (every 90 days recommended)

### 2. **Token Security**
- ✅ Tokens expire after 24 hours
- ✅ Each token has unique ID (jti)
- ✅ Tokens include issued timestamp (iat)
- ✅ Algorithm is strictly validated (HS256 only)

### 3. **Environment Security**
- ✅ Use environment variables (never hardcode)
- ✅ Use `.env` file for development (add to `.gitignore`)
- ✅ Use secure secret management in production (AWS Secrets Manager, HashiCorp Vault, etc.)
- ✅ Restrict access to JWT_SECRET

### 4. **Production Checklist**
- [ ] JWT_SECRET is at least 32 characters
- [ ] JWT_SECRET is randomly generated
- [ ] JWT_SECRET is different from development
- [ ] JWT_SECRET is stored securely (not in code)
- [ ] JWT_SECRET is rotated periodically
- [ ] HTTPS is enabled (tokens sent over encrypted connection)
- [ ] Token expiration is appropriate for your use case

## 📋 Token Structure

### Claims Included:
```json
{
  "sub": "user-id-uuid",
  "username": "user123",
  "exp": 1234567890,  // Expiration timestamp
  "iat": 1234567890,  // Issued at timestamp
  "jti": "token-uuid" // Unique token ID
}
```

### Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

## ⚠️ Important Notes

1. **Backend Will Not Start Without JWT_SECRET**
   - The server will return an error if JWT_SECRET is missing
   - This prevents accidental insecure deployments

2. **Existing Tokens Will Be Invalid**
   - After updating JWT_SECRET, all existing tokens will be invalid
   - Users will need to log in again

3. **Token Rotation**
   - When rotating JWT_SECRET, plan for user re-authentication
   - Consider implementing refresh tokens for smoother transitions

4. **Development vs Production**
   - Use different secrets for each environment
   - Never use production secrets in development

## 🔄 Migration Steps

If you're upgrading from the old insecure version:

1. **Generate new JWT_SECRET** (see Step 1 above)
2. **Update environment variable** (see Step 2 above)
3. **Restart backend server**
4. **Users will need to log in again** (existing tokens invalidated)
5. **Verify new tokens work** (check token structure)

## 🛠️ Troubleshooting

### Error: "JWT_SECRET environment variable is not set"
**Solution**: Set JWT_SECRET in your environment or .env file

### Error: "Invalid or expired token"
**Possible causes**:
- Token expired (24 hours)
- JWT_SECRET changed
- Token was tampered with
- Token format is invalid

**Solution**: User needs to log in again

### Warning: "JWT_SECRET is too short"
**Solution**: Generate a longer secret (minimum 32 characters)

## 📚 Additional Resources

- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [JWT.io](https://jwt.io/) - Debug and verify JWT tokens

