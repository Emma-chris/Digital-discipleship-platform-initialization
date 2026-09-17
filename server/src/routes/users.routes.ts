import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { userController } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', requireAuth, userController.getMe);
router.patch('/me', requireAuth, ...userController.updateMe.validators, userController.updateMe.handler);

export default router;