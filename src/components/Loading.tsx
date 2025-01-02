import { View, ActivityIndicator, Text } from 'react-native';
import BackgroundView from './BackgroundView';
import { textColor } from '../themes/ColorUtil';

export default function Loading() {
  return (
    <BackgroundView>
      <View className="flex w-full h-full justify-center items-center">
        <Text className={`text-light-text dark:text-dark-text mb-2`}>{'Loading...'}</Text>
        <ActivityIndicator />
      </View>
    </BackgroundView>
  );
}
