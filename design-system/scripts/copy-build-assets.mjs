import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const cssFiles = [
  'src/styles/tokens.css',
  'src/styles/typography.css',
  'src/components/button/button.css',
  'src/components/kpi-card/kpi-card.css',
  'src/components/text-field/text-field.css',
  'src/components/chip/chip.css',
  'src/components/checkbox/checkbox.css',
  'src/components/switch/switch.css',
  'src/components/data-table/data-table.css',
  'src/components/line-chart/line-chart.css',
  'src/components/bar-chart/bar-chart.css',
  'src/components/action-insight-list/action-insight-list.css',
  'src/components/source-flow-map/source-flow-map.css',
];

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
