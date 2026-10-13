import { useState, useEffect } from 'react';
import type { User } from '@/types';
import { getStoredUser, storeUser, clearUser } from '@/lib/auth';
import { MOCK_USERS } from '@/constants/mockData';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800));
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      storeUser(found);
      setUser(found);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = async (name: string, email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800));
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) return { success: false, error: 'Email already registered' };
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name, email, role: 'customer',
      createdAt: new Date().toISOString(),
    };
    storeUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
