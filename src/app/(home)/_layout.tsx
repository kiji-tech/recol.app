import TabBar from '@/src/components/TabBar';
import { Stack, Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
      <Tabs.Screen name="PlanList" options={{ title: '旅行計画', headerShown: false }} />
      <Tabs.Screen name="Settings" options={{ title: '設定', headerShown: false }} />
      {/* <Tabs.Screen name="sample" options={{ title: 'サンプル', headerShown: true }} /> */}
    </Tabs>
  );
};

export default EventsLayout;
