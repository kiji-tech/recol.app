import React, { useMemo } from 'react';
import MapView, {
  Callout,
  Circle,
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { Place } from '@/src/features/map/types/Place';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useLocation } from '@/src/contexts/LocationContext';
import { Route } from '../types/Direction';

/** センターサークル */
const CenterCircle = ({
  region,
  radius,
  fillColor = 'rgba(30,150,200,0.2)',
  strokeColor = '#C1EBEE',
}: {
  region: Region | null;
  radius: number;
  fillColor: string;
  strokeColor: string;
}) => {
  if (!region) return null;
  return (
    <Circle
      center={{
        latitude: region.latitude,
        longitude: region.longitude,
      }}
      radius={radius}
      fillColor={fillColor}
      strokeColor={strokeColor}
    />
  );
};

/** 選択中の場所マーカー */
const SelectedMarker = ({
  place,
  onPress = () => void 0,
}: {
  place: Place;
  onPress?: () => void;
}) => {
  const { isDarkMode } = useTheme();
  return (
    <Marker
      title={`✔ ${place.displayName.text}`}
      pinColor={!isDarkMode ? '#B5F3C3' : '#17AC38'}
      coordinate={place.location}
      onPress={onPress}
    ></Marker>
  );
};

/** デフォルトのマーカー */
const DefaultMarker = ({
  place,
  onPress = () => void 0,
}: {
  place: Place;
  onPress?: () => void;
}) => {
  return <Marker coordinate={place.location} title={place.displayName.text} onPress={onPress} />;
};

/**
 * 現在地のマーカー
 */
const CurrentMarker = () => {
  const { currentRegion } = useLocation();
  const { isDarkMode } = useTheme();
  if (!currentRegion) return null;

  return (
    <Marker
      coordinate={currentRegion}
      title="現在地"
      pinColor={!isDarkMode ? '#3B82F6' : '#60A5FA'}
    />
  );
};

/**
 * マップコンポーネント
 */
export default function Map({
  radius,
  region,
  placeList = [],
  selectedPlaceList = [],
  isMarker = false,
  isCallout = false,
  isCenterCircle = false,
  routeList = [],
  onRegionChange = () => void 0,
  onSelectedPlace = () => void 0,
}: {
  radius: number;
  region: Region | null;
  placeList?: Place[];
  selectedPlaceList?: Place[];
  isMarker?: boolean;
  isCallout?: boolean;
  isCenterCircle?: boolean;
  routeList?: Route[] | null;
  onRegionChange?: (region: Region) => void;
  onSelectedPlace?: (place: Place) => void;
}) {
  // === Member ===
  const { isDarkMode } = useTheme();
  const filterPlaceList = useMemo(() => {
    if (!selectedPlaceList || !placeList) return placeList;
    return placeList.filter((place) => !selectedPlaceList.some((p) => p.id === place.id));
  }, [placeList, selectedPlaceList]);

  // === Method ===
  /** マップ移動 */
  const handleChangeRegion = (region: Region, isGesture: boolean) => {
    if (isGesture) onRegionChange(region);
  };

  // === Effect ===

  // === Member ===
  const routeSteps = useMemo(() => {
    const r: LatLng[][] = [];
    if (!routeList || routeList.length === 0) return [[]];
    for (const route of routeList) {
      const stepList: { lat: number; lng: number }[] = [];
      for (const leg of route.legs) {
        const startStep = leg.start_location;
        stepList.push(startStep);
        for (const step of leg.steps) {
          const endStep = step.end_location;
          stepList.push(endStep);
        }
        const endStep = leg.end_location;
        stepList.push(endStep);
      }
      r.push(stepList.map((step) => ({ latitude: step.lat, longitude: step.lng })));
    }
    return r;
  }, [routeList]);

  // === Render ===
  if (!region) return null;
  return (
    <MapView
      style={{
        height: '100%',
        width: '100%',
        flex: 1,
      }}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      region={region}
      onRegionChangeComplete={(r, { isGesture }) => {
        handleChangeRegion(r, isGesture || false);
      }}
    >
      {/* 経路マーカー */}
      {routeSteps.length > 0 &&
        routeSteps.map((route: LatLng[], index: number) => {
          const opacity = index != 0 ? 0.5 : 1;
          return (
            <Polyline
              key={`route-${index}`}
              coordinates={route}
              fillColor={
                !isDarkMode ? `rgba(59,130,246,${opacity})` : `rgba(96,165,250,${opacity})`
              }
              strokeWidth={6}
            />
          );
        })}

      {/* 現在地のマーカー */}
      <CurrentMarker />

      {/** 選択中の場所マーカー */}
      {isMarker && (
        <>
          {selectedPlaceList.map((place) => (
            <SelectedMarker key={place.id} place={place} onPress={() => onSelectedPlace(place)} />
          ))}
          {filterPlaceList.map((place) => (
            <DefaultMarker key={place.id} place={place} onPress={() => onSelectedPlace(place)} />
          ))}
        </>
      )}

      {/* センターサークル */}
      {isCenterCircle && (
        <CenterCircle
          region={{ ...region, latitude: region.latitude }}
          radius={radius}
          fillColor="rgba(30,150,200,0.2)"
          strokeColor="#C1EBEE"
        />
      )}
      {/* ツールチップ */}
      {isCallout && <Callout tooltip={true} />}
    </MapView>
  );
}
