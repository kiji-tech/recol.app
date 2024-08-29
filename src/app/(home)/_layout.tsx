import { Stack } from "expo-router";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "ホーム", headerShown: true }}
      />
    </Stack>
  );
};
export default HomeLayout;
