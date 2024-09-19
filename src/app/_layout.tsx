import '@/global.css';
import { Stack } from 'expo-router';
import { colorScheme, useColorScheme } from 'nativewind';

// Use imperatively
//  | 'light' | 'system'
colorScheme.set('dark');

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ title: 'ホーム', headerShown: false }} />
      <Stack.Screen name="(add.plan)" options={{ title: '計画作成', headerShown: false }} />
      <Stack.Screen name="(plan)/[id]" options={{ title: '計画表示', headerShown: false }} />
    </Stack>
  );
};
export default RouteLayout;
