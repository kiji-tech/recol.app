import React from 'react';
import ToastManager, { Toast } from 'toastify-react-native';

import { BackgroundView, Button } from '@/src/components';

export default function SampleScreen() {
  const handle = async () => {
    Toast.warn('Warning message!');
  };

  return (
    <BackgroundView>
      <ToastManager />
      <Button text="handler" onPress={handle} />
    </BackgroundView>
  );
}
