// server/src/services/eventService.ts

import { IEvent } from '../models/types.js';
import { Event } from '../models/Event.js'; // Import the Mongoose Model

export const eventService = {
  /**
   * Retrieves all events.
   * @returns An array of all event objects.
   */
  async getAllEvents(): Promise<IEvent[]> {
    // Finds all events
    return await Event.find({}).lean<IEvent[]>();
  },

  /**
   * Retrieves a single event by its ID.
   * @param eventId The ID of the event.
   * @returns The event object or null if not found.
   */
  async getEventById(eventId: string): Promise<IEvent | null> {
    // Uses findById for quick retrieval
    return await Event.findById(eventId).lean<IEvent | null>();
  },

  /**
   * Retrieves events scheduled in the future, sorted chronologically.
   * @returns An array of upcoming event objects.
   */
  async getUpcomingEvents(): Promise<IEvent[]> {
    const now = new Date();
    // Finds events where eventDate is greater than the current time, and sorts them ascending
    return await Event.find({ eventDate: { $gt: now } })
      .sort({ eventDate: 1 }) // 1 for ascending order
      .lean<IEvent[]>();
  },

  /**
   * Creates a new event and saves it to the database.
   * @returns The newly created event object.
   */
  async createEvent(
    eventName: string,
    eventDate: Date,
    eventLocation: string,
    eventDescription: string
  ): Promise<IEvent> {
    // Use Mongoose create to save the new event
    const newEvent = await Event.create({
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      attendees: [], // Default value handled by schema, but explicit here
    });
    return newEvent.toObject() as IEvent;
  },

  /**
   * Adds a user's ID to the event's attendees list.
   * @param eventId The ID of the event.
   * @param userId The ID of the user to add.
   * @returns The updated event object or null if not found.
   */
  async addAttendee(eventId: string, userId: string): Promise<IEvent | null> {
    // Use $addToSet to add the userId only if it doesn't already exist
    return await Event.findByIdAndUpdate(
      eventId,
      { 
        $addToSet: { attendees: userId }, 
        $set: { updatedAt: new Date() } 
      },
      { new: true }
    ).lean<IEvent | null>();
  },

  /**
   * Removes a user's ID from the event's attendees list.
   * @param eventId The ID of the event.
   * @param userId The ID of the user to remove.
   * @returns The updated event object or null if not found.
   */
  async removeAttendee(eventId: string, userId: string): Promise<IEvent | null> {
    // Use $pull to remove the userId from the array
    return await Event.findByIdAndUpdate(
      eventId,
      { 
        $pull: { attendees: userId }, 
        $set: { updatedAt: new Date() } 
      },
      { new: true }
    ).lean<IEvent | null>();
  },

  /**
   * Updates an existing event.
   * @param eventId The ID of the event to update.
   * @param updates A partial object of event fields to update.
   * @returns The updated event object or null if not found.
   */
  async updateEvent(eventId: string, updates: Partial<IEvent>): Promise<IEvent | null> {
    // Use findByIdAndUpdate to atomically update the event
    return await Event.findByIdAndUpdate(
      eventId,
      { 
        $set: { ...updates, updatedAt: new Date() } 
      },
      { new: true } // Return the modified document
    ).lean<IEvent | null>();
  },

  /**
   * Deletes a specific event by its ID.
   * @param eventId The ID of the event to delete.
   * @returns A boolean indicating success.
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    const result = await Event.deleteOne({ _id: eventId });
    // Returns true if one document was successfully deleted
    return result.deletedCount === 1;
  },
};