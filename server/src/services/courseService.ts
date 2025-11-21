import { ICourse } from '../models/types.js';

const mockCourses: Map<string, ICourse> = new Map();

const seededCourses: ICourse[] = [
  {
    _id: 'course_1',
    courseTitle: 'Understanding ADHD: The Basics',
    courseDescription: 'An introductory course covering ADHD fundamentals, symptoms, and management strategies.',
    courseInstructor: 'Dr. Sarah Williams',
    courseStartDate: new Date('2024-12-01'),
    courseEndDate: new Date('2025-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'course_2',
    courseTitle: 'Time Management for ADHD',
    courseDescription: 'Learn practical time management techniques specifically designed for ADHD minds.',
    courseInstructor: 'James Thompson',
    courseStartDate: new Date('2024-12-10'),
    courseEndDate: new Date('2025-01-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'course_3',
    courseTitle: 'Building Productive Routines',
    courseDescription: 'Develop sustainable routines that work with, not against, your ADHD brain.',
    courseInstructor: 'Emma Rodriguez',
    courseStartDate: new Date('2024-12-15'),
    courseEndDate: new Date('2025-02-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

seededCourses.forEach(course => {
  mockCourses.set(course._id!, course);
});

export const courseService = {
  async getAllCourses(): Promise<ICourse[]> {
    return Array.from(mockCourses.values());
  },

  async getCourseById(courseId: string): Promise<ICourse | null> {
    return mockCourses.get(courseId) || null;
  },

  async createCourse(
    courseTitle: string,
    courseDescription: string,
    courseInstructor: string,
    courseStartDate: Date,
    courseEndDate: Date
  ): Promise<ICourse> {
    const newCourse: ICourse = {
      _id: `course_${Date.now()}`,
      courseTitle,
      courseDescription,
      courseInstructor,
      courseStartDate,
      courseEndDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCourses.set(newCourse._id!, newCourse);
    return newCourse;
  },

  async updateCourse(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null> {
    const course = mockCourses.get(courseId);
    if (!course) return null;

    const updated = { ...course, ...updates, updatedAt: new Date() };
    mockCourses.set(courseId, updated);
    return updated;
  },

  async deleteCourse(courseId: string): Promise<boolean> {
    return mockCourses.delete(courseId);
  },
};
