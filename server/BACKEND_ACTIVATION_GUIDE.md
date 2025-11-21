# MongoDB/Express Backend Activation Guide

This TypeScript Service Layer is designed to be a drop-in replacement for a full Node.js/Express/MongoDB backend. The following guide explains how to activate the full backend when ready to deploy.

## Current State (Prototype)

The current `/server` folder contains:

- **TypeScript Interfaces** (`src/models/types.ts`) - Complete MongoDB Document structure definitions
- **Service Layer** (`src/services/`) - Business logic functions that currently use in-memory mock data
- **Package Configuration** - All dependencies for a production Express server

## Converting to Full MongoDB/Express Backend

### Step 1: Set Up MongoDB Connection

Create a `src/config/database.ts` file:

```typescript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};
```

### Step 2: Create Mongoose Schemas

Create `src/models/User.ts`:

```typescript
import mongoose, { Schema } from 'mongoose';
import { IUser } from './types.js';

const EmotionalCheckinSchema = new Schema({
  checkinMood: String,
  checkinNotes: String,
  checkinDate: Date,
}, { _id: true });

const PlannerEntrySchema = new Schema({
  pEntryTime: String,
  pEntryTask: String,
  pEntryStatus: String,
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

const UserSchema = new Schema({
  clerkId: { type: String, unique: true, required: true },
  userFirstName: { type: String, required: true },
  userLastName: { type: String, required: true },
  userEmail: { type: String, unique: true, required: true },
  userType: { type: String, enum: ['user', 'admin'], default: 'user' },
  emotionalCheckins: [EmotionalCheckinSchema],
  plannerEntries: [PlannerEntrySchema],
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  favoriteResources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
```

Create `src/models/Habit.ts`:

```typescript
import mongoose, { Schema } from 'mongoose';
import { IHabit } from './types.js';

const HabitSchema = new Schema({
  habitName: { type: String, required: true },
  habitFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  habitProgress: { type: Number, default: 0, min: 0, max: 100 },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Habit = mongoose.model<IHabit>('Habit', HabitSchema);
```

Create similar models for Course, Resource, Event, and Enrollment.

### Step 3: Convert Service Functions to Mongoose Operations

Replace service layer mock data with actual database operations. Example for `userService.ts`:

```typescript
import { User } from '../models/User.js';
import { IUser } from '../models/types.js';

export const userService = {
  async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    return await User.findOne({ clerkId });
  },

  async createUser(clerkId: string, userFirstName: string, userLastName: string, userEmail: string): Promise<IUser> {
    const newUser = new User({
      clerkId,
      userFirstName,
      userLastName,
      userEmail,
    });
    return await newUser.save();
  },

  // ... continue for other methods
};
```

### Step 4: Create Express API Routes

Create `src/routes/users.ts`:

```typescript
import express, { Router } from 'express';
import { userService } from '../services/index.js';

const router: Router = express.Router();

router.get('/:clerkId', async (req, res) => {
  try {
    const user = await userService.getUserByClerkId(req.params.clerkId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { clerkId, userFirstName, userLastName, userEmail } = req.body;
    const user = await userService.createUser(clerkId, userFirstName, userLastName, userEmail);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

Create similar routes for habits, courses, resources, and events.

### Step 5: Create Main Express Server

Create `src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import userRoutes from './routes/users.js';
import habitRoutes from './routes/habits.js';
import courseRoutes from './routes/courses.js';
import resourceRoutes from './routes/resources.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/events', eventRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port', process.env.PORT || 5000);
});
```

### Step 6: Environment Variables

Create `.env.local`:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/adhd-support-uk
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
NODE_ENV=development
```

### Step 7: Build and Deploy

For **local development**:
```bash
npm run dev
```

For **production (Render)**:
```bash
npm run build
npm start
```

## Service Layer Architecture

The current service layer maintains a consistent interface regardless of backend implementation:

- **userService** - User profile, emotional checkins, planner entries
- **habitService** - Habit tracking and progress
- **courseService** - Course catalog and enrollment
- **resourceService** - Resource library management
- **eventService** - Event calendar and registration

All service methods follow the same async/await pattern, making them compatible with:
- Mock data (current prototype)
- MongoDB with Mongoose
- Any other database system

## Type Safety

All services use TypeScript interfaces from `src/models/types.ts`, ensuring:
- Type consistency across the entire application
- Easy refactoring from mock to real database
- Frontend integration type safety via shared interfaces

## Frontend Integration

The frontend connects to this backend via API calls. When migrating from mock services to real Express backend, update the API endpoint:

```typescript
// From (mock service)
import { userService } from '@server/services';
const user = await userService.getUserByClerkId(clerkId);

// To (Express API)
const response = await fetch('/api/users/' + clerkId);
const user = await response.json();
```

## Deployment on Render

1. Push server code to GitHub
2. Connect Render to your repository
3. Set environment variables in Render dashboard
4. Deploy: Render will automatically run `npm run build && npm start`

## Next Steps

- Implement MongoDB connection
- Create Mongoose models for all entities
- Convert services to database operations
- Create Express routes for each service
- Test with Postman or Thunder Client
- Deploy to Render and connect frontend on Vercel
