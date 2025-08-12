# 📁 GoalSync - Complete Folder Structure

This document provides a comprehensive overview of the GoalSync project's folder structure with enhanced photo upload and fitness tracking features.

## 🗂️ Root Directory Structure

```
goalsync/
├── 📁 client/                     # React Frontend Application
├── 📁 server/                     # Express.js Backend API
├── 📁 shared/                     # Shared TypeScript Types & Schemas
├── 📄 .env.example               # Environment Variables Template
├── 📄 .gitignore                 # Git Ignore Rules
├── 📄 .replit                    # Replit Configuration
├── 📄 components.json            # shadcn/ui Components Configuration
├── 📄 DEPLOYMENT_GUIDE.md        # Comprehensive Deployment Instructions
├── 📄 drizzle.config.ts          # Drizzle ORM Configuration
├── 📄 FOLDER_STRUCTURE.md        # This File - Project Structure Documentation
├── 📄 package.json               # Node.js Dependencies & Scripts
├── 📄 package-lock.json          # Locked Dependency Versions
├── 📄 postcss.config.js          # PostCSS Configuration
├── 📄 README.md                  # Project Documentation & Setup Guide
├── 📄 replit.md                  # Project Architecture & User Preferences
├── 📄 tailwind.config.ts         # Tailwind CSS Configuration
├── 📄 tsconfig.json              # TypeScript Configuration
├── 📄 vite.config.ts             # Vite Build Tool Configuration
└── 📄 vercel.json                # Vercel Deployment Configuration
```

## 🎨 Client Directory (Frontend)

```
client/
├── 📁 src/                       # Source Code
│   ├── 📁 components/            # Reusable React Components
│   │   ├── 📁 ui/               # Base UI Components (shadcn/ui)
│   │   │   ├── accordion.tsx     # Collapsible Content Panels
│   │   │   ├── alert-dialog.tsx  # Confirmation Dialogs
│   │   │   ├── alert.tsx         # Alert Messages
│   │   │   ├── aspect-ratio.tsx  # Image Aspect Ratio Container
│   │   │   ├── avatar.tsx        # User Profile Images
│   │   │   ├── badge.tsx         # Status & Category Badges
│   │   │   ├── breadcrumb.tsx    # Navigation Breadcrumbs
│   │   │   ├── button.tsx        # Interactive Buttons
│   │   │   ├── calendar.tsx      # Date Picker Component
│   │   │   ├── card.tsx          # Content Container Cards
│   │   │   ├── carousel.tsx      # Image/Content Carousel
│   │   │   ├── chart.tsx         # Data Visualization Charts
│   │   │   ├── checkbox.tsx      # Form Checkbox Input
│   │   │   ├── collapsible.tsx   # Expandable Content
│   │   │   ├── command.tsx       # Command Palette
│   │   │   ├── context-menu.tsx  # Right-click Menus
│   │   │   ├── dialog.tsx        # Modal Dialog Windows
│   │   │   ├── drawer.tsx        # Slide-out Panels
│   │   │   ├── dropdown-menu.tsx # Dropdown Navigation
│   │   │   ├── form.tsx          # Form Validation Components
│   │   │   ├── hover-card.tsx    # Hover Information Cards
│   │   │   ├── input-otp.tsx     # One-Time Password Input
│   │   │   ├── input.tsx         # Text Input Fields
│   │   │   ├── label.tsx         # Form Field Labels
│   │   │   ├── menubar.tsx       # Application Menu Bar
│   │   │   ├── navigation-menu.tsx # Complex Navigation
│   │   │   ├── pagination.tsx    # Page Navigation Controls
│   │   │   ├── popover.tsx       # Floating Content Panels
│   │   │   ├── progress.tsx      # Progress Bar Indicators
│   │   │   ├── radio-group.tsx   # Radio Button Groups
│   │   │   ├── resizable.tsx     # Resizable Panel Layout
│   │   │   ├── scroll-area.tsx   # Custom Scrollable Areas
│   │   │   ├── select.tsx        # Dropdown Selection
│   │   │   ├── separator.tsx     # Visual Content Dividers
│   │   │   ├── sheet.tsx         # Side Panel Overlays
│   │   │   ├── sidebar.tsx       # Application Sidebar
│   │   │   ├── skeleton.tsx      # Loading State Placeholders
│   │   │   ├── slider.tsx        # Range Input Sliders
│   │   │   ├── switch.tsx        # Toggle Switches
│   │   │   ├── table.tsx         # Data Table Components
│   │   │   ├── tabs.tsx          # Tabbed Content Interface
│   │   │   ├── textarea.tsx      # Multi-line Text Input
│   │   │   ├── toast.tsx         # Notification Toasts
│   │   │   ├── toaster.tsx       # Toast Container
│   │   │   ├── toggle-group.tsx  # Toggle Button Groups
│   │   │   ├── toggle.tsx        # Toggle Buttons
│   │   │   └── tooltip.tsx       # Hover Tooltips
│   │   ├── daily-checkin.tsx      # Daily Mood & Progress Check-in
│   │   ├── fitness-tracker.tsx    # 🏃‍♀️ Fitness Data Input & Display
│   │   ├── goal-card.tsx         # Individual Goal Display
│   │   ├── goal-form.tsx         # Goal Creation/Editing Form
│   │   ├── memory-gallery.tsx    # 📸 Progress Photo Gallery
│   │   ├── navigation.tsx        # Main App Navigation Bar
│   │   ├── photo-upload.tsx      # 📷 Photo Upload Component
│   │   ├── progress-bar.tsx      # Visual Progress Indicators
│   │   └── team-activity.tsx     # Social Activity Feed
│   ├── 📁 hooks/                # Custom React Hooks
│   │   ├── use-mobile.tsx        # Mobile Device Detection
│   │   ├── use-toast.ts          # Toast Notification Hook
│   │   └── useAuth.ts            # Authentication State Hook
│   ├── 📁 lib/                  # Utility Libraries
│   │   ├── authUtils.ts          # Authentication Helper Functions
│   │   ├── queryClient.ts        # React Query Configuration
│   │   └── utils.ts              # General Utility Functions
│   ├── 📁 pages/                # Route Page Components
│   │   ├── analytics.tsx         # 📊 Analytics & Insights Dashboard
│   │   ├── dashboard.tsx         # 🏠 Main Dashboard Home Page
│   │   ├── fitness.tsx           # 🏃‍♀️ Fitness Tracking Page
│   │   ├── goals.tsx             # 🎯 Goals Management Page
│   │   ├── landing.tsx           # 🌟 Landing Page for Logged-out Users
│   │   └── not-found.tsx         # 404 Error Page
│   ├── App.tsx                   # Main Application Component
│   ├── index.css                 # Global Styles & CSS Variables
│   └── main.tsx                  # Application Entry Point
└── index.html                    # HTML Template
```

