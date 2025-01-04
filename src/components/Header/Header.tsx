import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackButton from './BackButton';

type Props = {
  title?: string;
  onBack?: Function | null;
  onSearch?: null | ((text: string) => void);
  rightComponent?: React.ReactNode;
};

export default function Header({
  title,
  onBack = null,
  onSearch = null,
  rightComponent = null,
}: Props) {
  const [searchText, setSearchText] = useState<string>('');
  return (
    <View className="w-full h-12 flex flex-row items-center justify-between gap-4">
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
          className={`flex-1 flex-row justify-start rounded-xl items-center px-4 py-2 bg-light-background dark:bg-dark-background `}
        >
          {/* TODO ダークモードのときの色変更 */}
          <MaterialIcons className={`opacity-30`} name="search" size={24} color="#25292e" />
          <TextInput
            defaultValue={searchText}
            onChangeText={(n) => setSearchText(n)}
            placeholder="検索"
            onBlur={() => onSearch(searchText)}
            returnKeyType="search"
            className={`w-full rounded-xl text-m text-light-text dark:text-dark-text`}
          />
        </View>
      )}
      <View>{rightComponent}</View>
    </View>
  );
}
