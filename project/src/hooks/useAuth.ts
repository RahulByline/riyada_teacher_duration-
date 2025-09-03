import { useState, useEffect } from 'react';
import { mysqlClient } from '../lib/mysql';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'trainer' | 'participant' | 'client';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Restore user session on component mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = mysqlClient.getAuthToken();
        if (token) {
                // Try to get user profile from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const profile = await response.json();
        if (profile.user) {
          setUser(profile.user);
        }
      }
        }
      } catch (err) {
        // If token is invalid, clear it
        mysqlClient.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signInWithPasscode = async (passcode: string) => {
    try {
      setError(null);
      setLoading(true);

      // Use MySQL backend for passcode authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/auth/passcode-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passcode }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      if (data.user && data.token) {
        // Store the token
        mysqlClient.setAuthToken(data.token);
        setUser(data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await mysqlClient.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed');
    }
  };

  const updateUserRole = async (newRole: 'admin' | 'trainer' | 'participant' | 'client') => {
    if (!user) return;

    try {
      setError(null);
      const updatedUser = {
        ...user,
        role: newRole,
        updated_at: new Date().toISOString()
      };
      
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signInWithPasscode,
    signOut,
    updateUserRole,
    isAuthenticated: !!user
  };
}