export interface IEmotionalCheckin {
  _id?: string;
  checkinMood: 'happy' | 'sad' | 'anxious' | 'calm' | 'overwhelmed' | 'focused';
  checkinNotes: string;
  checkinDate: Date;
}

export interface IPlannerEntry {
  _id?: string;
  pEntryTime: string;
  pEntryTask: string;
  pEntryStatus: 'pending' | 'in-progress' | 'completed';
  createdAt?: Date;
}

export interface IHabit {
  _id?: string;
  habitName: string;
  habitFrequency: 'daily' | 'weekly' | 'monthly';
  habitProgress: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id?: string;
  clerkId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userType: 'user' | 'admin';
  emotionalCheckins: IEmotionalCheckin[];
  plannerEntries: IPlannerEntry[];
  enrolledCourses: string[];
  favoriteResources: string[];
  registeredEvents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollment {
  _id?: string;
  userId: string;
  courseId: string;
  enrollmentDate: Date;
  completionStatus: 'enrolled' | 'in-progress' | 'completed';
}

export interface ICourse {
  _id?: string;
  courseTitle: string;
  courseDescription: string;
  courseInstructor: string;
  courseStartDate: Date;
  courseEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResource {
  _id?: string;
  resourceTitle: string;
  resourceCategory: 'article' | 'video' | 'tool' | 'guide' | 'other';
  resourceLink: string;
  resourceDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id?: string;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  eventDescription: string;
  attendees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin {
  _id?: string;
  clerkId: string;
  adminUsername: string;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
}
