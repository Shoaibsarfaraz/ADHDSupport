import axios, { AxiosInstance } from 'axios';
import { IUser, IHabit, ICourse, IResource, IEvent, IEmotionalCheckin, IPlannerEntry } from '../types/index.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  users: {
    getByClerkId: (clerkId: string) => apiClient.get<IUser>(`/users/${clerkId}`),
    create: (data: Partial<IUser>) => apiClient.post<IUser>('/users', data),
    update: (clerkId: string, data: Partial<IUser>) => apiClient.put<IUser>(`/users/${clerkId}`, data),
    addEmotionalCheckin: (clerkId: string, checkin: IEmotionalCheckin) =>
      apiClient.post<IUser>(`/users/${clerkId}/emotional-checkins`, checkin),
    getEmotionalCheckins: (clerkId: string) => apiClient.get<IEmotionalCheckin[]>(`/users/${clerkId}/emotional-checkins`),
    addPlannerEntry: (clerkId: string, entry: IPlannerEntry) =>
      apiClient.post<IUser>(`/users/${clerkId}/planner-entries`, entry),
    getPlannerEntries: (clerkId: string) => apiClient.get<IPlannerEntry[]>(`/users/${clerkId}/planner-entries`),
    updatePlannerEntry: (clerkId: string, entryId: string, updates: Partial<IPlannerEntry>) =>
      apiClient.put<IPlannerEntry>(`/users/${clerkId}/planner-entries/${entryId}`, updates),
    enrollCourse: (clerkId: string, courseId: string) =>
      apiClient.post<IUser>(`/users/${clerkId}/enroll-course`, { courseId }),
    addFavoriteResource: (clerkId: string, resourceId: string) =>
      apiClient.post<IUser>(`/users/${clerkId}/favorite-resource`, { resourceId }),
    registerEvent: (clerkId: string, eventId: string) =>
      apiClient.post<IUser>(`/users/${clerkId}/register-event`, { eventId }),
  },

  habits: {
    getByUserId: (userId: string) => apiClient.get<IHabit[]>(`/habits?userId=${userId}`),
    create: (data: Partial<IHabit>) => apiClient.post<IHabit>('/habits', data),
    updateProgress: (habitId: string, progress: number) =>
      apiClient.put<IHabit>(`/habits/${habitId}`, { habitProgress: progress }),
    delete: (habitId: string) => apiClient.delete(`/habits/${habitId}`),
  },

  courses: {
    getAll: () => apiClient.get<ICourse[]>('/courses'),
    getById: (courseId: string) => apiClient.get<ICourse>(`/courses/${courseId}`),
    create: (data: Partial<ICourse>) => apiClient.post<ICourse>('/courses', data),
    update: (courseId: string, data: Partial<ICourse>) =>
      apiClient.put<ICourse>(`/courses/${courseId}`, data),
    delete: (courseId: string) => apiClient.delete(`/courses/${courseId}`),
  },

  resources: {
    getAll: () => apiClient.get<IResource[]>('/resources'),
    getByCategory: (category: string) => apiClient.get<IResource[]>(`/resources?category=${category}`),
    getById: (resourceId: string) => apiClient.get<IResource>(`/resources/${resourceId}`),
    create: (data: Partial<IResource>) => apiClient.post<IResource>('/resources', data),
    update: (resourceId: string, data: Partial<IResource>) =>
      apiClient.put<IResource>(`/resources/${resourceId}`, data),
    delete: (resourceId: string) => apiClient.delete(`/resources/${resourceId}`),
  },

  events: {
    getAll: () => apiClient.get<IEvent[]>('/events'),
    getUpcoming: () => apiClient.get<IEvent[]>('/events/upcoming'),
    getById: (eventId: string) => apiClient.get<IEvent>(`/events/${eventId}`),
    create: (data: Partial<IEvent>) => apiClient.post<IEvent>('/events', data),
    registerAttendee: (eventId: string, userId: string) =>
      apiClient.post<IEvent>(`/events/${eventId}/register`, { userId }),
    update: (eventId: string, data: Partial<IEvent>) =>
      apiClient.put<IEvent>(`/events/${eventId}`, data),
    delete: (eventId: string) => apiClient.delete(`/events/${eventId}`),
  },
};
