import { test, expect } from '@playwright/test';

const domain = 'https://playwright.dev/';

test('get docs', async ({ page }) => {
  await page.goto(domain);

  await page.getByRole('link', { name: 'Docs' }).click();

  const installationLocator = await page.getByRole('heading', {
    name: 'Installation',
  });

  await expect(installationLocator).toBeVisible();
});

test('writing test', async ({ page }) => {
  await page.goto(`${domain}docs/codegen`);

  await page.getByRole('link', { name: 'Writing tests' }).click();

  await expect(
    page.getByRole('heading', { name: 'Writing tests' })
  ).toBeVisible();
});

test('generating tests', async ({ page }) => {
  await page.goto(domain);

  await page.getByRole('link', { name: 'Get started' }).click();

  await page.getByRole('link', { name: 'Generating tests' }).click();

  await expect(
    page.getByRole('heading', { name: 'Generating tests' })
  ).toBeVisible();
});
