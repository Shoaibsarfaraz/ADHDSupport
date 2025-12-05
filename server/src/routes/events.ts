// server/src/routes/events.ts

import express, { Router, Request, Response } from 'express';
import { eventService } from '../services/index.js';

const router: Router = express.Router();

// GET /api/events - Get all events (or potentially future events)
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/events/upcoming - Get only events scheduled in the future
router.get('/upcoming', async (req: Request, res: Response) => {
  try {
    const upcomingEvents = await eventService.getUpcomingEvents();
    res.json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/events/:eventId - Get a specific event by ID
router.get('/:eventId', async (req: Request, res: Response) => {
  try {
    const event = await eventService.getEventById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/events - Create a new event (Admin function)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { eventName, eventDate, eventLocation, eventDescription } = req.body;

    if (!eventName || !eventDate || !eventLocation) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }

    const newEvent = await eventService.createEvent(
      eventName,
      new Date(eventDate),
      eventLocation,
      eventDescription
    );
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/events/:eventId - Update an existing event (Admin function)
router.put('/:eventId', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.eventId, req.body);

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/events/:eventId/attendee/:userId - Add an attendee
router.post('/:eventId/attendee/:userId', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventService.addAttendee(req.params.eventId, req.params.userId);

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/events/:eventId/attendee/:userId - Remove an attendee
router.delete('/:eventId/attendee/:userId', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventService.removeAttendee(req.params.eventId, req.params.userId);

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event or User not found' });
    }
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/events/:eventId - Delete an event (Admin function)
router.delete('/:eventId', async (req: Request, res: Response) => {
  try {
    const success = await eventService.deleteEvent(req.params.eventId);
    if (!success) {
      return res.status(404).json({ error: 'Event not found or could not be deleted' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;