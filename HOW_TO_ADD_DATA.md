# How to Add Data to Educonnect

## Overview

When you first log in, the application will be empty - this is normal! You need to add your own data. Here's how:

## Quick Start: Adding Your First Student

### Step 1: Click "Add Contact" Button

1. After logging in, you'll see the dashboard
2. Look for the **"Add Contact"** button in the sidebar (left side)
3. Click it to open the student form

### Step 2: Fill in Student Information

Fill in all required fields:

- **Student Name** * (required)
- **Phone Number** * (required, 10 digits)
- **Email ID** * (required, valid email format)
- **College Name** * (required)
- **Address** * (required)
- **Exam Preferences** * (required, select at least one):
  - UPSC
  - TNPSC
  - SSC
  - NEET
  - BANKING
  - RRB
- **Registration Date** * (required, defaults to today)

### Step 3: Save the Student

Click the **"Add Student"** button at the bottom of the form.

You should see a success message: "Student saved successfully!"

The student will now appear in the student table.

## Organizing Data with Folders

### Creating Folders

You can organize students by creating folders (e.g., by district, college, etc.):

1. Click **"Create Folder"** button in the sidebar
2. Enter a folder name (e.g., "Chennai District")
3. Click OK

### Creating Subfolders

1. Click on a folder to select it
2. Click **"Create Folder"** again
3. The new folder will be created inside the selected folder

### Adding Students to Folders

1. Select a folder from the sidebar
2. Click **"Add Contact"**
3. Fill in the student form
4. The student will be added to the selected folder

## Viewing Your Data

### View All Students

- Click **"All Students"** (🏠 icon) in the sidebar to see all students regardless of folder

### View Students in a Folder

- Click on any folder in the sidebar to see only students in that folder

### Search and Filter

Once you have students, you can:
- **Search by Name**: Type in the search box
- **Search by College**: Filter by college name
- **Filter by Date**: Select a date to see students added on that date
- **Sort**: Click column headers to sort (click again to reverse)

## Adding Activities

You can also add activities related to students:

### Seminars
1. Select a folder
2. Click on the folder to view its dashboard
3. Click **"Activities"** tab
4. Add seminar information

### Recruitment Drives
1. Same as seminars, but select "Recruitment" tab

### Book Orders
1. Same as seminars, but select "Books" tab

## Troubleshooting

### "No Students in this folder" Message

This is normal when you first start! Just click **"Add Contact"** to add your first student.

### Can't See "Add Contact" Button

- Make sure you're logged in
- Check the sidebar on the left side of the screen
- The button should be visible at the top of the sidebar

### Student Not Appearing After Adding

1. Check the browser console (F12) for errors
2. Make sure the backend is running
3. Try refreshing the page
4. Check if you're viewing the correct folder (click "All Students" to see all)

### Form Validation Errors

- Make sure all required fields are filled
- Phone must be exactly 10 digits
- Email must be in valid format (e.g., user@example.com)
- Password must be at least 6 characters (for account creation)

## Example Workflow

1. **Create a Main Folder** (e.g., "Tamil Nadu Districts")
   - Click "Create Folder"
   - Name it "Tamil Nadu Districts"

2. **Create Subfolders** (e.g., "Chennai", "Coimbatore")
   - Click on "Tamil Nadu Districts"
   - Click "Create Folder" → Name: "Chennai"
   - Click "Create Folder" → Name: "Coimbatore"

3. **Add Students**
   - Click on "Chennai" folder
   - Click "Add Contact"
   - Fill in student details
   - Click "Add Student"

4. **View Your Data**
   - Students appear in the table
   - You can search, filter, and sort
   - Click "All Students" to see everyone

## Tips

- **Start Simple**: Add a few students first to get familiar
- **Use Folders**: Organize by location, college, or any system that works for you
- **Search is Powerful**: Once you have many students, use search to find them quickly
- **Registration Dates**: Use these to track when students registered
- **Exam Preferences**: Students can have multiple exam preferences

## Need Help?

If you're still having issues:
1. Check that both frontend and backend are running
2. Check browser console (F12) for errors
3. Check backend terminal for error messages
4. Make sure you're logged in with a valid account

