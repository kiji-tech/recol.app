import React from 'react';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '@/src/contexts/ThemeContext';
import { View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import i18n from '@/src/libs/i18n';
interface PlanListMenuProps {
  onSortPress: () => void;
}

export default function PlanListMenu({ onSortPress }: PlanListMenuProps) {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  // === Method ===
  /**
   * プラン追加ボタン イベントハンドラ
   */
  const handleAddPress = () => {
    router.push('/(modal)/PlanCreator');
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
          text={i18n.t('COMPONENT.PLAN.ADD_PLAN')}
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={handleAddPress}
        />
        <MenuOption
          text={i18n.t('COMPONENT.PLAN.SORT_TITLE')}
          customStyles={{
            optionText: {
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: 'black',
            },
          }}
          onSelect={onSortPress}
        />
      </MenuOptions>
    </Menu>
  );
}
