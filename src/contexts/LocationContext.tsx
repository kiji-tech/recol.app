import React, { useCallback, useContext } from 'react';
import * as Location from 'expo-location';
import { createContext, useState } from 'react';
import { Region } from 'react-native-maps';
import { useFocusEffect } from 'expo-router';

type LocationContextType = {
  currentRegion: Region | null;
  setCurrentRegion: (region: Region) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [permission, requestPermission] = Location.useForegroundPermissions();
  if (permission == null) {
    requestPermission();
  }
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);

  // === Member ===
  /**
   * 現在位置を取得
   */
  const getCurrentPosition = async () => {
    console.log('current location get');
    const location = await Location.getCurrentPositionAsync({}).catch((error) => {
      console.log('current location get error', error);
    });
    if (!location) return;
    setCurrentRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.03,
    });
  };

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
