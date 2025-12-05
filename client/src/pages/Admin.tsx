import React, { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react'; 
import { useData } from '../context/UserContext.js';
import { useUserProfile } from '../context/UserProfileContext.js'; // <-- NEW IMPORT
import { api } from '../services/api.js';
import { BookOpen, Calendar, Users, Settings, Plus, X } from 'lucide-react';
import type { ICourse, IEvent, IResource } from '../types/index.js';

// --- Reusable Modal Component ---
const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-[#30506C]">{title}</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><X size={24} /></button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    </div>
);

export const Admin = () => {
    // --- HOOKS ---
    const { user, isLoaded: isUserLoaded } = useUser();
    const { courses, events, resources, loading: isDataLoading, setCourses, setEvents, setResources } = useData();
    // FETCH USER PROFILE DATA FOR THE RELIABLE ADMIN CHECK
    const { userProfile, isProfileLoading } = useUserProfile(); // <-- USE FOR ADMIN CHECK
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal State
    const [modalType, setModalType] = useState<'course' | 'event' | 'resource' | null>(null);

    // Form State (Simplified for Course)
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const [newCourseInst, setNewCourseInst] = useState('');
    const [newCourseStart, setNewCourseStart] = useState('');
    const [newCourseEnd, setNewCourseEnd] = useState('');
    
    // Form State (Simplified for Event)
    const [newEventName, setNewEventName] = useState('');
    const [newEventDate, setNewEventDate] = useState('');
    const [newEventLocation, setNewEventLocation] = useState('');
    const [newEventDesc, setNewEventDesc] = useState('');
    
    // Form State (Simplified for Resource)
    const [newResourceTitle, setNewResourceTitle] = useState('');
    const [newResourceCategory, setNewResourceCategory] = useState<'article' | 'video' | 'tool' | 'guide' | 'other'>('article');
    const [newResourceLink, setNewResourceLink] = useState('');
    const [newResourceDesc, setNewResourceDesc] = useState('');

    const resetForms = () => {
        setNewCourseTitle(''); setNewCourseDesc(''); setNewCourseInst(''); setNewCourseStart(''); setNewCourseEnd('');
        setNewEventName(''); setNewEventDate(''); setNewEventLocation(''); setNewEventDesc('');
        setNewResourceTitle(''); setNewResourceLink(''); setNewResourceDesc('');
    };

    // ... (All Handlers: handleAddCourse, handleAddEvent, handleAddResource - unchanged) ...

    // Handler for Course Creation
    const handleAddCourse = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !newCourseTitle || !newCourseInst || !newCourseStart || !newCourseEnd) return;

        setIsSubmitting(true);
        const courseData: Partial<ICourse> = {
            courseTitle: newCourseTitle,
            courseDescription: newCourseDesc,
            courseInstructor: newCourseInst,
            courseStartDate: new Date(newCourseStart),
            courseEndDate: new Date(newCourseEnd),
        };

        try {
            const response = await api.courses.create(courseData);
            // Add new course to local context state immediately
            setCourses([...courses, response.data]);
            setModalType(null);
            resetForms();
        } catch (e) {
            console.error('Failed to create course:', e);
        } finally {
            setIsSubmitting(false);
        }
    }, [newCourseTitle, newCourseDesc, newCourseInst, newCourseStart, newCourseEnd, isSubmitting, courses, setCourses]);

    // Handler for Event Creation
    const handleAddEvent = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !newEventName || !newEventDate || !newEventLocation) return;

        setIsSubmitting(true);
        const eventData: Partial<IEvent> = {
            eventName: newEventName,
            eventDate: new Date(newEventDate),
            eventLocation: newEventLocation,
            eventDescription: newEventDesc,
            attendees: [], // Handled by backend default
        };

        try {
            const response = await api.events.create(eventData);
            setEvents([...events, response.data]);
            setModalType(null);
            resetForms();
        } catch (e) {
            console.error('Failed to create event:', e);
        } finally {
            setIsSubmitting(false);
        }
    }, [newEventName, newEventDate, newEventLocation, newEventDesc, isSubmitting, events, setEvents]);

    // Handler for Resource Creation
    const handleAddResource = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || !newResourceTitle || !newResourceCategory || !newResourceLink) return;

        setIsSubmitting(true);
        const resourceData: Partial<IResource> = {
            resourceTitle: newResourceTitle,
            resourceCategory: newResourceCategory,
            resourceLink: newResourceLink,
            resourceDescription: newResourceDesc,
        };

        try {
            const response = await api.resources.create(resourceData);
            setResources([...resources, response.data]);
            setModalType(null);
            resetForms();
        } catch (e) {
            console.error('Failed to create resource:', e);
        } finally {
            setIsSubmitting(false);
        }
    }, [newResourceTitle, newResourceCategory, newResourceLink, newResourceDesc, isSubmitting, resources, setResources]);


    // --- LOADING/SECURITY CHECK ---

    // 1. Check if Clerk user is loaded and present.
    // 2. Check if the app's User Profile data (which contains the accurate userType) is loaded.
    // 3. Check if the app's general context data is loaded.
    if (!isUserLoaded || !user || isProfileLoading || isDataLoading) {
        return (
            <div className="min-h-screen bg-[#EFE3DF] flex items-center justify-center">
                <p className="text-[#30506C]">Loading Admin authentication...</p>
            </div>
        );
    }
    
    // RELIABLE ACCESS CHECK: Use the loaded userProfile, which you confirmed is correct.
    const userType = userProfile?.userType || 'user';

    // Security Check: If the type is not 'admin', deny access.
    if (userType !== 'admin') {
        return (
            <div className="min-h-screen bg-[#EFE3DF] flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
                    <Settings size={48} className="mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold text-[#30506C] mb-2">Access Denied</h1>
                    <p className="text-[#263A47]">You do not have permission to access the admin dashboard. Current type: **{userType}**</p>
                </div>
            </div>
        );
    }
    // END OF SECURITY/LOADING CHECKS

    const stats = [
        { label: 'Total Courses', value: courses.length, icon: <BookOpen /> },
        { label: 'Total Events', value: events.length, icon: <Calendar /> },
        { label: 'Total Resources', value: resources.length, icon: <Users /> },
    ];

    // --- MODAL RENDERING LOGIC ---
    const renderModal = () => {
        switch (modalType) {
            case 'course':
                return (
                    <Modal title="Add New Course" onClose={() => setModalType(null)}>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <input type="text" placeholder="Course Title" required value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <textarea placeholder="Description" value={newCourseDesc} onChange={(e) => setNewCourseDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg resize-none" rows={3} />
                            <input type="text" placeholder="Instructor" required value={newCourseInst} onChange={(e) => setNewCourseInst(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <label className="block text-sm text-[#263A47]">Start Date:</label>
                            <input type="date" required value={newCourseStart} onChange={(e) => setNewCourseStart(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <label className="block text-sm text-[#263A47]">End Date:</label>
                            <input type="date" required value={newCourseEnd} onChange={(e) => setNewCourseEnd(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400">
                                {isSubmitting ? 'Creating...' : 'Create Course'}
                            </button>
                        </form>
                    </Modal>
                );
            case 'event':
                return (
                    <Modal title="Add New Event" onClose={() => setModalType(null)}>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <input type="text" placeholder="Event Name" required value={newEventName} onChange={(e) => setNewEventName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <textarea placeholder="Description" value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg resize-none" rows={3} />
                            <label className="block text-sm text-[#263A47]">Date & Time:</label>
                            <input type="datetime-local" required value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <input type="text" placeholder="Location (e.g., Virtual - Zoom)" required value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400">
                                {isSubmitting ? 'Creating...' : 'Create Event'}
                            </button>
                        </form>
                    </Modal>
                );
            case 'resource':
                return (
                    <Modal title="Add New Resource" onClose={() => setModalType(null)}>
                        <form onSubmit={handleAddResource} className="space-y-4">
                            <input type="text" placeholder="Resource Title" required value={newResourceTitle} onChange={(e) => setNewResourceTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <select required value={newResourceCategory} onChange={(e) => setNewResourceCategory(e.target.value as 'article' | 'video' | 'tool' | 'guide' | 'other')} className="w-full px-3 py-2 border rounded-lg">
                                <option value="article">Article</option>
                                <option value="video">Video</option>
                                <option value="tool">Tool</option>
                                <option value="guide">Guide/Book</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="url" placeholder="Link (URL)" required value={newResourceLink} onChange={(e) => setNewResourceLink(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                            <textarea placeholder="Description" value={newResourceDesc} onChange={(e) => setNewResourceDesc(e.target.value)} className="w-full px-3 py-2 border rounded-lg resize-none" rows={3} />
                            <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400">
                                {isSubmitting ? 'Creating...' : 'Create Resource'}
                            </button>
                        </form>
                    </Modal>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Admin Dashboard</h1>
                <p className="text-[#263A47] mb-8">Manage courses, events, and resources</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#469CA4]"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[#263A47] text-sm font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-[#30506C] mt-2">{stat.value}</p>
                                </div>
                                <div className="text-3xl text-[#469CA4]">{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                            <BookOpen size={24} />
                            <span>Courses</span>
                        </h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {courses.length === 0 ? (
                                <p className="text-[#263A47]">No courses yet</p>
                            ) : (
                                courses.map(course => (
                                    <div key={course._id} className="p-3 bg-[#F5F0ED] rounded-lg">
                                        <p className="font-semibold text-[#30506C]">{course.courseTitle}</p>
                                        <p className="text-xs text-[#263A47]">{course.courseInstructor}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        <button 
                            onClick={() => { resetForms(); setModalType('course'); }} 
                            className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
                        >
                            <Plus size={16} className="inline mr-1" /> Add Course
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                            <Calendar size={24} />
                            <span>Events</span>
                        </h2>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {events.length === 0 ? (
                                <p className="text-[#263A47]">No events yet</p>
                            ) : (
                                events.map(event => (
                                    <div key={event._id} className="p-3 bg-[#F5F0ED] rounded-lg">
                                        <p className="font-semibold text-[#30506C]">{event.eventName}</p>
                                        <p className="text-xs text-[#263A47]">
                                            {new Date(event.eventDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        <button 
                            onClick={() => { resetForms(); setModalType('event'); }} 
                            className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
                        >
                            <Plus size={16} className="inline mr-1" /> Add Event
                        </button>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                        <Users size={24} />
                        <span>Resources</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                        {resources.length === 0 ? (
                            <p className="text-[#263A47]">No resources yet</p>
                        ) : (
                            resources.map(resource => (
                                <div key={resource._id} className="p-3 bg-[#F5F0ED] rounded-lg">
                                    <p className="font-semibold text-[#30506C]">{resource.resourceTitle}</p>
                                    <p className="text-xs text-[#263A47]">{resource.resourceCategory}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <button 
                        onClick={() => { resetForms(); setModalType('resource'); }} 
                        className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
                    >
                        <Plus size={16} className="inline mr-1" /> Add Resource
                    </button>
                </div>
            </div>
            
            {/* Modal Renderer */}
            {renderModal()}
        </div>
    );
};