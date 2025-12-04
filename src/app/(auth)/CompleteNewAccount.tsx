import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { BackgroundView } from '@/src/components';
import { Image } from 'expo-image';
import { useTheme } from '@/src/contexts/ThemeContext';
import generateI18nMessage from '@/src/libs/i18n';

// パーティクルコンポーネント
const Particle = ({ delay, position }: { delay: number; position: { x: number; y: number } }) => {
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 2000 + delay * 500,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 2000 + delay * 500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const particles = ['✨', '🌟', '💫', '⭐', '🎊', '🎉'];
  const randomParticle = particles[Math.floor(Math.random() * particles.length)];

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -30],
            }),
          },
          {
            scale: animValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.5, 1.2, 0.8],
            }),
          },
        ],
      }}
    >
      <Text className="text-lg">{randomParticle}</Text>
    </Animated.View>
  );
};

export default function CompleteNewAccount() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));
  const [slideAnim] = useState(new Animated.Value(50));
  const [bounceAnim] = useState(new Animated.Value(0));

  // === Effect ===
  useEffect(() => {
    // フェードインアニメーション
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // スケールアニメーション
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // スライドアニメーション
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // バウンスアニメーション（お祝いアイコン用）
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // === Method ===
  const handleGetStarted = () => {
    router.replace('/(auth)/SignIn');
  };

  // パーティクルの位置を生成
  const particles = Array.from({ length: 12 }, (_, i) => ({
    delay: i * 0.2,
    position: {
      x: Math.random() * 300 + 50,
      y: Math.random() * 600 + 100,
    },
  }));

  return (
    <BackgroundView>
      <View className="flex-1 items-center justify-center p-6">
        {/* パーティクル効果 */}
        {particles.map((particle, index) => (
          <Particle key={index} delay={particle.delay} position={particle.position} />
        ))}

        {/* メインコンテンツ */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center"
        >
          {/* お祝いアイコン */}
          <Animated.View
            style={{
              transform: [
                {
                  translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }),
                },
              ],
            }}
            className="mb-8"
          >
            <Text className="text-8xl mb-4">🎉</Text>
            <Text className="text-6xl mb-2">✨</Text>
            <Text className="text-4xl">🌟</Text>
          </Animated.View>

          {/* アプリアイコン */}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
            }}
            className="mb-6"
          >
            <Image
              cachePolicy="memory-disk"
              source={{
                uri: './assets/images/icon.png',
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: isDarkMode ? '#6366f1' : '#8b5cf6',
                shadowColor: isDarkMode ? '#6366f1' : '#8b5cf6',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            />
          </Animated.View>

          {/* メッセージ */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="items-center mb-8"
          >
            <Text className="text-3xl font-bold text-center text-light-text dark:text-dark-text mb-4">
              {generateI18nMessage('FEATURE.AUTH.CONGRATULATIONS')}
            </Text>
            <Text className="text-xl text-center text-light-text dark:text-dark-text mb-2">
              {generateI18nMessage('FEATURE.AUTH.WELCOME')}
            </Text>
            <Text className="text-base text-center text-gray-600 dark:text-gray-400 leading-6">
              {generateI18nMessage('FEATURE.AUTH.GREAT_TRIP')}
            </Text>
          </Animated.View>

          {/* 祝福メッセージ */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 mb-8 w-full border border-purple-200 dark:border-purple-700"
          >
            <Text className="text-center text-lg font-medium text-purple-800 dark:text-purple-200 mb-2">
              {generateI18nMessage('FEATURE.AUTH.REGISTRATION_COMPLETE')}
            </Text>
            <Text className="text-center text-sm text-purple-700 dark:text-purple-300">
              {generateI18nMessage('FEATURE.AUTH.EXPERIENCE_STARTS')}
            </Text>
          </Animated.View>

          {/* ボタン */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            className="w-full"
          >
            <Button
              title={generateI18nMessage('FEATURE.AUTH.GET_STARTED')}
              onPress={handleGetStarted}
            />
          </Animated.View>
        </Animated.View>

        {/* 装飾要素 */}
        <View className="absolute top-20 left-8">
          <Text className="text-2xl opacity-30">🎈</Text>
        </View>
        <View className="absolute top-32 right-10">
          <Text className="text-xl opacity-40">🎊</Text>
        </View>
        <View className="absolute bottom-40 left-12">
          <Text className="text-lg opacity-35">✨</Text>
        </View>
        <View className="absolute bottom-32 right-8">
          <Text className="text-xl opacity-30">🎉</Text>
        </View>
      </View>
    </BackgroundView>
  );
}
