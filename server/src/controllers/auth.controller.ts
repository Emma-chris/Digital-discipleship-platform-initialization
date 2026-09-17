import type { Request, Response } from 'express';
import {
  confirmPasswordResetSchema,
  emailVerificationSchema,
  loginSchema,
  registerSchema,
  requestPasswordResetSchema,
  ErrorCode,
  type ConfirmPasswordResetInput,
  type LoginInput,
  type RegisterInput,
} from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { validateBody } from '../utils/validate.js';
import {
  getCurrentUser,
  login,
  register,
  requestPasswordReset,
  confirmPasswordReset,
  verifyEmail,
} from '../services/auth.service.js';
import { signAccessToken } from '../auth/tokens.js';
import { writeAuditLog } from '../utils/audit.js';

async function registerHandler(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterInput;
  const result = await register(input);
  writeAuditLog({
    userId: result.user.id,
    action: 'auth.register',
    entityType: 'user',
    entityId: result.user.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  res.status(201).json({
    success: true,
    data: {
      user: result.user,
      ...(result.verificationToken ? { verificationToken: result.verificationToken } : {}),
    },
  });
}

async function loginHandler(req: Request, res: Response): Promise<void> {
  const input = req.body as LoginInput;
  const result = await login(input.email, input.password);
  if (req.session) {
    req.session.userId = result.user.id;
  }
  const accessToken = signAccessToken({
    sub: result.user.id,
    org: result.user.organizationId,
    roles: result.user.roles,
  });
  writeAuditLog({
    userId: result.user.id,
    action: 'auth.login',
    entityType: 'user',
    entityId: result.user.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  res.json({ success: true, data: { user: result.user, accessToken } });
}

function logoutHandler(req: Request, res: Response): void {
  const userId = req.principal?.userId ?? null;
  req.session?.destroy((err) => {
    if (err) {
      res.status(500).json({
        success: false,
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Could not end session',
      });
      return;
    }
    writeAuditLog({
      userId,
      action: 'auth.logout',
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    res.clearCookie('sid', { path: '/' });
    res.status(204).end();
  });
}

async function meHandler(req: Request, res: Response): Promise<void> {
  if (!req.principal) throw ApiError.unauthorized();
  const user = await getCurrentUser(req.principal.userId);
  res.json({ success: true, data: { user } });
}

async function verifyEmailHandler(req: Request, res: Response): Promise<void> {
  const { token } = emailVerificationSchema.parse(req.body);
  await verifyEmail(token);
  writeAuditLog({ action: 'auth.email_verified' });
  res.json({ success: true, data: { verified: true } });
}

async function requestResetHandler(req: Request, res: Response): Promise<void> {
  const input = requestPasswordResetSchema.parse(req.body);
  const { resetToken } = await requestPasswordReset(input.email);
  writeAuditLog({ action: 'auth.password_reset_requested' });
  res.json({
    success: true,
    data: {
      sent: true,
      ...(resetToken ? { resetToken } : {}),
    },
  });
}

async function confirmResetHandler(req: Request, res: Response): Promise<void> {
  const input = confirmPasswordResetSchema.parse(req.body) as ConfirmPasswordResetInput;
  await confirmPasswordReset(input.token, input.password);
  writeAuditLog({ action: 'auth.password_reset_completed' });
  res.json({ success: true, data: { reset: true } });
}

export const authController = {
  register: { validators: [validateBody(registerSchema)], handler: registerHandler },
  login: { validators: [validateBody(loginSchema)], handler: loginHandler },
  logout: { handler: logoutHandler },
  me: { handler: meHandler },
  verifyEmail: {
    validators: [validateBody(emailVerificationSchema)],
    handler: verifyEmailHandler,
  },
  requestReset: {
    validators: [validateBody(requestPasswordResetSchema)],
    handler: requestResetHandler,
  },
  confirmReset: {
    validators: [validateBody(confirmPasswordResetSchema)],
    handler: confirmResetHandler,
  },
};