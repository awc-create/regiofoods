// Create or reset an admin login.
//   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='something-strong' yarn seed:admin
// Falls back to ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME (as in .env.production).
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const email = (process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL)?.trim().toLowerCase();
const password = process.env.SEED_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '';
const name = (process.env.SEED_ADMIN_NAME || process.env.ADMIN_NAME)?.trim() || null;

if (!email || !password) {
  console.error(
    'Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD (or ADMIN_EMAIL and ADMIN_PASSWORD).'
  );
  process.exit(1);
}
if (password.length < 10) {
  console.error('The admin password must be at least 10 characters.');
  process.exit(1);
}

const prisma = new PrismaClient();
const passwordHash = await bcrypt.hash(password, 12);

const user = await prisma.user.upsert({
  where: { email },
  create: { email, name, role: 'admin', passwordHash },
  update: { role: 'admin', passwordHash, ...(name ? { name } : {}) },
});

console.log(`Admin ready: ${user.email}`);
await prisma.$disconnect();
