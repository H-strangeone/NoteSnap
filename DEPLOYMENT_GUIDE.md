# 🚀 GoalSync Deployment Guide

This comprehensive guide covers deploying GoalSync to various platforms with Supabase as the database and file storage backend.

## 📋 Prerequisites

Before deploying, you'll need:

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Git Repository** - Your code should be in a Git repository
3. **Deployment Platform Account** - Choose from Vercel, Railway, Heroku, or others

## 🗄️ Supabase Setup

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `goalsync` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Wait for project creation (2-3 minutes)

### 2. Get Database Connection Details

1. In your project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string
4. Replace `[YOUR-PASSWORD]` with your actual database password

### 3. Set Up Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table for authentication
CREATE TABLE sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

-- Create index for session expiration
CREATE INDEX IDX_session_expire ON sessions(expire);

-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR NOT NULL DEFAULT 'personal',
  target_date TIMESTAMP,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  is_team_goal BOOLEAN DEFAULT false,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Milestones table
CREATE TABLE milestones (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  goal_id VARCHAR NOT NULL REFERENCES goals(id),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Goal collaborators table
CREATE TABLE goal_collaborators (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id VARCHAR NOT NULL REFERENCES goals(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  role VARCHAR DEFAULT 'collaborator',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress entries table (enhanced with photo support)
CREATE TABLE progress_entries (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id VARCHAR NOT NULL REFERENCES goals(id),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  previous_progress INTEGER DEFAULT 0,
  new_progress INTEGER NOT NULL,
  notes TEXT,
  photo_url VARCHAR,
  photo_caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily checkins table (enhanced with fitness data)
CREATE TABLE daily_checkins (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  mood VARCHAR NOT NULL,
  notes TEXT,
  steps INTEGER DEFAULT 0,
  photo_url VARCHAR,
  photo_caption TEXT,
  date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activities table for feed
CREATE TABLE activities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id),
  goal_id VARCHAR REFERENCES goals(id),
  milestone_id VARCHAR REFERENCES milestones(id),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Photo memories table
CREATE TABLE photo_memories (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  goal_id VARCHAR REFERENCES goals(id),
  progress_entry_id VARCHAR REFERENCES progress_entries(id),
  photo_url VARCHAR NOT NULL,
  caption TEXT,
  tags VARCHAR[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fitness tracking table
CREATE TABLE fitness_tracking (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL REFERENCES users(id),
  date TIMESTAMP DEFAULT NOW(),
  steps INTEGER DEFAULT 0,
  distance INTEGER DEFAULT 0,
  calories INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  heart_rate INTEGER,
  weight INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Set Up Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `progress-photos`
3. Set it to **Public** (for easy image access)
4. Configure policies for authenticated uploads:

```sql
-- Allow authenticated users to upload photos
INSERT INTO storage.policies (id, name, bucket_id, policy_type, definition)
VALUES (
  'Authenticated users can upload photos',
  'progress-photos-upload',
  'progress-photos',
  'INSERT',
  'auth.role() = ''authenticated'''
);

-- Allow public read access to photos
INSERT INTO storage.policies (id, name, bucket_id, policy_type, definition)
VALUES (
  'Public read access',
  'progress-photos-read',
  'progress-photos',
  'SELECT',
  'true'
);
```

### 5. Get API Keys

1. Go to **Settings** → **API**
2. Copy your:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon public** key

## 🌐 Platform Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent performance and easy deployment for full-stack applications.

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
SESSION_SECRET=your-super-secret-session-key-with-at-least-32-characters
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=production
```

#### Step 4: Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Link to existing project**: No
- **Project name**: goalsync (or your choice)
- **Directory**: ./ (root)
- **Want to override settings**: No

#### Step 5: Set Environment Variables in Vercel
```bash
vercel env add DATABASE_URL
vercel env add SESSION_SECRET
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add NODE_ENV
```

Or set them in the Vercel dashboard under Project → Settings → Environment Variables.

#### Step 6: Redeploy
```bash
vercel --prod
```

### Option 2: Railway

Railway offers simple deployment with built-in PostgreSQL if you prefer not to use Supabase.

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
railway init
```

#### Step 3: Set Environment Variables
```bash
railway variables set DATABASE_URL="your-supabase-connection-string"
railway variables set SESSION_SECRET="your-session-secret"
railway variables set SUPABASE_URL="your-supabase-url"
railway variables set SUPABASE_ANON_KEY="your-supabase-key"
railway variables set NODE_ENV="production"
```

#### Step 4: Deploy
```bash
railway up
```

### Option 3: Heroku

#### Step 1: Install Heroku CLI
Download from [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)

#### Step 2: Create Heroku App
```bash
heroku create your-app-name
```

#### Step 3: Set Environment Variables
```bash
heroku config:set DATABASE_URL="your-supabase-connection-string"
heroku config:set SESSION_SECRET="your-session-secret"
heroku config:set SUPABASE_URL="your-supabase-url"
heroku config:set SUPABASE_ANON_KEY="your-supabase-key"
heroku config:set NODE_ENV="production"
```

#### Step 4: Deploy
```bash
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Choose **Web Service**
3. Set build command: `npm run build`
4. Set run command: `npm start`
5. Add environment variables in the dashboard
6. Deploy

## 🔧 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres` |
| `SESSION_SECRET` | Secret key for session encryption | `your-32-character-secret-key` |
| `SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by most platforms) | `5000` |

## 🎯 Post-Deployment Setup

### 1. Test Your Deployment

1. Visit your deployed URL
2. Test user registration/login
3. Create a goal and track progress
4. Upload a progress photo
5. Record fitness data
6. Check analytics

### 2. Configure Custom Domain (Optional)

#### Vercel:
1. Go to Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

#### Railway:
1. Go to Project → Settings → Domains
2. Add custom domain
3. Update DNS records

### 3. Set Up Monitoring

Consider adding monitoring tools:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for usage analytics

## 🔍 Troubleshooting

### Common Issues:

**1. Database Connection Fails**
- Verify DATABASE_URL format
- Check Supabase project is active
- Confirm password in connection string

**2. Photos Won't Upload**
- Check SUPABASE_URL and SUPABASE_ANON_KEY
- Verify storage bucket exists and is public
- Check storage policies are configured

**3. Session Issues**
- Ensure SESSION_SECRET is set
- Check it's at least 32 characters
- Verify sessions table exists

**4. Build Fails**
- Run `npm run build` locally first
- Check for TypeScript errors
- Verify all dependencies are installed

### Getting Help:

1. Check deployment platform logs
2. Check Supabase logs in dashboard
3. Test locally with production environment variables
4. Review the [GitHub Issues](https://github.com/your-repo/issues) for common problems

## 🚀 Performance Optimization

### 1. Database Optimization
- Add indexes for frequently queried columns
- Use connection pooling
- Monitor query performance in Supabase

### 2. Image Optimization
- Compress images before upload
- Use Supabase's built-in image transformations
- Implement lazy loading for image galleries

### 3. Caching
- Enable Vercel's edge caching
- Use React Query for client-side caching
- Consider Redis for session storage at scale

## 📊 Scaling Considerations

As your app grows:

1. **Database**: Supabase handles scaling automatically
2. **File Storage**: Monitor storage usage and costs
3. **Compute**: Most platforms offer auto-scaling
4. **CDN**: Use Vercel's global CDN or Cloudflare

---

🎉 **Congratulations!** Your GoalSync app is now deployed and ready for users to track their goals, share progress photos, and monitor their fitness journey!

For updates and support, refer to the project documentation or create an issue in the repository.