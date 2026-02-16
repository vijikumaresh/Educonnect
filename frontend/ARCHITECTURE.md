# EduConnect - Architecture Diagram

## Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                          │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTP
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                        React Application                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     App.tsx (Routing)                      │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │           AuthProvider (Context)                     │ │ │
│  │  │  - Authentication State                              │ │ │
│  │  │  - Login/Logout Functions                            │ │ │
│  │  │  - User Session Management                           │ │ │
│  │  └────────────────────┬─────────────────────────────────┘ │ │
│  │                       │                                     │ │
│  │  ┌────────────────────▼─────────────────────────────────┐ │ │
│  │  │          React Router DOM                            │ │ │
│  │  │  ┌────────────┐  ┌────────────┐  ┌───────────────┐ │ │ │
│  │  │  │ /          │  │ /dashboard │  │ /* (redirect) │ │ │ │
│  │  │  │ LoginPage  │  │ Dashboard  │  │ to /          │ │ │ │
│  │  │  │            │  │ (Protected)│  │               │ │ │ │
│  │  │  └────────────┘  └────────────┘  └───────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
│
├─── AuthProvider (Context)
│    │
│    └─── Router
│         │
│         ├─── Route: "/"
│         │    └─── LoginPage
│         │         ├── Login Form
│         │         ├── Input Fields
│         │         └── Submit Button
│         │
│         └─── Route: "/dashboard"
│              └─── ProtectedRoute
│                   └─── Dashboard
│                        ├── Header (Company Name + Logout)
│                        │
│                        └── Dashboard Content
│                             ├── Sidebar (30%)
│                             │   ├── Add Contact Button
│                             │   └── Navigation Menu
│                             │       ├── Students
│                             │       ├── Reports
│                             │       └── Settings
│                             │
│                             └── Main Content (70%)
│                                  ├── StudentForm (conditional)
│                                  │   ├── Name Input
│                                  │   ├── Phone Input
│                                  │   ├── Email Input
│                                  │   ├── College Input
│                                  │   ├── Address Textarea
│                                  │   ├── Exam Checkboxes
│                                  │   └── Action Buttons
│                                  │
│                                  └── StudentList (conditional)
│                                       ├── Empty State (if no students)
│                                       └── Student Cards Grid
│                                            └── StudentCard (each)
│                                                ├── Avatar
│                                                ├── Student Info
│                                                ├── Contact Details
│                                                ├── Exam Badges
│                                                └── Edit/Delete Buttons
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         User Actions                              │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ├─── Login
         │    ├─► AuthContext.login()
         │    ├─► Save to localStorage
         │    └─► Navigate to /dashboard
         │
         ├─── Add Student
         │    ├─► Click "Add Contact"
         │    ├─► Show StudentForm
         │    ├─► Fill & Validate
         │    ├─► Submit Form
         │    ├─► Generate ID & Timestamp
         │    ├─► Add to students array
         │    └─► Show StudentList
         │
         ├─── Edit Student
         │    ├─► Click "Edit" on card
         │    ├─► Load data into StudentForm
         │    ├─► Modify & Validate
         │    ├─► Submit Form
         │    ├─► Update in students array
         │    └─► Show StudentList
         │
         ├─── Delete Student
         │    ├─► Click "Delete" on card
         │    ├─► Show confirmation
         │    ├─► Remove from students array
         │    └─► Update StudentList
         │
         └─── Logout
              ├─► AuthContext.logout()
              ├─► Clear localStorage
              └─► Navigate to /
```

## State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                   Application State                              │
│                                                                   │
│  ┌────────────────────┐     ┌────────────────────────────────┐  │
│  │   AuthContext      │     │   Dashboard Component State     │  │
│  │                    │     │                                 │  │
│  │  - user: User|null │     │  - students: Student[]          │  │
│  │  - isAuthenticated │     │  - showForm: boolean            │  │
│  │                    │     │  - editingStudent: Student|null │  │
│  └────────────────────┘     └────────────────────────────────┘  │
│           │                              │                       │
│           │                              │                       │
│  [localStorage]                  [In-Memory]                     │
│  - Persisted                     - Lost on refresh               │
│  - Survives reload               - Can connect to API            │
└─────────────────────────────────────────────────────────────────┘
```

## File Dependencies

```
main.tsx
  └─► App.tsx
       ├─► App.css
       ├─► index.css
       │
       ├─► AuthContext.tsx
       │    └─► types/index.ts
       │
       └─► React Router
            │
            ├─► LoginPage.tsx
            │    ├─► LoginPage.css
            │    ├─► AuthContext.tsx
            │    └─► types/index.ts
            │
            ├─► ProtectedRoute.tsx
            │    └─► AuthContext.tsx
            │
            └─► Dashboard.tsx
                 ├─► Dashboard.css
                 ├─► AuthContext.tsx
                 ├─► types/index.ts
                 │
                 ├─► Sidebar.tsx
                 │    └─► Sidebar.css
                 │
                 ├─► StudentForm.tsx
                 │    ├─► StudentForm.css
                 │    └─► types/index.ts
                 │
                 └─► StudentList.tsx
                      ├─► StudentList.css
                      └─► types/index.ts
```

## User Journey Map

```
START
  │
  ▼
┌─────────────────┐
│  Open Browser   │
│  Visit App URL  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│     Login Page              │
│  ┌───────────────────────┐  │
│  │ Username: [______]    │  │
│  │ Password: [______]    │  │
│  │      [Login Button]   │  │
│  └───────────────────────┘  │
└────────┬────────────────────┘
         │ (Enter any credentials)
         ▼
┌────────────────────────────────────────────────┐
│           Dashboard - Initial View              │
│  ┌─────────┬─────────────────────────────────┐ │
│  │ Sidebar │  Empty State Message            │ │
│  │ [+ Add] │  "No Students Yet"              │ │
│  │ □ Stud  │  "Click Add Contact..."         │ │
│  │ □ Rep   │                                 │ │
│  │ □ Set   │                                 │ │
│  └─────────┴─────────────────────────────────┘ │
└───────┬────────────────────────────────────────┘
        │
        ▼ (Click Add Contact)
┌────────────────────────────────────────────────┐
│         Dashboard - Add Student                 │
│  ┌─────────┬─────────────────────────────────┐ │
│  │ Sidebar │  Student Form                   │ │
│  │ [+ Add] │  Name: [___]                    │ │
│  │         │  Phone: [___]                   │ │
│  │         │  Email: [___]                   │ │
│  │         │  College: [___]                 │ │
│  │         │  Address: [___]                 │ │
│  │         │  Exams: ☐☐☐☐☐☐                  │ │
│  │         │  [Cancel] [Add Student]         │ │
│  └─────────┴─────────────────────────────────┘ │
└───────┬────────────────────────────────────────┘
        │
        ▼ (Submit Form)
┌────────────────────────────────────────────────┐
│       Dashboard - Student List View             │
│  ┌─────────┬─────────────────────────────────┐ │
│  │ Sidebar │  Students (1)                   │ │
│  │ [+ Add] │  ┌─────────────────────────┐   │ │
│  │ ■ Stud  │  │ [A] Alice Johnson       │   │ │
│  │ □ Rep   │  │     MIT College          │   │ │
│  │ □ Set   │  │ 📞 📧 📍                 │   │ │
│  │         │  │ [UPSC] [NEET]            │   │ │
│  │         │  │ [Edit] [Delete]          │   │ │
│  │         │  └─────────────────────────┘   │ │
│  └─────────┴─────────────────────────────────┘ │
└────────────────────────────────────────────────┘
        │
        ├─► Click Edit → Edit Form → Update List
        ├─► Click Delete → Confirm → Update List
        ├─► Click Add Contact → New Form → Add to List
        └─► Click Logout → Return to Login Page
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│                                                               │
│  HTML5 + CSS3 (Custom Properties, Flexbox, Grid)             │
│  - Modern gradients and animations                           │
│  - Responsive design with media queries                      │
│  - Professional typography and spacing                       │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    Component Layer                           │
│                                                               │
│  React 18.2 (Functional Components + Hooks)                  │
│  - useState, useEffect, useContext                           │
│  - Custom hooks (useAuth)                                    │
│  - Component composition                                     │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      Type Layer                              │
│                                                               │
│  TypeScript 5.2                                              │
│  - Interface definitions                                     │
│  - Type checking                                             │
│  - IntelliSense support                                      │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                     Routing Layer                            │
│                                                               │
│  React Router DOM 6.20                                       │
│  - Client-side routing                                       │
│  - Protected routes                                          │
│  - Navigation management                                     │
└─────────────────────────────────────────────────────────────┘
                          ▲
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      Build Layer                             │
│                                                               │
│  Vite 5.0                                                    │
│  - Fast HMR (Hot Module Replacement)                         │
│  - Optimized production builds                               │
│  - ES modules support                                        │
└─────────────────────────────────────────────────────────────┘
```

## Security & Validation Flow

```
┌────────────────────────────────────────────────────────┐
│                  User Input                             │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│            Client-Side Validation                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  LoginForm                                       │  │
│  │  - Required fields check                         │  │
│  │  - Non-empty validation                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  StudentForm                                     │  │
│  │  - Required fields (name, phone, email, etc.)   │  │
│  │  - Email format (regex)                          │  │
│  │  - Phone format (10 digits)                      │  │
│  │  - Exam selection (at least one)                 │  │
│  │  - Real-time error messages                      │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│              Protected Routes                           │
│                                                          │
│  - Check authentication status                          │
│  - Redirect to login if not authenticated               │
│  - Allow access if authenticated                        │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│              State Management                           │
│                                                          │
│  - AuthContext manages user session                     │
│  - localStorage for persistence                         │
│  - In-memory state for students                         │
└────────────────────────────────────────────────────────┘
```

---

**Legend:**
- `┌─┐ └─┘` = Containers/Sections
- `│` = Vertical connection
- `▼ ▲` = Data flow direction
- `─` = Horizontal connection
- `►` = Action/Process flow

---

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable components
✅ Type-safe development
✅ Easy maintenance
✅ Scalable structure





