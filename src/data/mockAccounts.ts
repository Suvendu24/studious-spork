import type { Account, AccountsById } from '../types'

const seedAccounts: Account[] = [
  {
    id: 'acc_10024587',
    userId: 'usr_suvendu',
    accountNumber: '**** **** 4587',
    accountHolder: 'Suvendu Panda',
    accountType: 'Savings',
    currency: 'USD',
    interestRate: 0.035,
    openedAt: '2023-04-18T09:15:00.000Z',
    balanceInCents: 1_284_50,
    transactions: [
      {
        id: 'txn_0001',
        type: 'deposit',
        amountInCents: 1_500_00,
        balanceAfterInCents: 1_500_00,
        description: 'Opening deposit',
        createdAt: '2023-04-18T09:15:00.000Z',
      },
      {
        id: 'txn_0002',
        type: 'deposit',
        amountInCents: 250_00,
        balanceAfterInCents: 1_750_00,
        description: 'Salary transfer',
        createdAt: '2024-01-31T18:02:00.000Z',
      },
      {
        id: 'txn_0003',
        type: 'withdrawal',
        amountInCents: 620_00,
        balanceAfterInCents: 1_130_00,
        description: 'Rent payment',
        createdAt: '2024-02-05T11:40:00.000Z',
      },
      {
        id: 'txn_0004',
        type: 'deposit',
        amountInCents: 180_25,
        balanceAfterInCents: 1_310_25,
        description: 'Interest credit',
        createdAt: '2024-06-30T07:00:00.000Z',
      },
      {
        id: 'txn_0005',
        type: 'withdrawal',
        amountInCents: 25_75,
        balanceAfterInCents: 1_284_50,
        description: 'Card purchase',
        createdAt: '2024-07-12T16:24:00.000Z',
      },
    ],
  },
  {
    id: 'acc_10024588',
    userId: 'usr_rahul',
    accountNumber: '**** **** 4588',
    accountHolder: 'Rahul Sharma',
    accountType: 'Savings',
    currency: 'USD',
    interestRate: 0.042,
    openedAt: '2022-11-02T10:30:00.000Z',
    balanceInCents: 3_640_00,
    transactions: [
      {
        id: 'txn_1001',
        type: 'deposit',
        amountInCents: 3_000_00,
        balanceAfterInCents: 3_000_00,
        description: 'Opening deposit',
        createdAt: '2022-11-02T10:30:00.000Z',
      },
      {
        id: 'txn_1002',
        type: 'deposit',
        amountInCents: 1_200_00,
        balanceAfterInCents: 4_200_00,
        description: 'Freelance invoice',
        createdAt: '2023-08-14T12:05:00.000Z',
      },
      {
        id: 'txn_1003',
        type: 'withdrawal',
        amountInCents: 760_00,
        balanceAfterInCents: 3_440_00,
        description: 'Laptop purchase',
        createdAt: '2024-03-21T09:12:00.000Z',
      },
      {
        id: 'txn_1004',
        type: 'deposit',
        amountInCents: 200_00,
        balanceAfterInCents: 3_640_00,
        description: 'Interest credit',
        createdAt: '2024-09-30T07:00:00.000Z',
      },
    ],
  },
  {
    id: 'acc_10024589',
    userId: 'usr_ananya',
    accountNumber: '**** **** 4589',
    accountHolder: 'Ananya Das',
    accountType: 'Savings',
    currency: 'USD',
    interestRate: 0.038,
    openedAt: '2024-01-09T08:45:00.000Z',
    balanceInCents: 875_20,
    transactions: [
      {
        id: 'txn_2001',
        type: 'deposit',
        amountInCents: 900_00,
        balanceAfterInCents: 900_00,
        description: 'Opening deposit',
        createdAt: '2024-01-09T08:45:00.000Z',
      },
      {
        id: 'txn_2002',
        type: 'withdrawal',
        amountInCents: 120_80,
        balanceAfterInCents: 779_20,
        description: 'Course fees',
        createdAt: '2024-04-02T15:26:00.000Z',
      },
      {
        id: 'txn_2003',
        type: 'deposit',
        amountInCents: 96_00,
        balanceAfterInCents: 875_20,
        description: 'Tutoring income',
        createdAt: '2024-10-11T19:40:00.000Z',
      },
    ],
  },
]

/** Returns a fresh deep copy of the seeded accounts so callers can never
 * mutate the demo data that "Reset demo data" restores. */
export function createSeedAccounts(): AccountsById {
  return structuredClone(seedAccounts).reduce<AccountsById>(
    (accounts, account) => {
      accounts[account.id] = account
      return accounts
    },
    {},
  )
}
