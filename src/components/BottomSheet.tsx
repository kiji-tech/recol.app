import { useMemo, useRef } from 'react';
import { View, Text, useWindowDimensions, Dimensions } from 'react-native';
import { Gesture, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function BottomSheet() {
  const scrollRef = useRef(null);
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const translationY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const bottomSheetHeight = useMemo(() => {
    return {
      height: translationY.value * -1 - 100 - 64,
    };
  }, [translationY]);
  const gesture = Gesture.Pan()
    .onStart(() => {
      console.log(translationY.value);
      context.value.y = translationY.value;
    })
    .onUpdate((event) => {
      translationY.value = event.translationY + context.value.y;
      translationY.value = Math.max(translationY.value, (SCREEN_HEIGHT - 200) * -1);
    })
    .onEnd((event) => {
      context.value.y = translationY.value;
      console.log(translationY.value);
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translationY.value }],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[{ top: SCREEN_HEIGHT - 200, height: SCREEN_HEIGHT }, rBottomSheetStyle]}
        className={`absolute w-screen rounded-3xl bg-light-background dark:bg-dark-background`}
      >
        <View className="flex justify-start items-center w-full">
          {/* バー */}
          <View
            className={`w-40 m-4 border-[3px] rounded-xl border-light-info dark:border-dark-info`}
          ></View>
          {/* タイトル */}
          <View className="flex justify-start items-start p-4 flex-row w-full border-b border-light-border dark:border-dark-border">
            <Text className="font-bold text-3xl">title</Text>
          </View>
        </View>
        {/* コンテナ */}
        <View>
          <Animated.ScrollView
            ref={scrollRef}
            contentContainerClassName={'flex flex-grow'}
            bounces={true}
          >
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-dark-info">
              <Text>content</Text>
            </View>
            <View className="w-full p-8 flex-1 justify-start items-start flex-col bg-light-info">
              <Text>content</Text>
            </View>
          </Animated.ScrollView>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
