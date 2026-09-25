import { test, expect, type Page } from '@playwright/test';
import {
  demoUsers,
  gotoAsUser,
  login,
  logout,
  navigateTo,
} from './helpers/auth';

const RAHUL_OPTION = 'Rahul Sharma (**** **** 4588)';

async function submitTransfer(
  page: Page,
  options: { recipient?: string; amount: string; description?: string },
) {
  await navigateTo(page, 'Transfer');
  const form = page.getByTestId('transfer-form');

  if (options.recipient !== undefined) {
    await form.getByLabel('Recipient').selectOption({ label: options.recipient });
  }
  await form.getByLabel('Amount').fill(options.amount);
  if (options.description !== undefined) {
    await form.getByLabel('Description (optional)').fill(options.description);
  }
  await form.getByRole('button', { name: 'Send transfer' }).click();

  return form;
}

test('the recipient list never contains the signed-in user', async ({
  page,
}) => {
  await gotoAsUser(page, 'suvendu');
  await navigateTo(page, 'Transfer');

  const recipient = page.getByTestId('transfer-form').getByLabel('Recipient');
  await expect(recipient).toContainText('Rahul Sharma');
  await expect(recipient).toContainText('Ananya Das');
  await expect(recipient).not.toContainText('Suvendu Panda');
});

test('a transfer debits the sender and credits the recipient', async ({
  page,
}) => {
  await gotoAsUser(page, 'suvendu');

  const form = await submitTransfer(page, {
    recipient: RAHUL_OPTION,
    amount: '284.50',
    description: 'Shared dinner',
  });

  await expect(form.getByTestId('transfer-success')).toContainText(
    'Transfer to Rahul Sharma completed.',
  );
  await expect(page.getByTestId('balance')).toHaveText('$1,000.00');

  const senderTransactions = page.getByTestId('transaction-list');
  await expect(senderTransactions).toContainText('Shared dinner');
  await expect(senderTransactions).toContainText('−$284.50');

  await logout(page);
  await login(page, 'rahul');

  await expect(page.getByTestId('balance')).toHaveText('$3,924.50');
  const recipientTransactions = page.getByTestId('transaction-list');
  await expect(recipientTransactions).toContainText('Shared dinner');
  await expect(recipientTransactions).toContainText('+$284.50');
});

test('a transfer without a description labels both sides', async ({ page }) => {
  await gotoAsUser(page, 'suvendu');

  await submitTransfer(page, { recipient: RAHUL_OPTION, amount: '25' });
  await expect(page.getByTestId('transaction-list')).toContainText(
    'Transfer to Rahul Sharma',
  );

  await logout(page);
  await login(page, 'rahul');
  await expect(page.getByTestId('transaction-list')).toContainText(
    'Transfer from Suvendu Panda',
  );
});

test('a transfer larger than the balance is rejected', async ({ page }) => {
  await gotoAsUser(page, 'ananya');

  const form = await submitTransfer(page, {
    recipient: RAHUL_OPTION,
    amount: '2000',
  });

  await expect(form.getByTestId('transfer-error')).toContainText(
    'Insufficient funds for this transfer.',
  );
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.ananya.balance,
  );

  await logout(page);
  await login(page, 'rahul');
  await expect(page.getByTestId('balance')).toHaveText(demoUsers.rahul.balance);
});

test('a transfer without a recipient is rejected', async ({ page }) => {
  await gotoAsUser(page, 'suvendu');

  const form = await submitTransfer(page, { amount: '10' });

  await expect(form.getByTestId('transfer-error')).toContainText(
    'Select a recipient.',
  );
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.suvendu.balance,
  );
});

test('a transfer to the signed-in user\'s own account is rejected', async ({
  page,
}) => {
  await gotoAsUser(page, 'suvendu');
  await navigateTo(page, 'Transfer');

  const form = page.getByTestId('transfer-form');
  // The dropdown never offers the signed-in user, so the own-account guard is
  // exercised by forcing the sender's own account id into the select.
  await form.getByLabel('Recipient').evaluate((element) => {
    const select = element as HTMLSelectElement;
    const option = document.createElement('option');
    option.value = 'acc_10024587';
    option.textContent = 'Own account';
    select.append(option);
  });
  await form.getByLabel('Recipient').selectOption('acc_10024587');
  await form.getByLabel('Amount').fill('10');
  await form.getByRole('button', { name: 'Send transfer' }).click();

  await expect(form.getByTestId('transfer-error')).toContainText(
    'You cannot transfer to your own account.',
  );
  await expect(page.getByTestId('balance')).toHaveText(
    demoUsers.suvendu.balance,
  );
});

const invalidTransferAmounts = [
  { amount: '', expectedError: 'Enter an amount.' },
  { amount: 'abc', expectedError: 'Enter a valid number' },
  { amount: '0', expectedError: 'Amount must be greater than zero.' },
  { amount: '1.234', expectedError: 'Use at most two decimal places.' },
] as const;

for (const { amount, expectedError } of invalidTransferAmounts) {
  test(`a transfer of "${amount}" is rejected`, async ({ page }) => {
    await gotoAsUser(page, 'suvendu');

    const form = await submitTransfer(page, {
      recipient: RAHUL_OPTION,
      amount,
    });

    await expect(form.getByTestId('transfer-error')).toContainText(
      expectedError,
    );
    await expect(page.getByTestId('balance')).toHaveText(
      demoUsers.suvendu.balance,
    );
  });
}

test('transferred money survives a reload for both parties', async ({
  page,
}) => {
  await gotoAsUser(page, 'suvendu');
  await submitTransfer(page, {
    recipient: RAHUL_OPTION,
    amount: '100',
    description: 'Rent share',
  });
  await expect(page.getByTestId('balance')).toHaveText('$1,184.50');

  await page.reload();
  await expect(page.getByTestId('balance')).toHaveText('$1,184.50');

  await logout(page);
  await login(page, 'rahul');
  await page.reload();
  await expect(page.getByTestId('balance')).toHaveText('$3,740.00');
  await navigateTo(page, 'Account');
  await expect(page.getByTestId('transaction-history')).toContainText(
    'Rent share',
  );
});

test('the dashboard summary counts transfers as income and expense', async ({
  page,
}) => {
  await gotoAsUser(page, 'ananya');
  await submitTransfer(page, { recipient: RAHUL_OPTION, amount: '75.20' });

  await navigateTo(page, 'Dashboard');
  await expect(page.getByTestId('balance')).toHaveText('$800.00');
  await expect(page.getByTestId('summary-income')).toHaveText('$996.00');
  await expect(page.getByTestId('summary-expense')).toHaveText('$196.00');
  await expect(page.getByTestId('summary-net')).toHaveText('$800.00');
});
