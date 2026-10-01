// Runs on every Hetzner deploy via `prisma db seed` (see package.json "prisma.seed").
// Safe to repeat:
//  - the catalogue is only imported when the database has no products yet
//  - the admin from ADMIN_EMAIL is created if missing; an existing admin's
//    password is never overwritten (so changes made in the admin survive deploys)
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const run = (file, args = []) => {
  const r = spawnSync(process.execPath, [path.join(here, file), ...args], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run('seed-catalogue.mjs');
if (process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL)
  run('seed-admin.mjs', ['--keep-password']);
else console.log('No ADMIN_EMAIL set — skipping admin account.');
