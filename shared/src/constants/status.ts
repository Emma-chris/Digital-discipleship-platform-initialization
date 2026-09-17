/** Domain status values. Stored as TEXT with CHECK constraints in the database. */
export const UserStatus = {
  ACTIVE: 'active',
  INVITED: 'invited',
  SUSPENDED: 'suspended',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const EnrollmentStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DROPPED: 'dropped',
} as const;
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];

export const UserTokenKind = {
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
} as const;
export type UserTokenKind = (typeof UserTokenKind)[keyof typeof UserTokenKind];

export const ContentType = {
  VIDEO: 'video',
  TEXT: 'text',
  AUDIO: 'audio',
  QUIZ: 'quiz',
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

const LessonStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;
export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus];

export const LessonStatusValues = LessonStatus;