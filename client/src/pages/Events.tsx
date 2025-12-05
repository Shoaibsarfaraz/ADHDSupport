import React from 'react';
import { useState, useEffect } from 'react';
// Keep useUser for initial loading checks, but remove reliance on publicMetadata
import { useUser } from '@clerk/clerk-react'; 
import { useData } from '../context/UserContext.js'; // Global event catalog
import { useUserProfile } from '../context/UserProfileContext.js'; // User-specific data
import { api } from '../services/api.js'; // API client for updates
import { Calendar, MapPin, Users, CheckCircle } from 'lucide-react';
import type { IEvent } from '../types/index.js';

export const Events = () => {
    // --- HOOKS ---
    const { isLoaded: isClerkLoaded } = useUser();
    const { events, loading: isDataLoading } = useData(); // Global event catalog
    const { userProfile, isProfileLoading, refreshProfile } = useUserProfile(); // User profile and refresh

    const [filter, setFilter] = useState<'all' | 'registered'>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // REMOVED: The useEffect hook that set mockEvents is deleted.
    // Events are now loaded via DataProvider (useData).

    // Safely get registered events from the live userProfile
    const registeredEvents: string[] = userProfile 
        ? (userProfile.registeredEvents?.map(id => id.toString()) || [])
        : [];

    // --- LOADING CHECK ---
    if (!isClerkLoaded || isDataLoading || isProfileLoading || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading events and registration status...</p>
            </div>
        );
    }
    
    const clerkId = userProfile.clerkId; // Get ID here once

    const filteredEvents = events.filter(event => {
        if (filter === 'registered') {
            return registeredEvents.includes(event._id!);
        }
        return true; // 'all'
    });

    const sortedEvents = filteredEvents.sort(
        (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );

    // --- IMPLEMENT LIVE REGISTRATION HANDLER ---
    const handleRegister = async (eventId: string) => {
        if (!clerkId || !eventId || registeredEvents.includes(eventId)) return; // Must be logged in and not already registered
        
        setIsSubmitting(true);
        
        try {
            // API call to the backend endpoint we set up: POST /api/users/:clerkId/registerEvent
            // Note: The backend route is POST /api/events/:eventId/attendee/:userId.
            // However, the api.ts client uses api.users.registerEvent which hits /users/:clerkId/registerEvent.
            // We use the route that is integrated with user-specific data management.
            await api.users.registerEvent(clerkId, eventId);
            
            // Success: Refresh the UserProfile context to update the UI
            await refreshProfile(); 
            
            console.log(`Successfully registered for event: ${eventId}`);

        } catch (error) {
            console.error('Failed to register for event:', error);
            // Optional: Show an error notification
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Events & Community</h1>
                <p className="text-[#263A47] mb-8">Connect with others and learn from experts in the ADHD community</p>

                <div className="flex space-x-2 mb-6">
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
                            const isRegistered = registeredEvents.includes(event._id!);

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
                                                {/* <div className="flex items-center space-x-2 text-[#263A47]">
                                                    <Users size={18} className="text-[#469CA4]" />
                                                    <span className="text-sm">{event.attendees.length} Registered</span>
                                                </div> */}
                                            </div>

                                            <button
                                                onClick={() => handleRegister(event._id!)}
                                                disabled={isRegistered || isSubmitting}
                                                className={`py-2 px-6 rounded-lg font-medium transition ${
                                                    isRegistered
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                                                }`}
                                            >
                                                {isSubmitting ? 'Registering...' : isRegistered ? 'Registered' : 'Register Now'}
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