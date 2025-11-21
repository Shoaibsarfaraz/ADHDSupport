import { IUser, IEmotionalCheckin, IPlannerEntry } from '../models/types.js';

const mockUsers: Map<string, IUser> = new Map();

export const userService = {
  async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    return mockUsers.get(clerkId) || null;
  },

  async createUser(clerkId: string, userFirstName: string, userLastName: string, userEmail: string): Promise<IUser> {
    const newUser: IUser = {
      clerkId,
      userFirstName,
      userLastName,
      userEmail,
      userType: 'user',
      emotionalCheckins: [],
      plannerEntries: [],
      enrolledCourses: [],
      favoriteResources: [],
      registeredEvents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.set(clerkId, newUser);
    return newUser;
  },

  async updateUser(clerkId: string, updates: Partial<IUser>): Promise<IUser | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    const updated = { ...user, ...updates, updatedAt: new Date() };
    mockUsers.set(clerkId, updated);
    return updated;
  },

  async addEmotionalCheckin(clerkId: string, checkin: IEmotionalCheckin): Promise<IUser | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    const newCheckin: IEmotionalCheckin = {
      ...checkin,
      _id: `checkin_${Date.now()}`,
      checkinDate: checkin.checkinDate || new Date(),
    };

    user.emotionalCheckins.push(newCheckin);
    user.updatedAt = new Date();
    mockUsers.set(clerkId, user);
    return user;
  },

  async getEmotionalCheckins(clerkId: string): Promise<IEmotionalCheckin[]> {
    const user = mockUsers.get(clerkId);
    return user?.emotionalCheckins || [];
  },

  async addPlannerEntry(clerkId: string, entry: IPlannerEntry): Promise<IUser | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    const newEntry: IPlannerEntry = {
      ...entry,
      _id: `entry_${Date.now()}`,
      createdAt: new Date(),
    };

    user.plannerEntries.push(newEntry);
    user.updatedAt = new Date();
    mockUsers.set(clerkId, user);
    return user;
  },

  async getPlannerEntries(clerkId: string): Promise<IPlannerEntry[]> {
    const user = mockUsers.get(clerkId);
    return user?.plannerEntries || [];
  },

  async updatePlannerEntry(clerkId: string, entryId: string, updates: Partial<IPlannerEntry>): Promise<IPlannerEntry | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    const entryIndex = user.plannerEntries.findIndex(e => e._id === entryId);
    if (entryIndex === -1) return null;

    user.plannerEntries[entryIndex] = { ...user.plannerEntries[entryIndex], ...updates };
    user.updatedAt = new Date();
    mockUsers.set(clerkId, user);
    return user.plannerEntries[entryIndex];
  },

  async enrollCourse(clerkId: string, courseId: string): Promise<IUser | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      user.updatedAt = new Date();
      mockUsers.set(clerkId, user);
    }
    return user;
  },

  async addFavoriteResource(clerkId: string, resourceId: string): Promise<IUser | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    if (!user.favoriteResources.includes(resourceId)) {
      user.favoriteResources.push(resourceId);
      user.updatedAt = new Date();
      mockUsers.set(clerkId, user);
    }
    return user;
  },

  async registerEvent(clerkId: string, eventId: string): Promise<IUser | null> {
    const user = mockUsers.get(clerkId);
    if (!user) return null;

    if (!user.registeredEvents.includes(eventId)) {
      user.registeredEvents.push(eventId);
      user.updatedAt = new Date();
      mockUsers.set(clerkId, user);
    }
    return user;
  },
};
