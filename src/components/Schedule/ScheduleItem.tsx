import React from 'react';
import dayjs from 'dayjs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tables } from '@/src/libs/database.types';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  item: Tables<'schedule'>;
  isEndDateView: boolean;
  onPress: (schedule: Tables<'schedule'>) => void;
  onLongPress: (schedule: Tables<'schedule'>) => void;
};
export default function ScheduleItem({ item, isEndDateView, onPress, onLongPress }: Props) {
  const { isDarkMode } = useTheme();
  return (
    <TouchableOpacity onPress={() => onPress(item)} onLongPress={() => onLongPress(item)}>
      <View className="flex flex-col gap-2 mb-4">
        {/* 開始時刻 */}
        <View className="flex flex-row gap-2 items-center">
          <View className="w-6 h-6 bg-light-info dark:bg-dark-info flex justify-center items-center rounded-full">
            <View className="w-3 h-3 bg-light-background dark:bg-dark-background rounded-full"></View>
          </View>
          <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
            {dayjs(item.from).format('H:mm')}
          </Text>
          <Text className="font-normal text-2xl text-light-text dark:text-dark-text">
            {item.title}
          </Text>
        </View>
        {/* 情報詳細 */}
        <View className="flex flex-col gap-2 p-4 ml-3 border-l-[1px] border-light-border dark:border-dark-border">
          <Text className="text-light-text dark:text-dark-text">{item.description}</Text>
          <View className="flex flex-row justify-between">
            <Text className="text-light-text dark:text-dark-text">☑ 0/2 件</Text>
            {item.place_list && item.place_list?.length > 0 && (
              <View className="flex flex-row gap-2 items-center">
                <FontAwesome5
                  name="map-marked-alt"
                  size={18}
                  color={isDarkMode ? 'white' : 'black'}
                />
                <Text className="text-lg text-light-text dark:text-dark-text">
                  {item.place_list?.length || 0}件
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* 終了時刻 */}
        {isEndDateView && (
          <View className="flex flex-row gap-2 items-center mb-8">
            <View className="w-6 h-6 bg-light-info dark:bg-dark-info flex justify-center items-center rounded-full">
              <View className="w-3 h-3 bg-light-background dark:bg-dark-background rounded-full"></View>
            </View>
            <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
              {dayjs(item.to).format('H:mm')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
