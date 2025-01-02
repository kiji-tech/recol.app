import TabBar from '@/src/components/TabBar';
import { Stack, Tabs } from 'expo-router';

const PlanLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="MapScreen" options={{ title: 'マップ', headerShown: false }} />
      <Tabs.Screen name="ChatScreen" options={{ title: 'チャット', headerShown: false }} />
      <Tabs.Screen name="ScheduleScreen" options={{ title: 'カレンダー', headerShown: false }} />
    </Tabs>
  );
};
export default PlanLayout;
