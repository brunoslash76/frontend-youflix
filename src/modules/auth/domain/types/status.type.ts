export type AuthStatus = 'checking' | 'authenticated' | 'guest';
export const AUTH_STATUS: Record<AuthStatus, { label: string, color: string }> = {
  checking: { label: 'Checking', color: 'gray' },
  authenticated: { label: 'Authenticated', color: 'green' },
  guest: { label: 'Guest', color: 'red' },
}