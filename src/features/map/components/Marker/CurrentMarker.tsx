import React, { useCallback, useRef, useState } from 'react';
import { Marker, Region } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';
import { useTheme, useLocation } from '@/src/contexts';
import { LogUtil } from '@/src/libs/LogUtil';
import Geolocation from '@react-native-community/geolocation';
/**
 * 現在地のマーカー
 */
export default function CurrentMarker() {
  const { currentRegion } = useLocation();
  const [watchRegion, setWatchRegion] = useState<Region | null>(currentRegion || null);
  const watchIdRef = useRef<number | null>(null);
  const { isDarkMode } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const id = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setWatchRegion((prev) => {
            return {
              ...(prev || {}),
              ...{ latitude, longitude },
            } as Region;
          });
        },
        (error) => LogUtil.log(JSON.stringify({ error }), { level: 'warn' })
      );
      watchIdRef.current = id;

      return () => {
        if (watchIdRef.current !== null) {
          Geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
      };
    }, [])
  );

  if (!watchRegion || !currentRegion) return null;

  return (
    <Marker
      coordinate={watchRegion || currentRegion}
      title="現在地"
      pinColor={!isDarkMode ? '#3B82F6' : '#60A5FA'}
    />
  );
}
