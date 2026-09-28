// src/lib/api.ts — small helpers shared by the admin API routes
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

/** Pages read the database on every request; this clears any cached HTML just in case. */
export function refreshSite() {
  try {
    revalidatePath('/', 'layout');
  } catch {
    /* not fatal */
  }
}

export const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
