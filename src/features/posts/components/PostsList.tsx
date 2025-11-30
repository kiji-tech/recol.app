import React, { useCallback } from 'react';
import { usePosts } from '../hooks/usePosts';
import { View, Text, FlatList } from 'react-native';
import { Posts } from '../types/Posts';
import { Place, useMap } from '../../map';
import PostsItem from './PostsItem';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
  onSelect: (place: Place) => void;
  onReport: (posts: Posts) => void;
};
export default function PostsList({ onSelect, onReport }: Props) {
  // === Member ===
  const { data: postsList, refetch } = usePosts();

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // === Render ===
  if (!postsList || postsList!.length === 0) {
    return (
      <View>
        <Text>No posts found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={postsList}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex flex-col justify-start items-start"
      keyExtractor={(item: Posts) => item.uid!}
      renderItem={({ item }) => <PostsItem posts={item} onSelect={onSelect} onReport={onReport} />}
    />
  );
}
