import { Tables } from '@/src/libs/database.types';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  item: Tables<'schedule'>;
  active: boolean;
  onPress: (schedule: Tables<'schedule'>) => void;
};
export default function ScheduleItem({ item, active, onPress }: Props) {
  const CELL_HEIGHT = 40;
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
      className={`absolute left-20 w-80 bg-light-theme dark:bg-dark-theme rounded-lg ${active ? 'opacity-100' : 'opacity-70 '}`}
      onPress={() => onPress(item)}
    >
      <View className="p-4">
        <Text className="font-bold">{item.title}</Text>
        <Text>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
}
