import { Session, User } from '@supabase/supabase-js';
import { Profile } from '../../profile/types/Profile';
import { Subscription } from '../../payment/types/Subscription';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: (Profile & { subscription: Subscription[] }) | null;
  getProfileInfo: () => (Profile & { subscription: Subscription[] }) | null;
  getProfile: () => Promise<void>;
  setProfile: (profile: (Profile & { subscription: Subscription[] }) | null) => void;
  loading: boolean;
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
  profile: (Profile & { subscription: Subscription[] }) | null;
};
