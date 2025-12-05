import mongoose, { Schema } from 'mongoose';
import { IEvent } from './types.js';

const EventSchema = new Schema<IEvent>({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventLocation: { type: String, required: true },
  eventDescription: { type: String, required: true },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }], // References User IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);