## ⚙️ Server Directory (Backend)

```
server/
├── db.ts                         # Database Connection Configuration
├── index.ts                     # Express Server Entry Point
├── replitAuth.ts                 # Replit OIDC Authentication Setup
├── routes.ts                     # 🛤️ API Route Definitions
├── simple-auth.ts               # Development Authentication Middleware
├── storage.ts                   # 🗄️ Database Operations Layer
├── supabase.ts                  # 📦 Supabase Client & File Upload
├── tsconfig.json                # TypeScript Configuration for Server
└── vite.ts                      # Vite Development Server Integration
```

## 🔗 Shared Directory (Common Types)

```
shared/
└── schema.ts                    # 📋 Database Schema & TypeScript Types
    ├── Users Table Definition
    ├── Goals Table Definition
    ├── Milestones Table Definition
    ├── Progress Entries Table (with photo support)
    ├── Daily Check-ins Table (with fitness data)
    ├── Activities Table (social feed)
    ├── Photo Memories Table 📸
    ├── Fitness Tracking Table 🏃‍♀️
    ├── Goal Collaborators Table
    ├── Sessions Table (authentication)
    └── Type Exports & Validation Schemas
```

## 📋 Key Features by Directory

### 🎯 Goal Management (`client/src/components/goal-*.tsx`)
- **Goal Creation**: Form-based goal setup with categories
- **Progress Tracking**: Visual progress bars with milestone support
- **Team Collaboration**: Multi-user goal sharing and permissions
- **Time Tracking**: Target dates and completion analytics

### 📸 Photo & Memory Features (`*photo*.tsx`, `*memory*.tsx`)
- **Photo Upload**: Drag-and-drop image upload with validation
- **Memory Gallery**: Grid-based photo browsing with modal view
- **Progress Documentation**: Link photos to specific goals and milestones
- **Caption Support**: Rich text descriptions for progress photos

### 🏃‍♀️ Fitness Tracking (`*fitness*.tsx`)
- **Step Counter**: Daily step tracking and history
- **Health Metrics**: Weight, heart rate, calories, distance monitoring
- **Activity Logging**: Exercise sessions and active minutes
- **Weekly Analytics**: Trend analysis and goal correlation

### 🔐 Authentication & Security
- **Session Management**: Secure server-side sessions
- **User Profiles**: Profile management with avatars
- **Authorization**: Route-level access control
- **Input Validation**: Comprehensive data validation with Zod

### 📊 Analytics & Insights (`analytics.tsx`)
- **Progress Charts**: Visual goal completion trends
- **Habit Tracking**: Daily check-in consistency
- **Team Analytics**: Collaborative goal statistics
- **Fitness Correlations**: Health data vs goal achievement

## 🗃️ Database Schema Overview

### Core Tables
1. **users** - User profiles and authentication
2. **goals** - Goal definitions and progress tracking
3. **milestones** - Goal breakdown into smaller steps
4. **progress_entries** - Progress updates with optional photos
5. **daily_checkins** - Daily mood and fitness check-ins

### Enhanced Features
6. **photo_memories** - Progress photo gallery with captions
7. **fitness_tracking** - Comprehensive health and activity metrics
8. **activities** - Social feed and notification system
9. **goal_collaborators** - Team goal management
10. **sessions** - Authentication session storage

## 🎨 UI/UX Architecture

### Design System
- **shadcn/ui**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling approach
- **Radix UI**: Headless components for complex interactions
- **Lucide Icons**: Consistent iconography throughout

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Desktop Enhancement**: Rich desktop experience
- **Touch-Friendly**: Large tap targets and gestures
- **Keyboard Navigation**: Full accessibility support

## 🚀 Build & Deployment

### Development
- **Vite**: Fast development server with HMR
- **TypeScript**: Type safety across frontend and backend
- **Hot Reload**: Instant code changes reflection
- **Path Aliases**: Clean import statements

### Production
- **Code Splitting**: Optimized bundle sizes
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: Automatic image compression
- **CDN Integration**: Global content delivery

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, and metadata |
| `tsconfig.json` | TypeScript compilation settings |
| `tailwind.config.ts` | Tailwind CSS customization |
| `vite.config.ts` | Build tool configuration |
| `drizzle.config.ts` | Database ORM settings |
| `components.json` | UI component library setup |
| `.env.example` | Environment variables template |

---

This structure supports a comprehensive goal tracking application with modern web development practices, enhanced photo sharing capabilities, and integrated fitness tracking features. The architecture is designed for scalability, maintainability, and excellent user experience across all devices.