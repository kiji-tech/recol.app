import "@/global.css";
import { Stack } from "expo-router";

const RouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{ title: "ホーム", headerShown: false }}
      />
    </Stack>
  );
};
export default RouteLayout;
