import '@/global.css';
import { Stack } from 'expo-router';

const ChatLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="ScheduleEditor" options={{ title: 'スケジュール編集', headerShown: false }} />
    </Stack>
  );
};
export default ChatLayout;
