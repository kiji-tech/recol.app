import "@/global.css";
import { Stack } from "expo-router";

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ title: "ホーム", headerShown: false }} />
      <Stack.Screen name="(plan)/[id]" options={{ title: "旅行計画", headerShown: false }} />
      <Stack.Screen name="(search)" options={{ title: "検索", headerShown: false }} />
    </Stack>
  );
};
export default RouteLayout;
