# Quick Start Guide - ADHD Support UK

Get the application running locally in minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for cloning)

## Local Development

### Option 1: Run Frontend Only (Recommended for Demo)

This runs the complete UI with mock data and doesn't require the backend.

```bash
cd client
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

**Features Available:**
- Dashboard with activity overview
- Productivity tools (task planner, mood tracking)
- Course browsing and enrollment
- Events registration
- Resource library
- User profile
- Admin dashboard

### Option 2: Run Full Stack Locally

This requires both frontend and backend running.

#### Terminal 1: Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend: `http://localhost:5173`

#### Terminal 2: Start Backend (requires backend activation)

```bash
cd server
npm install
npm run dev
```

Backend: `http://localhost:5000`

**Note**: The backend currently runs mock services. To enable database persistence, follow `/server/BACKEND_ACTIVATION_GUIDE.md`.

## First Time Setup

### 1. Clone Repository (if not already done)

```bash
git clone https://github.com/YOUR_USERNAME/adhd-support-uk.git
cd adhd-support-uk
```

### 2. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend (optional for local dev)
cd ../server
npm install
```

### 3. Start Development Servers

```bash
# In one terminal
cd client && npm run dev

# In another terminal (optional)
cd server && npm run dev
```

### 4. Open in Browser

Navigate to `http://localhost:5173`

## Default Demo User

The application comes with a pre-configured demo user:

- **Name**: Alex Johnson
- **Email**: alex.johnson@example.com
- **Type**: Regular User

Click "Login as Demo User" to access the dashboard.

## Project Structure

```
adhd-support-uk/
├── client/                 # React frontend (Vercel)
│   ├── src/
│   │   ├── components/     # Header, Navigation
│   │   ├── pages/          # Dashboard, Courses, etc.
│   │   ├── services/       # API client
│   │   ├── context/        # User context
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Node/Express backend (Render)
│   ├── src/
│   │   ├── models/         # Data types (types.ts)
│   │   └── services/       # Business logic
│   ├── package.json
│   └── BACKEND_ACTIVATION_GUIDE.md
│
├── README.md              # Project overview
├── QUICK_START.md         # This file
└── DEPLOYMENT_GUIDE.md    # Production deployment
```

## Available Commands

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Check TypeScript types
```

### Backend

```bash
npm run dev        # Start development server
npm run build      # Build TypeScript
npm start          # Run compiled JavaScript
npm run typecheck  # Check TypeScript types
```

## Key Features

### Dashboard
- Overview of your activity
- Quick links to main features
- Recent mood check-ins
- Task count summary

### Productivity Tools
Three tabs for managing your ADHD:

1. **Planner**: Create and track daily tasks
   - Set time for each task
   - Mark tasks as complete
   - Delete completed tasks

2. **Habits**: Track your habits (coming soon)
   - View progress
   - Daily/weekly/monthly habits

3. **Mood**: Track emotional well-being
   - Log your mood (6 options)
   - Add notes
   - View mood history

### Courses
- Browse available courses
- Enroll in courses
- Track enrollment status
- Filter by enrollment status

### Resources
- Browse articles, videos, tools, and guides
- Add resources to favorites
- Open external resources
- Filter by category

### Events
- View upcoming events
- Register for events
- See event details
- Check attendee count

### Profile
- View profile information
- See enrollment summary
- Track mood check-ins
- View favorite resources

## Colors Used

The application uses a carefully chosen color palette optimized for ADHD users:

- **Headers** (`#30506C`): Dark, professional blue
- **Body Text** (`#263A47`): Dark, readable slate
- **Accents** (`#469CA4`): Calm teal
- **Background 1** (`#EFE3DF`): Warm beige
- **Background 2** (`#D7E9ED`): Light blue

## Troubleshooting

### Port Already in Use

If port 5173 is already in use:

```bash
npm run dev -- --port 3000
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Remove package-lock.json and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Build Errors

```bash
# Check Node version
node --version  # Should be 18+

# Verify TypeScript
npm run typecheck

# Try rebuilding
rm -rf node_modules dist
npm install
npm run build
```

## API Integration

The frontend is pre-configured to call backend APIs:

```typescript
// Example API calls (in src/services/api.ts)
api.courses.getAll()
api.habits.getByUserId(userId)
api.events.getUpcoming()
api.users.getByClerkId(clerkId)
```

Currently, these return mock data. To enable real database calls, activate the backend following `/server/BACKEND_ACTIVATION_GUIDE.md`.

## Next Steps

1. **Explore the UI**: Familiarize yourself with the interface
2. **Test Features**: Try creating tasks, checking mood, enrolling in courses
3. **Review Code**: Check `/client/src` for frontend architecture
4. **Review Services**: Check `/server/src/services` for business logic
5. **Deploy**: Follow `DEPLOYMENT_GUIDE.md` to deploy to Vercel and Render

## Getting Help

- **Frontend Issues**: Check `/client` README and src files
- **Backend Setup**: See `/server/BACKEND_ACTIVATION_GUIDE.md`
- **Deployment**: Follow `DEPLOYMENT_GUIDE.md`
- **Type Issues**: Run `npm run typecheck` for TypeScript errors

## Development Tips

- **Hot Reload**: Frontend changes auto-reload in browser
- **React DevTools**: Install Chrome/Firefox React DevTools extension
- **Type Safety**: Use strict TypeScript settings
- **Console Logs**: Check browser console for API errors
- **Network Tab**: Monitor API calls in DevTools

## Performance Notes

- Frontend bundle: ~216 KB (gzipped)
- Build time: ~5 seconds
- Dev server startup: ~2 seconds

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Enjoy developing with ADHD Support UK!
