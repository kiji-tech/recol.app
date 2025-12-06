import React from 'react';
import { View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '@/src/contexts';
import { Place } from '@/src/features/map';
import { useAuth } from '@/src/features/auth';
import { Posts } from '@/src/features/posts/types/Posts';
import { useShare } from '@/src/features/commons/hooks/useShare';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  posts: Posts;
  place: Place;
  onDelete: () => void;
  onReport: () => void;
};
export default function PostsMenu({ posts, place, onDelete, onReport }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { profile } = useAuth();
  const { sharePosts } = useShare();

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
            sharePosts(posts, place);
          }}
          text="Share"
        />
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
            text={generateI18nMessage('FEATURE.POSTS.REPORT')}
          />
        )}
      </MenuOptions>
    </Menu>
  );
}
