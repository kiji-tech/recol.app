import React, { useEffect, useState } from 'react';
import { Image, ScrollView, useWindowDimensions } from 'react-native';
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
      </ScrollView>
    </BackgroundView>
  );
}
