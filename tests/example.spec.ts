import { test, expect } from '../grid-fixtures';
import { By, until } from 'selenium-webdriver';

test('has title', async ({ gridDriver }) => {
  await gridDriver.get('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  const title = await gridDriver.getTitle();
  expect(title).toContain('Playwright');
});

test('get started link', async ({ gridDriver }) => {
  await gridDriver.get('https://playwright.dev/');

  // Wait for page to load
  await gridDriver.sleep(2000);

  // Try to find and click the get started link using CSS selector
  try {
    const getStartedLink = await gridDriver.findElement(By.css('a[href*="/docs/intro"]'));
    await getStartedLink.click();
  } catch (e) {
    // Alternative: try finding by text content using XPath
    const getStartedLink = await gridDriver.findElement(By.xpath('//a[contains(text(), "started")]'));
    await getStartedLink.click();
  }

  // Wait for navigation
  await gridDriver.sleep(2000);
  
  // Expects page URL to contain 'intro'
  const currentUrl = await gridDriver.getCurrentUrl();
  expect(currentUrl).toContain('intro');
});
