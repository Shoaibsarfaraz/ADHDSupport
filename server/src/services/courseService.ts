// server/src/services/courseService.ts

import { ICourse } from '../models/types.js';
import { Course } from '../models/Course.js'; // Import the Mongoose Model

export const courseService = {
  /**
   * Retrieves all courses in the catalog.
   * @returns An array of all course objects.
   */
  async getAllCourses(): Promise<ICourse[]> {
    // Use find({}) to retrieve all documents
    return await Course.find({}).lean<ICourse[]>();
  },

  /**
   * Retrieves a single course by its ID.
   * @param courseId The ID of the course.
   * @returns The course object or null if not found.
   */
  async getCourseById(courseId: string): Promise<ICourse | null> {
    // Use findById for quick retrieval by the primary key (_id)
    return await Course.findById(courseId).lean<ICourse | null>();
  },

  /**
   * Creates a new course and saves it to the database.
   * @returns The newly created course object.
   */
  async createCourse(
    courseTitle: string,
    courseDescription: string,
    courseInstructor: string,
    courseStartDate: Date,
    courseEndDate: Date
  ): Promise<ICourse> {
    // Use Mongoose create to save the new course
    const newCourse = await Course.create({
      courseTitle,
      courseDescription,
      courseInstructor,
      courseStartDate,
      courseEndDate,
    });
    return newCourse.toObject() as ICourse;
  },

  /**
   * Updates an existing course.
   * @param courseId The ID of the course to update.
   * @param updates A partial object of course fields to update.
   * @returns The updated course object or null if not found.
   */
  async updateCourse(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null> {
    // Use findByIdAndUpdate to atomically update the course
    return await Course.findByIdAndUpdate(
      courseId,
      { 
        $set: { ...updates, updatedAt: new Date() } 
      },
      { new: true } // Return the modified document
    ).lean<ICourse | null>();
  },

  /**
   * Deletes a specific course by its ID.
   * @param courseId The ID of the course to delete.
   * @returns A boolean indicating success.
   */
  async deleteCourse(courseId: string): Promise<boolean> {
    const result = await Course.deleteOne({ _id: courseId });
    // Returns true if one document was successfully deleted
    return result.deletedCount === 1;
  },
};