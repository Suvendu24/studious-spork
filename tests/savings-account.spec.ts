import { test, expect, type Page } from '@playwright/test';
import { gotoAsUser, navigateTo } from './helpers/auth';

const INITIAL_BALANCE = '$1,284.50';

async function submitTransaction(
  page: Page,
  type: 'deposit' | 'withdrawal',
  amount: string,
  description?: string,
) {
  const form = page.getByTestId(`${type}-form`);

  await form.getByLabel('Amount').fill(amount);
  if (description !== undefined) {
    await form.getByLabel('Description (optional)').fill(description);
  }
  await form
    .getByRole('button', {
      name: type === 'deposit' ? 'Deposit funds' : 'Withdraw funds',
    })
    .click();

  return form;
}

test('dashboard shows the seeded account, balance and recent transactions', async ({
  page,
}) => {
  await gotoAsUser(page);

  await expect(
    page.getByRole('heading', { name: 'Savings Account' }),
  ).toBeVisible();
  await expect(page.getByTestId('balance')).toHaveText(INITIAL_BALANCE);

  const transactions = page.getByTestId('transaction-list').getByRole('listitem');
  await expect(transactions).toHaveCount(5);
  await expect(transactions.first()).toContainText('Card purchase');
  await expect(transactions.first()).toContainText('−$25.75');
  await expect(transactions.last()).toContainText('Opening deposit');

  await navigateTo(page, 'Account');

  const accountInfo = page.getByTestId('account-info');
  await expect(accountInfo).toContainText('Suvendu Panda');
  await expect(accountInfo).toContainText('**** **** 4587');
  await expect(accountInfo).toContainText('Savings');
  await expect(accountInfo).toContainText('USD');
  await expect(accountInfo).toContainText('Apr 18, 2023');
});

test('a deposit is added to the top of the recent transactions list', async ({
  page,
}) => {
  await gotoAsUser(page);

  await submitTransaction(page, 'deposit', '120.25', 'Bonus payment');

  const transactions = page.getByTestId('transaction-list').getByRole('listitem');
  await expect(transactions).toHaveCount(5);

  const latest = transactions.first();
  await expect(latest).toContainText('Bonus payment');
  await expect(latest).toContainText('+$120.25');
  await expect(latest).toContainText('Balance $1,404.75');

  // The list keeps only the five most recent entries.
  await expect(page.getByTestId('transaction-list')).not.toContainText(
    'Opening deposit',
  );
});

test('a withdrawal is recorded as a debit with the running balance', async ({
  page,
}) => {
  await gotoAsUser(page);

  await submitTransaction(page, 'withdrawal', '84.50', 'Utility bill');

  const latest = page
    .getByTestId('transaction-list')
    .getByRole('listitem')
    .first();
  await expect(latest).toContainText('Utility bill');
  await expect(latest).toContainText('−$84.50');
  await expect(latest).toContainText('Balance $1,200.00');
});

test('transactions submitted without a description use a default label', async ({
  page,
}) => {
  await gotoAsUser(page);

  await submitTransaction(page, 'deposit', '10');
  await expect(
    page.getByTestId('transaction-list').getByRole('listitem').first(),
  ).toContainText('Deposit');

  await submitTransaction(page, 'withdrawal', '5');
  await expect(
    page.getByTestId('transaction-list').getByRole('listitem').first(),
  ).toContainText('Withdrawal');
});

const invalidAmounts = [
  { amount: '', expectedError: 'Enter an amount.' },
  { amount: 'abc', expectedError: 'Enter a valid number' },
  { amount: '0', expectedError: 'Amount must be greater than zero.' },
  { amount: '1.234', expectedError: 'Use at most two decimal places.' },
  { amount: '2000000', expectedError: 'exceeds the per-transaction limit' },
] as const;

for (const type of ['deposit', 'withdrawal'] as const) {
  for (const { amount, expectedError } of invalidAmounts) {
    test(`${type} rejects the amount "${amount}" without changing the account`, async ({
      page,
    }) => {
      await gotoAsUser(page);

      const form = await submitTransaction(page, type, amount);

      await expect(form.getByTestId(`${type}-error`)).toContainText(
        expectedError,
      );
      await expect(form.getByTestId(`${type}-success`)).toBeHidden();
      await expect(page.getByTestId('balance')).toHaveText(INITIAL_BALANCE);
      await expect(
        page.getByTestId('transaction-list').getByRole('listitem'),
      ).toHaveCount(5);
    });
  }
}

test('amounts with thousands separators and cents are accepted', async ({
  page,
}) => {
  await gotoAsUser(page);

  await submitTransaction(page, 'deposit', '1,000.50');

  await expect(page.getByTestId('balance')).toHaveText('$2,285.00');
});

test('editing the amount clears a previous error message', async ({ page }) => {
  await gotoAsUser(page);

  const form = await submitTransaction(page, 'withdrawal', '9999');
  await expect(form.getByTestId('withdrawal-error')).toBeVisible();

  await form.getByLabel('Amount').fill('10');
  await expect(form.getByTestId('withdrawal-error')).toBeHidden();
});

test('the full balance can be withdrawn, after which further withdrawals fail', async ({
  page,
}) => {
  await gotoAsUser(page);

  await submitTransaction(page, 'withdrawal', '1284.50');
  await expect(page.getByTestId('balance')).toHaveText('$0.00');

  const form = await submitTransaction(page, 'withdrawal', '0.01');
  await expect(form.getByTestId('withdrawal-error')).toContainText(
    'Insufficient funds',
  );
  await expect(page.getByTestId('balance')).toHaveText('$0.00');
});

test('account state survives a reload and can be reset to the demo data', async ({
  page,
}) => {
  await gotoAsUser(page);

  await submitTransaction(page, 'deposit', '300', 'Savings top-up');
  await expect(page.getByTestId('balance')).toHaveText('$1,584.50');

  await page.reload();
  await expect(page.getByTestId('balance')).toHaveText('$1,584.50');
  await expect(page.getByTestId('transaction-list')).toContainText(
    'Savings top-up',
  );

  await page.getByRole('button', { name: 'Reset demo data' }).click();
  await expect(page.getByTestId('balance')).toHaveText(INITIAL_BALANCE);
  await expect(page.getByTestId('transaction-list')).not.toContainText(
    'Savings top-up',
  );

  await page.reload();
  await expect(page.getByTestId('balance')).toHaveText(INITIAL_BALANCE);
});
