import { Router } from 'express';
import { ErrorCode, Permission, RoleCode } from '@church/shared';
import { requireAuth, requireRole, requirePermission } from '../middleware/auth.js';
import { adminStatsHandler } from '../controllers/admin.controller.js';

const router = Router();

// Administrators only. Most admin functionality is intentionally staged for a
// later phase; the router establishes the authorization boundary now and
// offers a real platform-stats endpoint for the admin overview foundation.
router.use(requireAuth, requireRole(RoleCode.ADMIN));

router.get('/stats', requirePermission(Permission.ANALYTICS_VIEW), adminStatsHandler);

router.all('/*splat', (_req, res) => {
  res.status(501).json({
    success: false,
    code: ErrorCode.NOT_IMPLEMENTED,
    message: 'Administrator endpoints are implemented in a later phase.',
  });
});

export default router;