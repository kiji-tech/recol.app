import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Loading, BackgroundView } from '@/src/components';
import { Article } from '@/src/entities/Article';
import { fetchBlogList } from '@/src/libs/ApiService';
import { useFocusEffect } from 'expo-router';
import { MenuTrigger, Menu, MenuOption, MenuOptions } from 'react-native-popup-menu';
import { useTheme } from '@/src/contexts/ThemeContext';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
export default function SampleScreen() {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const { isDarkMode } = useTheme();
  useFocusEffect(
    useCallback(() => {
      fetchBlogList().then((blogs) => {
        setBlogs(blogs);
      });
    }, [])
  );

  if (!blogs) return <Loading />;

  return (
    <BackgroundView>
      <Menu>
        <MenuTrigger>
          <View className="w-10 h-10 bg-light-theme dark:bg-dark-theme rounded-full flex flex-row items-center justify-center">
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
              width: 140,
            },
          }}
        >
          <MenuOption
            text="プラン編集"
            customStyles={{
              optionText: {
                padding: 4,
              },
            }}
            onSelect={() => {
              console.log('プラン編集');
            }}
          />
          <MenuOption
            text="スケジュール追加"
            customStyles={{
              optionText: {
                padding: 4,
              },
            }}
            onSelect={() => {
              console.log('プラン編集');
            }}
          />
        </MenuOptions>
      </Menu>
    </BackgroundView>
  );
}
