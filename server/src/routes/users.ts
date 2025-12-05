import express, { Router, Request, Response } from 'express';
import { userService } from '../services/index.js';

const router: Router = express.Router();

// ====================================================================
// CORE USER PROFILE POST (specific routes first)
// ====================================================================

// POST /api/users - Create a new user
router.post('/', async (req: Request, res: Response) => {
    try {
        const {
            clerkId,
            userFirstName = "",
            userLastName = "",
            userEmail = ""
        } = req.body;

        if (!clerkId) {
            return res.status(400).json({ error: "clerkId is required" });
        }
        if (!userEmail) {
            return res.status(400).json({ error: "userEmail is required" });
        }

        const user = await userService.createUser(
            clerkId,
            userFirstName || "",
            userLastName || "",
            userEmail
        );

        return res.status(201).json(user);

    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ error: (error as Error).message });
    }
});




// ====================================================================
// PRODUCTIVITY ROUTES (all specific paths BEFORE any /:clerkId)
// ====================================================================



router.post('/:clerkId/checkin', async (req: Request, res: Response) => {
    try {
        const updatedUser = await userService.addEmotionalCheckin(req.params.clerkId, req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });
        res.status(201).json(updatedUser.emotionalCheckins.slice(-1)[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});
router.get('/:clerkId/checkins', async (req: Request, res: Response) => { // NOTE: Changed to PLURAL for GET consistency
    try {
        const checkins = await userService.getEmotionalCheckins(req.params.clerkId);
        res.json(checkins);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/:clerkId/braindump', async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content is required.' });

        const updatedUser = await userService.addBrainDumpEntry(req.params.clerkId, req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(201).json(updatedUser.brainDumpEntries.slice(-1)[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.put('/:clerkId/braindump-delete', async (req, res) => {
    try {
        const { entryId } = req.body;
        if (!entryId) return res.status(400).json({ error: 'Entry ID required' });

        const user = await userService.deleteBrainDumpEntry(req.params.clerkId, entryId);
        if (!user) return res.status(404).json({ error: 'Entry not found' });

        res.status(200).json({ message: 'Brain dump entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:clerkId/focus', async (req: Request, res: Response) => {
    try {
        const { duration } = req.body;
        if (typeof duration !== 'number')
            return res.status(400).json({ error: 'Duration (number) is required' });

        const updatedUser = await userService.addFocusSession(req.params.clerkId, req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(201).json(updatedUser.focusSessions.slice(-1)[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/:clerkId/planner', async (req: Request, res: Response) => {
    try {
        const entries = await userService.getPlannerEntries(req.params.clerkId);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/:clerkId/planner', async (req: Request, res: Response) => {
    try {
        const updatedUser = await userService.addPlannerEntry(req.params.clerkId, req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.status(201).json(updatedUser.plannerEntries.slice(-1)[0]);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.put('/:clerkId/planner/:entryId', async (req: Request, res: Response) => {
    try {
        const updatedEntry = await userService.updatePlannerEntry(
            req.params.clerkId,
            req.params.entryId,
            req.body
        );

        if (!updatedEntry) return res.status(404).json({ error: 'Planner entry not found' });

        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.put('/:clerkId/planner-delete', async (req, res) => {
    try {
        const { entryId } = req.body;
        if (!entryId) return res.status(400).json({ error: 'Entry ID required' });

        const user = await userService.deletePlannerEntry(req.params.clerkId, entryId);
        if (!user) return res.status(404).json({ error: 'Entry not found' });

        res.status(200).json({ message: 'Planner entry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ====================================================================
// COURSE / EVENT / RESOURCE (Still BEFORE generic /:clerkId routes)
// ====================================================================

router.post('/:clerkId/enrollCourse', async (req, res) => {
    try {
        const { courseId } = req.body;
        const updatedUser = await userService.enrollCourse(req.params.clerkId, courseId);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/:clerkId/favoriteResource', async (req, res) => {
    try {
        const { resourceId } = req.body;
        const updatedUser = await userService.addFavoriteResource(req.params.clerkId, resourceId);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/:clerkId/registerEvent', async (req, res) => {
    try {
        const { eventId } = req.body;
        const updatedUser = await userService.registerEvent(req.params.clerkId, eventId);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


// ====================================================================
// LAST TWO ROUTES (GENERIC) — MUST BE AT THE VERY END
// ====================================================================

// UPDATE USER
router.put('/:clerkId', async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.clerkId, req.body);
        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// GET USER
router.get('/:clerkId', async (req, res) => {
    try {
        const user = await userService.getUserByClerkId(req.params.clerkId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
