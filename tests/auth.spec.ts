import { test, expect } from '@playwright/test';
import {
  demoUsers,
  gotoAsUser,
  login,
  logout,
  navigateTo,
} from './helpers/auth';

test('an unauthenticated visitor only sees the login page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('login-form')).toBeVisible();
  await expect(page.getByTestId('demo-credentials')).toContainText('suvendu');
  await expect(page.getByTestId('dashboard-page')).toBeHidden();
  await expect(page.getByTestId('main-nav')).toBeHidden();
  await expect(page.getByTestId('balance')).toBeHidden();
});

test('valid demo credentials open the dashboard', async ({ page }) => {
  await page.goto('/');
  await login(page, 'suvendu');

  await expect(page.getByTestId('dashboard-page')).toBeVisible();
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.suvendu.balance,
  );
  await expect(page.getByTestId('login-form')).toBeHidden();
});

const invalidLogins = [
  { username: 'suvendu', password: 'wrong', error: 'Invalid username or password.' },
  { username: 'nobody', password: 'demo1234', error: 'Invalid username or password.' },
  { username: '', password: '', error: 'Enter a username and password.' },
] as const;

for (const { username, password, error } of invalidLogins) {
  test(`login is rejected for "${username}" / "${password}"`, async ({
    page,
  }) => {
    await page.goto('/');

    const form = page.getByTestId('login-form');
    await form.getByLabel('Username').fill(username);
    await form.getByLabel('Password').fill(password);
    await form.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByTestId('login-error')).toHaveText(error);
    await expect(page.getByTestId('dashboard-page')).toBeHidden();
  });
}

test('logging out clears the session and returns to the login page', async ({
  page,
}) => {
  await gotoAsUser(page, 'rahul');

  await logout(page);
  await expect(page.getByTestId('dashboard-page')).toBeHidden();

  await page.reload();
  await expect(page.getByTestId('login-form')).toBeVisible();
});

test('the session survives a reload', async ({ page }) => {
  await gotoAsUser(page, 'ananya');

  await page.reload();

  await expect(page.getByTestId('current-user')).toHaveText(
    demoUsers.ananya.name,
  );
  await expect(page.getByTestId('balance')).toHaveText(demoUsers.ananya.balance);
});

test('each user sees only their own account data', async ({ page }) => {
  await gotoAsUser(page, 'suvendu');
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.suvendu.balance,
  );
  await expect(page.getByTestId('current-account')).toHaveText(
    demoUsers.suvendu.accountNumber,
  );
  await expect(page.getByTestId('transaction-list')).toContainText(
    'Card purchase',
  );
  await expect(page.getByTestId('transaction-list')).not.toContainText(
    'Laptop purchase',
  );

  await logout(page);
  await login(page, 'rahul');

  await expect(page.getByTestId('balance')).toHaveText(demoUsers.rahul.balance);
  await expect(page.getByTestId('current-account')).toHaveText(
    demoUsers.rahul.accountNumber,
  );
  await expect(page.getByTestId('transaction-list')).toContainText(
    'Laptop purchase',
  );
  await expect(page.getByTestId('transaction-list')).not.toContainText(
    'Card purchase',
  );
});

test('the profile page shows the signed-in user', async ({ page }) => {
  await gotoAsUser(page, 'ananya');
  await navigateTo(page, 'Profile');

  const profile = page.getByTestId('profile');
  await expect(profile).toContainText(demoUsers.ananya.name);
  await expect(profile).toContainText('ananya');
  await expect(profile).toContainText('ananya.das@example.com');
  await expect(profile).toContainText(demoUsers.ananya.accountNumber);
});

test('deposits and withdrawals apply to the signed-in user only', async ({
  page,
}) => {
  await gotoAsUser(page, 'rahul');

  const depositForm = page.getByTestId('deposit-form');
  await depositForm.getByLabel('Amount').fill('360');
  await depositForm.getByRole('button', { name: 'Deposit funds' }).click();
  await expect(page.getByTestId('balance')).toHaveText('$4,000.00');

  const withdrawalForm = page.getByTestId('withdrawal-form');
  await withdrawalForm.getByLabel('Amount').fill('500');
  await withdrawalForm.getByRole('button', { name: 'Withdraw funds' }).click();
  await expect(page.getByTestId('balance')).toHaveText('$3,500.00');

  await logout(page);
  await login(page, 'ananya');
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.ananya.balance,
  );
});

test('resetting demo data restores every account', async ({ page }) => {
  await gotoAsUser(page, 'suvendu');

  const depositForm = page.getByTestId('deposit-form');
  await depositForm.getByLabel('Amount').fill('100');
  await depositForm.getByRole('button', { name: 'Deposit funds' }).click();
  await expect(page.getByTestId('balance')).toHaveText('$1,384.50');

  await logout(page);
  await login(page, 'rahul');

  const withdrawalForm = page.getByTestId('withdrawal-form');
  await withdrawalForm.getByLabel('Amount').fill('40');
  await withdrawalForm.getByRole('button', { name: 'Withdraw funds' }).click();
  await expect(page.getByTestId('balance')).toHaveText('$3,600.00');

  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await expect(page.getByTestId('balance')).toHaveText(demoUsers.rahul.balance);

  await logout(page);
  await login(page, 'suvendu');
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.suvendu.balance,
  );
  await expect(
    page.getByTestId('transaction-list').getByRole('listitem'),
  ).toHaveCount(5);
  await expect(page.getByTestId('transaction-list')).toContainText(
    'Card purchase',
  );
});
