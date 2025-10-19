import { test as base } from '@playwright/test';
import { Builder } from 'selenium-webdriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import type { WebDriver } from 'selenium-webdriver';

type GridFixtures = {
  gridDriver: WebDriver;
};

// Selenium Grid configuration
const GRID_URL = process.env.GRID_URL || 'http://localhost:4444';
const HEADLESS = process.env.HEADLESS !== 'false'; // Default to headless, set HEADLESS=false to see browser

// Verify Grid is accessible before running tests
async function verifyGridConnection(): Promise<void> {
  try {
    const response = await fetch(`${GRID_URL}/status`);
    const status = await response.json();
    
    if (!status.value?.ready) {
      throw new Error(`Selenium Grid at ${GRID_URL} is not ready`);
    }
    
    console.log(`✓ Connected to Selenium Grid at ${GRID_URL}`);
  } catch (error) {
    throw new Error(
      `Failed to connect to Selenium Grid at ${GRID_URL}. ` +
      `Please ensure Selenium Grid is running. Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const test = base.extend<GridFixtures>({
  gridDriver: async ({}, use) => {
    // Verify Grid connection before creating session
    await verifyGridConnection();
    
    // Create a new Chrome session in Selenium Grid in HEADLESS mode
    const chromeOptions = new ChromeOptions();
    
    // Run browser in headless mode by default (no visible window)
    // Set environment variable HEADLESS=false to see the browser
    if (HEADLESS) {
      chromeOptions.addArguments('--headless=new');
      chromeOptions.addArguments('--disable-gpu');
      console.log(`✓ Running in HEADLESS mode (set HEADLESS=false to see browser)`);
    } else {
      chromeOptions.addArguments('--start-maximized');
      console.log(`✓ Running in HEADED mode (browser window will be visible)`);
    }
    
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--window-size=1920,1080');
    
    const driver = await new Builder()
      .forBrowser('chrome')
      .usingServer(GRID_URL) // Forces execution through Grid
      .setChromeOptions(chromeOptions)
      .build();

    // Verify session was created on Grid
    const session = await driver.getSession();
    const mode = HEADLESS ? 'HEADLESS' : 'HEADED';
    console.log(`✓ Browser session created on Grid (${mode}): ${session.getId()}`);

    await use(driver);
    
    // Cleanup
    await driver.quit();
    console.log(`✓ Browser session closed on Grid`);
  },
});

export { expect } from '@playwright/test';
