import React, { forwardRef, useImperativeHandle } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { Platform } from 'react-native';
const isIOS = Platform.OS === 'ios';

type Props = {
  children: React.ReactNode;
};
const BottomSheetLayout = forwardRef(({ children }: Props, ref) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  if (ref) {
    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
      expand: () => bottomSheetRef.current?.expand(),
    }));
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['20%', '40%', '85%']}
      enableOverDrag={false}
      enableDynamicSizing={false}
    >
      {children}
      {/* ISOのほうがアクションバーでより隠れるため高くする */}
      <View className={isIOS ? 'h-[92px]' : 'h-[102px]'}></View>
      {/* {isIOS && <View className="h-[92px]"></View>} */}
    </BottomSheet>
  );
});

BottomSheetLayout.displayName = 'BottomSheetLayout';

export default BottomSheetLayout;
