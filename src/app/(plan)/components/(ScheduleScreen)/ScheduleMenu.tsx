import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Plan } from '@/src/features/plan';
import { Schedule } from '@/src/features/schedule';
import { useRouter } from 'expo-router';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Share, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { usePlan } from '@/src/contexts/PlanContext';
import dayjs from 'dayjs';
import generateShareMessage from '@/src/features/schedule/libs/generateShareMessage';

export default function ScheduleMenu({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { setEditSchedule } = usePlan();

  // === Method ===
  /** プランの編集 */
  const handleEditPress = () => {
    router.push(`/(modal)/PlanEditor`);
  };

  /** スケジュールの追加 */
  const handleAddPress = () => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs().set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: dayjs().add(1, 'hour').set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Schedule;
    setEditSchedule(schedule);
    router.push(`/(scheduleEditor)/ScheduleEditor`);
  };

  /**
   * スケジュールを共有する
   */
  const handleSharePress = async () => {
    await Share.share({
      message: generateShareMessage(plan),
      title: 'スケジュールを共有します',
    });
  };

  return (
    <Menu>
      <MenuTrigger>
        <View className="w-10 h-10 bg-light-info dark:bg-dark-info rounded-full flex flex-row items-center justify-center">
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
          text="予定編集"
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={handleEditPress}
        />
        <MenuOption
          text="スケジュール追加"
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={() => {
            handleAddPress();
          }}
        />
        <MenuOption
          text="共有する"
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={() => {
            handleSharePress();
          }}
        />
      </MenuOptions>
    </Menu>
  );
}
