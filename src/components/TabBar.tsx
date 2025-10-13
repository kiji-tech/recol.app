import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../contexts/ThemeContext';
import { MyBannerAd } from './Ad/BannerAd';
import { useAuth } from '../features/auth';
import { router } from 'expo-router';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { profile } = useAuth();
  const isIOS = Platform.OS === 'ios';
  const LARGE_ICON_SIZE = 24;
  const SMALL_ICON_SIZE = 20;

  // === Render ===
  return (
    <View className={`flex-col ${isIOS && 'mb-8'} z-10`}>
      <MyBannerAd />
      <View className="flex-row w-full border-t-[1px] border-light-border dark:border-dark-border mx-auto">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name || '';

          const isFocused = state.index === index;

          // === Method ===
          const onPress = () => {
            if (!profile) {
              router.push('/(auth)/SignIn');
              return;
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          // === Render ===
          if (label == 'サンプル' && process.env.EXPO_PUBLIC_APP_ENV != 'development') return;
          // サンプルコンポーネントは非表示
          if (
            label.toString().indexOf('Components') >= 0 ||
            label.toString().indexOf('components') >= 0
          )
            return;

          return (
            <TouchableOpacity
              key={route.key}
              className={`flex-1 flex-col justify-center items-center py-2 px-4 
                        bg-light-background dark:bg-dark-background`}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
            >
              {label == 'ホーム' && (
                <>
                  {isFocused ? (
                    <Ionicons
                      name="home-sharp"
                      size={LARGE_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  ) : (
                    <Ionicons
                      name="home-outline"
                      size={SMALL_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  )}
                </>
              )}
              {(label == '計画' || label == 'スケジュール') && (
                <>
                  {isFocused ? (
                    <Ionicons
                      name="calendar-sharp"
                      size={LARGE_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  ) : (
                    <Ionicons
                      name="calendar-outline"
                      size={SMALL_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  )}
                </>
              )}
              {label == '設定' && (
                <>
                  {isFocused ? (
                    <Ionicons
                      name="settings"
                      size={LARGE_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  ) : (
                    <Ionicons
                      name="settings-outline"
                      size={SMALL_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  )}
                </>
              )}
              {label == 'マップ' && (
                <>
                  {isFocused ? (
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={LARGE_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={SMALL_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  )}
                </>
              )}
              {label == 'メディア' && (
                <>
                  {isFocused ? (
                    <Ionicons
                      name="camera"
                      size={LARGE_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  ) : (
                    <Ionicons
                      name="camera-outline"
                      size={SMALL_ICON_SIZE}
                      color={isDarkMode ? 'white' : 'black'}
                    />
                  )}
                </>
              )}
              <Text
                className={`text-light-text dark:text-dark-text  ${isFocused ? 'text-md' : 'text-sm'}`}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
