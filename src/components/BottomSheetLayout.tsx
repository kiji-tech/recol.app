import React, { forwardRef, useImperativeHandle } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { Platform } from 'react-native';
const isIOS = Platform.OS === 'ios';

type Props = {
  ref?: any;
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
      enableOverDrag={false}
      ref={bottomSheetRef}
      style={{
        borderRadius: 16,
        marginTop: 64,
        backgroundColor: 'black',
      }}
      snapPoints={['20%', '50%']}
      enableDynamicSizing={true}
    >
      {children}
      {/* ISOのほうがアクションバーでより隠れるため高くする */}
      <View className={isIOS ? 'h-44' : 'h-16'}></View>
    </BottomSheet>
  );
});

export default BottomSheetLayout;
