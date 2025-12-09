import React, { useState } from 'react';
import { Button, ModalLayout } from '@/src/components';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Posts } from '../types/Posts';
import { useTheme } from '@/src/contexts';
import { FontAwesome5 } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import { PostsReportCategory, PostsReport } from '../types/PostsReport';
import { useAuth } from '../../auth';
import { createPostsReport } from '../apis/createPostsReport';
import { useMutation } from 'react-query';
import generateI18nMessage from '@/src/libs/i18n';

type Props = {
  posts: Posts;
  isOpen: boolean;
  onClose: () => void;
};

const REPORT_REASONS: { id: PostsReportCategory; label: string }[] = [
  {
    id: 'Inappropriate',
    label: generateI18nMessage('FEATURE.POSTS.INAPPROPRIATE_CONTENT'),
  },
  { id: 'Offensive', label: generateI18nMessage('FEATURE.POSTS.OFFENSIVE_CONTENT') },
  { id: 'Privacy', label: generateI18nMessage('FEATURE.POSTS.PRIVACY_VIOLATION') },
  { id: 'Other', label: generateI18nMessage('FEATURE.POSTS.OTHER') },
];

export default function PostsReportModal({ isOpen, onClose, posts }: Props) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const { profile, session } = useAuth();
  const [selectedReason, setSelectedReason] = useState<PostsReportCategory | null>(null);
  const [details, setDetails] = useState('');

  // === Handler ===
  /**
   * 投稿を報告する
   */
  const handleReport = async () => {
    if (!selectedReason) return;
    const postsReport = new PostsReport({
      posts_id: posts.uid,
      category_id: selectedReason,
      body: details,
      user_id: profile?.uid || null,
    } as PostsReport);

    await createPostsReport(postsReport, session);

    setTimeout(() => {
      setSelectedReason(null);
      setDetails('');
    }, 300);
  };

  // === Mutate ===
  const { mutate, isLoading } = useMutation({
    mutationFn: handleReport,
    onSuccess: () => {
      onClose();
      Toast.success(generateI18nMessage('COMMON.SEND_SUCCESS'));
    },
    onError: () => {
      Toast.error(generateI18nMessage('COMMON.SEND_FAILURE'));
    },
  });

  // === Render ===
  return (
    <ModalLayout
      size="half"
      visible={isOpen}
      onClose={onClose}
      rightComponent={
        <Button
          text={generateI18nMessage('COMMON.SEND')}
          disabled={!selectedReason}
          theme="theme"
          size="fit"
          onPress={mutate}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-4">
          <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
            {generateI18nMessage('FEATURE.POSTS.REASON_MESSAGE')}
          </Text>

          <View className="flex-col gap-3 mb-6">
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                disabled={isLoading}
                key={reason.id}
                onPress={() => setSelectedReason(reason.id)}
                className={`flex-row items-center justify-between p-4 rounded-xl border ${
                  selectedReason === reason.id
                    ? 'border-light-primary dark:border-dark-primary bg-light-primary/10 dark:bg-dark-primary/10'
                    : 'border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background'
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedReason === reason.id
                      ? 'text-light-primary dark:text-dark-primary font-bold'
                      : 'text-light-text dark:text-dark-text'
                  }`}
                >
                  {reason.label}
                </Text>
                {selectedReason === reason.id && (
                  <FontAwesome5
                    name="check-circle"
                    size={20}
                    color={isDarkMode ? '#A5F3FC' : '#0891B2'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {selectedReason === 'Other' && (
            <View className="mb-4">
              <Text className="text-sm text-light-text dark:text-dark-text mb-2 font-bold">
                {generateI18nMessage('FEATURE.POSTS.DETAIL')}
              </Text>
              <TextInput
                className="p-4 rounded-xl bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border text-light-text dark:text-dark-text min-h-[160px]"
                multiline
                placeholder={generateI18nMessage('FEATURE.POSTS.DETAIL_PLACEHOLDER')}
                placeholderTextColor="gray"
                value={details}
                onChangeText={setDetails}
                textAlignVertical="top"
                numberOfLines={6}
                editable={!isLoading}
              />
            </View>
          )}
          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </ModalLayout>
  );
}
