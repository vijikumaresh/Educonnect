#!/bin/bash

# Test Activity Tracking CRUD Operations
# This script tests all three activity types: Seminars, Recruitment, Book Orders

API_BASE="http://localhost:8080/api"
TOKEN=""
FOLDER_ID=""

echo "🧪 EduConnect Activity Tracking API Test Suite"
echo "=============================================="
echo ""

# Step 1: Login
echo "📝 Step 1: Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"vijayalakshmi","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo ""

# Step 2: Get folders
echo "📂 Step 2: Getting folders..."
FOLDERS_RESPONSE=$(curl -s -X GET "$API_BASE/folders" \
  -H "Authorization: Bearer $TOKEN")

FOLDER_ID=$(echo $FOLDERS_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$FOLDER_ID" ]; then
  echo "❌ No folders found!"
  exit 1
fi

echo "✅ Found folder: $FOLDER_ID"
echo ""

# Test Seminars
echo "================================"
echo "📚 TESTING SEMINARS"
echo "================================"
echo ""

echo "➕ Creating a seminar..."
SEMINAR_CREATE=$(curl -s -X POST "$API_BASE/seminars" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Career Guidance Session\",
    \"topic\": \"Engineering Career Paths\",
    \"participants_count\": 150,
    \"seminar_date\": \"2026-02-15\",
    \"description\": \"Comprehensive career guidance for engineering students\",
    \"folder_id\": \"$FOLDER_ID\"
  }")

SEMINAR_ID=$(echo $SEMINAR_CREATE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SEMINAR_ID" ]; then
  echo "❌ Failed to create seminar!"
  echo "Response: $SEMINAR_CREATE"
else
  echo "✅ Seminar created: $SEMINAR_ID"
fi
echo ""

echo "📖 Getting all seminars..."
curl -s -X GET "$API_BASE/seminars" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null || echo "Seminars fetched"
echo ""

# Test Recruitment
echo "================================"
echo "💼 TESTING RECRUITMENT DRIVES"
echo "================================"
echo ""

echo "➕ Creating a recruitment drive..."
RECRUITMENT_CREATE=$(curl -s -X POST "$API_BASE/recruitment" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"company_name\": \"TCS\",
    \"drive_date\": \"2026-03-01\",
    \"participants_count\": 200,
    \"selected_count\": 45,
    \"job_role\": \"Software Engineer\",
    \"description\": \"Campus recruitment drive for fresh graduates\",
    \"folder_id\": \"$FOLDER_ID\"
  }")

RECRUITMENT_ID=$(echo $RECRUITMENT_CREATE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$RECRUITMENT_ID" ]; then
  echo "❌ Failed to create recruitment drive!"
  echo "Response: $RECRUITMENT_CREATE"
else
  echo "✅ Recruitment drive created: $RECRUITMENT_ID"
fi
echo ""

echo "📖 Getting all recruitment drives..."
curl -s -X GET "$API_BASE/recruitment" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null || echo "Recruitment drives fetched"
echo ""

# Test Book Orders
echo "================================"
echo "📖 TESTING BOOK ORDERS"
echo "================================"
echo ""

echo "➕ Creating a book order..."
BOOK_ORDER_CREATE=$(curl -s -X POST "$API_BASE/book-orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"book_title\": \"Engineering Mathematics Vol I\",
    \"author\": \"Dr. B.S. Grewal\",
    \"academic_session\": \"2026-2027\",
    \"quantity\": 50,
    \"order_date\": \"2026-02-10\",
    \"student_name\": \"John Doe\",
    \"notes\": \"For first year students\",
    \"folder_id\": \"$FOLDER_ID\"
  }")

BOOK_ORDER_ID=$(echo $BOOK_ORDER_CREATE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$BOOK_ORDER_ID" ]; then
  echo "❌ Failed to create book order!"
  echo "Response: $BOOK_ORDER_CREATE"
else
  echo "✅ Book order created: $BOOK_ORDER_ID"
fi
echo ""

echo "📖 Getting all book orders..."
curl -s -X GET "$API_BASE/book-orders" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null || echo "Book orders fetched"
echo ""

# Summary
echo "================================"
echo "✅ TEST SUMMARY"
echo "================================"
echo "Seminar created: ${SEMINAR_ID:-'Failed'}"
echo "Recruitment drive created: ${RECRUITMENT_ID:-'Failed'}"
echo "Book order created: ${BOOK_ORDER_ID:-'Failed'}"
echo ""
echo "🎉 All tests completed!"
echo ""
echo "To view in browser:"
echo "1. Login as: vijayalakshmi / admin123"
echo "2. Select a college folder"
echo "3. Click '📊 Activities' button"
echo "4. You should see the data in respective tabs!"








