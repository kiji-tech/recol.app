import { Stack, Tabs } from "expo-router";

const PlanLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="map" options={{ title: "マップ", headerShown: false }} />
      <Tabs.Screen name="schedule" options={{ title: "スケジュール", headerShown: false }} />
    </Tabs>
  );
};
export default PlanLayout;
