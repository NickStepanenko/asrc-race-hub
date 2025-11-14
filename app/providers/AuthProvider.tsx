// app/providers/AuthProvider.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthState = { user: { id: number; email: string; name?: string } | null; loading: boolean; };

const AuthContext = createContext<AuthState>({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setState({ user: data?.user ?? null, loading: false }))
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
