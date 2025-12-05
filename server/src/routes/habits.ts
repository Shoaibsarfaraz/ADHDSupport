// server/src/routes/habits.ts

import express, { Router, Request, Response } from 'express';
import { habitService } from '../services/index.js';

const router: Router = express.Router();

// NOTE: In a real application, you would ensure the userId is authenticated 
// and passed as a header or derived from a session token, not passed openly in the body for sensitive actions.

// GET /api/habits/:userId - Get all habits for a specific user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const habits = await habitService.getHabitsByUserId(req.params.userId);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/habits - Create a new habit
router.post('/', async (req: Request, res: Response) => {
  try {
    const { habitName, habitFrequency, userId } = req.body;

    if (!habitName || !habitFrequency || !userId) {
      return res.status(400).json({ error: 'Missing required fields: habitName, habitFrequency, and userId' });
    }

    const newHabit = await habitService.createHabit(habitName, habitFrequency, userId);
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/habits/:habitId/progress - Update habit progress
router.put('/:habitId/progress', async (req: Request, res: Response) => {
  try {
    const { progress } = req.body;
    
    if (typeof progress !== 'number') {
        return res.status(400).json({ error: 'Progress must be a number' });
    }
    
    const updatedHabit = await habitService.updateHabitProgress(req.params.habitId, progress);

    if (!updatedHabit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/habits/:habitId - Delete a habit
router.delete('/:habitId', async (req: Request, res: Response) => {
  try {
    const success = await habitService.deleteHabit(req.params.habitId);
    if (!success) {
      return res.status(404).json({ error: 'Habit not found or could not be deleted' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;