import { test, expect } from '@playwright/test';
import { login } from '.';

test.beforeEach(async ({ page }) => {
  await login(page);
});

// * Tests for Shopping cart
test('Product quantity and price are displayed in the Cart page', async ({
  page,
}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  const priceOfItemFromInventory = await page
    .locator(
      '.inventory_item .inventory_item_description .pricebar .inventory_item_price'
    )
    .first()
    .textContent();

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('[data-test="item-quantity"]')).toBeVisible();
  const priceOfItemFromCart = await page
    .locator('.cart_item .cart_item_label .item_pricebar .inventory_item_price')
    .first()
    .textContent();

  // checks
  await expect(priceOfItemFromInventory).toEqual(priceOfItemFromCart);
});
