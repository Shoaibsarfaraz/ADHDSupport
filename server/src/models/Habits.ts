import mongoose, { Schema } from 'mongoose';
import { IHabit } from './types.js';

const HabitSchema = new Schema({
  habitName: { type: String, required: true },
  habitFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  habitProgress: { type: Number, default: 0, min: 0, max: 100 },
  userId: { type: String, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Habit = mongoose.model<IHabit>('Habit', HabitSchema);