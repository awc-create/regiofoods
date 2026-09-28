// Load the current product list (src/data/products.json) into the database.
// Runs only when the database has no products yet, unless you pass --force
// (which deletes all products and categories first).
//   yarn seed:catalogue
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const candidates = [
  path.join(here, '..', 'src', 'data', 'products.json'),
  path.join(here, 'data', 'products.json'),
];
const file = candidates.find((p) => existsSync(p));
if (!file) {
  console.error('products.json not found.');
  process.exit(1);
}

const PARENT_ORDER = ['Frozen', 'Groceries', 'Snacks', 'Bakery', 'Beverages', 'Others'];
const force = process.argv.includes('--force');
const prisma = new PrismaClient();

const slugify = (s) =>
  (s || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';

const existing = await prisma.product.count();
if (existing > 0 && !force) {
  console.log(
    `Database already has ${existing} products — nothing to do (use --force to replace).`
  );
  await prisma.$disconnect();
  process.exit(0);
}

if (force) {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
}

const data = JSON.parse(readFileSync(file, 'utf8'));

// Categories
const parents = new Map(); // name -> { id, children: Map(name -> id) }
const usedCatSlugs = new Set();
const catSlug = (base) => {
  let s = slugify(base);
  let n = 2;
  while (usedCatSlugs.has(s)) s = `${slugify(base)}-${n++}`;
  usedCatSlugs.add(s);
  return s;
};

const parentNames = [...new Set(data.map((p) => p.parentCollection || 'Others'))].sort((a, b) => {
  const ia = PARENT_ORDER.indexOf(a);
  const ib = PARENT_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
});

for (const [i, name] of parentNames.entries()) {
  const cat = await prisma.category.create({ data: { name, slug: catSlug(name), sortOrder: i } });
  parents.set(name, { id: cat.id, children: new Map() });
}

for (const name of parentNames) {
  const children = [
    ...new Set(
      data
        .filter((p) => (p.parentCollection || 'Others') === name)
        .map((p) => p.variants[0]?.category)
        .filter((c) => c && c !== name)
    ),
  ].sort();
  const parent = parents.get(name);
  for (const [i, child] of children.entries()) {
    const cat = await prisma.category.create({
      data: { name: child, parentId: parent.id, slug: catSlug(`${name}-${child}`), sortOrder: i },
    });
    parent.children.set(child, cat.id);
  }
}

// Products
const usedSlugs = new Set();
let count = 0;
for (const [i, p] of data.entries()) {
  const parentName = p.parentCollection || 'Others';
  const parent = parents.get(parentName);
  const child = p.variants[0]?.category;
  const categoryId = (child && parent.children.get(child)) || parent.id;

  let slug = slugify(p.baseName);
  let n = 2;
  while (usedSlugs.has(slug)) slug = `${slugify(p.baseName)}-${n++}`;
  usedSlugs.add(slug);

  await prisma.product.create({
    data: {
      name: p.baseName,
      slug,
      description: p.description || '',
      categoryId,
      sortOrder: i,
      variants: {
        create: p.variants.map((v, j) => ({
          name: v.name || '',
          packSize: v.packSize || '',
          imageUrl: v.image || '',
          sortOrder: j,
        })),
      },
    },
  });
  count++;
}

console.log(`Imported ${count} products into ${parentNames.length} main categories.`);
await prisma.$disconnect();
