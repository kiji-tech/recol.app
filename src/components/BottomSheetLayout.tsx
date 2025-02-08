import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { Platform } from 'react-native';
const isIOS = Platform.OS === 'ios';

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
      {/* ISOのほうがアクションバーでより隠れるため高くする */}
      <View className={isIOS ? 'h-44' : 'h-16'}></View>
    </BottomSheet>
  );
}
