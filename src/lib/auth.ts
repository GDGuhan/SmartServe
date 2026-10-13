import type { User } from '@/types';

const AUTH_KEY = 'smartserve_auth';

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function generateMockToken(userId: string): string {
  return btoa(`smartserve-jwt-mock-${userId}-${Date.now()}`);
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

export function isStaff(user: User | null): boolean {
  return user?.role === 'admin' || user?.role === 'staff';
}
