import { auth, db } from "@/lib/firebase";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { doc, onSnapshot, type DocumentData } from "firebase/firestore";
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  createdAt?: string;
  schoolName?: string;
  studyField?: string;
  onboardingCompleted?: boolean;
  avatarUrl?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  listenerInitialized: boolean;
  initAuthListener: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // will hold our Firestore unsubscribe fn
  let unsubscribeProfile: (() => void) | null = null;

  return {
    user: null,
    loading: true,
    listenerInitialized: false,
    setUser: (user: User | null) => set({ user, loading: false }),

    initAuthListener: () => {
      if (get().listenerInitialized) return;

      onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        // tear down any old subscription
        unsubscribeProfile?.();

        if (fbUser) {
          // first set the basic auth info
          set({
            user: {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName,
            },
            loading: false,
          });

          // then subscribe to their Firestore doc
          const profileRef = doc(db, "users", fbUser.uid);
          unsubscribeProfile = onSnapshot(profileRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data() as DocumentData;
              set((state) => ({
                user: {
                  ...state.user!,
                  displayName: data.displayName || state.user!.displayName,
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  schoolName: data.schoolName,
                  studyField: data.studyField,
                  onboardingCompleted: data.onboardingCompleted,
                  avatarUrl: data.avatarUrl || state.user!.avatarUrl,
                },
              }));
            }
          });
        } else {
          // logged out
          set({ user: null, loading: false });
        }
      });

      set({ listenerInitialized: true });
    },

    logout: () => {
      // if you ever need a programmatic logout
      return signOut(auth);
    },
  };
});
