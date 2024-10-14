import { Stack, Tabs } from 'expo-router';

const EventsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'ホーム', headerShown: false }} />
      <Tabs.Screen name="search" options={{ title: '検索', headerShown: false }} />
      <Tabs.Screen name="settings" options={{ title: '設定', headerShown: false }} />
      <Tabs.Screen name="sample" options={{ title: 'サンプル', headerShown: true }} />
    </Tabs>
  );
};

export default EventsLayout;
