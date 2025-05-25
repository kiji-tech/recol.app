import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { fetchBlogList } from '@/src/libs/ApiService';
import { BackgroundView, Loading } from '@/src/components';
import { Blog } from '@/src/entities/Article';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function SampleScreen() {
  const router = useRouter();
  const { textColor } = useTheme();

  const [blogs, setBlogs] = useState<Blog[]>([]);

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
      <FlatList
        data={blogs}
        keyExtractor={(item: Blog) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ flexDirection: 'row', marginBottom: 16 }}
            onPress={() => router.push(`/(blog)/${item.id}`)}
          >
            {item.eyecatch?.url && (
              <Image
                source={{ uri: item.eyecatch.url }}
                style={{ width: 120, height: 96, borderRadius: 8, marginRight: 12 }}
              />
            )}
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: textColor }}>
                {item.title}
              </Text>
              <Text style={{ color: textColor, marginTop: 4 }}>
                {new Date(item.publishedAt).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </BackgroundView>
  );
}
