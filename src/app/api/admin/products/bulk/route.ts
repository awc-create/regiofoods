import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { bad, readJson, refreshSite } from '@/lib/api';

/** Body: { ids: string[], action: 'show'|'hide'|'feature'|'unfeature'|'move'|'delete', categoryId? } */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await readJson<{ ids?: unknown; action?: string; categoryId?: string }>(req);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((x): x is string => typeof x === 'string').slice(0, 1000)
    : [];
  if (!ids.length) return bad('Select at least one product.');

  const where = { id: { in: ids } };
  switch (body?.action) {
    case 'show':
      await prisma.product.updateMany({ where, data: { visible: true } });
      break;
    case 'hide':
      await prisma.product.updateMany({ where, data: { visible: false } });
      break;
    case 'feature':
      await prisma.product.updateMany({ where, data: { featured: true } });
      break;
    case 'unfeature':
      await prisma.product.updateMany({ where, data: { featured: false } });
      break;
    case 'move': {
      const categoryId = body.categoryId || null;
      if (categoryId && !(await prisma.category.findUnique({ where: { id: categoryId } }))) {
        return bad('Category not found.');
      }
      await prisma.product.updateMany({ where, data: { categoryId } });
      break;
    }
    case 'delete':
      await prisma.product.deleteMany({ where });
      break;
    default:
      return bad('Unknown action.');
  }

  refreshSite();
  return NextResponse.json({ ok: true, count: ids.length });
}
