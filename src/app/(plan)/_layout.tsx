import { Stack, Tabs } from 'expo-router';

const PlanLayout = () => {
  return (
    // <Stack>
    //   <Stack.Screen name="MapScreen" options={{ title: 'マップ', headerShown: false }} />
    // </Stack>
    <Tabs>
      <Tabs.Screen name="MapScreen" options={{ title: 'マップ', headerShown: false }} />
      <Tabs.Screen name="ScheduleScreen" options={{ title: 'スケジュール', headerShown: false }} />
    </Tabs>
  );
};
export default PlanLayout;
