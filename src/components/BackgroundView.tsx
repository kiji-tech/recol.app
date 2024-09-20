import { SafeAreaView, View } from 'react-native';

export default function BackgroundView({ children }: { children: React.ReactNode }) {
  return (
      <View className="bg-light-primary-clear dark:bg-dark-primary-clear flex flex-col justify-start items-center">{children}</View>
  );
}
