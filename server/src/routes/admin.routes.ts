import { Router } from 'express';
import { ErrorCode, RoleCode } from '@church/shared';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Administrators only. Admin functionality is intentionally staged for a
// later phase; the router establishes the authorization boundary now.
router.use(requireAuth, requireRole(RoleCode.ADMIN));
router.all('/*splat', (_req, res) => {
  res.status(501).json({
    success: false,
    code: ErrorCode.NOT_IMPLEMENTED,
    message: 'Administrator endpoints are implemented in a later phase.',
  });
});

export default router;