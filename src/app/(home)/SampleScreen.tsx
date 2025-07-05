import React from 'react';
import { View } from 'react-native';

import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { BackgroundView, Button } from '@/src/components';

export default function SampleScreen() {
  const handleNotificationList = async () => {
    NotificationUtil.fetchAllScheduleNotification();
  };

  return (
    <BackgroundView>
      <Button text="Notification List" onPress={handleNotificationList} />
    </BackgroundView>
  );
}
