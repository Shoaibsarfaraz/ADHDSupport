import mongoose, { Schema } from 'mongoose';
import { IAdmin } from './types.js';

const AdminSchema = new Schema<IAdmin>({
  clerkId: { type: String, unique: true, required: true },
  adminUsername: { type: String, required: true },
  adminEmail: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);