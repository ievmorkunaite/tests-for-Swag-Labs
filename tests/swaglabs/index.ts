import { Page } from '@playwright/test';

export const validUser = 'standard_user';
export const validPassword = 'secret_sauce';
export const domain = 'https://www.saucedemo.com/';

export async function login(page: Page) {
  await page.goto(domain);
  await page.locator('[data-test="username"]').click();
  await page.locator('[data-test="username"]').fill(validUser);
  await page.locator('[data-test="password"]').click();
  await page.locator('[data-test="password"]').fill(validPassword);
  await page.locator('[data-test="login-button"]').click();
}
