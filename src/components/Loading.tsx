import { View, ActivityIndicator, Text } from 'react-native';
import BackgroundView from './BackgroundView';
import { textColor } from '../themes/ColorUtil';

export default function Loading() {
  return (
    <View className="absolute w-full h-full z-50" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
      <View className="flex w-full h-full justify-center items-center">
        <View className="bg-light-background dark:bg-dark-background p-4 rounded-xl">
          <Text className={`text-light-text dark:text-dark-text mb-2`}>{'Loading...'}</Text>
          <ActivityIndicator />
        </View>
      </View>
    </View>
  );
}
