
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'on',
    video: 'on',
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  },
});
