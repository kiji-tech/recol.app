import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { Posts, usePosts, PostsItem } from '@/src/features/posts';
import { Place } from '@/src/features/map';

type Props = {
  onSelect: (place: Place) => void;
  onReport: (posts: Posts) => void;
};
export default function PostsList({ onSelect, onReport }: Props) {
  // === Member ===
  const { posts, reset, fetchPosts, isLoading, deleteMutate } = usePosts();

  // === Handler ===
  const handleDelete = (posts: Posts) => {
    deleteMutate.mutate(posts);
    reset();
  };

  // === Effect ===
  useEffect(() => {
    fetchPosts();
  }, []);

  // === Render ===
  if (!posts || posts!.length === 0) {
    return (
      <View>
        <Text className="text-center text-light-text dark:text-dark-text">No posts found</Text>
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
      onRefresh={async () => {
        await reset();
      }}
      onEndReached={() => fetchPosts()}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        <View className="flex flex-col justify-center items-center my-8 w-screen">
          <ActivityIndicator />
        </View>
      }
    />
  );
}
