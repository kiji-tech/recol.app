import React from 'react';
import { View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useTheme } from '@/src/contexts/ThemeContext';
import generateI18nMessage from '@/src/libs/i18n';
import { useAuth } from '../../auth';
import { Posts } from '../types/Posts';

type Props = {
  posts: Posts;
  onDelete: () => void;
  onReport: () => void;
};
export default function PostsMenu({ posts, onDelete, onReport }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { profile } = useAuth();

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
        {profile?.uid === posts.user_id && (
          <MenuOption
            customStyles={{
              optionText: {
                paddingVertical: 12,
                paddingHorizontal: 8,
                color: 'black',
              },
            }}
            onSelect={onDelete}
            text={generateI18nMessage('COMMON.DELETE')}
          />
        )}
        {profile?.uid !== posts.user_id && (
          <MenuOption
            customStyles={{
              optionText: {
                paddingVertical: 12,
                paddingHorizontal: 8,
                color: 'black',
              },
            }}
            onSelect={onReport}
            text={generateI18nMessage('COMPONENT.POSTS.REPORT')}
          />
        )}
      </MenuOptions>
    </Menu>
  );
}
