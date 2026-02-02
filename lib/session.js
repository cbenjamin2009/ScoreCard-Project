import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SESSION_COOKIE = 'scorecard-session';
const SESSION_DIR = path.join(process.cwd(), '.cache', 'sessions');
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

const isValidSessionId = (value) => /^[a-f0-9-]{36}$/.test(value);

export const getSessionIdFromCookie = (cookieHeader) => {
  if (!cookieHeader) return null;
  const entries = cookieHeader.split(';').map((entry) => entry.trim());
  const match = entries.find((entry) => entry.startsWith(`${SESSION_COOKIE}=`));
  if (!match) return null;
  const value = match.split('=')[1];
  return isValidSessionId(value) ? value : null;
};

export const ensureSessionId = (cookieHeader) => {
  const existing = getSessionIdFromCookie(cookieHeader);
  if (existing) return { sessionId: existing, isNew: false };
  return { sessionId: crypto.randomUUID(), isNew: true };
};

export const setSessionCookie = (res, sessionId) => {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${sessionId}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; SameSite=Lax; HttpOnly`,
  );
};

export const clearSessionCookie = (res) => {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly`,
  );
};

export const getSessionPaths = (sessionId) => {
  const dir = path.join(SESSION_DIR, sessionId);
  return {
    dir,
    workbookPath: path.join(dir, 'scorecard.xlsx'),
    metaPath: path.join(dir, 'meta.json'),
  };
};

export const readSessionMeta = (sessionId) => {
  const { metaPath } = getSessionPaths(sessionId);
  if (!fs.existsSync(metaPath)) return null;
  try {
    const raw = fs.readFileSync(metaPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const writeSessionMeta = (sessionId, meta) => {
  const { dir, metaPath } = getSessionPaths(sessionId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
};
