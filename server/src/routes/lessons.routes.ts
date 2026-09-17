import { Router } from 'express';
import { lessonsQuerySchema } from '@church/shared';
import { validateQuery } from '../utils/validate.js';
import { contentController } from '../controllers/content.controller.js';

const router = Router();

router.get('/', validateQuery(lessonsQuerySchema), contentController.listLessons);

export default router;