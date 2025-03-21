import React, { useRef } from 'react';
import { View, Text, Animated, PanResponder, ScrollView } from 'react-native';

export default function SampleScreen() {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  return (
    <View>
      <Text>Sample Screen</Text>
      <ScrollView>
        <View className="h-screen w-screen">
          <Animated.View
            style={{
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
          >
            <View className="w-10 h-10 bg-light-theme" />
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}
