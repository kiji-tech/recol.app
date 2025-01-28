import TabBar from '@/src/components/TabBar';
import { Tabs } from 'expo-router';

const PlanLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="ScheduleScreen" options={{ title: 'スケジュール', headerShown: false }} />
      <Tabs.Screen name="MapScreen" options={{ title: 'マップ', headerShown: false }} />
    </Tabs>
  );
};
export default PlanLayout;
