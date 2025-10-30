import React from 'react';
import dayjs from 'dayjs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Tables } from '@/src/libs/database.types';
import { Text, TouchableOpacity, View } from 'react-native';
import { Place } from '@/src/features/map/types/Place';
import { Schedule } from '@/src/features/schedule';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  item: Schedule;
  isEndDateView: boolean;
  onPress: (schedule: Tables<'schedule'> & { place_list: Place[] }) => void;
  onLongPress: (schedule: Tables<'schedule'> & { place_list: Place[] }) => void;
};
export default function ScheduleItem({ item, isEndDateView, onPress, onLongPress }: Props) {
  const { isDarkMode } = useTheme();
  /**
   * 指定された時間が現在時刻から見て過去かどうかを判定する
   * @param from 開始時刻
   * @param to 終了時刻
   * @returns 過去 = -1 現在 = 0 未来 = 1
   */
  const isTargetTime = (from: string, to: string) => {
    const now = dayjs();
    const fromTime = dayjs(from);
    const toTime = dayjs(to);

    if (fromTime.isBefore(now) && toTime.isAfter(now)) {
      return 0;
    } else if (fromTime.isBefore(now)) {
      return -1;
    } else {
      return 1;
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress(item)} onLongPress={() => onLongPress(item)}>
      <View className="flex flex-col gap-2 px-4 pt-4">
        {/* 開始時刻 */}
        <View className="flex flex-row gap-2 items-center">
          <View
            className={`w-12 h-12 flex justify-center items-center rounded-full
                        ${isTargetTime(item.from!, item.to!) === -1 && 'bg-light-border dark:bg-dark-border'}
                         ${isTargetTime(item.from!, item.to!) === 0 && 'bg-light-danger dark:bg-dark-danger'}
                          ${isTargetTime(item.from!, item.to!) === 1 && 'bg-light-info dark:bg-dark-info'}`}
          >
            <View className="w-8 h-8 bg-light-background dark:bg-dark-background rounded-full flex justify-center items-center">
              {item.category === 'Movement' && (
                <FontAwesome6
                  name="person-running"
                  size={16}
                  color={isDarkMode ? 'white' : 'black'}
                />
              )}
              {item.category === 'Meals' && (
                <FontAwesome6 name="utensils" size={16} color={isDarkMode ? 'white' : 'black'} />
              )}
              {item.category === 'Cafe' && (
                <Ionicons name="cafe" size={16} color={isDarkMode ? 'white' : 'black'} />
              )}
              {item.category === 'Amusement' && (
                <FontAwesome6 name="camera" size={16} color={isDarkMode ? 'white' : 'black'} />
              )}
              {item.category === 'Other' && (
                <FontAwesome name="question" size={16} color={isDarkMode ? 'white' : 'black'} />
              )}
            </View>
          </View>
          <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
            {dayjs(item.from).format('H:mm')}
          </Text>
          <Text className="font-normal text-2xl text-light-text dark:text-dark-text">
            {item.title}
          </Text>
        </View>
        {/* 情報詳細 */}
        <View className="flex flex-col gap-2 p-4 ml-6 border-l-[1px] border-light-border dark:border-dark-border">
          <Text className="text-light-text dark:text-dark-text line-clamp-2">
            {item.description}
          </Text>
          <View className="flex flex-row justify-between">
            {/* TODO: チェックリスト（将来機能） */}
            {/* <Text className="text-light-text dark:text-dark-text">☑ 0/2 件</Text> */}

            {item.place_list && item.place_list?.length > 0 && (
              <View className="flex flex-row gap-2 items-center">
                <FontAwesome5 name="map-marker-alt" size={18} color="#f87171" />
                <Text className="text-lg text-light-text dark:text-dark-text">
                  {item.place_list?.length || 0}件
                </Text>
              </View>
            )}
          </View>
        </View>
        {/* 終了時刻 */}
        {isEndDateView && (
          <View className="flex flex-row gap-2 items-center mb-4">
            <View
              className={`w-12 h-12 flex justify-center items-center rounded-full
                        ${isTargetTime(item.from!, item.to!) === -1 && 'bg-light-border dark:bg-dark-border'}
                         ${isTargetTime(item.from!, item.to!) === 0 && 'bg-light-danger dark:bg-dark-danger'}
                          ${isTargetTime(item.from!, item.to!) === 1 && 'bg-light-info dark:bg-dark-info'}`}
            >
              <View className="w-8 h-8 bg-light-background dark:bg-dark-background rounded-full"></View>
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
