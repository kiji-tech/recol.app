import React from 'react';
import { View, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ScheduleCategoryList } from '@/src/features/schedule/types/ScheduleCategory';
import { FontAwesome6, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  category: string | null;
  onChange: (category: string) => void;
};

export default function CategorySelector({ category, onChange }: Props) {
  const { isDarkMode } = useTheme();
  return (
    <View className="w-full flex flex-col justify-start items-start">
      <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>カテゴリ</Text>
      <View className="w-full flex flex-row justify-start items-center gap-2 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-xl p-4">
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
              marginLeft: 8,
              lineHeight: 18,
            },
            inputAndroid: {
              marginLeft: 8,
              lineHeight: 18,
            },
          }}
          placeholder={{
            key: 'placeholder',
            label: 'カテゴリを選んでください…',
            value: 'placeholder',
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
