import React from 'react';
import { View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '@/src/contexts';
import { Schedule } from '../../types/Schedule';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  schedule: Schedule;
  onPosts: () => void;
  onDelete: () => void;
};
export default function ScheduleItemMenu({ schedule, onPosts, onDelete }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();

  // === Render ===
  return (
    <Menu>
      <MenuTrigger>
        <View className="w-10 h-10  rounded-full flex flex-row items-center justify-center">
          <SimpleLineIcons name="options" size={14} color={isDarkMode ? 'white' : 'black'} />
        </View>
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderStartStartRadius: 10,
            borderStartEndRadius: 10,
            borderEndStartRadius: 10,
            borderEndEndRadius: 10,
            width: 160,
          },
        }}
      >
        <MenuOption
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={() => {
            onPosts();
          }}
          text={generateI18nMessage('FEATURE.SCHEDULE.POSTS')}
        />
        <MenuOption
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={() => {
            onDelete();
          }}
          text={generateI18nMessage('COMMON.DELETE')}
        />
      </MenuOptions>
    </Menu>
  );
}
