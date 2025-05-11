import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../contexts/ThemeContext';
import { MyBannerAd } from './Ad/BannerAd';
export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <View className="flex-col gap-2">
      <View className="w-screen mb-6">
        <MyBannerAd />
      </View>
      <View className="flex-row w-full bottom-8 border-[1px] border-light-border dark:border-dark-border mx-auto">
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

          if (label == 'サンプル' && process.env.EXPO_PUBLIC_APP_ENV != 'development') return;

          return (
            <TouchableOpacity
              key={route.key}
              className={`flex-1 flex-col justify-center items-center py-2 px-4 border-light-border dark:border-dark-border
                    ${index != state.routes.length - 1 && 'border-r-[1px]'}
                    ${isFocused ? 'bg-light-theme dark:bg-dark-theme' : 'bg-light-background dark:bg-dark-background'}`}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {label == 'ホーム' && (
                <Entypo name="home" size={20} color={isDarkMode ? 'white' : 'black'} />
              )}
              {label == 'プラン' && (
                <Entypo name="calendar" size={20} color={isDarkMode ? 'white' : 'black'} />
              )}
              {label == '設定' && (
                <Ionicons name="settings" size={20} color={isDarkMode ? 'white' : 'black'} />
              )}
              {label == 'マップ' && (
                <FontAwesome name="map-marker" size={20} color={isDarkMode ? 'white' : 'black'} />
              )}

              <Text className={`text-light-text dark:text-dark-text text-md font-semibold`}>
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
