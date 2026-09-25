import { test, expect } from '@playwright/test';

test('user can deposit money', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByText('Savings Account')
  ).toBeVisible();

  const depositForm = page.getByTestId('deposit-form');

  await depositForm.getByLabel('Amount').fill('500');

  await depositForm
    .getByRole('button', { name: 'Deposit funds' })
    .click();

  await expect(
    depositForm.getByTestId('deposit-success')
  ).toBeVisible();

  await expect(
  page.getByTestId('balance')
).toHaveText('$1,784.50');
});

test('user can withdraw money', async ({ page }) => {
  await page.goto('/');

  const withdrawalForm = page.getByTestId('withdrawal-form');

  await withdrawalForm.getByLabel('Amount').fill('200');

  await withdrawalForm
    .getByRole('button', { name: 'Withdraw funds' })
    .click();

  await expect(
    withdrawalForm.getByTestId('withdrawal-success')
  ).toBeVisible();

  await expect(
    page.getByTestId('balance')
  ).toHaveText('$1,084.50');
});

test('user cannot withdraw more than the available balance', async ({ page }) => {
  await page.goto('/');

  const withdrawalForm = page.getByTestId('withdrawal-form');

  await withdrawalForm.getByLabel('Amount').fill('2000');

  await withdrawalForm
    .getByRole('button', { name: 'Withdraw funds' })
    .click();

  await expect(
    withdrawalForm.getByTestId('withdrawal-error')
  ).toBeVisible();

  await expect(
    page.getByTestId('balance')
  ).toHaveText('$1,284.50');
});