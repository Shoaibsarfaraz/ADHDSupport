import { IResource } from '../models/types.js';

const mockResources: Map<string, IResource> = new Map();

const seededResources: IResource[] = [
  {
    _id: 'resource_1',
    resourceTitle: 'ADHD Medication Guide',
    resourceCategory: 'guide',
    resourceLink: 'https://example.com/adhd-medication-guide',
    resourceDescription: 'Comprehensive guide on ADHD medications, side effects, and management.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'resource_2',
    resourceTitle: 'Productivity Hacks for ADHD',
    resourceCategory: 'article',
    resourceLink: 'https://example.com/productivity-hacks',
    resourceDescription: 'Evidence-based productivity techniques tailored for ADHD.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'resource_3',
    resourceTitle: 'Focus Timer Tool',
    resourceCategory: 'tool',
    resourceLink: 'https://example.com/focus-timer',
    resourceDescription: 'Customizable Pomodoro timer designed for ADHD work patterns.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'resource_4',
    resourceTitle: 'Understanding Executive Function',
    resourceCategory: 'video',
    resourceLink: 'https://example.com/executive-function-video',
    resourceDescription: 'Video explanation of executive function and how ADHD affects it.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

seededResources.forEach(resource => {
  mockResources.set(resource._id!, resource);
});

export const resourceService = {
  async getAllResources(): Promise<IResource[]> {
    return Array.from(mockResources.values());
  },

  async getResourcesByCategory(category: string): Promise<IResource[]> {
    return Array.from(mockResources.values()).filter(r => r.resourceCategory === category);
  },

  async getResourceById(resourceId: string): Promise<IResource | null> {
    return mockResources.get(resourceId) || null;
  },

  async createResource(
    resourceTitle: string,
    resourceCategory: 'article' | 'video' | 'tool' | 'guide' | 'other',
    resourceLink: string,
    resourceDescription: string
  ): Promise<IResource> {
    const newResource: IResource = {
      _id: `resource_${Date.now()}`,
      resourceTitle,
      resourceCategory,
      resourceLink,
      resourceDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockResources.set(newResource._id!, newResource);
    return newResource;
  },

  async updateResource(resourceId: string, updates: Partial<IResource>): Promise<IResource | null> {
    const resource = mockResources.get(resourceId);
    if (!resource) return null;

    const updated = { ...resource, ...updates, updatedAt: new Date() };
    mockResources.set(resourceId, updated);
    return updated;
  },

  async deleteResource(resourceId: string): Promise<boolean> {
    return mockResources.delete(resourceId);
  },
};
