import { test, expect } from '@playwright/test';

test('get docs', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Docs' }).click();

  const installationLocator = await page.getByRole('heading', {
    name: 'Installation',
  });

  await expect(installationLocator).toBeVisible();
});

test('writing test', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/codegen');

  await page.getByRole('link', { name: 'Writing tests' }).click();

  await expect(
    page.getByRole('heading', { name: 'Writing tests' })
  ).toBeVisible();
});

test('generating tests', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Get started' }).click();

  await page.getByRole('link', { name: 'Generating tests' }).click();

  await expect(
    page.getByRole('heading', { name: 'Generating tests' })
  ).toBeVisible();
});
