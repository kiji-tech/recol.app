import '@/global.css';
import { Stack } from 'expo-router';

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="AddPlan" options={{ title: 'プラン作成', headerShown: false }} />
    </Stack>
  );
};
export default RouteLayout;
