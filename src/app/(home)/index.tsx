import React from 'react';
import { BackgroundView } from '@/src/components';
import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [viewCategory, setViewCategory] = useState<'new' | 'favorit'>('new');
  return (
    <SafeAreaView>
      <BackgroundView>
        <ScrollView>
          {/* 旅行ブログ */}
          <View className="flex-1 flex-row justify-between items-center w-full mt-4">
            <Text className="text-2xl font-bold">ブログ</Text>
            <View className="border-1 flex flex-row">
              <View className="px-4 py-2 bg-light-info  rounded-l-[100]">
                <Text>人気</Text>
              </View>
              <View className="px-4 py-2 rounded-r-[100]">
                <Text>新着</Text>
              </View>
            </View>
          </View>
          {/* 旅行グッズ */}
          <View className="flex-1 flex-row justify-between items-center w-full mt-4">
            <Text className="text-2xl font-bold">旅行で使えるグッズ</Text>
            <View className="border-1 flex flex-row">
              <View className="px-4 py-2 bg-light-info  rounded-l-[100]">
                <Text>人気</Text>
              </View>
              <View className="px-4 py-2 rounded-r-[100]">
                <Text>新着</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </BackgroundView>
    </SafeAreaView>
  );
}
