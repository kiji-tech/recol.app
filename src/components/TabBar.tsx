import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="flex-row w-[90%] bottom-12 border-[1px] border-light-border dark:border-dark-border mx-auto">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name || '';

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (label == 'サンプル') return;

        return (
          <TouchableOpacity
            key={route.key}
            className={`flex-1 justify-center items-center py-2 px-4 border-light-border dark:border-dark-border
                    ${index != state.routes.length - 1 && 'border-r-[1px]'}
                    ${isFocused ? 'bg-light-info dark:bg-dark-info' : 'bg-[#fff]'}`}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Text
              className={`${isFocused ? 'text-light-text' : 'text-[#222]'} text-xl font-semibold`}
            >
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
