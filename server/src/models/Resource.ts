import mongoose, { Schema } from 'mongoose';
import { IResource } from './types.js';

const ResourceSchema = new Schema<IResource>({
  resourceTitle: { type: String, required: true },
  resourceCategory: { 
    type: String, 
    enum: ['article', 'video', 'tool', 'guide', 'other'], 
    required: true 
  },
  resourceLink: { type: String, required: true },
  resourceDescription: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Resource = mongoose.model<IResource>('Resource', ResourceSchema);