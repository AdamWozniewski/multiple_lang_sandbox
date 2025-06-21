import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: [
    'packages/backend/test/e2e/specs/**/*.spec.ts',
    // 'packages/web/test/e2e/specs/**/*.spec.ts',
  ],
  reporter: [
    ['list'],
    ['html'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false,
    }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chrome', use: devices['Desktop Chrome'] },
    // {
    //   name: 'web-chrome',
    //   use: { ...devices['Desktop Chrome'] },
    // },
  ],
});