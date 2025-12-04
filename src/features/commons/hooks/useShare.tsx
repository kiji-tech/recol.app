import Share from 'react-native-share';
import { Posts } from '@/src/features/posts/types/Posts';
import { Place } from '@/src/features/map/types/Place';
import { Platform } from 'react-native';
import { useAuth } from '../../auth';

export const useShare = () => {
  // === Member ===
  const { profile } = useAuth();

  // === Method ===
  const generatePostsMessage = (posts: Posts, place: Place) => {
    const message = `【Re:CoL】\n${posts.body}\n\n--- ${place.displayName.text} ---\n${place.googleMapsUri}\n\n${process.env.EXPO_PUBLIC_IOS_STORE}\n${process.env.EXPO_PUBLIC_ANDROID_STORE}`;
    return message;
  };

  const generateMyPostsMessage = (posts: Posts, place: Place) => {
    const message = `【Re:CoL】\n${posts.body}\n\n--- ${place.displayName.text} ---\n${place.googleMapsUri}\n\n${process.env.EXPO_PUBLIC_IOS_STORE}\n${process.env.EXPO_PUBLIC_ANDROID_STORE}`;
    return message;
  };

  /**
   * 投稿を共有する
   * @param posts {Posts} 投稿
   * @param place {Place} お店
   */
  const sharePosts = async (posts: Posts, place: Place) => {
    const message = profile?.isMyPosts(posts)
      ? generateMyPostsMessage(posts, place)
      : generatePostsMessage(posts, place);

    // 共有オプション
    const shareOptions = {
      title: 'Re:CoL',
      message,
    };
    await Share.open(shareOptions);
  };

  /**
   * アプリを共有する
   */
  const shereApplication = async () => {
    // 共有オプション
    const shareOptions = {
      title: 'Re:CoL',
      message:
        'カフェ行きたいってなったとき、候補がたくさんあってまとめるのがめんどいってことありませんか？\nRe:CoLなら、お店をまとめて紐づけることができるので楽ちん！\n詳しくはリンクから！\n\n${process.env.EXPO_PUBLIC_IOS_STORE}\n${process.env.EXPO_PUBLIC_ANDROID_STORE}',
    };

    await Share.open(shareOptions);
  };

  return { sharePosts, shereApplication };
};
