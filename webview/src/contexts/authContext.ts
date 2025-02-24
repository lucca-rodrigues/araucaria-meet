import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      login: async (email: string, password: string) => {
        // TODO: Integrar com API real
        // const response = await api.post('/auth/login', { email, password })
        // const user = response.data

        // Mock do usuário para desenvolvimento
        const mockUser = {
          id: '1',
          name: 'Admin',
          email: email,
          token: 'mock-token',
        };

        set({ user: mockUser, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
