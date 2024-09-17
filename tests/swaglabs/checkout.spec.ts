import { test, expect } from '@playwright/test';
import { extractAmount, login } from '.';

test.beforeEach(async ({ page }) => {
  await login(page);
});

// * Tests for Checkout
test('Redirect to the Information page after clicking the Checkout button', async ({
  page,
}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();

  //checks
  await expect(page).toHaveURL(
    'https://www.saucedemo.com/checkout-step-one.html'
  );
});

const validFirstName = 'John';
const validLastName = 'Doe';
const validZip = '11400';

test('Continue to the overview page after filling out the shipping information with valid data', async ({
  page,
}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill(validFirstName);
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill(validLastName);
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill(validZip);
  await page.locator('[data-test="continue"]').click();

  //checks
  await expect(page).toHaveURL(
    'https://www.saucedemo.com/checkout-step-two.html'
  );
});

test('Cannot continue to Overview page without filling in First Name', async ({
  page,
}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill(validLastName);
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill(validZip);
  await page.locator('[data-test="continue"]').click();

  //checks
  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Error: First Name is required'
  );
});

test('Cannot continue to Overview page without filling in Last Name', async ({
  page,
}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill(validFirstName);
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill(validZip);
  await page.locator('[data-test="continue"]').click();

  //checks
  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Error: Last Name is required'
  );
});

test('Cannot continue to Overview page without filling in Zip', async ({
  page,
}) => {
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill(validFirstName);
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill(validLastName);
  await page.locator('[data-test="continue"]').click();

  //checks
  await expect(page.locator('[data-test="error"]')).toHaveText(
    'Error: Postal Code is required'
  );
});

test('Products and price on the overview page match', async ({ page }) => {
  await page
    .locator('.inventory_item .inventory_item_description .pricebar')
    .first()
    .getByRole('button', { name: 'Add to cart' })
    .click();
  const nameOfFirstItemInventory = await page
    .locator(
      '.inventory_item .inventory_item_description .inventory_item_name '
    )
    .first()
    .textContent();
  const priceOfFirstItemInventory = await page
    .locator(
      '.inventory_item .inventory_item_description .pricebar .inventory_item_price'
    )
    .first()
    .textContent();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill(validFirstName);
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill(validLastName);
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill(validZip);
  await page.locator('[data-test="continue"]').click();
  const nameOfFirstItemOverview = await page
    .locator('.cart_item .cart_item_label .inventory_item_name ')
    .first()
    .textContent();
  const priceOfFirstItemOverview = await page
    .locator('.cart_item .cart_item_label .item_pricebar .inventory_item_price')
    .first()
    .textContent();

  // checks
  await expect(nameOfFirstItemInventory).toEqual(nameOfFirstItemOverview);
  await expect(priceOfFirstItemInventory).toEqual(priceOfFirstItemOverview);
});

test('The Total on the Overview page is calculated as expected', async ({
  page,
}) => {
  await page
    .locator('.inventory_item .inventory_item_description .pricebar')
    .first()
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await page
    .locator('.inventory_item .inventory_item_description .pricebar')
    .nth(1)
    .getByRole('button', { name: 'Add to cart' })
    .click();

  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill(validFirstName);
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill(validLastName);
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill(validZip);
  await page.locator('[data-test="continue"]').click();

  const priceOfFirstItemOverviewStr = await page
    .locator('.cart_item .cart_item_label .item_pricebar .inventory_item_price')
    .first()
    .textContent();
  const priceOfSecondItemOverviewStr = await page
    .locator('.cart_item .cart_item_label .item_pricebar .inventory_item_price')
    .nth(1)
    .textContent();

  const itemTotal = extractAmount(
    await page.locator('.summary_subtotal_label').textContent()
  );
  const tax = extractAmount(
    await page.locator('.summary_tax_label').textContent()
  );
  const totalToPay = extractAmount(
    await page.locator('.summary_total_label').textContent()
  );
  const priceOfFirstItemOverview = extractAmount(priceOfFirstItemOverviewStr);
  const priceOfSecondItemOverview = extractAmount(priceOfSecondItemOverviewStr);

  // checks
  await expect(priceOfFirstItemOverview + priceOfSecondItemOverview).toEqual(
    itemTotal
  );
  await expect(itemTotal + tax).toEqual(totalToPay);
});

test('The Back Home button returns to the Inventory page', async ({ page }) => {
  await page
    .locator('.inventory_item .inventory_item_description .pricebar')
    .first()
    .getByRole('button', { name: 'Add to cart' })
    .click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').click();
  await page.locator('[data-test="firstName"]').fill(validFirstName);
  await page.locator('[data-test="lastName"]').click();
  await page.locator('[data-test="lastName"]').fill(validLastName);
  await page.locator('[data-test="postalCode"]').click();
  await page.locator('[data-test="postalCode"]').fill(validZip);
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="back-to-products"]').click();

  // checks
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});
