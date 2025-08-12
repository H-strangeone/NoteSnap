# GoalSync - Complete Deployment Guide

## 📦 Complete Codebase Structure

```
goalsync/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── goal-card.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── daily-checkin.tsx
│   │   │   └── team-activity.tsx
│   │   ├── pages/
│   │   │   ├── landing.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── goals.tsx
│   │   │   └── analytics.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── use-toast.ts
│   │   │   └── use-mobile.tsx
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   ├── queryClient.ts
│   │   │   └── authUtils.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   ├── simple-auth.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── drizzle.config.ts
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.json
└── deployment files...
```

## 🚀 Deployment Options

### Option 1: Deploy to Vercel with Supabase (Recommended)

#### Step 1: Set up Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

#### Step 2: Run SQL Schema Setup

In your Supabase SQL Editor, run:

```sql
-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL DEFAULT 'personal',
  target_date TIMESTAMP,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_team_goal BOOLEAN DEFAULT FALSE,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  goal_id VARCHAR NOT NULL REFERENCES goals(id),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create goal_collaborators table
CREATE TABLE IF NOT EXISTS goal_collaborators (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id VARCHAR NOT NULL REFERENCES goals(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  role VARCHAR DEFAULT 'collaborator',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create progress_entries table
CREATE TABLE IF NOT EXISTS progress_entries (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id VARCHAR NOT NULL REFERENCES goals(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  previous_progress INTEGER DEFAULT 0,
  new_progress INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create daily_checkins table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  mood VARCHAR NOT NULL,
  notes TEXT,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  goal_id VARCHAR REFERENCES goals(id),
  milestone_id VARCHAR REFERENCES milestones(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Step 3: Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` in root:**
   ```json
   {
     "functions": {
       "server/index.ts": {
         "runtime": "@vercel/node"
       }
     },
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/index.html"
       }
     ],
     "buildCommand": "npm run build",
     "outputDirectory": "dist"
   }
   ```

3. **Update `package.json` scripts:**
   ```json
   {
     "scripts": {
       "build": "npm run build:client && npm run build:server",
       "build:client": "vite build",
       "build:server": "tsc && cp -r dist/client dist/server/public",
       "start": "node dist/server/index.js"
     }
   }
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Set Environment Variables in Vercel:**
   - `DATABASE_URL`: Your Supabase connection string
   - `SESSION_SECRET`: A random 32+ character string
   - `NODE_ENV`: `production`

### Option 2: Deploy to Railway

1. **Connect to Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   ```

2. **Set Environment Variables:**
   ```bash
   railway variables set DATABASE_URL="your-supabase-url"
   railway variables set SESSION_SECRET="your-session-secret"
   railway variables set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

### Option 3: Deploy to Heroku

1. **Install Heroku CLI and login:**
   ```bash
   heroku create your-app-name
   ```

2. **Set Environment Variables:**
   ```bash
   heroku config:set DATABASE_URL="your-supabase-url"
   heroku config:set SESSION_SECRET="your-session-secret"
   heroku config:set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

## 📱 Mobile App Options

### Option 1: Progressive Web App (PWA)
Add `manifest.json` to make it installable on mobile devices:

```json
{
  "name": "GoalSync",
  "short_name": "GoalSync",
  "description": "Social goal tracking app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Option 2: React Native with Expo
1. **Install Expo CLI:**
   ```bash
   npm install -g @expo/cli
   expo init GoalSyncMobile --template typescript
   ```

2. **Reuse the API endpoints** from your deployed web version
3. **Install navigation:**
   ```bash
   npm install @react-navigation/native @react-navigation/stack
   ```

### Option 3: Capacitor for iOS/Android
1. **Install Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Add platforms:**
   ```bash
   npx cap add ios
   npx cap add android
   ```

## 🔧 Environment Variables Needed

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-very-long-random-secret-key-here
NODE_ENV=development
PORT=5000
```

## 🚨 Important Notes

1. **Database URL Format:** Make sure your Supabase URL follows this format:
   ```
   postgresql://postgres.abc123:password@aws-0-region.pooler.supabase.com:5432/postgres
   ```

2. **Session Secret:** Generate a strong random string (32+ characters) for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **CORS:** The app is configured to work with same-origin requests. For separate frontend/backend deployments, update CORS settings.

4. **Authentication:** Currently uses simple demo authentication. For production, implement proper OAuth or JWT authentication.

## 🎯 Features Included

- ✅ Goal creation and management
- ✅ Progress tracking with visual progress bars  
- ✅ Milestone management
- ✅ Daily check-ins
- ✅ Team collaboration
- ✅ Activity feed
- ✅ Analytics dashboard
- ✅ Responsive design
- ✅ Database persistence
- ✅ Session management

## 📞 Support

If you need help with deployment or customization, the code is fully documented and modular for easy modification.