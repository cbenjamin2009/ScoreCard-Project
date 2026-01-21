#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const cacheDirSetting = process.env.SCORECARD_CACHE_DIR?.trim() || '.cache';
const cacheDir = path.isAbsolute(cacheDirSetting)
  ? cacheDirSetting
  : path.join(process.cwd(), cacheDirSetting);

if (!fs.existsSync(cacheDir)) {
  console.log(`[scorecard-cache] No cache directory found at ${cacheDir}`);
  process.exit(0);
}

try {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log(`[scorecard-cache] Cleared cache at ${cacheDir}`);
} catch (error) {
  console.error(`[scorecard-cache] Failed to clear cache: ${error.message}`);
  process.exit(1);
}
