# 🎯 GoalSync - Social Goal Tracking App

A comprehensive goal tracking application with progress visualization, team collaboration, and social accountability features.

## ✨ Features

- 📊 **Visual Progress Tracking** - Interactive progress bars and analytics
- 🎯 **Goal Management** - Create, edit, and organize personal and team goals
- 🏆 **Milestone Tracking** - Break down goals into manageable milestones
- 📱 **Daily Check-ins** - Track mood and daily progress
- 👥 **Team Collaboration** - Share goals and collaborate with friends
- 📈 **Analytics Dashboard** - View progress trends and statistics
- 🔄 **Activity Feed** - Real-time updates on goal progress

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Supabase recommended)

### Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd goalsync
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and session secret
   ```

3. **Set up database:**
   - Create a Supabase project
   - Run the SQL schema from `DEPLOYMENT_GUIDE.md`
   - Update `DATABASE_URL` in `.env`

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Visit http://localhost:5000**

## 🗄️ Database Setup

The app uses PostgreSQL with the following tables:
- `users` - User profiles and authentication
- `goals` - Goal data with progress tracking
- `milestones` - Goal milestones and subtasks
- `goal_collaborators` - Team collaboration data
- `progress_entries` - Progress history tracking
- `daily_checkins` - Daily mood and progress check-ins
- `activities` - Activity feed and notifications
- `sessions` - Session management for authentication

## 🔧 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- TanStack Query for state management
- Wouter for routing
- React Hook Form + Zod validation

**Backend:**
- Node.js + Express
- TypeScript
- Drizzle ORM
- Session-based authentication
- PostgreSQL database

**Deployment:**
- Vercel (recommended)
- Railway
- Heroku
- Docker support

## 📱 Mobile App

The app is fully responsive and can be deployed as:
- **Progressive Web App (PWA)** - Installable on mobile devices
- **React Native** - Native iOS/Android apps
- **Capacitor** - Hybrid mobile apps

## 🚀 Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions for:
- Vercel + Supabase
- Railway
- Heroku
- Docker

## 🔐 Authentication

Currently uses simple session-based authentication with demo users. For production, consider implementing:
- OAuth (Google, GitHub, etc.)
- JWT tokens
- Replit Auth (if deploying on Replit)

## 🛠️ Development

### Project Structure
```
├── client/          # React frontend
├── server/          # Express backend  
├── shared/          # Shared TypeScript types
├── package.json     # Dependencies and scripts
└── deployment/      # Deployment configurations
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes

## 📄 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For deployment help or customization, refer to the detailed `DEPLOYMENT_GUIDE.md` or create an issue.