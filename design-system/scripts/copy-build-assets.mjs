import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
// Derived from src/index.css's @import order — never hand-maintain this list.
// A component whose CSS is imported there but missing here would build, typecheck
// and ship with no styles at all, silently.
const entry = readFileSync(join(root, 'src/index.css'), 'utf8');
const cssFiles = [...entry.matchAll(/@import\s+['"](.+?)['"]\s*;/g)].map((m) =>
  join('src', m[1].replace(/^\.\//, ''))
);
if (cssFiles.length === 0) throw new Error('No @import rules found in src/index.css');

mkdirSync(dist, { recursive: true });
copyFileSync(join(root, 'src/styles/tokens.css'), join(dist, 'tokens.css'));
copyFileSync(join(root, 'src/styles/typography.css'), join(dist, 'typography.css'));
writeFileSync(
  join(dist, 'index.css'),
  cssFiles
    .map((file) => `/* ${file} */\n${readFileSync(join(root, file), 'utf8').trim()}`)
    .join('\n\n') + '\n'
);

console.log('Copied: dist/index.css, dist/tokens.css, dist/typography.css');
