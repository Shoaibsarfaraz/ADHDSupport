import React, { useState, useEffect, useCallback } from 'react';
import { useUserProfile } from '../context/UserProfileContext.js';
import { api } from '../services/api.js';
import { 
    CheckCircle2, Circle, Plus, Trash2, Smile, 
    Brain, Timer, Play, Pause, RotateCcw 
} from 'lucide-react';
import type { 
    IPlannerEntry, 
    IEmotionalCheckin, 
    IBrainDumpEntry, 
    IFocusSession,
    IHabit
} from '../types/index.js';

export const Productivity = () => {
    // --- 1. HOOKS & STATE (UNCONDITIONAL) ---
    
    const { 
        userProfile, 
        isProfileLoading, 
        refreshProfile,
    } = useUserProfile();

    const [habits, setHabits] = useState<IHabit[]>([]);
    const [isHabitLoading, setIsHabitLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    
    // Hooks for Forms/UI State
    const [newTask, setNewTask] = useState('');
    const [newTaskTime, setNewTaskTime] = useState('09:00');
    const [newMood, setNewMood] = useState<IEmotionalCheckin['checkinMood']>('calm');
    const [moodNotes, setMoodNotes] = useState('');
    const [brainDumpInput, setBrainDumpInput] = useState('');
    
    // Focus Timer State
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isWorkMode, setIsWorkMode] = useState(true);
    
    // UI Tab State
    const [selectedTab, setSelectedTab] = useState<'planner' | 'habits' | 'mood' | 'brain-dump' | 'focus'>('planner');
    
    // FIX: Reinstating Habit Form State Variables
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    
    // --- 2. HELPER FUNCTIONS (UNCONDITIONAL) ---
    
    const moods: IEmotionalCheckin['checkinMood'][] = ['happy', 'sad', 'anxious', 'calm', 'overwhelmed', 'focused'];

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(isWorkMode ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // --- 3. ASYNC HANDLERS (HOISTED AND STABILIZED) ---
    
    const clerkId = userProfile?.clerkId;
    
    // --- PLANNER HANDLERS ---
    const handleAddTask = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim() || !clerkId || isSubmitting) return;

        setIsSubmitting(true);
        const newEntry: Partial<IPlannerEntry> = {
            pEntryTime: newTaskTime,
            pEntryTask: newTask,
            pEntryStatus: 'pending',
        };

        try {
            await api.users.addPlannerEntry(clerkId, newEntry as IPlannerEntry);
            
            setNewTask('');
            setNewTaskTime('09:00');
            
            setTimeout(() => { refreshProfile(); }, 0); 
        } catch (e) {
            console.error("Failed to add planner entry:", e);
        } finally {
             setIsSubmitting(false);
        }
    }, [newTask, newTaskTime, clerkId, refreshProfile, isSubmitting, userProfile]);

    const handleToggleTask = useCallback(async (entry: IPlannerEntry) => {
        if (!entry._id || !clerkId || isSubmitting) return;
        
        setIsSubmitting(true);
        const newStatus = entry.pEntryStatus === 'completed' ? 'pending' : 'completed';
        const updates: Partial<IPlannerEntry> = { pEntryStatus: newStatus };

        try {
            await api.users.updatePlannerEntry(clerkId, entry._id, updates);
            setTimeout(() => { refreshProfile(); }, 0); 
        } catch (e) {
            console.error("Failed to toggle task status:", e);
        } finally {
            setIsSubmitting(false);
        }
    }, [clerkId, refreshProfile, isSubmitting, userProfile]);

    const handleDeleteTask = useCallback(async (entryId: string | undefined) => {
    if (!entryId || !clerkId || isSubmitting) return;

    setIsSubmitting(true);

    try {
        // API call to the new DELETE endpoint
        await api.users.deletePlannerEntry(clerkId, entryId); 

        // After successful deletion, force context refresh to update UI
        setTimeout(() => { refreshProfile(); }, 0);

    } catch (e) {
        console.error("Failed to delete planner entry:", e);
    } finally {
        setIsSubmitting(false);
    }
}, [refreshProfile, isSubmitting, clerkId]);

    // --- MOOD HANDLERS ---
    const handleAddMoodCheckin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clerkId || isSubmitting) return;

        setIsSubmitting(true);
        const newCheckin: Partial<IEmotionalCheckin> = {
            checkinMood: newMood,
            checkinNotes: moodNotes,
        };
        
        try {
            await api.users.addEmotionalCheckin(clerkId, newCheckin as IEmotionalCheckin);
            setMoodNotes('');
            setTimeout(() => { refreshProfile(); }, 0);
        } catch (e) {
            console.error("Failed to add emotional check-in:", e);
        } finally {
            setIsSubmitting(false);
        }
    }, [clerkId, newMood, moodNotes, refreshProfile, isSubmitting]);

    // --- BRAIN DUMP HANDLERS ---
    const handleAddBrainDump = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brainDumpInput.trim() || !clerkId || isSubmitting) return;

        setIsSubmitting(true);
        const newDump: Partial<IBrainDumpEntry> = { content: brainDumpInput };

        try {
            await api.users.addBrainDumpEntry(clerkId, newDump as IBrainDumpEntry);
            setBrainDumpInput('');
            setTimeout(() => { refreshProfile(); }, 0);
        } catch (e) {
            console.error("Failed to add brain dump entry:", e);
        } finally {
            setIsSubmitting(false);
        }
    }, [brainDumpInput, clerkId, refreshProfile, isSubmitting]);

    const handleDeleteBrainDump = useCallback(async (id: string) => {
    if (!id || !clerkId || isSubmitting) return;

    setIsSubmitting(true);
    try {
        await api.users.deleteBrainDumpEntry(clerkId, id);
        
        setTimeout(() => { refreshProfile(); }, 0); 
    } catch (e) {
        console.error("Failed to delete brain dump entry:", e);
    } finally {
        setIsSubmitting(false);
    }
}, [refreshProfile, isSubmitting, clerkId]);

    // --- HABIT HANDLERS ---
    const handleAddHabit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim() || !clerkId || isSubmitting) return;

        setIsSubmitting(true);
        const newHabitData = {
            habitName: newHabitName,
            habitFrequency: newHabitFrequency,
            userId: clerkId,
        };

        try {
            const response = await api.habits.create(newHabitData);
            setHabits(prev => [...prev, response.data]);
            setNewHabitName('');
        } catch (e) {
            console.error("Failed to create habit:", e);
        } finally {
            setIsSubmitting(false);
        }
    }, [newHabitName, newHabitFrequency, clerkId, isSubmitting]);

    const handleUpdateProgress = useCallback(async (habitId: string, currentProgress: number) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const newProgress = Math.min(100, currentProgress + 10);

        try {
            const response = await api.habits.updateProgress(habitId, newProgress);
            setHabits(prev => 
                prev.map(h => (h._id === habitId ? response.data : h))
            );
        } catch (e) {
            console.error("Failed to update habit progress:", e);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);

    const handleDeleteHabit = useCallback(async (habitId: string) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await api.habits.delete(habitId);
            setHabits(prev => prev.filter(h => h._id !== habitId));
        } catch (e) {
            console.error("Failed to delete habit:", e);
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting]);
    
    // --- 4. EFFECTS ---
    
    const focusTimerEffect = useCallback(() => {
        let interval: NodeJS.Timeout;

        if (!clerkId) return;
        const duration = isWorkMode ? 25 : 5;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            
            if (isWorkMode) {
                const newSessionData: Partial<IFocusSession> = {
                    duration: duration,
                    completedAt: new Date(),
                };
                
                api.users.addFocusSession(clerkId, newSessionData as IFocusSession)
                    .then(() => refreshProfile()) 
                    .catch(e => console.error("Failed to save focus session:", e));
                
                setIsWorkMode(false);
                setTimeLeft(5 * 60);
            } else {
                setIsWorkMode(true);
                setTimeLeft(25 * 60);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isWorkMode, clerkId, refreshProfile]);
    
    useEffect(focusTimerEffect, [focusTimerEffect]); 
    
    const fetchHabitsEffect = useCallback(() => {
        if (selectedTab !== 'habits' || isProfileLoading || !clerkId) return;

        const fetchHabits = async () => {
            setIsHabitLoading(true);
            try {
                const response = await api.habits.getByUserId(clerkId);
                setHabits(response.data);
            } catch (e) {
                console.error("Failed to fetch habits:", e);
                setHabits([]);
            } finally {
                setIsHabitLoading(false);
            }
        };

        fetchHabits();
    }, [selectedTab, isProfileLoading, clerkId]);

    useEffect(fetchHabitsEffect, [fetchHabitsEffect]);


    // --- 5. CONDITIONAL RETURN ---
    if (isProfileLoading || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading productivity tools...</p>
            </div>
        );
    }
    
    // --- 6. RENDER RETURN ---
    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Productivity Tools</h1>
                <p className="text-[#263A47] mb-8">Manage your tasks, habits, focus, and mind.</p>

                {/* Navigation Tabs */}
                <div className="flex space-x-2 mb-6 border-b border-[#D7E9ED] overflow-x-auto">
                    {([
                        { id: 'planner', label: 'Planner' },
                        { id: 'habits', label: 'Habits' },
                        { id: 'mood', label: 'Mood' },
                        { id: 'brain-dump', label: 'Brain Dump' },
                        { id: 'focus', label: 'Focus Timer' }
                    ] as const).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedTab(tab.id as any)}
                            className={`px-4 py-2 font-medium border-b-2 transition whitespace-nowrap ${
                                selectedTab === tab.id
                                    ? 'text-[#30506C] border-[#469CA4]'
                                    : 'text-[#263A47] border-transparent hover:border-[#D7E9ED]'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* PLANNER TAB */}
                {selectedTab === 'planner' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-[#30506C] mb-4">Today's Tasks</h2>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {userProfile.plannerEntries.length === 0 ? (
                                        <p className="text-[#263A47] text-center py-8">No tasks yet. Add one to get started!</p>
                                    ) : (
                                        userProfile.plannerEntries.map(entry => (
                                            <div key={entry._id} className="flex items-center justify-between p-3 bg-[#F5F0ED] rounded-lg hover:bg-[#D7E9ED] transition">
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <button onClick={() => handleToggleTask(entry)} disabled={isSubmitting} className="text-[#469CA4] hover:text-[#30506C] transition disabled:opacity-50">
                                                        {entry.pEntryStatus === 'completed' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                                    </button>
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${entry.pEntryStatus === 'completed' ? 'text-[#263A47] line-through' : 'text-[#30506C]'}`}>
                                                            {entry.pEntryTask}
                                                        </p>
                                                        <p className="text-sm text-[#263A47]">{entry.pEntryTime}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteTask(entry._id)} disabled={isSubmitting} className="text-red-500 hover:text-red-700 transition ml-2 disabled:opacity-50">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Add Task Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Add Task</h2>
                            <form onSubmit={handleAddTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Time</label>
                                    <input type="time" value={newTaskTime} onChange={(e) => setNewTaskTime(e.target.value)} className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Task</label>
                                    <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter a task..." className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition flex items-center justify-center space-x-2 disabled:bg-gray-400">
                                    <Plus size={20} />
                                    <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* HABITS TAB (LIVE API INTEGRATION) */}
                {selectedTab === 'habits' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-[#30506C] mb-4">Your Habits</h2>
                                
                                {isHabitLoading ? (
                                    <p className="text-[#263A47] text-center py-8">Loading habits...</p>
                                ) : habits.length === 0 ? (
                                    <p className="text-[#263A47] text-center py-8">No habits tracked yet. Create one!</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {habits.map(habit => (
                                            <div key={habit._id} className="bg-[#F5F0ED] rounded-lg p-4 relative">
                                                <p className="font-medium text-[#30506C] mb-2">{habit.habitName}</p>
                                                <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
                                                    <div className="bg-[#469CA4] h-2 rounded-full transition-all duration-500" style={{ width: `${habit.habitProgress}%` }}></div>
                                                </div>
                                                <p className="text-sm text-[#263A47]">{habit.habitProgress}% Progress • {habit.habitFrequency.charAt(0).toUpperCase() + habit.habitFrequency.slice(1)}</p>

                                                <div className="mt-3 flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdateProgress(habit._id!, habit.habitProgress)}
                                                        disabled={habit.habitProgress >= 100 || isSubmitting}
                                                        className="bg-[#469CA4] text-white text-xs px-3 py-1 rounded hover:bg-[#3a7f8a] disabled:bg-gray-400"
                                                    >
                                                        {habit.habitProgress >= 100 ? 'Completed' : '+10% Progress'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHabit(habit._id!)}
                                                        disabled={isSubmitting}
                                                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Add Habit Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Add New Habit</h2>
                            <form onSubmit={handleAddHabit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Habit Name</label>
                                    <input 
                                        type="text" 
                                        value={newHabitName} 
                                        onChange={(e) => setNewHabitName(e.target.value)} 
                                        placeholder="e.g., Read for 15 minutes" 
                                        className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Frequency</label>
                                    <select 
                                        value={newHabitFrequency} 
                                        onChange={(e) => setNewHabitFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')} 
                                        className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]"
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition flex items-center justify-center space-x-2 disabled:bg-gray-400">
                                    <Plus size={20} />
                                    <span>{isSubmitting ? 'Creating...' : 'Create Habit'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* MOOD TAB */}
                {selectedTab === 'mood' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Mood History</h2>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {userProfile.emotionalCheckins.length === 0 ? (
                                    <p className="text-[#263A47] text-center py-8">No mood check-ins yet. Start tracking today!</p>
                                ) : (
                                    userProfile.emotionalCheckins.slice().reverse().map(checkin => (
                                        <div key={checkin._id} className="p-4 bg-[#F5F0ED] rounded-lg border-l-4 border-[#469CA4]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-[#30506C] capitalize">{checkin.checkinMood}</span>
                                                <span className="text-sm text-[#263A47]">{new Date(checkin.checkinDate).toLocaleDateString()}</span>
                                            </div>
                                            {checkin.checkinNotes && <p className="text-[#263A47] text-sm">{checkin.checkinNotes}</p>}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Check In Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                                <Smile size={24} />
                                <span>Check In</span>
                            </h2>
                            <form onSubmit={handleAddMoodCheckin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">How are you feeling?</label>
                                    <select value={newMood} onChange={(e) => setNewMood(e.target.value as IEmotionalCheckin['checkinMood'])} className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4]">
                                        {moods.map(mood => (
                                            <option key={mood} value={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#263A47] mb-2">Notes (optional)</label>
                                    <textarea value={moodNotes} onChange={(e) => setMoodNotes(e.target.value)} placeholder="How are you feeling today?..." rows={3} className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4] resize-none" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400">
                                    {isSubmitting ? 'Saving...' : 'Save Check-in'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* BRAIN DUMP TAB */}
                {selectedTab === 'brain-dump' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center gap-2">
                                    <Brain size={24} />
                                    <span>Thought Stream</span>
                                </h2>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {userProfile.brainDumpEntries.length === 0 ? (
                                        <p className="text-[#263A47] text-center py-8">Mind full? Pour it out here.</p>
                                    ) : (
                                        userProfile.brainDumpEntries.map(entry => (
                                            <div key={entry._id} className="p-4 bg-[#F5F0ED] rounded-lg group relative">
                                                <p className="text-[#30506C] whitespace-pre-wrap">{entry.content}</p>
                                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#D7E9ED]">
                                                    <span className="text-xs text-[#263A47]">{new Date(entry.createdAt).toLocaleString()}</span>
                                                    <button onClick={() => handleDeleteBrainDump(entry._id)} disabled={isSubmitting} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition disabled:opacity-50">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Clear Your Mind Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Clear Your Mind</h2>
                            <form onSubmit={handleAddBrainDump} className="space-y-4">
                                <textarea 
                                    value={brainDumpInput} 
                                    onChange={(e) => setBrainDumpInput(e.target.value)} 
                                    placeholder="What's on your mind? Don't judge, just type..." 
                                    rows={6} 
                                    className="w-full px-3 py-2 border border-[#D7E9ED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#469CA4] resize-none" 
                                />
                                <button type="submit" disabled={isSubmitting} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400">
                                    {isSubmitting ? 'Dumping...' : 'Dump Thoughts'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* FOCUS TIMER TAB */}
                {selectedTab === 'focus' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="flex justify-center items-center gap-2 mb-6">
                                <Timer size={32} className="text-[#469CA4]" />
                                <h2 className="text-2xl font-bold text-[#30506C]">
                                    {isWorkMode ? 'Focus Session' : 'Break Time'}
                                </h2>
                            </div>
                            
                            <div className="mb-8">
                                <div className="text-8xl font-bold text-[#30506C] font-mono tracking-wider">
                                    {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="flex justify-center space-x-6 mb-8">
                                <button 
                                    onClick={toggleTimer}
                                    disabled={isSubmitting}
                                    className={`p-4 rounded-full transition ${
                                        isActive 
                                            ? 'bg-[#F5F0ED] text-[#30506C] hover:bg-[#D7E9ED]' 
                                            : 'bg-[#469CA4] text-white hover:bg-[#3a7f8a]'
                                    } disabled:opacity-50`}
                                >
                                    {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                </button>
                                <button 
                                    onClick={resetTimer}
                                    disabled={isSubmitting}
                                    className="p-4 rounded-full bg-[#F5F0ED] text-[#30506C] hover:bg-[#D7E9ED] transition disabled:opacity-50"
                                >
                                    <RotateCcw size={32} />
                                </button>
                            </div>

                            <div className="border-t border-[#D7E9ED] pt-6">
                                <p className="text-[#263A47] mb-2 font-medium">Sessions Completed</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {userProfile.focusSessions
                                        .filter((s: IFocusSession) => new Date(s.completedAt).toDateString() === new Date().toDateString())
                                        .map((_, i) => (
                                        <div key={i} className="w-4 h-4 bg-[#469CA4] rounded-full" title="25 min session" />
                                    ))}
                                    {userProfile.focusSessions.filter((s: IFocusSession) => new Date(s.completedAt).toDateString() === new Date().toDateString()).length === 0 && (
                                        <span className="text-sm text-gray-400">No sessions yet today</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};