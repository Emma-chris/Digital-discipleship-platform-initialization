import type { Request, Response } from 'express';
import { profileUpdateSchema, type ProfileUpdateInput } from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { validateBody } from '../utils/validate.js';
import { getCurrentUser, updateOwnProfile } from '../services/auth.service.js';
import { writeAuditLog } from '../utils/audit.js';

async function getMeHandler(req: Request, res: Response): Promise<void> {
  if (!req.principal) throw ApiError.unauthorized();
  const user = await getCurrentUser(req.principal.userId);
  res.json({ success: true, data: { user } });
}

async function updateMeHandler(req: Request, res: Response): Promise<void> {
  if (!req.principal) throw ApiError.unauthorized();
  const input = req.body as ProfileUpdateInput;
  const user = await updateOwnProfile(req.principal.userId, input);
  writeAuditLog({
    userId: user.id,
    action: 'profile.updated',
    entityType: 'user',
    entityId: user.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  res.json({ success: true, data: { user } });
}

export const userController = {
  getMe: getMeHandler,
  updateMe: {
    validators: [validateBody(profileUpdateSchema)],
    handler: updateMeHandler,
  },
};