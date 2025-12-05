import React, { useState, useEffect } from 'react';
// REMOVED: import { useUser } from '@clerk/clerk-react'; // No longer needed for profile data
import { useUser } from '@clerk/clerk-react'; // Keep for user.id and loading check
import { useData } from '../context/UserContext.js';
import { useUserProfile } from '../context/UserProfileContext.js'; // 1. IMPORT UserProfile Hook
import { api } from '../services/api.js'; // 2. IMPORT API Client
import { BookOpen, Calendar, User, CheckCircle } from 'lucide-react';
import type { ICourse } from '../types/index.js';

export const Courses = () => {
    // --- HOOKS ---
    const { isLoaded: isClerkLoaded } = useUser(); // Keep for basic auth loading check
    const { courses, loading: isDataLoading } = useData(); // Global course catalog
    const { userProfile, isProfileLoading, refreshProfile } = useUserProfile(); // User profile and refresh

    const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. REMOVED: The useEffect hook that set mockCourses is deleted.
    // Courses are now loaded via DataProvider (useData).

    // Safely get enrolled courses from the live userProfile, defaulting to empty array.
    const enrolledCourses: string[] = userProfile 
        ? (userProfile.enrolledCourses?.map(id => id.toString()) || [])
        : [];

    // --- LOADING CHECK ---
    if (!isClerkLoaded || isDataLoading || isProfileLoading || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading courses and user data...</p>
            </div>
        );
    }
    
    const clerkId = userProfile.clerkId; // Get ID here once

    const filteredCourses = courses.filter(course => {
        const courseId = course._id!;
        const isEnrolled = enrolledCourses.includes(courseId);

        if (filter === 'enrolled') {
            return isEnrolled;
        }
        if (filter === 'available') {
            return !isEnrolled;
        }
        return true;
    });

    // 4. IMPLEMENT LIVE ENROLLMENT HANDLER
    const handleEnroll = async (courseId: string) => {
        if (!clerkId || !courseId || enrolledCourses.includes(courseId)) return;
        
        setIsSubmitting(true);
        
        try {
            // API call to the backend endpoint we set up: POST /api/users/:clerkId/enrollCourse
            await api.users.enrollCourse(clerkId, courseId);
            
            // Success: Refresh the UserProfile context to update the UI immediately
            await refreshProfile();
            
            console.log(`Successfully enrolled in course: ${courseId}`);

        } catch (error) {
            console.error('Failed to enroll in course:', error);
            // Optional: Show an error notification
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Courses</h1>
                <p className="text-[#263A47] mb-8">Develop new skills and strategies tailored for ADHD</p>

                <div className="flex space-x-2 mb-6">
                    {(['all', 'enrolled', 'available'] as const).map(filterOption => (
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {filteredCourses.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-[#263A47] mb-4">No courses found</p>
                                {filter !== 'all' && (
                                    <button
                                        onClick={() => setFilter('all')}
                                        className="text-[#469CA4] hover:underline font-medium"
                                    >
                                        View all courses
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredCourses.map(course => {
                                const isEnrolled = enrolledCourses.includes(course._id!);
                                return (
                                    <div
                                        key={course._id}
                                        onClick={() => setSelectedCourse(course)}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                                    >
                                        <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-32"></div>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold text-[#30506C]">{course.courseTitle}</h3>
                                                {isEnrolled && (
                                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
                                                        <CheckCircle size={16} />
                                                        <span className="text-sm font-medium">Enrolled</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[#263A47] mb-4">{course.courseDescription}</p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center space-x-2 text-[#263A47] text-sm">
                                                    <User size={16} />
                                                    <span>{course.courseInstructor}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-[#263A47] text-sm">
                                                    <Calendar size={16} />
                                                    <span>
                                                        {new Date(course.courseStartDate).toLocaleDateString()} -{' '}
                                                        {new Date(course.courseEndDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEnroll(course._id!);
                                                }}
                                                disabled={isEnrolled || isSubmitting}
                                                className={`w-full py-2 rounded-lg font-medium transition ${
                                                    isEnrolled
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                                                }`}
                                            >
                                                {isSubmitting && !isEnrolled ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {selectedCourse && (
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Course Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-[#263A47] mb-1">Title</p>
                                    <p className="text-[#30506C]">{selectedCourse.courseTitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#263A47] mb-1">Instructor</p>
                                    <p className="text-[#30506C]">{selectedCourse.courseInstructor}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#263A47] mb-1">Duration</p>
                                    <p className="text-[#30506C]">
                                        {Math.ceil(
                                            (new Date(selectedCourse.courseEndDate).getTime() -
                                                new Date(selectedCourse.courseStartDate).getTime()) /
                                                (1000 * 60 * 60 * 24 * 7)
                                        )}{' '}
                                        weeks
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        handleEnroll(selectedCourse._id!);
                                        setSelectedCourse(null);
                                    }}
                                    disabled={enrolledCourses.includes(selectedCourse._id!) || isSubmitting}
                                    className={`w-full py-2 rounded-lg font-medium transition ${
                                        enrolledCourses.includes(selectedCourse._id!)
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                                    }`}
                                >
                                    {isSubmitting && !enrolledCourses.includes(selectedCourse._id!) ? 'Enrolling...' : enrolledCourses.includes(selectedCourse._id!) ? 'Enrolled' : 'Enroll Now'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};