#!/bin/bash

# Student Save Diagnostic Script
# This script tests if student data is being saved correctly

echo "🔍 Student Save Diagnostic Test"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check if backend is running
echo "1️⃣  Checking if backend is running..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is NOT running${NC}"
    echo "   Please start the backend first:"
    echo "   cd backend && cargo run"
    exit 1
fi
echo ""

# 2. Check database connection
echo "2️⃣  Checking database connection..."
if psql -U pc3 -d educonnect_app -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Cannot connect to database${NC}"
    echo "   Check if PostgreSQL is running"
    exit 1
fi
echo ""

# 3. Check students table schema
echo "3️⃣  Checking students table schema..."
COLUMNS=$(psql -U pc3 -d educonnect_app -t -c "SELECT column_name FROM information_schema.columns WHERE table_name='students'")
echo -e "${GREEN}✅ Students table exists with columns:${NC}"
echo "$COLUMNS" | grep -v "^$" | sed 's/^/   /'
echo ""

# 4. Get auth token (you need to login first)
echo "4️⃣  Testing API authentication..."
echo -e "${YELLOW}ℹ️  You need to be logged in to save students${NC}"
echo "   Please ensure you have logged into the application first"
echo ""

# 5. Check current student count
echo "5️⃣  Checking current student count..."
STUDENT_COUNT=$(psql -U pc3 -d educonnect_app -t -c "SELECT COUNT(*) FROM students")
echo -e "${GREEN}✅ Current students in database: $STUDENT_COUNT${NC}"
echo ""

# 6. Show recent students
echo "6️⃣  Recent students (last 5):"
psql -U pc3 -d educonnect_app -c "SELECT id, name, college_name, phone, created_at FROM students ORDER BY created_at DESC LIMIT 5"
echo ""

# 7. Test creating a student via API (with auth token)
echo "7️⃣  API Test Instructions:"
echo ""
echo "To test saving a student via the API, follow these steps:"
echo ""
echo "a) Login to get your auth token:"
echo "   curl -X POST http://localhost:8080/api/auth/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"username\":\"YOUR_USERNAME\",\"password\":\"YOUR_PASSWORD\"}'"
echo ""
echo "b) Save the token from the response"
echo ""
echo "c) Create a test student:"
echo "   curl -X POST http://localhost:8080/api/students \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer YOUR_TOKEN_HERE' \\"
echo "     -d '{"
echo "       \"name\": \"Test Student\","
echo "       \"phone\": \"1234567890\","
echo "       \"email\": \"test@example.com\","
echo "       \"college_name\": \"Test College\","
echo "       \"address\": \"Test Address\","
echo "       \"exam_preferences\": [\"UPSC\"],"
echo "       \"registration_date\": \"2026-02-09\""
echo "     }'"
echo ""

# 8. Frontend checklist
echo "8️⃣  Frontend Checklist:"
echo ""
echo "   ${YELLOW}Before saving students in the UI, ensure:${NC}"
echo "   ✓ You are logged in"
echo "   ✓ Browser console shows no errors (F12 → Console)"
echo "   ✓ Network tab shows successful API calls (F12 → Network)"
echo "   ✓ All required fields are filled:"
echo "     - Student Name"
echo "     - Phone Number (10 digits)"
echo "     - Email (valid format)"
echo "     - College Name"
echo "     - Address"
echo "     - At least one Exam Preference"
echo "     - Registration Date"
echo ""

# 9. Common issues
echo "9️⃣  Common Issues & Solutions:"
echo ""
echo "   ${RED}Issue: Student not saving${NC}"
echo "   Solution:"
echo "   • Check browser console for errors"
echo "   • Verify all required fields are filled"
echo "   • Check Network tab for API response"
echo "   • Look at backend logs for errors"
echo ""
echo "   ${RED}Issue: No error message shown${NC}"
echo "   Solution:"
echo "   • Open browser DevTools (F12)"
echo "   • Go to Console tab"
echo "   • Try saving again and check errors"
echo ""
echo "   ${RED}Issue: 401 Unauthorized${NC}"
echo "   Solution:"
echo "   • Logout and login again"
echo "   • Check if token is valid"
echo ""

# 10. View backend logs
echo "🔟  Backend Log Location:"
echo "   Terminal where you ran 'cargo run'"
echo "   Look for lines like:"
echo "   - 'Creating student for user: ...'"
echo "   - 'Student created successfully: ...'"
echo "   - 'Error creating student: ...'"
echo ""

# 11. Database monitoring
echo "1️⃣1️⃣  Monitor Database (real-time):"
echo ""
echo "   Watch for new students being added:"
echo "   watch -n 2 'psql -U pc3 -d educonnect_app -c \"SELECT COUNT(*) FROM students\"'"
echo ""

echo "================================"
echo "✅ Diagnostic Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Make sure backend is running (cargo run)"
echo "   2. Make sure frontend is running (npm run dev)"
echo "   3. Login to the application"
echo "   4. Try adding a student"
echo "   5. Check browser console (F12) for any errors"
echo "   6. Check backend terminal for logs"
echo ""
echo "🆘 If students still not saving:"
echo "   Run this script and share the output"
echo "   Also share:"
echo "   - Browser console errors"
echo "   - Backend terminal logs"
echo "   - Network tab request/response"

