import { Router } from 'express';
import { checkDatabase } from '../db/pool.js';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await checkDatabase();
  res.json({
    success: true,
    data: {
      status: 'ok',
      db: db ? 'up' : 'down',
      time: new Date().toISOString(),
    },
  });
});

export default router;