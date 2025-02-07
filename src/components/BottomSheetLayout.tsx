import React, { useCallback, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

type Props = {
  children: React.ReactNode;
};
export default function BottomSheetLayout({ children }: Props) {
  const ref = useRef<BottomSheet>(null);

  return (
    <BottomSheet
        ref={ref}
        style={{
            borderWidth: 0.5,
            borderColor: 'gray',
            borderRadius: 16,
        }}
        snapPoints={['10%', '50%', '90%']}
    >
        <BottomSheetView className="flex-1 items-start justify-start py-4">
            {children}
        </BottomSheetView>
    </BottomSheet>
  );
}
