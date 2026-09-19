import type { Pool } from 'pg';
import type { AdminStats } from '@church/shared';

/**
 * Platform-wide aggregate counts for the admin overview. Every value is a
 * real database total — the client renders these as-is and never invents
 * analytics.
 */
export async function getPlatformStats(pool: Pool): Promise<AdminStats> {
  const { rows } = await pool.query<{
    users: string;
    organizations: string;
    programs: string;
    courses: string;
    pathways: string;
    assessments: string;
    mentors: string;
    instructors: string;
  }>(
    `SELECT
       (SELECT count(*) FROM users) AS users,
       (SELECT count(*) FROM organizations) AS organizations,
       (SELECT count(*) FROM programs) AS programs,
       (SELECT count(*) FROM courses) AS courses,
       (SELECT count(*) FROM pathways) AS pathways,
       (SELECT count(*) FROM assessments) AS assessments,
       (SELECT count(*) FROM mentors) AS mentors,
       (SELECT count(*) FROM users u
        JOIN user_roles ur ON ur.user_id = u.id
        JOIN roles r ON r.id = ur.role_id
        WHERE r.code = 'instructor') AS instructors`,
  );
  const row = rows[0];
  return {
    users: Number(row?.users ?? 0),
    organizations: Number(row?.organizations ?? 0),
    programs: Number(row?.programs ?? 0),
    courses: Number(row?.courses ?? 0),
    pathways: Number(row?.pathways ?? 0),
    assessments: Number(row?.assessments ?? 0),
    mentors: Number(row?.mentors ?? 0),
    instructors: Number(row?.instructors ?? 0),
  };
}