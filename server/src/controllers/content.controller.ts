import type { Request, Response } from 'express';
import type { PaginationInput } from '@church/shared';
import { ApiError } from '../utils/ApiError.js';
import { buildPaginationMeta } from '../utils/pagination.js';
import { getPool } from '../db/pool.js';
import {
  listActiveMentors,
  listEnrollmentsForUser,
  listProgressForUser,
  listPublishedAssessments,
  listPublishedCourses,
  listPublishedLessons,
  listPublishedPathways,
  listPublishedPrograms,
} from '../repositories/content.repository.js';

function pagination(res: Response): PaginationInput {
  return res.locals.query as PaginationInput;
}

async function listCourses(req: Request, res: Response): Promise<void> {
  const { items, total } = await listPublishedCourses(getPool(), pagination(res));
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

async function listPrograms(req: Request, res: Response): Promise<void> {
  const { items, total } = await listPublishedPrograms(getPool(), pagination(res));
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

async function listPathways(req: Request, res: Response): Promise<void> {
  const { items, total } = await listPublishedPathways(getPool(), pagination(res));
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

async function listLessons(req: Request, res: Response): Promise<void> {
  const query = pagination(res) as PaginationInput & { courseId?: string };
  const { items, total } = await listPublishedLessons(getPool(), {
    page: query.page,
    pageSize: query.pageSize,
    courseId: query.courseId,
  });
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(query, total),
  });
}

async function listAssessments(req: Request, res: Response): Promise<void> {
  const { items, total } = await listPublishedAssessments(getPool(), pagination(res));
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

async function listMyEnrollments(req: Request, res: Response): Promise<void> {
  if (!req.principal) throw ApiError.unauthorized();
  const { items, total } = await listEnrollmentsForUser(
    getPool(),
    req.principal.userId,
    pagination(res),
  );
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

async function listMyProgress(req: Request, res: Response): Promise<void> {
  if (!req.principal) throw ApiError.unauthorized();
  const { items, total } = await listProgressForUser(getPool(), req.principal.userId, pagination(res));
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

async function listMentors(req: Request, res: Response): Promise<void> {
  const { items, total } = await listActiveMentors(getPool(), pagination(res));
  res.json({
    success: true,
    data: { items },
    meta: buildPaginationMeta(pagination(res), total),
  });
}

export const contentController = {
  listCourses,
  listPrograms,
  listPathways,
  listLessons,
  listAssessments,
  listMyEnrollments,
  listMyProgress,
  listMentors,
};