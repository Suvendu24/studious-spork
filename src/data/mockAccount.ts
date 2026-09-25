import type { Account } from '../types'

export const mockAccount: Account = {
  id: 'acc_10024587',
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
}
