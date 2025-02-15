import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from './BackButton';
import { useTheme } from '@/src/contexts/ThemeContext';

type Props = {
  title?: string;
  onBack?: null | (() => void);
  onSearch?: null | ((text: string) => void);
  rightComponent?: React.ReactNode;
};

export default function Header({
  title,
  onBack = null,
  onSearch = null,
  rightComponent = null,
}: Props) {
  const { isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState<string>('');
  return (
    <View className="w-full h-12 flex flex-row items-center justify-between gap-4 mt-4">
      {/* 戻るボタン */}
      {onBack && <BackButton onPress={() => onBack()} />}
      {/* タイトル */}
      {!onSearch && (
        <Text className="flex-1 text-center text-light-text dark:text-dark-text font-bold text-xl">
          {title}
        </Text>
      )}
      {/* 検索バー */}
      {onSearch && (
        <View
          className={`flex-1 flex-row justify-start items-center  rounded-xl px-4 mx-2 py-2 bg-light-background dark:bg-dark-background `}
        >
          {/* TODO ダークモードのときの色変更 */}
          <MaterialIcons
            className={`opacity-30 pr-2`}
            name="search"
            size={24}
            color={isDarkMode ? 'white' : 'black'}
          />
          <TextInput
            defaultValue={searchText}
            onChangeText={(n) => setSearchText(n)}
            placeholder="検索"
            onBlur={() => onSearch(searchText)}
            returnKeyType="search"
            placeholderTextColor={isDarkMode ? 'gray' : 'black'}
            className={`w-full rounded-xl text-m 
                        border-light-border dark:border-dark-border
                        text-light-text dark:text-dark-text`}
          />
        </View>
      )}
      <View>{rightComponent}</View>
    </View>
  );
}
