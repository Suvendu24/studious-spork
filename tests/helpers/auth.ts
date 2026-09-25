import { expect, type Page } from '@playwright/test';

export const demoUsers = {
  suvendu: {
    username: 'suvendu',
    password: 'demo1234',
    name: 'Suvendu Panda',
    accountNumber: '**** **** 4587',
    balance: '$1,284.50',
  },
  rahul: {
    username: 'rahul',
    password: 'demo1234',
    name: 'Rahul Sharma',
    accountNumber: '**** **** 4588',
    balance: '$3,640.00',
  },
  ananya: {
    username: 'ananya',
    password: 'demo1234',
    name: 'Ananya Das',
    accountNumber: '**** **** 4589',
    balance: '$875.20',
  },
} as const;

export type DemoUserKey = keyof typeof demoUsers;

export async function login(page: Page, user: DemoUserKey) {
  const { username, password, name } = demoUsers[user];
  const form = page.getByTestId('login-form');

  await form.getByLabel('Username').fill(username);
  await form.getByLabel('Password').fill(password);
  await form.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByTestId('current-user')).toHaveText(name);
}

/** Opens the app and signs the given demo user in. */
export async function gotoAsUser(page: Page, user: DemoUserKey = 'suvendu') {
  await page.goto('/');
  await login(page, user);
}

export async function logout(page: Page) {
  await page.getByTestId('logout').click();
  await expect(page.getByTestId('login-form')).toBeVisible();
}

export async function navigateTo(
  page: Page,
  label: 'Dashboard' | 'Account' | 'Transfer' | 'Profile',
) {
  await page.getByTestId('main-nav').getByRole('button', { name: label }).click();
}
