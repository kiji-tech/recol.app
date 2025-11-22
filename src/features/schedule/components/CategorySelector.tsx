import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ScheduleCategoryList } from '@/src/features/schedule/types/ScheduleCategory';
import { FontAwesome6, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  category: string | null;
  onChange: (category: string) => void;
};

export default function CategorySelector({ category, onChange }: Props) {
  const { isDarkMode } = useTheme();
  return (
    <View className="w-full flex flex-col justify-start items-start">
      <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
        {generateI18nMessage('DATA.SCHEDULE.CATEGORY')}
      </Text>
      <View className="w-full flex flex-row justify-start items-center gap-2  rounded-xl p-4">
        {/* アイコン */}
        {category === 'Movement' && (
          <FontAwesome6 name="person-running" size={20} color={isDarkMode ? 'white' : 'black'} />
        )}
        {category === 'Meals' && (
          <FontAwesome6 name="utensils" size={20} color={isDarkMode ? 'white' : 'black'} />
        )}
        {category === 'Cafe' && (
          <Ionicons name="cafe" size={20} color={isDarkMode ? 'white' : 'black'} />
        )}
        {category === 'Amusement' && (
          <FontAwesome6 name="camera" size={20} color={isDarkMode ? 'white' : 'black'} />
        )}
        {category === 'Other' && (
          <FontAwesome name="question" size={20} color={isDarkMode ? 'white' : 'black'} />
        )}
        {/* セレクタ */}
        <RNPickerSelect
          items={ScheduleCategoryList}
          style={{
            inputIOS: {
              backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
              padding: 8,
              width: 200,
              marginLeft: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? '#5A5A5A' : '#D7D7D7',
              color: isDarkMode ? 'white' : 'black',
            },
            inputAndroid: {
              backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
              padding: 8,
              width: 200,
              marginLeft: 8,
              borderWidth: 1,
              borderColor: isDarkMode ? '#5A5A5A' : '#D7D7D7',
              color: isDarkMode ? 'white' : 'black',
            },
          }}
          placeholder={{
            key: 'placeholder',
            label: generateI18nMessage('SCREEN.SCHEDULE.SELECT_CATEGORY'),
            value: 'placeholder',
            color: isDarkMode ? '#5A5A5A' : '#D7D7D7',
          }}
          value={category}
          onValueChange={(value: string) => {
            onChange(value);
          }}
        />
      </View>
    </View>
  );
}
