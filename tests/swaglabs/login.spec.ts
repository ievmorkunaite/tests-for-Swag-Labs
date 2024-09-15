import { test, expect } from '@playwright/test';
import { domain, validPassword, validUser } from '.';

// * Tests for Login page
test('login with valid credentials', async ({ page }) => {
  await page.goto(domain);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill(validUser);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(validPassword);
  await page.locator('[data-test="login-button"]').click();

  // checks
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('login with invalid credentials', async ({ page }) => {
  await page.goto(domain);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('invalidUser');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('invalidPassword');
  await page.locator('[data-test="login-button"]').click();

  // checks
  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service'
  );
});

test('login with locked out user credentials', async ({ page }) => {
  await page.goto(domain);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill('locked_out_user');
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // checks
  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.'
  );
});
