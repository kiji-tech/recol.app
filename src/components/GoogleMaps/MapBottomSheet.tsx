import React, { useCallback, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { LayoutChangeEvent, useWindowDimensions, Text, View } from 'react-native';

export default function MapBottomSheet() {
  const ref = useRef<BottomSheet>(null);
  const { height: windowHeight } = useWindowDimensions();
  const [bottomInset, setBottomInset] = useState(0);
  const handleContentLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setBottomInset((windowHeight - layout.height) / 2);
    },
    [windowHeight]
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      style={{ borderWidth: 0.5, borderColor: 'gray', borderRadius: 16 }}
      onChange={handleSheetChanges}
      snapPoints={['10%', '50%', '90%']}
    >
      <BottomSheetView
        // onLayout={handleContentLayout}
        className="flex-1 items-start justify-start h-full w-full py-4"
      >
        <Text>ammant</Text>
      </BottomSheetView>
    </BottomSheet>
  );
}
