import { test, expect } from '@playwright/test';
import { login } from '.';

test.beforeEach(async ({ page }) => {
  await login(page);
});

// * Tests for Shopping cart
test('Product quantity and price are displayed in the Cart page', async ({
  page,
}) => {
  await page
    .locator('.inventory_item .inventory_item_description .pricebar')
    .first()
    .getByRole('button', { name: 'Add to cart' })
    .click();
  const priceOfItemFromInventory = await page
    .locator(
      '.inventory_item .inventory_item_description .pricebar .inventory_item_price'
    )
    .first()
    .textContent();

  await page.locator('[data-test="shopping-cart-link"]').click();
  const priceOfItemFromCart = await page
    .locator('.cart_item .cart_item_label .item_pricebar .inventory_item_price')
    .first()
    .textContent();

  // checks
  await expect(page.locator('[data-test="item-quantity"]')).toBeVisible();
  await expect(priceOfItemFromInventory).toEqual(priceOfItemFromCart);
});

test('Product can be removed from cart on the Cart page', async ({ page }) => {
  await page
    .locator('.inventory_item .inventory_item_description .pricebar')
    .first()
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page
    .locator('.cart_item .cart_item_label .item_pricebar')
    .first()
    .getByRole('button', { name: 'Remove' })
    .click();

  //checks
  await expect(page.locator('[data-test="inventory-item"]')).not.toBeVisible();
});

test('Return to Inventory page after clicking Continue Shopping', async ({
  page,
}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="continue-shopping"]').click();

  //checks
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
