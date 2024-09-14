import { test, expect } from '@playwright/test';

const validUser = 'standard_user';
const validPassword = 'secret_sauce';
const domain = 'https://www.saucedemo.com/';

test('login with valid credentials', async ({ page }) => {
  await page.goto(domain);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill(validUser);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(validPassword);
  await page.locator('[data-test="login-button"]').click();

  // checks
  await expect(page.locator('[data-test="title"]')).toHaveText('Products');
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

test.beforeEach(async ({ page }) => {
  await page.goto(domain);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill(validUser);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(validPassword);
  await page.locator('[data-test="login-button"]').click();
});

test('Add to cart button changes to Remove', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // checks
  await expect(
    page.locator('[data-test="remove-sauce-labs-backpack"]')
  ).toBeVisible();
});

test('test', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  // checks
  await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();
});

test('removing item from cart on the cart page', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  // checks
  await expect(page.locator('[data-test="inventory-item"]')).not.toBeVisible();
});
