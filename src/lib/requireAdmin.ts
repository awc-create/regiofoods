// src/lib/requireAdmin.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/**
 * Admin gate for API route handlers (same contract as Essentia):
 *
 *   const denied = await requireAdmin();
 *   if (denied) return denied;
 *
 * The proxy only guards /admin pages, so every admin API handler must call this.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase?.() ?? null;
  const role = session?.user?.role ?? 'user';

  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

/** Email of the signed-in admin, for audit fields. */
export async function currentAdminEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}
