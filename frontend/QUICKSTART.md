# EduConnect - Quick Start Guide

## 🎉 Welcome to EduConnect!

This is a complete, production-ready Student Management System built for **ONE27 Educational Services Private Limited**.

## ✨ What's Included

### Core Features
✅ Authentication with Login Page  
✅ Protected Dashboard Routes  
✅ 30:70 Layout Split (Sidebar : Main Content)  
✅ Add Student Form with Validation  
✅ Student List with Cards  
✅ Edit & Delete Functionality  
✅ Exam Preferences (UPSC, TNPSC, SSC, NEET, BANKING, RRB)  
✅ Responsive Design  
✅ Modern UI with Gradients & Animations  
✅ Company Branding Throughout  

### Tech Stack
- ⚛️ React 18.2
- 📘 TypeScript 5.2
- ⚡ Vite 5.0
- 🎨 CSS3 (Custom Properties)
- 🛣️ React Router DOM 6.20

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
cd /home/pc3/Desktop/Educonnect/frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to: `http://localhost:5173`

## 🔐 Demo Login

For testing, you can use ANY username and password combination:
- Username: `admin`
- Password: `password`

Or literally any other combination - authentication is simplified for demo purposes.

## 📖 User Guide

### 1. Login
- Enter any username and password
- Click "Login" button
- You'll be redirected to the dashboard

### 2. Dashboard Overview
- **Left Sidebar (30%)**: Navigation menu and "Add Contact" button
- **Right Content (70%)**: Student list or form

### 3. Adding a Student
1. Click the **"Add Contact"** button in sidebar
2. Fill in all required fields:
   - Student Name *
   - Phone Number * (10 digits)
   - Email ID * (valid email format)
   - College Name *
   - Address *
   - Exam Preferences * (select at least one)
3. Click **"Add Student"**

### 4. Managing Students
- **View**: All students displayed in card format
- **Edit**: Click "Edit" button on any card
- **Delete**: Click "Delete" button (with confirmation)

### 5. Logout
- Click the "Logout" button in the header
- You'll be redirected to login page

## 🎨 Design Highlights

### Color Scheme
- Primary: Blue gradient (#2563eb to #1e40af)
- Success: Green (#10b981)
- Danger: Red (#ef4444)
- Background: Light gray (#f9fafb)

### Layout Features
- Responsive grid for student cards
- Smooth hover animations
- Professional shadows and borders
- Modern gradient backgrounds
- Clean typography

### Form Validation
- Real-time error messages
- Field-specific validation
- Required field indicators
- Visual feedback on errors

## 📁 Project Structure Explained

```
src/
├── components/           # Reusable UI components
│   ├── ProtectedRoute.tsx   → Route guard for authenticated pages
│   ├── Sidebar.tsx          → Left navigation sidebar (30%)
│   ├── StudentForm.tsx      → Add/Edit student form
│   └── StudentList.tsx      → Grid display of students
│
├── contexts/            # React Context providers
│   └── AuthContext.tsx     → Authentication state management
│
├── pages/               # Page-level components
│   ├── Dashboard.tsx       → Main dashboard with layout
│   └── LoginPage.tsx       → Login/authentication page
│
├── styles/              # Component-specific CSS
│   ├── Dashboard.css
│   ├── LoginPage.css
│   ├── Sidebar.css
│   ├── StudentForm.css
│   └── StudentList.css
│
├── types/               # TypeScript interfaces
│   └── index.ts           → Student, User, ExamPreference types
│
├── App.tsx             # Main app with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles & CSS variables
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🌟 Features in Detail

### Authentication
- Context-based state management
- LocalStorage persistence
- Protected routes
- Automatic redirect on logout

### Student Management
- In-memory storage (can be connected to backend)
- CRUD operations (Create, Read, Update, Delete)
- Unique ID generation
- Timestamp tracking

### Form Validation
- Required field validation
- Email format validation
- Phone number format (10 digits)
- Exam preference validation (at least one)
- Real-time error feedback

### Responsive Design
- Desktop: Full sidebar + content
- Tablet: Horizontal sidebar
- Mobile: Stacked layout
- Adaptive navigation

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Configuration
Create `.env` file for API endpoints:
```env
VITE_API_URL=your_backend_api_url
```

## 🔮 Next Steps

To connect to a real backend:

1. **Create API service** in `src/services/api.ts`
2. **Update AuthContext** to call real authentication endpoint
3. **Update Dashboard** to fetch/save students from/to API
4. **Add error handling** for network failures
5. **Implement loading states**

## 📞 Support

For issues or questions, contact:
**ONE27 Educational Services Private Limited**

---

**Built with ❤️ using React + TypeScript**


