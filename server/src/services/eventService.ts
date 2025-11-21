import { IEvent } from '../models/types.js';

const mockEvents: Map<string, IEvent> = new Map();

const seededEvents: IEvent[] = [
  {
    _id: 'event_1',
    eventName: 'ADHD Support Group Monthly Meetup',
    eventDate: new Date('2024-12-15T18:00:00'),
    eventLocation: 'Virtual - Zoom',
    eventDescription: 'Monthly support group meeting for individuals with ADHD. Share experiences and strategies.',
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'event_2',
    eventName: 'Expert Q&A: ADHD and Relationships',
    eventDate: new Date('2024-12-20T19:00:00'),
    eventLocation: 'London Community Center',
    eventDescription: 'Live Q&A session with Dr. Emily Chen discussing ADHD and relationship management.',
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'event_3',
    eventName: 'Productivity Workshop',
    eventDate: new Date('2025-01-10T14:00:00'),
    eventLocation: 'Virtual - Microsoft Teams',
    eventDescription: 'Interactive workshop on building sustainable productivity systems for ADHD brains.',
    attendees: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

seededEvents.forEach(event => {
  mockEvents.set(event._id!, event);
});

export const eventService = {
  async getAllEvents(): Promise<IEvent[]> {
    return Array.from(mockEvents.values());
  },

  async getEventById(eventId: string): Promise<IEvent | null> {
    return mockEvents.get(eventId) || null;
  },

  async getUpcomingEvents(): Promise<IEvent[]> {
    const now = new Date();
    return Array.from(mockEvents.values())
      .filter(event => event.eventDate > now)
      .sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  },

  async createEvent(
    eventName: string,
    eventDate: Date,
    eventLocation: string,
    eventDescription: string
  ): Promise<IEvent> {
    const newEvent: IEvent = {
      _id: `event_${Date.now()}`,
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      attendees: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockEvents.set(newEvent._id!, newEvent);
    return newEvent;
  },

  async addAttendee(eventId: string, userId: string): Promise<IEvent | null> {
    const event = mockEvents.get(eventId);
    if (!event) return null;

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId);
      event.updatedAt = new Date();
      mockEvents.set(eventId, event);
    }
    return event;
  },

  async removeAttendee(eventId: string, userId: string): Promise<IEvent | null> {
    const event = mockEvents.get(eventId);
    if (!event) return null;

    event.attendees = event.attendees.filter(id => id !== userId);
    event.updatedAt = new Date();
    mockEvents.set(eventId, event);
    return event;
  },

  async updateEvent(eventId: string, updates: Partial<IEvent>): Promise<IEvent | null> {
    const event = mockEvents.get(eventId);
    if (!event) return null;

    const updated = { ...event, ...updates, updatedAt: new Date() };
    mockEvents.set(eventId, updated);
    return updated;
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    return mockEvents.delete(eventId);
  },
};
