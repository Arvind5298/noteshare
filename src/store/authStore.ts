import { create } from 'zustand';
import { User } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { auth, firebaseAuth } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
      set({ user: result.user });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  signInWithGoogle: async () => {
    try {
      const result = await firebaseAuth.signInWithGoogle();
      set({ user: result.user });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  signUp: async (email, password) => {
    try {
      const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      set({ user: result.user });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  signOut: async () => {
    try {
      await firebaseAuth.signOut();
      set({ user: null });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  setUser: (user) => set({ user }),
}));

// Set up auth state listener
auth.onAuthStateChanged((user) => {
  useAuthStore.getState().setUser(user);
});