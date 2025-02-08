import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { View } from 'react-native';

type Props = {
  ref?: any;
  children: React.ReactNode;
};
export default function BottomSheetLayout({ ref, children }: Props) {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  if (ref) {
    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    }));
  }

  return (
    <BottomSheet
      ref={ref}
      style={{
        borderRadius: 16,
        marginTop: 64,
        backgroundColor: 'black',
      }}
      snapPoints={['20%', '50%', '90%']}
      enableDynamicSizing={true}
    >
      {children}
      {/* IOSのみ,一番下がアクションバーに隠れるので高さ調整 */}
      <View className="h-48"></View>
    </BottomSheet>
  );
}
