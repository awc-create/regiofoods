// Bundles the Material Design icons used in src/ (plus a few common extras)
// into src/lib/icons-mdi.json, so icons never need the Iconify web API.
// Run after using a new icon:  node scripts/build-icons.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { getIcons } from '@iconify/utils';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, 'src');
const names = new Set([
  // extras editors may type into icon fields
  'truck',
  'truck-fast-outline',
  'food',
  'food-outline',
  'fire',
  'water',
  'star-outline',
  'check-decagram-outline',
  'certificate-outline',
  'ship-wheel',
  'ferry',
  'handshake-outline',
  'account-group-outline',
  'chart-line',
  'package-variant',
  'fridge-outline',
  'thermometer',
  'baguette',
  'rice',
  'chili-mild',
  'cup-outline',
  'coffee-outline',
  'x',
  'tiktok',
  'pinterest',
  'web',
  'email',
  'phone',
]);

function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(f)) {
      for (const m of readFileSync(p, 'utf8').matchAll(/mdi:([a-z0-9-]+)/g)) names.add(m[1]);
    }
  }
}
walk(src);

const full = JSON.parse(
  readFileSync(path.join(root, 'node_modules/@iconify-json/mdi/icons.json'), 'utf8')
);
const subset = getIcons(full, [...names]);
writeFileSync(path.join(src, 'lib', 'icons-mdi.json'), JSON.stringify(subset));
console.log(`Bundled ${Object.keys(subset.icons).length} icons.`);
