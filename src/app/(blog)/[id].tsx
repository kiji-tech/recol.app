import React, { useEffect, useState } from 'react';
import {
  Text,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackgroundView, Header, Loading } from '@/src/components';
import { fetchBlog } from '@/src/libs/ApiService';
import { Blog } from '@/src/entities/Blog';
import RenderHtml from 'react-native-render-html';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function BlogScreen() {
  const router = useRouter();
  const { textColor } = useTheme();
  // urlパラメータから､BlogのIDを取得する
  const { id } = useLocalSearchParams() as { id: string };
  const [blog, setBlog] = useState<Blog | null>(null);

  const { width: screenWidth } = useWindowDimensions();
  const horizontalPadding = 16; // ScrollView の padding と合わせる
  const contentWidth = screenWidth - horizontalPadding * 2;

  useEffect(() => {
    fetchBlog(id)
      .then((blog) => {
        console.log({ blog });
        setBlog(blog);
      })
      .catch((e) => console.error(e));
  }, []);

  const openShopUrl = (shopUrl: string) => {
    Linking.openURL(shopUrl).catch((err) => console.error('URLを開けませんでした:', err));
  };

  if (!blog) return <Loading />;

  return (
    <BackgroundView>
      <Header title={blog.title} onBack={() => router.back()} />
      <ScrollView>
        {blog.eyecatch?.url && (
          <Image
            source={{ uri: blog.eyecatch.url }}
            style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
          />
        )}

        {/* body は microCMS から html 文字列で返る想定 */}
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: blog.content }}
          renderersProps={{
            /* img タグの width="100%" 指定を有効化 */
            img: { enableExperimentalPercentWidth: true },
          }}
          tagsStyles={{
            p: { marginBottom: 12, fontSize: 16, lineHeight: 24, color: textColor },
            h2: { color: textColor },
            h3: { color: textColor },
            li: { color: textColor },
            ul: { color: textColor },
            ol: { color: textColor },
            img: { width: '100', height: 'auto', borderRadius: 8 }, // 横幅は必ず100%
          }}
        />
        <View className="flex-row mt-2 gap-4 justify-center">
          {blog.amazonUrl && (
            <TouchableOpacity
              onPress={() => openShopUrl(blog.amazonUrl!)}
              className="bg-[#FF9900] rounded-md px-2 py-2 mr-1 flex-row items-center justify-center flex-1 max-w-52"
            >
              <Text className="text-dark-text text-md font-bold">Amazon</Text>
            </TouchableOpacity>
          )}
          {blog.rakutenUrl && (
            <TouchableOpacity
              onPress={() => openShopUrl(blog.rakutenUrl!)}
              className="bg-[#BF0000] rounded-md px-2 py-2 flex-row items-center justify-center flex-1 max-w-52"
            >
              <Text className="text-dark-text text-md font-bold">楽天</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </BackgroundView>
  );
}
