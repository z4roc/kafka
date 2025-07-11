import { create } from "zustand";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: string;
  schoolName?: string;
  studyField?: string;
  onboardingCompleted?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: AuthState["user"]) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
