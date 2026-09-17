import { Router } from 'express';
import { ErrorCode } from '@church/shared';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Community features arrive in a later phase. This router exists so the API
// surface and client routes can be built against a real endpoint contract.
router.use(requireAuth);
router.all('/*splat', (_req, res) => {
  res.status(501).json({
    success: false,
    code: ErrorCode.NOT_IMPLEMENTED,
    message: 'The community module is not implemented yet.',
  });
});

export default router;