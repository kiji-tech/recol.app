import React, { forwardRef, useImperativeHandle } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
const isIOS = Platform.OS === 'ios';

type Props = {
  children: React.ReactNode;
};
const BottomSheetLayout = forwardRef(({ children }: Props, ref) => {
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const { isDarkMode } = useTheme();

  if (ref) {
    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
      expand: () => bottomSheetRef.current?.expand(),
    }));
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['20%', '40%', '75%']}
      enableOverDrag={false}
      enableDynamicSizing={false}
      handleStyle={{
        backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
        borderRadius: 100,
      }}
      backgroundStyle={{
        backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? 'white' : '#1a1a1a',
        borderRadius: 10,
        width: 64,
        height: 4,
      }}
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
