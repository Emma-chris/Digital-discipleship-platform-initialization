/**
 * Core entity row shapes. These reflect the database schema (see
 * migrations/001_init.up.sql). Only shapes actively shared with the client
 * are declared here; the full schema lives in the migration SQL + server
 * repositories. Keep this file focused — do not duplicate every column.
 */

export interface UserRow {
  id: string;
  organizationId: string | null;
  email: string;
  fullName: string | null;
  passwordHash: string;
  status: string;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileRow {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
  language: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicCourseSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  estimatedMinutes: number | null;
  isPublished: boolean;
  createdAt: Date;
}

export interface PublicProgramSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  createdAt: Date;
}

export interface PublicPathwaySummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  createdAt: Date;
}

export interface PublicLessonSummary {
  id: string;
  courseId: string;
  moduleId: string | null;
  title: string;
  summary: string | null;
  contentType: string;
  durationMinutes: number | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
}