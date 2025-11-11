import React, { forwardRef, useImperativeHandle } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useTheme } from '../contexts/ThemeContext';

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
      snapPoints={['30%', '55%']}
      enableOverDrag={false}
      enableDynamicSizing={false}
      handleStyle={{
        backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
        borderRadius: 10,
      }}
      backgroundStyle={{
        backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode ? 'white' : '#1a1a1a',
        borderRadius: 10,
        width: 80,
        height: 4,
      }}
    >
      {children}
    </BottomSheet>
  );
});

BottomSheetLayout.displayName = 'BottomSheetLayout';

export default BottomSheetLayout;
