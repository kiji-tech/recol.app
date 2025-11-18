import React, { useCallback, useContext } from 'react';
import * as Location from 'expo-location';
import { createContext, useState } from 'react';
import { Region } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';
import { LogUtil } from '../libs/LogUtil';
import { useAuth } from '../features/auth';

type LocationContextType = {
  currentRegion: Region | null;
  setCurrentRegion: (region: Region) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [permission, requestPermission] = Location.useForegroundPermissions();
  if (permission == null) {
    requestPermission();
  }
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

  // === Member ===
  /**
   * 現在位置を取得
   */
  const getCurrentPosition = useCallback(async () => {
    LogUtil.log(JSON.stringify({ getCurrentPosition: { currentRegion } }), {
      level: 'info',
      user,
    });
    try {
      const location = await Location.getCurrentPositionAsync({});
      if (!location) return;
      setCurrentRegion((prev) => {
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: prev?.latitudeDelta || 0.05,
          longitudeDelta: prev?.longitudeDelta || 0.03,
        } as Region;
      });
    } catch (error) {
      LogUtil.log(JSON.stringify({ getCurrentPositionError: error }), { level: 'error', user });
    }
  }, [currentRegion, user]);

  // === Effect ===
  useFocusEffect(
    useCallback(() => {
      if (permission?.status === 'granted') {
        getCurrentPosition();
      }
    }, [permission])
  );

  return (
    <LocationContext.Provider value={{ currentRegion, setCurrentRegion }}>
      {children}
    </LocationContext.Provider>
  );
};

const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export { LocationProvider, useLocation };
