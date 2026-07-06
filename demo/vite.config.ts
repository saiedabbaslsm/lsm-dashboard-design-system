import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Consume the design system exactly like a coworker would: `@lsm/design-system`.
// (Aliased to the local source since it isn't published yet.)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@lsm/design-system/styles.css',
        replacement: path.resolve(__dirname, '../design-system/dist/index.css'),
      },
      {
        find: '@lsm/design-system',
        replacement: path.resolve(__dirname, '../design-system/dist/index.js'),
      },
    ],
  },
  server: { port: 5173, strictPort: true },
});
