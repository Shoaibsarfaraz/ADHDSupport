import express, { Router, Request, Response } from 'express';
import { userService } from '../services/index.js';

// Define the interface for the merged URL parameters
interface ProductivityParams {
    clerkId: string;
    entryId: string; // Used for planner and braindump sub-documents
}

// NOTE: { mergeParams: true } is CRITICAL here to access the :clerkId parameter
const router: Router = express.Router({ mergeParams: true });

// Type the Request object explicitly with our new interface
type TypedRequest = Request<ProductivityParams>;


// ====================================================================
// CONSOLIDATED PRODUCTIVITY ROUTES - Mounted at /api/users/:clerkId
// ====================================================================

// GET /api/users/:clerkId/planner - Get all planner entries
router.get('/planner', async (req: TypedRequest, res: Response) => {
    try {
        const entries = await userService.getPlannerEntries(req.params.clerkId);
        res.json(entries);
    } catch (error) { res.status(500).json({ error: (error as Error).message }); }
});

// POST /api/users/:clerkId/planner - Add new planner entry
router.post('/planner', async (req: TypedRequest, res: Response) => {
    try {
        const updatedUser = await userService.addPlannerEntry(req.params.clerkId, req.body);
        if (!updatedUser) { return res.status(404).json({ error: 'User not found' }); }
        res.status(201).json(updatedUser.plannerEntries.slice(-1)[0]);
    } catch (error) { res.status(500).json({ error: (error as Error).message }); }
});

// PUT /api/users/:clerkId/planner/:entryId - Update specific planner entry
router.put('/planner/:entryId', async (req: TypedRequest, res: Response) => {
    try {
        const updatedEntry = await userService.updatePlannerEntry(req.params.clerkId, req.params.entryId, req.body);
        if (!updatedEntry) { return res.status(404).json({ error: 'Entry or User not found' }); }
        res.json(updatedEntry);
    } catch (error) { res.status(500).json({ error: (error as Error).message }); }
});

// FIX 1: Planner Delete route (Using PUT and ID in body)
router.put('/planner-delete', async (req: TypedRequest, res: Response) => {
    try {
        const { entryId } = req.body;
        if (!entryId) { return res.status(400).json({ error: 'Entry ID required.' }); }
        
        const user = await userService.deletePlannerEntry(req.params.clerkId, entryId);
        
        if (!user) { return res.status(404).json({ error: 'Entry not found' }); }
        res.status(200).json({ message: 'Planner entry deleted successfully' });
    } catch (error) { res.status(500).json({ error: 'Internal Server Error.' }); }
});

// POST /api/users/:clerkId/braindump - Add a new brain dump entry
router.post('/braindump', async (req: TypedRequest, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) { return res.status(400).json({ error: 'Content required.' }); }
        const updatedUser = await userService.addBrainDumpEntry(req.params.clerkId, req.body);
        if (!updatedUser) { return res.status(404).json({ error: 'User not found' }); }
        res.status(201).json(updatedUser.brainDumpEntries.slice(-1)[0]);
    } catch (error) { res.status(500).json({ error: 'Internal Server Error.' }); }
});

// FIX 2: Brain Dump Delete route (Using PUT and ID in body)
router.put('/braindump-delete', async (req: TypedRequest, res: Response) => {
    try {
        const { entryId } = req.body;
        if (!entryId) { return res.status(400).json({ error: 'Entry ID required.' }); }
        
        const user = await userService.deleteBrainDumpEntry(req.params.clerkId, entryId); 
        
        if (!user) { return res.status(404).json({ error: 'Entry not found' }); }
        res.status(200).json({ message: 'Brain dump entry deleted successfully' });
    } catch (error) { res.status(500).json({ error: 'Internal Server Error.' }); }
});

// POST /api/users/:clerkId/focus - Add a new focus session
router.post('/focus', async (req: TypedRequest, res: Response) => {
    try {
        const { duration } = req.body;
        if (typeof duration !== 'number') { return res.status(400).json({ error: 'Duration is required.' }); }
        const updatedUser = await userService.addFocusSession(req.params.clerkId, req.body);
        if (!updatedUser) { return res.status(404).json({ error: 'User not found' }); }
        res.status(201).json(updatedUser.focusSessions.slice(-1)[0]);
    } catch (error) { res.status(500).json({ error: 'Internal Server Error.' }); }
});

export default router;