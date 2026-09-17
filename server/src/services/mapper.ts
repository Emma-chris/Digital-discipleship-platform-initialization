import type { RoleCode } from '@church/shared';
import type { ProfileRecord, UserRecord } from '../repositories/user.repository.js';

export interface CurrentUser {
  id: string;
  email: string;
  organizationId: string | null;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  roles: RoleCode[];
  emailVerified: boolean;
  status: string;
  createdAt: Date;
}

export function toCurrentUser(
  user: UserRecord,
  profile: ProfileRecord | null,
  roles: RoleCode[],
): CurrentUser {
  return {
    id: user.id,
    email: user.email,
    organizationId: user.organizationId,
    fullName: user.fullName,
    displayName: profile?.displayName ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    roles,
    emailVerified: user.emailVerifiedAt !== null,
    status: user.status,
    createdAt: user.createdAt,
  };
}