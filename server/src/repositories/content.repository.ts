import type { Pool } from 'pg';
import type {
  PublicCourseSummary,
  PublicLessonSummary,
  PublicPathwaySummary,
  PublicProgramSummary,
} from '@church/shared';

export interface AssessmentSummary {
  id: string;
  courseId: string | null;
  moduleId: string | null;
  lessonId: string | null;
  title: string;
  description: string | null;
  passThreshold: number;
  isPublished: boolean;
  createdAt: Date;
}

export async function listPublishedAssessments(
  pool: Pool,
  pagination: { page: number; pageSize: number },
): Promise<{ items: AssessmentSummary[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [rows, counts] = await Promise.all([
    pool.query<{
      id: string;
      course_id: string | null;
      module_id: string | null;
      lesson_id: string | null;
      title: string;
      description: string | null;
      pass_threshold: number;
      is_published: boolean;
      created_at: Date;
    }>(
      `SELECT id, course_id, module_id, lesson_id, title, description,
              pass_threshold, is_published, created_at
       FROM assessments WHERE is_published = true
       ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM assessments WHERE is_published = true`,
    ),
  ]);

  return {
    items: rows.rows.map((r) => ({
      id: r.id,
      courseId: r.course_id,
      moduleId: r.module_id,
      lessonId: r.lesson_id,
      title: r.title,
      description: r.description,
      passThreshold: r.pass_threshold,
      isPublished: r.is_published,
      createdAt: r.created_at,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}

function courseWhere(courseId?: string): string {
  return courseId ? 'AND l.course_id = $1' : '';
}

export async function listPublishedCourses(
  pool: Pool,
  pagination: { page: number; pageSize: number },
): Promise<{ items: PublicCourseSummary[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [courseRes, countRes] = await Promise.all([
    pool.query<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      level: string | null;
      estimated_minutes: number | null;
      is_published: boolean;
      created_at: Date;
    }>(
      `SELECT id, slug, title, description, level, estimated_minutes, is_published, created_at
       FROM courses
       WHERE is_published = true
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM courses WHERE is_published = true`,
    ),
  ]);

  return {
    items: courseRes.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      level: r.level,
      estimatedMinutes: r.estimated_minutes,
      isPublished: r.is_published,
      createdAt: r.created_at,
    })),
    total: Number(countRes.rows[0]?.total ?? 0),
  };
}

export async function listPublishedPrograms(
  pool: Pool,
  pagination: { page: number; pageSize: number },
): Promise<{ items: PublicProgramSummary[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [programs, counts] = await Promise.all([
    pool.query<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      is_published: boolean;
      created_at: Date;
    }>(
      `SELECT id, slug, title, description, is_published, created_at
       FROM programs WHERE is_published = true
       ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM programs WHERE is_published = true`,
    ),
  ]);

  return {
    items: programs.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      isPublished: r.is_published,
      createdAt: r.created_at,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}

export async function listPublishedPathways(
  pool: Pool,
  pagination: { page: number; pageSize: number },
): Promise<{ items: PublicPathwaySummary[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [pathways, counts] = await Promise.all([
    pool.query<{
      id: string;
      slug: string;
      title: string;
      description: string | null;
      is_published: boolean;
      created_at: Date;
    }>(
      `SELECT id, slug, title, description, is_published, created_at
       FROM pathways WHERE is_published = true
       ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM pathways WHERE is_published = true`,
    ),
  ]);

  return {
    items: pathways.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description,
      isPublished: r.is_published,
      createdAt: r.created_at,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}

export async function listPublishedLessons(
  pool: Pool,
  pagination: { page: number; pageSize: number; courseId?: string },
): Promise<{ items: PublicLessonSummary[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const where = courseWhere(pagination.courseId);
  const params: unknown[] = [];
  if (pagination.courseId) params.push(pagination.courseId);
  params.push(pagination.pageSize, offset);
  const paramIndex = params.length - 2;

  const [lessons, counts] = await Promise.all([
    pool.query<{
      id: string;
      course_id: string;
      module_id: string | null;
      title: string;
      summary: string | null;
      content_type: string;
      duration_minutes: number | null;
      sort_order: number;
      is_published: boolean;
      created_at: Date;
    }>(
      `SELECT l.id, l.course_id, l.module_id, l.title, l.summary, l.content_type,
              l.duration_minutes, l.sort_order, l.is_published, l.created_at
       FROM lessons l
       JOIN courses c ON c.id = l.course_id
       WHERE l.is_published = true AND c.is_published = true ${where}
       ORDER BY l.created_at DESC
       LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`,
      params,
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total
       FROM lessons l
       JOIN courses c ON c.id = l.course_id
       WHERE l.is_published = true AND c.is_published = true ${where}`,
      pagination.courseId ? [pagination.courseId] : [],
    ),
  ]);

  return {
    items: lessons.rows.map((r) => ({
      id: r.id,
      courseId: r.course_id,
      moduleId: r.module_id,
      title: r.title,
      summary: r.summary,
      contentType: r.content_type,
      durationMinutes: r.duration_minutes,
      sortOrder: r.sort_order,
      isPublished: r.is_published,
      createdAt: r.created_at,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}

export interface EnrolledCourseRow {
  courseId: string;
  title: string;
  slug: string;
  status: string;
  enrolledAt: Date;
  completedAt: Date | null;
}

export async function listEnrollmentsForUser(
  pool: Pool,
  userId: string,
  pagination: { page: number; pageSize: number },
): Promise<{ items: EnrolledCourseRow[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [rows, counts] = await Promise.all([
    pool.query<{
      course_id: string;
      title: string;
      slug: string;
      status: string;
      enrolled_at: Date;
      completed_at: Date | null;
    }>(
      `SELECT e.course_id, c.title, c.slug, e.status, e.enrolled_at, e.completed_at
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM enrollments WHERE user_id = $1`,
      [userId],
    ),
  ]);

  return {
    items: rows.rows.map((r) => ({
      courseId: r.course_id,
      title: r.title,
      slug: r.slug,
      status: r.status,
      enrolledAt: r.enrolled_at,
      completedAt: r.completed_at,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}

export interface CourseProgressRow {
  courseId: string;
  status: string;
  progressPercent: number;
  startedAt: Date | null;
  completedAt: Date | null;
}

export async function listProgressForUser(
  pool: Pool,
  userId: string,
  pagination: { page: number; pageSize: number },
): Promise<{ items: CourseProgressRow[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [rows, counts] = await Promise.all([
    pool.query<{
      course_id: string;
      status: string;
      progress_percent: number;
      started_at: Date | null;
      completed_at: Date | null;
    }>(
      `SELECT course_id, status, progress_percent, started_at, completed_at
       FROM course_progress
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM course_progress WHERE user_id = $1`,
      [userId],
    ),
  ]);

  return {
    items: rows.rows.map((r) => ({
      courseId: r.course_id,
      status: r.status,
      progressPercent: r.progress_percent,
      startedAt: r.started_at,
      completedAt: r.completed_at,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}

export interface MentorSummary {
  id: string;
  userId: string;
  displayName: string | null;
  bio: string | null;
}

export async function listActiveMentors(
  pool: Pool,
  pagination: { page: number; pageSize: number },
): Promise<{ items: MentorSummary[]; total: number }> {
  const offset = (pagination.page - 1) * pagination.pageSize;
  const [rows, counts] = await Promise.all([
    pool.query<{
      id: string;
      user_id: string;
      display_name: string | null;
      bio: string | null;
    }>(
      `SELECT m.id, m.user_id, p.display_name, m.bio
       FROM mentors m
       LEFT JOIN profiles p ON p.user_id = m.user_id
       WHERE m.status = 'active'
       ORDER BY m.created_at ASC
       LIMIT $1 OFFSET $2`,
      [pagination.pageSize, offset],
    ),
    pool.query<{ total: string }>(
      `SELECT count(*) AS total FROM mentors WHERE status = 'active'`,
    ),
  ]);

  return {
    items: rows.rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      displayName: r.display_name,
      bio: r.bio,
    })),
    total: Number(counts.rows[0]?.total ?? 0),
  };
}