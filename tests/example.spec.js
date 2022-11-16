// @ts-check
const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://www.azurestaticwebapps.dev/');
  const title = page.locator('.navbar__inner .navbar__title');
  await expect(title).toHaveText('Static Web Apps!');
});
