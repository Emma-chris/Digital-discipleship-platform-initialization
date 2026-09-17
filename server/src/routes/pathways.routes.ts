import { Router } from 'express';
import { paginationSchema } from '@church/shared';
import { validateQuery } from '../utils/validate.js';
import { contentController } from '../controllers/content.controller.js';

const router = Router();

router.get('/', validateQuery(paginationSchema), contentController.listPathways);

export default router;