import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');

// Read fresh on every call so editing content/ (or redeploying) takes effect immediately.
export const readText = (rel: string): string => readFileSync(join(contentDir, rel), 'utf8');
export const readJson = <T = unknown>(rel: string): T => JSON.parse(readText(rel)) as T;
