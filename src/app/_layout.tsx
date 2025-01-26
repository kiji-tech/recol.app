import '@/global.css';
import { Session } from '@supabase/supabase-js';
import { router, Stack } from 'expo-router';
import { colorScheme, useColorScheme } from 'nativewind';
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabase';
import { PlanProvider } from '../contexts/PlanContext';
require('dayjs/locale/ja');

// Use imperatively
// 'dark  | 'light' | 'system'
colorScheme.set('light');

const RouteLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (!session) {
        router.navigate('/(auth)/SignIn');
      }
    })();
  }, []);

  return (
    <PlanProvider>
      <Stack>
        <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
        <Stack.Screen name="(add.plan)" options={{ title: '計画作成', headerShown: false }} />
        <Stack.Screen name="(plan)" options={{ title: '計画表示', headerShown: false }} />
        <Stack.Screen name="(chat)" options={{ title: 'チャット', headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ title: 'ログイン', headerShown: false }} />
      </Stack>
    </PlanProvider>
  );
};
export default RouteLayout;
