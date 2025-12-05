// server/src/services/resourceService.ts

import { IResource } from '../models/types.js';
import { Resource } from '../models/Resource.js'; // Import the Mongoose Model

export const resourceService = {
  /**
   * Retrieves all resources in the library.
   * @returns An array of all resource objects.
   */
  async getAllResources(): Promise<IResource[]> {
    // Finds all resources
    return await Resource.find({}).lean<IResource[]>();
  },

  /**
   * Retrieves resources filtered by a specific category.
   * @param category The resource category ('article', 'video', etc.).
   * @returns An array of filtered resource objects.
   */
  async getResourcesByCategory(category: string): Promise<IResource[]> {
    // Finds resources matching the given category
    return await Resource.find({ resourceCategory: category }).lean<IResource[]>();
  },

  /**
   * Retrieves a single resource by its ID.
   * @param resourceId The ID of the resource.
   * @returns The resource object or null if not found.
   */
  async getResourceById(resourceId: string): Promise<IResource | null> {
    // Use findById for quick retrieval by the primary key (_id)
    return await Resource.findById(resourceId).lean<IResource | null>();
  },

  /**
   * Creates a new resource and saves it to the database.
   * @returns The newly created resource object.
   */
  async createResource(
    resourceTitle: string,
    resourceCategory: 'article' | 'video' | 'tool' | 'guide' | 'other',
    resourceLink: string,
    resourceDescription: string
  ): Promise<IResource> {
    // Use Mongoose create to save the new resource
    const newResource = await Resource.create({
      resourceTitle,
      resourceCategory,
      resourceLink,
      resourceDescription,
    });
    return newResource.toObject() as IResource;
  },

  /**
   * Updates an existing resource.
   * @param resourceId The ID of the resource to update.
   * @param updates A partial object of resource fields to update.
   * @returns The updated resource object or null if not found.
   */
  async updateResource(resourceId: string, updates: Partial<IResource>): Promise<IResource | null> {
    // Use findByIdAndUpdate to atomically update the resource
    return await Resource.findByIdAndUpdate(
      resourceId,
      { 
        $set: { ...updates, updatedAt: new Date() } 
      },
      { new: true } // Return the modified document
    ).lean<IResource | null>();
  },

  /**
   * Deletes a specific resource by its ID.
   * @param resourceId The ID of the resource to delete.
   * @returns A boolean indicating success.
   */
  async deleteResource(resourceId: string): Promise<boolean> {
    const result = await Resource.deleteOne({ _id: resourceId });
    // Returns true if one document was successfully deleted
    return result.deletedCount === 1;
  },
};