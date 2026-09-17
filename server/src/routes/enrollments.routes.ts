import { Router } from 'express';
import { paginationSchema } from '@church/shared';
import { requireAuth } from '../middleware/auth.js';
import { validateQuery } from '../utils/validate.js';
import { contentController } from '../controllers/content.controller.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  validateQuery(paginationSchema),
  contentController.listMyEnrollments,
);

export default router;