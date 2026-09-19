import type { Request, Response } from 'express';
import { getPlatformStats } from '../repositories/admin.repository.js';
import { getPool } from '../db/pool.js';

export async function adminStatsHandler(_req: Request, res: Response): Promise<void> {
  const stats = await getPlatformStats(getPool());
  res.json({ success: true, data: stats });
}