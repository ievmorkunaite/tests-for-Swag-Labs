import { test, expect } from '@playwright/test';
import { login } from '.';

test.beforeEach(async ({ page }) => {
  await login(page);
});

// * Tests for Inventory page

test('Add to cart button changes to Remove', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // checks
  await expect(
    page.locator('[data-test="remove-sauce-labs-backpack"]')
  ).toBeVisible();
});

test('Adding to cart from the Products page', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  // checks
  await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();
});

test('Adding to cart from the individual product page', async ({ page }) => {
  await page.locator('[data-test="item-4-title-link"]').click();
  await page.locator('[data-test="add-to-cart"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  //checks
  await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
});

test('Removing item from cart on the cart page', async ({ page }) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  // checks
  await expect(page.locator('[data-test="inventory-item"]')).not.toBeVisible();
});

test('Sort by Name', async ({ page }) => {
  const firstItemText = await page
    .locator('.inventory_item .inventory_item_name')
    .first()
    .textContent();
  await page.locator('[data-test="product-sort-container"]').selectOption('za');
  const lastItemText = await page
    .locator('.inventory_item .inventory_item_name')
    .last()
    .textContent();

  // checks
  await expect(firstItemText).toEqual(lastItemText);
});

test('Sort by Price', async ({ page }) => {
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption('lohi');
  const firstItemText = await page
    .locator('.inventory_item .inventory_item_name')
    .first()
    .textContent();
  await page
    .locator('[data-test="product-sort-container"]')
    .selectOption('hilo');
  const lastItemText = await page
    .locator('.inventory_item .inventory_item_name')
    .last()
    .textContent();

  // checks
  await expect(firstItemText).toEqual(lastItemText);
});

test('Logout from Side menu', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  //checks
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
