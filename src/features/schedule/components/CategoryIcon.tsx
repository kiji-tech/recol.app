import React from 'react';
import { View } from 'react-native';
import { FontAwesome6, FontAwesome, Ionicons } from '@expo/vector-icons';
import { isTargetTime } from '../libs/isTargetTime';
import { Schedule } from '../types/Schedule';

export default function CategoryIcon({
  schedule,
  isDarkMode,
}: {
  schedule: Schedule;
  isDarkMode: boolean;
}) {
  const iconSize = 14;
  return (
    <View
      className={`w-8 h-8 flex justify-center items-center rounded-full
                        ${isTargetTime(schedule.from!, schedule.to!) === -1 && 'bg-light-border dark:bg-dark-border'}
                         ${isTargetTime(schedule.from!, schedule.to!) === 0 && 'bg-light-danger dark:bg-dark-danger'}
                          ${isTargetTime(schedule.from!, schedule.to!) === 1 && 'bg-light-info dark:bg-dark-info'}`}
    >
      {schedule.category === 'Movement' && (
        <FontAwesome6
          name="person-running"
          size={iconSize}
          color={isDarkMode ? 'white' : 'black'}
        />
      )}
      {schedule.category === 'Meals' && (
        <FontAwesome6 name="utensils" size={iconSize} color={isDarkMode ? 'white' : 'black'} />
      )}
      {schedule.category === 'Cafe' && (
        <Ionicons name="cafe" size={iconSize} color={isDarkMode ? 'white' : 'black'} />
      )}
      {schedule.category === 'Amusement' && (
        <FontAwesome6 name="camera" size={iconSize} color={isDarkMode ? 'white' : 'black'} />
      )}
      {schedule.category === 'Other' && (
        <FontAwesome name="question" size={iconSize} color={isDarkMode ? 'white' : 'black'} />
      )}
    </View>
  );
}
