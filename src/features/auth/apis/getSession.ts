import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../libs/supabase';

/**
 * セッション取得
 */
export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
