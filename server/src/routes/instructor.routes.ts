import { Router } from 'express';
import { ErrorCode, RoleCode } from '@church/shared';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Instructors only (administrators always pass via requireRole). Content
// authoring is intentionally staged; the router establishes the authorization
// boundary now so future endpoints are protected by default.
router.use(requireAuth, requireRole(RoleCode.INSTRUCTOR));
router.all('/*splat', (_req, res) => {
  res.status(501).json({
    success: false,
    code: ErrorCode.NOT_IMPLEMENTED,
    message: 'Instructor endpoints are implemented in a later phase.',
  });
});

export default router;