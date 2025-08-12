# 🎯 GoalSync - Social Goal Tracking App

A comprehensive goal tracking and social accountability application built with modern web technologies. Track personal and team goals, monitor progress with visual indicators, capture memories with photos, and maintain fitness tracking with step counters.

![GoalSync](https://img.shields.io/badge/GoalSync-v1.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)
![React](https://img.shields.io/badge/React-18+-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e.svg)

## ✨ Features

### 🎯 Goal Management
- **Personal & Team Goals**: Create individual goals or collaborate with others
- **Visual Progress Tracking**: Interactive progress bars with milestone support
- **Categories & Tags**: Organize goals by type (fitness, career, personal, etc.)
- **Time Estimation**: Set target dates and track completion timelines
- **Milestone System**: Break down goals into manageable steps

### 📸 Progress Memories
- **Photo Upload**: Capture progress moments with photos and captions
- **Memory Gallery**: Browse your journey with beautiful photo galleries
- **Progress Documentation**: Link photos to specific goals and milestones
- **Visual Timeline**: See your progress over time with photo memories

### 🏃‍♀️ Fitness Tracking
- **Step Counter Integration**: Track daily steps and activity
- **Comprehensive Metrics**: Monitor distance, calories, active minutes
- **Health Data**: Record weight, heart rate, and personal notes
- **Weekly Analytics**: View trends and patterns in your fitness data
- **Goal Correlation**: Connect fitness achievements to your goals

### 👥 Social Features
- **Team Collaboration**: Share goals with friends and family
- **Progress Sharing**: Show your achievements and milestones
- **Activity Feed**: Stay updated on team progress and celebrations
- **Accountability Partners**: Get support from your network

### 📊 Analytics & Insights
- **Progress Analytics**: Detailed charts and statistics
- **Completion Rates**: Track your success patterns
- **Time Analysis**: Understand your goal completion timelines
- **Habit Tracking**: Monitor daily check-ins and consistency

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for responsive, utility-first styling
- **Radix UI** components for accessible and customizable UI
- **TanStack React Query** for powerful server state management
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for forms

### Backend Stack
- **Express.js** with TypeScript for the API server
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database with Supabase hosting
- **Session-based authentication** with secure middleware
- **File upload handling** with Multer and Supabase Storage

### Database & Storage
- **Supabase** for database hosting and real-time features
- **PostgreSQL** with optimized schema design
- **File Storage** for progress photos and user content
- **Real-time subscriptions** for collaborative features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database and storage)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/goalsync.git
   cd goalsync
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/goalsync
   SESSION_SECRET=your-super-secret-session-key-with-at-least-32-characters
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
goalsync/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Base UI components (buttons, cards, etc.)
│   │   │   ├── fitness-tracker.tsx
│   │   │   ├── photo-upload.tsx
│   │   │   ├── memory-gallery.tsx
│   │   │   └── navigation.tsx
│   │   ├── pages/        # Page components
│   │   │   ├── dashboard.tsx
│   │   │   ├── goals.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── fitness.tsx
│   │   │   └── landing.tsx
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and configurations
│   │   └── App.tsx       # Main application component
│   └── index.html
├── server/                # Express.js backend
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations layer
│   ├── simple-auth.ts    # Authentication middleware
│   ├── supabase.ts       # Supabase client configuration
│   └── index.ts          # Server entry point
├── shared/                # Shared type definitions
│   └── schema.ts         # Database schema and types
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── DEPLOYMENT_GUIDE.md   # Comprehensive deployment instructions
└── README.md
```

## 🗄️ Database Schema

The application uses a well-designed PostgreSQL schema with the following main entities:

- **Users**: User profiles and authentication
- **Goals**: Goal definitions with progress tracking
- **Milestones**: Goal breakdown into smaller steps
- **Progress Entries**: Progress updates with optional photos
- **Daily Check-ins**: Mood and fitness tracking
- **Photo Memories**: Progress photo gallery
- **Fitness Tracking**: Comprehensive health metrics
- **Activities**: Social feed and notifications
- **Goal Collaborators**: Team goal management

## 🎨 UI/UX Design

### Design Principles
- **Clean & Intuitive**: Minimalist design focused on usability
- **Responsive**: Mobile-first approach with desktop optimization
- **Accessible**: WCAG 2.1 compliant with keyboard navigation
- **Consistent**: Design system with reusable components
- **Performance**: Optimized loading and smooth animations

### Color Scheme
- **Primary**: Blue tones for trust and reliability
- **Secondary**: Green accents for progress and success
- **Neutral**: Slate grays for text and backgrounds
- **Accent**: Warm colors for highlights and calls-to-action

## 🔒 Security Features

- **Secure Authentication**: Session-based auth with secure cookies
- **Input Validation**: Zod schema validation on all inputs
- **File Upload Security**: Type and size validation for images
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: Session-based CSRF mitigation

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Automatic compression and resizing
- **Caching Strategy**: React Query for intelligent caching
- **Bundle Optimization**: Tree shaking and minification
- **Database Indexing**: Optimized queries with proper indexes
- **CDN Integration**: Supabase CDN for global content delivery

## 🚀 Deployment

GoalSync can be deployed to various platforms. See our comprehensive [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions for:

- **Vercel** (Recommended) - Seamless full-stack deployment
- **Railway** - Simple deployment with built-in database options
- **Heroku** - Traditional PaaS deployment
- **DigitalOcean** - App Platform deployment
- **Self-hosted** - Docker containerization option

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- Component testing with Jest/React Testing Library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for excellent database and storage services
- **Vercel** for seamless deployment platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **The Open Source Community** for amazing tools and libraries

## 🆘 Support

- **Documentation**: Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/goalsync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/goalsync/discussions)
- **Email**: support@goalsync.app

---

Built with ❤️ by the GoalSync team. Start tracking your goals today! 🎯