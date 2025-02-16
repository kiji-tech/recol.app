import React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../libs/supabase';
import { Tables } from '../libs/database.types';
import { getProfile } from '../libs/ApiService';
import { LogUtil } from '../libs/LogUtil';

type AuthContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  profile: Tables<'profile'> | null;
  setProfile: (profile: Tables<'profile'> | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'profile'> | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        if (error.message) {
          alert(error.message);
        }
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await getProfile(session).catch((e) => {
          if (e && e.message) {
            alert(e.message);
          }
          return null;
        });
        setProfile(profile);
      }
    })().catch((e) => {
      if (e && e.message) LogUtil.log(e.message, { level: 'error' });
    });

    return () => {
      ctrl.abort();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession, user, setUser, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
