import React, { useCallback, useState } from 'react';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Marker, Region } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';
import Geolocation from '@react-native-community/geolocation';
/**
 * 現在地のマーカー
 */
export default function CurrentMarker() {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { isDarkMode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const id = Geolocation.watchPosition(
        (position) => {
          console.log({ position });
          const { latitude, longitude } = position.coords;
          setCurrentRegion({ latitude, longitude } as Region);
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10,
        }
      );
      setWatchId(id);

      return () => {
        if (watchId) {
          Geolocation.clearWatch(watchId);
        }
      };
    }, [])
  );

  if (!currentRegion) return null;

  return (
    <Marker
      coordinate={currentRegion}
      title="現在地"
      pinColor={!isDarkMode ? '#3B82F6' : '#60A5FA'}
    />
  );
}
