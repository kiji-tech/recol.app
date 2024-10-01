import { SafeAreaView, View } from 'react-native';

export default function BackgroundView({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex flex-col justify-start items-center w-screen h-screen p-4 bg-light-primary-clear dark:bg-dark-primary-clear">
      {children}
    </View>
  );
}
