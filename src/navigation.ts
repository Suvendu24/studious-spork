export const views = ['dashboard', 'account', 'transfer', 'profile'] as const

export type View = (typeof views)[number]

export const viewLabels: Record<View, string> = {
  dashboard: 'Dashboard',
  account: 'Account',
  transfer: 'Transfer',
  profile: 'Profile',
}
