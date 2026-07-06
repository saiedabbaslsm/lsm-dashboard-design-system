// Copies the built stylesheet + component source from ../design-system into content/
// so the MCP can serve them (Vercel bundles content/**). Run locally after the
// package is rebuilt, then commit.  Usage: node scripts/sync-assets.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = join(root, '..', 'design-system');
const contentDir = join(root, 'content');

// 1) the compiled stylesheet (tokens + type scale + all component CSS)
const cssSrc = join(pkg, 'dist', 'index.css');
if (!existsSync(cssSrc)) {
  console.error('Missing ' + cssSrc + ' — run `npm run build` in design-system first.');
  process.exit(1);
}
writeFileSync(join(contentDir, 'stylesheet.css'), readFileSync(cssSrc));

// 2) component source (.tsx + .css) — reference markup for HTML reports, real code for apps
const outDir = join(contentDir, 'components-src');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const compDir = join(pkg, 'src', 'components');
const names = [];
for (const name of readdirSync(compDir)) {
  const d = join(compDir, name);
  for (const f of readdirSync(d)) {
    if (f.endsWith('.tsx') || f.endsWith('.css')) cpSync(join(d, f), join(outDir, f));
  }
  names.push(name);
}
writeFileSync(join(outDir, 'index.json'), JSON.stringify({ components: names }, null, 2));
console.log('Synced stylesheet.css + ' + names.length + ' components: ' + names.join(', '));
