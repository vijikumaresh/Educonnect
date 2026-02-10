# 🔍 Missing Folders - User Issue

## The Problem

Your folders and students ARE in the database, but they belong to **different user accounts**!

### Current Database State:

**Users:**
- `vijayalakshmi` - 9 folders (Dindigul, madurai, chennai, mkcjsoil)
- `abarna` - 6 folders (dindigul, karur, chennai)
- `asdfgh` - 3 folders (dindigul with 2 subfolders) ← Most recent user
- `testuser` - No folders

**Students:** 9 students across various folders

---

## 🎯 Solution

### Option 1: Login as Previous User

If you remember the password, login as one of these users:
- **vijayalakshmi** (most data)
- **abarna** 
- **asdfgh** (most recent)

Then you'll see all your folders!

---

### Option 2: Transfer Folders to Current User

If you want to see ALL folders in ONE account, we can merge them.

**Step 1: Check which user you're currently logged in as**
- Open browser DevTools (F12)
- Go to Application tab → Local Storage
- Look for your JWT token or username

**Step 2: Transfer data to that user**

Run this SQL (replace `YOUR_CURRENT_USER_ID` with your actual user ID):

```sql
-- Transfer ALL folders to current user
UPDATE folders SET user_id = 'YOUR_CURRENT_USER_ID';

-- Transfer ALL students to current user  
UPDATE students SET user_id = 'YOUR_CURRENT_USER_ID';
```

---

### Option 3: Create One Master Account

Create a master account and consolidate everything:

```bash
# 1. Login to database
psql -U pc3 -h localhost -d educonnect_app

# 2. Create or use an existing user
# Let's use 'vijayalakshmi' as the master account

# 3. Get vijayalakshmi's user ID
SELECT id FROM users WHERE username = 'vijayalakshmi';
# Result: 77544734-f512-416c-8804-994f65277638

# 4. Transfer all data to vijayalakshmi
UPDATE folders SET user_id = '77544734-f512-416c-8804-994f65277638';
UPDATE students SET user_id = '77544734-f512-416c-8804-994f65277638';

# 5. Verify
SELECT COUNT(*) FROM folders WHERE user_id = '77544734-f512-416c-8804-994f65277638';
# Should show 18 folders

# 6. Exit
\q
```

Then login as **vijayalakshmi** and you'll see ALL 18 folders!

---

## 🚀 Quick Fix (Recommended)

**Make ALL data belong to 'vijayalakshmi' account:**

```bash
psql -U pc3 -h localhost -d educonnect_app << 'EOF'
-- Consolidate everything under vijayalakshmi
UPDATE folders SET user_id = '77544734-f512-416c-8804-994f65277638'
WHERE user_id != '77544734-f512-416c-8804-994f65277638';

UPDATE students SET user_id = '77544734-f512-416c-8804-994f65277638'
WHERE user_id != '77544734-f512-416c-8804-994f65277638';

-- Show results
SELECT 'Folders:', COUNT(*) FROM folders WHERE user_id = '77544734-f512-416c-8804-994f65277638';
SELECT 'Students:', COUNT(*) FROM students WHERE user_id = '77544734-f512-416c-8804-994f65277638';
EOF
```

Then **login as:** `vijayalakshmi`

---

## 📊 Summary

**The folders were NOT deleted!** They're just associated with different user accounts. 

The app shows folders based on who is logged in (multi-user system working as designed).

**Choose:**
1. Login as previous user (fastest)
2. Consolidate all data to one account (recommended if you want everything in one place)
3. Continue with current account and create new folders (clean start)

---

## ✅ After You Choose

Let me know which option you want, and I'll help you:
1. If Option 1: Just login as `vijayalakshmi` or another user
2. If Option 2: I'll run the SQL commands to consolidate everything
3. If Option 3: Create new folders (old data stays in other accounts)

