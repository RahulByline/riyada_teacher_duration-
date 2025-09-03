import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Database } from '../lib/mysql';

type User = Database['public']['Tables']['users']['Row'];

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithPasscode: (passcode: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserRole: (role: 'admin' | 'trainer' | 'participant' | 'client') => Promise<User | undefined>;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  return (
    <UserContext.Provider value={auth}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}