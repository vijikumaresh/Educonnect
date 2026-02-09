# EduConnect - Student Management System

**ONE27 Educational Services Private Limited**

A modern, feature-rich student management system built with React and TypeScript.

## 🎯 Features

- **Authentication System**: Secure login page with session management
- **Dashboard Layout**: 30:70 split layout with sidebar navigation
- **Student Management**: Add, edit, view, and delete student records
- **Exam Preferences**: Track student preferences for UPSC, TNPSC, SSC, NEET, BANKING, and RRB
- **Responsive Design**: Beautiful UI that works on all devices
- **Form Validation**: Comprehensive validation for all student information

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔐 Authentication

For demo purposes, you can log in with any username and password combination. In production, this would be connected to a proper authentication backend.

## 📋 Usage

1. **Login**: Enter any username and password to access the system
2. **Add Student**: Click the "Add Contact" button in the sidebar
3. **Fill Form**: Enter student details including:
   - Student Name
   - Phone Number
   - Email ID
   - College Name
   - Address
   - Exam Preferences (select one or more)
4. **View Students**: All students are displayed in a card grid layout
5. **Edit/Delete**: Use the buttons on each card to modify or remove students

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS3 with CSS Variables

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── ProtectedRoute.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StudentForm.tsx
│   │   └── StudentList.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   └── LoginPage.tsx
│   ├── styles/            # CSS files
│   │   ├── Dashboard.css
│   │   ├── LoginPage.css
│   │   ├── Sidebar.css
│   │   ├── StudentForm.css
│   │   └── StudentList.css
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main App component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Card-based student display
- Responsive grid layouts
- Professional color scheme
- Intuitive user interface
- Form validation with error messages

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔮 Future Enhancements

- Backend API integration
- Database persistence
- Advanced search and filtering
- Export to CSV/Excel
- Student performance tracking
- Notification system
- Multi-user role management

## 👨‍💻 Development

This project uses:
- ESLint for code quality
- TypeScript for type safety
- CSS custom properties for theming
- React Context for state management

## 📄 License

Copyright © 2026 ONE27 Educational Services Private Limited

