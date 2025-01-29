import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  item: Tables<'schedule'>;
  onPress: (schedule: Tables<'schedule'>) => void;
};
export default function ScheduleItem({ item, onPress }: Props) {
  const CELL_HEIGHT = 64;
  // 時間
  const { from, to } = item;
  const fromPosition = useMemo(
    () => (dayjs(from).hour() + dayjs(from).minute() / 60) * CELL_HEIGHT,
    [item]
  );
  const range = useMemo(
    () =>
      (dayjs(to).hour() +
        dayjs(to).minute() / 60 -
        (dayjs(from).hour() + dayjs(from).minute() / 60)) *
      CELL_HEIGHT,
    [item]
  );

  return (
    <TouchableOpacity
      style={{ top: Math.round(fromPosition), height: Math.round(range) }}
      className={`absolute left-20 w-80 bg-light-theme dark:bg-dark-theme rounded-xl`}
      onPress={() => onPress(item)}
    >
      <View className="p-4">
        <Text className="font-bold text-light-text dark:text-dark-text">{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
}
