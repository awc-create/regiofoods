// Health check used by the deploy pipeline. Does not touch the database,
// so a slow or migrating DB never blocks the deploy.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ ok: true });
}
