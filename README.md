# ADHD Support UK - Full-Stack Prototype

A comprehensive MongoDB-simulated full-stack application designed to support individuals with ADHD through productivity tools, courses, resources, and community events.

## Project Structure

This project is organized into two independent folders to simulate separate Vercel (frontend) and Render (backend) deployments:

### `/client` - React Frontend (Vercel)

A complete React/TypeScript application with Tailwind CSS styling and Lucide React icons.

**Features:**
- Dashboard with activity overview
- Productivity Tools (Task Planner, Mood Check-ins, Habit Tracking)
- Course Management & Enrollment
- Community Events Registration
- Resource Library with Favorites
- User Profile & Settings
- Admin Dashboard

**Tech Stack:**
- React 18.3.1
- TypeScript 5.5.3
- React Router DOM 6.20.1
- Tailwind CSS 3.4.1
- Axios 1.7.2
- Lucide React 0.344.0

**Getting Started:**
```bash
cd client
npm install
npm run dev
```

### `/server` - TypeScript API Service Layer (Render)

A MongoDB-simulated service layer with TypeScript interfaces and mock data functions designed to be a drop-in replacement for a full Express/MongoDB backend.

**Structure:**
- `src/models/types.ts` - MongoDB-style TypeScript interfaces
- `src/services/` - Business logic services:
  - `userService.ts` - User management
  - `habitService.ts` - Habit tracking
  - `courseService.ts` - Course management
  - `resourceService.ts` - Resource library
  - `eventService.ts` - Event management

**Tech Stack:**
- Node.js 18+
- Express.js 4.18.2
- TypeScript 5.5.3
- Mongoose 8.0.0 (models defined)
- Axios 1.7.2

**Getting Started:**
```bash
cd server
npm install
npm run dev
```

## Data Model

The application uses MongoDB-inspired document structures:

### Core Entities

**User**
- Embedded: EmotionalCheckins, PlannerEntries
- Referenced: Courses, Resources, Events

**Habit**
- Standalone collection
- Linked to User via userId

**Course, Resource, Event**
- Standalone collections
- Referenced by User enrollments/registrations

**Emotional Checkin (Embedded)**
- Mood (happy, sad, anxious, calm, overwhelmed, focused)
- Notes
- Date/Time

**Planner Entry (Embedded)**
- Time
- Task Description
- Status (pending, in-progress, completed)

## Design System

**Color Palette:**
- Headers: `#30506C` (Dark Slate)
- Body/Text: `#263A47` (Darker Slate)
- Icons/Accents: `#469CA4` (Teal)
- Background 1: `#EFE3DF` (Light Beige)
- Background 2: `#D7E9ED` (Light Blue)
- White: `#FFFFFF`

**Design Principles:**
- Clutter-free interface
- Highly legible typography
- Sufficient white space
- Clear component separation
- Accessibility for neurodivergent users

## MongoDB Backend Activation

The `/server` folder is structured to be immediately deployed as a full Node.js/Express/MongoDB backend. See `server/BACKEND_ACTIVATION_GUIDE.md` for detailed instructions on:

1. Setting up MongoDB connection
2. Creating Mongoose schemas
3. Converting services to database operations
4. Creating Express API routes
5. Deploying to Render

## File Organization

```
project/
├── client/
│   ├── src/
│   │   ├── components/     # Header, Navigation
│   │   ├── context/        # User context management
│   │   ├── pages/          # Dashboard, Productivity, Courses, etc.
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx         # Main app with routing
│   │   └── index.css       # Tailwind styles
│   ├── package.json
│   └── [config files]
│
└── server/
    ├── src/
    │   ├── models/
    │   │   └── types.ts    # MongoDB-style interfaces
    │   └── services/
    │       ├── userService.ts
    │       ├── habitService.ts
    │       ├── courseService.ts
    │       ├── resourceService.ts
    │       ├── eventService.ts
    │       └── index.ts
    ├── package.json
    ├── tsconfig.json
    └── BACKEND_ACTIVATION_GUIDE.md
```

## Frontend Integration

The frontend is pre-configured with mock data but designed to call actual API endpoints:

```typescript
// From api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Service layers handle all data operations
api.users.getByClerkId(clerkId)
api.courses.getAll()
api.habits.getByUserId(userId)
// ... and more
```

## Authentication

Currently uses demo authentication with localStorage. To integrate Clerk:

1. Install Clerk React SDK in `/client`
2. Wrap app with ClerkProvider
3. Use useAuth() hook instead of mock auth
4. Update API calls to include auth tokens

## Development Workflow

1. **Frontend Development:**
   ```bash
   cd client
   npm run dev
   ```
   Starts Vite dev server at `http://localhost:5173`

2. **Backend Service Development:**
   ```bash
   cd server
   npm run dev
   ```
   For use with Express (when activated)

3. **Type Checking:**
   ```bash
   npm run typecheck
   ```
   In either folder

4. **Building for Production:**
   ```bash
   npm run build
   ```
   In either folder

## Deployment

### Frontend (Vercel)
1. Connect `/client` folder to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Backend (Render)
1. Connect `/server` folder to Render
2. Set start command: `npm run build && npm start`
3. Set environment variables (MONGO_URI, etc.)

## Next Steps

1. Implement MongoDB connection in `/server`
2. Create Mongoose models from TypeScript interfaces
3. Convert service functions to database operations
4. Create Express routes for all services
5. Integrate Clerk authentication
6. Deploy to Vercel and Render

For detailed backend setup instructions, see `server/BACKEND_ACTIVATION_GUIDE.md`.
