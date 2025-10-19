import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Selenium Grid Execution
 * 
 * IMPORTANT: This configuration is designed to run tests ONLY through Selenium Grid.
 * Tests will NOT run locally. Selenium Grid must be running at http://localhost:4444
 */

export default defineConfig({
  testDir: './tests',
  
  // Fail fast if Grid is not available
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Run one test at a time to avoid overwhelming the Grid
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    trace: 'on',
    // All tests must use the gridDriver fixture from grid-fixtures.ts
    // This ensures execution happens only on Selenium Grid
  },
  
  projects: [
    {
      name: 'Chrome via Selenium Grid',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],
  
  // Ensure Grid is running before tests start
  globalSetup: require.resolve('./global-setup'),
});
