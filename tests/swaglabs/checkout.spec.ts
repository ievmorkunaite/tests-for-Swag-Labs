import { test, expect } from '@playwright/test';
import { login } from '.';

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
