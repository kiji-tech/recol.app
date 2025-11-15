import React from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Plan } from '@/src/features/plan';
import { Schedule } from '@/src/features/schedule';
import { useRouter } from 'expo-router';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Share, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { generateShareMessage } from '@/src/features/schedule/libs/generateShareMessage';
import i18n from '@/src/libs/i18n';

export default function ScheduleMenu({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // === Method ===
  /** プランの編集 */
  const handleEditPress = () => {
    router.push({
      pathname: '/(modal)/PlanEditor',
      params: {
        uid: plan.uid,
      },
    });
  };

  /** スケジュールの追加 */
  const handleAddPress = () => {
    const schedule = {
      plan_id: plan!.uid,
      from: dayjs().set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
      to: dayjs().add(1, 'hour').set('minute', 0).format('YYYY-MM-DDTHH:mm:00.000Z'),
    } as Schedule;
    router.push({
      pathname: '/(scheduleEditor)/ScheduleEditor',
      params: {
        uid: schedule.uid,
      },
    });
  };

  const handleEditTimePress = () => {
    router.push(`/(modal)/ScheduleTimeEditor`);
  };

  /**
   * スケジュールを共有する
   */
  const handleSharePress = async () => {
    await Share.share({
      message: generateShareMessage(plan),
      title: i18n.t('COMPONENT.SCHEDULE.SHARE_TITLE'),
    });
  };

  return (
    <Menu>
      <MenuTrigger>
        <View className="w-10 h-10 bg-light-background dark:bg-dark-background rounded-full flex flex-row items-center justify-center">
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
          text={i18n.t('COMPONENT.SCHEDULE.EDIT_PLAN')}
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
          text={i18n.t('COMPONENT.SCHEDULE.ADD_SCHEDULE')}
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
          text={i18n.t('COMPONENT.SCHEDULE.EDIT_TIME')}
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={() => {
            handleEditTimePress();
          }}
        />
        <MenuOption
          text={i18n.t('COMPONENT.SCHEDULE.SHARE')}
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
