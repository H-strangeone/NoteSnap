#!/bin/bash

# GoalSync Deployment Script
echo "🎯 GoalSync Deployment Script"
echo "=============================="

# Check if deployment type is provided
if [ $# -eq 0 ]; then
    echo "Usage: ./deploy.sh [vercel|railway|heroku|docker]"
    exit 1
fi

DEPLOYMENT_TYPE=$1

# Generate session secret if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update DATABASE_URL in .env file"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

case $DEPLOYMENT_TYPE in
    "vercel")
        echo "🚀 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    
    "railway")
        echo "🚂 Deploying to Railway..."
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        railway login
        railway up
        ;;
    
    "heroku")
        echo "🟣 Deploying to Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "Please install Heroku CLI first"
            exit 1
        fi
        
        # Check if git repo exists
        if [ ! -d .git ]; then
            git init
            git add .
            git commit -m "Initial commit"
        fi
        
        # Create Heroku app if needed
        if ! heroku apps:info &> /dev/null; then
            heroku create goalsync-$(date +%s)
        fi
        
        git push heroku main
        ;;
    
    "docker")
        echo "🐳 Building Docker image..."
        docker build -t goalsync .
        echo "✅ Docker image built successfully!"
        echo "Run with: docker run -p 5000:5000 --env-file .env goalsync"
        ;;
    
    *)
        echo "❌ Unknown deployment type: $DEPLOYMENT_TYPE"
        echo "Available options: vercel, railway, heroku, docker"
        exit 1
        ;;
esac

echo "✅ Deployment script completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your Supabase database using the schema in DEPLOYMENT_GUIDE.md"
echo "2. Configure environment variables in your deployment platform"
echo "3. Test your deployed application"
echo ""
echo "🔗 Don't forget to set these environment variables:"
echo "   - DATABASE_URL (from Supabase)"
echo "   - SESSION_SECRET (generate with: npm run generate-secret)"
echo "   - NODE_ENV=production"