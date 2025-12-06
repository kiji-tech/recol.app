import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/src/features/profile';
import { Subscription } from '@/src/features/payment';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: (Profile & { subscription: Subscription[] | null }) | null;
  getProfile: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
};

export type AuthResult = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
};
