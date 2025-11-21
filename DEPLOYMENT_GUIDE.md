# Deployment Guide - ADHD Support UK

This guide explains how to deploy both the frontend and backend independently to Vercel and Render.

## Quick Overview

- **Frontend**: `/client` folder → Deploy to Vercel
- **Backend**: `/server` folder → Deploy to Render (when activated)
- **Current State**: Both projects build successfully with mock data

## Prerequisites

1. GitHub account with repository access
2. Vercel account (free tier sufficient)
3. Render account (free tier sufficient)
4. Environment variables configured

## Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Repository

```bash
git init
git add .
git commit -m "Initial commit: ADHD Support UK full-stack prototype"
git remote add origin https://github.com/YOUR_USERNAME/adhd-support-uk.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select `/client` as the root directory
5. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Step 3: Environment Variables (Frontend)

In Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

(Update with actual Render backend URL after deployment)

### Step 4: Deploy

Click "Deploy" and wait for completion. Your frontend will be live at a URL like:
```
https://adhd-support-uk.vercel.app
```

## Part 2: Deploy Backend to Render

### Prerequisites for Backend

Before deploying the backend, ensure you have:

1. **MongoDB Atlas Account** (free tier)
   - Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/adhd-support-uk`

2. **Backend Code Activated**
   - Follow instructions in `/server/BACKEND_ACTIVATION_GUIDE.md`
   - Implement Mongoose models and Express routes
   - Create `.env` template

### Step 1: Prepare Backend for Deployment

Create `/server/.env.example`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/adhd-support-uk
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://adhd-support-uk.vercel.app
```

### Step 2: Create Render Account and Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `adhd-support-uk-backend`
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

### Step 3: Set Environment Variables on Render

In Render Service Settings → Environment:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/adhd-support-uk
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://adhd-support-uk.vercel.app
```

### Step 4: Deploy

Click "Create Web Service" and monitor deployment logs. Your backend will be live at:
```
https://adhd-support-uk-backend.onrender.com
```

## Part 3: Connect Frontend to Backend

### Step 1: Update Frontend Environment Variables

In Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://adhd-support-uk-backend.onrender.com/api
```

Trigger a redeployment to apply the changes.

### Step 2: Test API Connection

1. Open frontend in browser
2. Check Network tab in DevTools
3. Verify API calls are going to Render backend
4. Verify responses contain expected data

## Deployment Checklist

- [ ] Frontend built successfully (`npm run build` in `/client`)
- [ ] Backend built successfully (`npm run build` in `/server`)
- [ ] MongoDB cluster created and connection string obtained
- [ ] GitHub repository pushed with both `/client` and `/server` folders
- [ ] Vercel project created and environment variables set
- [ ] Render service created and environment variables set
- [ ] Frontend and backend environment variables linked
- [ ] Frontend redeployed after backend URL is known
- [ ] API calls tested and working
- [ ] User authentication flow tested

## Troubleshooting

### Frontend Build Fails on Vercel

**Problem**: Build error with missing dependencies

**Solution**:
```bash
cd client
npm install
npm run build
```

Then push to GitHub and redeploy.

### Backend Not Starting on Render

**Problem**: Service crashes after deployment

**Solution**:
1. Check Render logs for error messages
2. Verify `MONGO_URI` is correct
3. Ensure MongoDB cluster whitelist includes Render IP
4. Check that all environment variables are set

### CORS Errors Between Frontend and Backend

**Problem**: Browser blocks API requests

**Solution**:
1. In backend `index.ts`, ensure CORS is configured:
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```
2. Verify `CORS_ORIGIN` environment variable matches frontend URL

### Data Not Persisting After Restart

**Problem**: Mock data disappears on restart

**Solution**: This is expected behavior for in-memory mock data. Implement MongoDB persistence by following `/server/BACKEND_ACTIVATION_GUIDE.md`.

## Performance Optimization

### Frontend
- Vite bundle is already optimized (~216 KB gzipped)
- Enable Vercel Analytics for monitoring
- Consider adding image optimization

### Backend
- Use MongoDB indexing on frequently queried fields
- Implement caching with Redis (optional)
- Monitor Render metrics

## Next Steps

1. **User Authentication**
   - Integrate Clerk with backend
   - Implement JWT token verification
   - Set up role-based access control (RBAC)

2. **Database Integration**
   - Create Mongoose models from TypeScript interfaces
   - Implement database migrations
   - Set up automated backups

3. **Testing**
   - Add unit tests for services
   - Add integration tests for API routes
   - Set up CI/CD with GitHub Actions

4. **Monitoring**
   - Enable error tracking (Sentry)
   - Set up performance monitoring
   - Configure alerts

## Support URLs

- Frontend: `https://adhd-support-uk.vercel.app`
- Backend API: `https://adhd-support-uk-backend.onrender.com/api`
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com

## Environment Variables Reference

### Frontend (`/client`)
```
VITE_API_URL         # Backend API base URL
VITE_CLERK_KEY       # Clerk public key (if using Clerk)
```

### Backend (`/server`)
```
MONGO_URI            # MongoDB connection string
CLERK_SECRET_KEY     # Clerk secret key
PORT                 # Server port (default: 5000)
NODE_ENV             # Environment (development/production)
CORS_ORIGIN          # Frontend URL for CORS
```
