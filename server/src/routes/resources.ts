// server/src/routes/resources.ts

import express, { Router, Request, Response } from 'express';
import { resourceService } from '../services/index.js';

const router: Router = express.Router();

// GET /api/resources - Get the entire resource catalog, optionally filter by category
router.get('/', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    let resources;

    if (category) {
      resources = await resourceService.getResourcesByCategory(category);
    } else {
      resources = await resourceService.getAllResources();
    }
    
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/resources/:resourceId - Get a specific resource by ID
router.get('/:resourceId', async (req: Request, res: Response) => {
  try {
    const resource = await resourceService.getResourceById(req.params.resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /api/resources - Create a new resource (Admin function)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { resourceTitle, resourceCategory, resourceLink, resourceDescription } = req.body;

    if (!resourceTitle || !resourceCategory || !resourceLink) {
      return res.status(400).json({ error: 'Missing required resource fields' });
    }

    const newResource = await resourceService.createResource(
      resourceTitle,
      resourceCategory,
      resourceLink,
      resourceDescription
    );
    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// PUT /api/resources/:resourceId - Update an existing resource (Admin function)
router.put('/:resourceId', async (req: Request, res: Response) => {
  try {
    const updatedResource = await resourceService.updateResource(req.params.resourceId, req.body);

    if (!updatedResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/resources/:resourceId - Delete a resource (Admin function)
router.delete('/:resourceId', async (req: Request, res: Response) => {
  try {
    const success = await resourceService.deleteResource(req.params.resourceId);
    if (!success) {
      return res.status(404).json({ error: 'Resource not found or could not be deleted' });
    }
    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;