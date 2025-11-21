import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext.js';
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import type { IEvent } from '../types/index.js';

export const Events = () => {
  const { user, events, setEvents, setUser } = useUser();
  // Removed 'upcoming' from the state type and set default to 'all'
  const [filter, setFilter] = useState<'all' | 'registered'>('all');

  useEffect(() => {
    const mockEvents: IEvent[] = [
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
    setEvents(mockEvents);
  }, [setEvents]);

  // Removed the 'now' variable as we no longer check against current time

  const filteredEvents = events.filter(event => {
    // Removed the 'upcoming' check
    if (filter === 'registered') {
      return user?.registeredEvents.includes(event._id!);
    }
    return true; // 'all'
  });

  const sortedEvents = filteredEvents.sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  const handleRegister = (eventId: string) => {
    if (!user) return;

    if (!user.registeredEvents.includes(eventId)) {
      setUser({
        ...user,
        registeredEvents: [...user.registeredEvents, eventId],
        updatedAt: new Date(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Events & Community</h1>
        <p className="text-[#263A47] mb-8">Connect with others and learn from experts in the ADHD community</p>

        <div className="flex space-x-2 mb-6">
          {/* Removed 'upcoming' from the map array */}
          {(['all', 'registered'] as const).map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === filterOption
                  ? 'bg-[#469CA4] text-white'
                  : 'bg-white text-[#263A47] hover:bg-[#D7E9ED]'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#263A47] mb-4">No events found</p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="text-[#469CA4] hover:underline font-medium"
              >
                View all events
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedEvents.map(event => {
              const isRegistered = user?.registeredEvents.includes(event._id!);
              // Removed isUpcoming check

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gradient-to-br from-[#469CA4] to-[#30506C] p-6 md:w-32 md:flex-shrink-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl font-bold">
                          {new Date(event.eventDate).getDate()}
                        </div>
                        <div className="text-sm">
                          {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-[#30506C]">{event.eventName}</h3>
                        {isRegistered && (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1 flex-shrink-0">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Registered</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[#263A47] mb-4">{event.eventDescription}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-[#263A47]">
                          <Calendar size={18} className="text-[#469CA4]" />
                          <span className="text-sm">
                            {new Date(event.eventDate).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#263A47]">
                          <MapPin size={18} className="text-[#469CA4]" />
                          <span className="text-sm">{event.eventLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#263A47]">
                          <Users size={18} className="text-[#469CA4]" />
                          <span className="text-sm">{event.attendees.length} Registered</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRegister(event._id!)}
                        // Disabled only if already registered
                        disabled={isRegistered}
                        className={`py-2 px-6 rounded-lg font-medium transition ${
                          isRegistered
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                        }`}
                      >
                        {/* Removed 'Event Ended' text logic */}
                        {isRegistered ? 'Registered' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};