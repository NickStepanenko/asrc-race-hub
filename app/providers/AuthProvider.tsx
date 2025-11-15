'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type AuthState = {
  user: {
    id: number; email: string; name: string; role: string;
  } | null; loading: boolean;
};

type AuthContextValue = AuthState & { refresh: () => Promise<void> };

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
});
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setState({ user: data?.user ?? null, loading: false });
      } else if (res.status === 401) {
        setState({ user: null, loading: false });
      } else {
        throw new Error(`auth check failed: ${res.status}`);
      }
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthContext.Provider value={{ ...state, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}