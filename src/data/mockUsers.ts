import type { MockCredential, User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'usr_suvendu',
    username: 'suvendu',
    name: 'Suvendu Panda',
    email: 'suvendu.panda@example.com',
    phone: '+91 98200 11001',
    accountId: 'acc_10024587',
  },
  {
    id: 'usr_rahul',
    username: 'rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98200 11002',
    accountId: 'acc_10024588',
  },
  {
    id: 'usr_ananya',
    username: 'ananya',
    name: 'Ananya Das',
    email: 'ananya.das@example.com',
    phone: '+91 98200 11003',
    accountId: 'acc_10024589',
  },
]

/** Demo credentials only. There is no backend, hashing or real authentication
 * in this POC; every password is public and shown on the login screen. */
export const mockCredentials: MockCredential[] = [
  { username: 'suvendu', password: 'demo1234' },
  { username: 'rahul', password: 'demo1234' },
  { username: 'ananya', password: 'demo1234' },
]

export function findUserByUsername(username: string): User | undefined {
  return mockUsers.find(
    (user) => user.username === username.trim().toLowerCase(),
  )
}

export function findUserById(userId: string): User | undefined {
  return mockUsers.find((user) => user.id === userId)
}

export function findUserByAccountId(accountId: string): User | undefined {
  return mockUsers.find((user) => user.accountId === accountId)
}
