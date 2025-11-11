import React, { useCallback, useState } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Marker, Region } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';
import Geolocation from '@react-native-community/geolocation';
import { useLocation } from '@/src/contexts/LocationContext';
/**
 * 現在地のマーカー
 */
export default function CurrentMarker() {
  const { currentRegion } = useLocation();
  const [watchRegion, setWatchRegion] = useState<Region>(currentRegion!);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { isDarkMode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const id = Geolocation.watchPosition(
        (position) => {
          console.log({ position });
          const { latitude, longitude } = position.coords;
          setWatchRegion((prev) => {
            return {
              ...(prev || {}),
              ...{ latitude, longitude },
            } as Region;
          });
        },
        (error) => console.log(error)
      );
      setWatchId(id);

      return () => {
        if (watchId) {
          Geolocation.clearWatch(watchId);
        }
      };
    }, [])
  );

  return (
    <Marker
      coordinate={watchRegion}
      title="現在地"
      pinColor={!isDarkMode ? '#3B82F6' : '#60A5FA'}
    />
  );
}
