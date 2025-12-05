// server/src/services/habitService.ts

import { IHabit } from '../models/types.js';
import { Habit } from '../models/Habits.js'; // Import the Mongoose Model

export const habitService = {
  /**
   * Retrieves all habits for a specific user.
   * @param userId The ID of the user (Mongoose ObjectId, passed as string).
   * @returns An array of habit objects.
   */
  async getHabitsByUserId(userId: string): Promise<IHabit[]> {
    // Finds all habits where the userId field matches the input
    return await Habit.find({ userId }).lean<IHabit[]>();
  },

  /**
   * Creates a new habit for a user.
   * @returns The newly created habit object.
   */
  async createHabit(
    habitName: string, 
    habitFrequency: 'daily' | 'weekly' | 'monthly', 
    userId: string
  ): Promise<IHabit> {
    // Use Mongoose create to save the new habit to the database
    const newHabit = await Habit.create({
      habitName,
      habitFrequency,
      userId,
      habitProgress: 0, // Default value handled by the schema, but explicit here for clarity
    });
    return newHabit.toObject() as IHabit;
  },

  /**
   * Updates the progress of a specific habit.
   * @param habitId The ID of the habit to update.
   * @param progress The new progress value (0-100).
   * @returns The updated habit object or null if not found.
   */
  async updateHabitProgress(habitId: string, progress: number): Promise<IHabit | null> {
    // Ensure progress is clamped between 0 and 100
    const clampedProgress = Math.min(100, Math.max(0, progress));
    
    // Use findByIdAndUpdate to atomically update the habit
    return await Habit.findByIdAndUpdate(
      habitId,
      { 
        $set: { habitProgress: clampedProgress, updatedAt: new Date() } 
      },
      { new: true } // Return the modified document
    ).lean<IHabit | null>();
  },

  /**
   * Deletes a specific habit by its ID.
   * @param habitId The ID of the habit to delete.
   * @returns A boolean indicating success (true if deleted, false otherwise).
   */
  async deleteHabit(habitId: string): Promise<boolean> {
    const result = await Habit.deleteOne({ _id: habitId });
    // Returns true if one document was successfully deleted
    return result.deletedCount === 1;
  },

  /**
   * Retrieves a specific habit by its ID.
   * @param habitId The ID of the habit.
   * @returns The habit object or null if not found.
   */
  async getHabitById(habitId: string): Promise<IHabit | null> {
    // Use findById for quick retrieval by the primary key (_id)
    return await Habit.findById(habitId).lean<IHabit | null>();
  },
};