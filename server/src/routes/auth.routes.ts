import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimit.js';
import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authRateLimiter, ...authController.register.validators, authController.register.handler);
router.post('/login', authRateLimiter, ...authController.login.validators, authController.login.handler);
router.post('/logout', requireAuth, authController.logout.handler);
router.get('/me', requireAuth, authController.me.handler);
router.post(
  '/verify-email',
  ...authController.verifyEmail.validators,
  authController.verifyEmail.handler,
);
router.post(
  '/password-reset/request',
  ...authController.requestReset.validators,
  authController.requestReset.handler,
);
router.post(
  '/password-reset/confirm',
  ...authController.confirmReset.validators,
  authController.confirmReset.handler,
);

export default router;