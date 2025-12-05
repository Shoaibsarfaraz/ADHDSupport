import mongoose, { Schema, Types } from 'mongoose';
import { IEnrollment } from './types.js';

const EnrollmentSchema = new Schema<IEnrollment>({
  userId: { 
    type: Types.ObjectId, // This is correct Mongoose syntax
    ref: 'User', 
    required: true 
  }as any,
  courseId: { 
    type: Types.ObjectId, // This is correct Mongoose syntax
    ref: 'Course', 
    required: true 
  }as any,
  enrollmentDate: { type: Date, default: Date.now, required: true },
  completionStatus: { 
    type: String, 
    enum: ['enrolled', 'in-progress', 'completed'], 
    default: 'enrolled', 
    required: true 
  },
});

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);