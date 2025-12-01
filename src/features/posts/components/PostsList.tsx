import React from 'react';
import { usePosts } from '../hooks/usePosts';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Posts } from '../types/Posts';
import { Place } from '../../map/types/Place';
import PostsItem from './PostsItem';

type Props = {
  onSelect: (place: Place) => void;
  onReport: (posts: Posts) => void;
};
export default function PostsList({ onSelect, onReport }: Props) {
  // === Member ===
  const { posts, reset, refetch, isLoading, deleteMutate } = usePosts();

  // === Handler ===
  const handleDelete = (posts: Posts) => {
    deleteMutate.mutate(posts);
    reset();
  };

  // === Render ===
  if (!posts || posts!.length === 0) {
    return (
      <View>
        <Text>No posts found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex flex-col justify-start items-start"
      keyExtractor={(item: Posts) => item.uid!}
      renderItem={({ item }) => (
        <PostsItem posts={item} onSelect={onSelect} onDelete={handleDelete} onReport={onReport} />
      )}
      refreshing={isLoading}
      onRefresh={() => reset()}
      onEndReached={() => refetch()}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        <View className="flex flex-col justify-center items-center my-8 w-screen">
          <ActivityIndicator />
        </View>
      }
    />
  );
}
