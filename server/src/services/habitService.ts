import { IHabit } from '../models/types.js';

const mockHabits: Map<string, IHabit> = new Map();
let habitIdCounter = 1;

export const habitService = {
  async getHabitsByUserId(userId: string): Promise<IHabit[]> {
    return Array.from(mockHabits.values()).filter(habit => habit.userId === userId);
  },

  async createHabit(habitName: string, habitFrequency: 'daily' | 'weekly' | 'monthly', userId: string): Promise<IHabit> {
    const newHabit: IHabit = {
      _id: `habit_${habitIdCounter++}`,
      habitName,
      habitFrequency,
      habitProgress: 0,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockHabits.set(newHabit._id!, newHabit);
    return newHabit;
  },

  async updateHabitProgress(habitId: string, progress: number): Promise<IHabit | null> {
    const habit = mockHabits.get(habitId);
    if (!habit) return null;

    habit.habitProgress = Math.min(100, Math.max(0, progress));
    habit.updatedAt = new Date();
    mockHabits.set(habitId, habit);
    return habit;
  },

  async deleteHabit(habitId: string): Promise<boolean> {
    return mockHabits.delete(habitId);
  },

  async getHabitById(habitId: string): Promise<IHabit | null> {
    return mockHabits.get(habitId) || null;
  },
};
