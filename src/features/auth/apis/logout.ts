import { supabase } from '../../../libs/supabase';

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
};
