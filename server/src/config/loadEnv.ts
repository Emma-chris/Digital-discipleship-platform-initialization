import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Locate and load a `.env` file by walking up from the working directory.
 * npm workspaces run scripts with cwd inside the workspace folder, so the
 * shared root `.env` would otherwise be missed.
 *
 * IMPORTANT: this module must stay free of any import that reads process.env
 * at module scope, so it can run before configuration is parsed.
 */
export function loadEnvFileFromRepo(): void {
  let dir = process.cwd();
  while (true) {
    const candidate = path.join(dir, '.env');
    if (existsSync(candidate)) {
      process.loadEnvFile(candidate);
      return;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
}