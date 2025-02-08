import React, { useCallback, useImperativeHandle, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

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

  const handleSheetChange = useCallback((index: number) => {
    console.log('handleSheetChange', index);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      style={{
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 16,
        marginTop: 64,
      }}
      onChange={handleSheetChange}
      snapPoints={['20%', '50%', '90%']}
      enableDynamicSizing={true}
    >
      {children}
    </BottomSheet>
  );
}
