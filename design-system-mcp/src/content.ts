import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const localContentDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const cwdContentDir = join(process.cwd(), 'content');

const contentDir = existsSync(cwdContentDir) ? cwdContentDir : localContentDir;

// Read fresh on every call so editing content/ (or redeploying) takes effect immediately.
export const readText = (rel: string): string => readFileSync(join(contentDir, rel), 'utf8');
export const readJson = <T = unknown>(rel: string): T => JSON.parse(readText(rel)) as T;
