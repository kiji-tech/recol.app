import { Stack, Tabs } from "expo-router";

const EventsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "ホーム", headerShown: false }} />
      <Tabs.Screen name="settings" options={{ title: "設定", headerShown: false }} />
    </Tabs>
  );
};

export default EventsLayout;
