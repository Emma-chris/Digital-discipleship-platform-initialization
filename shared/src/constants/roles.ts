export const RoleCode = {
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor',
  MENTOR: 'mentor',
  STUDENT: 'student',
} as const;

export type RoleCode = (typeof RoleCode)[keyof typeof RoleCode];

export const ALL_ROLE_CODES: readonly RoleCode[] = [
  RoleCode.ADMIN,
  RoleCode.INSTRUCTOR,
  RoleCode.MENTOR,
  RoleCode.STUDENT,
];

export const ROLE_RANK: Record<RoleCode, number> = {
  [RoleCode.ADMIN]: 4,
  [RoleCode.INSTRUCTOR]: 3,
  [RoleCode.MENTOR]: 2,
  [RoleCode.STUDENT]: 1,
};