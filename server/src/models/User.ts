// server/src/models/User.ts - UPDATED CONTENT

import mongoose, { Schema } from 'mongoose';
import { IUser } from './types.js'; // Ensure this points to the backend types

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

// --- NEW SUB-SCHEMA: BrainDumpEntry ---
const BrainDumpEntrySchema = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: true });

// --- NEW SUB-SCHEMA: FocusSession ---
const FocusSessionSchema = new Schema({
  duration: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
}, { _id: true });


const UserSchema = new Schema({
  clerkId: { type: String, unique: true, required: true },
  userFirstName: { type: String, default: "" },
  userLastName: { type: String, default: "" },
  userEmail: { type: String, unique: true, required: true },
  userType: { type: String, enum: ['user', 'admin'], default: 'user' },
  emotionalCheckins: [EmotionalCheckinSchema],
  plannerEntries: [PlannerEntrySchema],
  
  // --- NEW FIELDS ADDED ---
  brainDumpEntries: [BrainDumpEntrySchema],
  focusSessions: [FocusSessionSchema],
  
  enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
  favoriteResources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
  registeredEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);