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
import { Route } from '../types/Direction';
import { decodePolyline } from '../libs/direction';
import CurrentMarker from './Marker/CurrentMarker';

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
  selectedStepIndex = null,
  isRealTimePosition = false,
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
  isRealTimePosition?: boolean;
  routeList?: Route[] | null;
  selectedStepIndex?: number | null;
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
    const stepPolylines: LatLng[][] = [];
    if (!routeList || routeList.length === 0) return [];
    for (const route of routeList) {
      for (const leg of route.legs) {
        for (const step of leg.steps) {
          if (step.polyline?.points) {
            const decoded = decodePolyline(step.polyline.points);
            stepPolylines.push(decoded);
          }
        }
      }
    }
    return stepPolylines;
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
      {/* 経路マーカー（Stepごと） */}
      {routeSteps.length > 0 &&
        routeSteps.map((stepPolyline: LatLng[], index: number) => {
          const isSelected = selectedStepIndex === index;
          return (
            <Polyline
              key={`step-${index}`}
              coordinates={stepPolyline}
              fillColor={
                isSelected
                  ? !isDarkMode
                    ? 'rgba(239,68,68,1)'
                    : 'rgba(248,113,113,1)'
                  : !isDarkMode
                    ? 'rgba(59,130,246,0.6)'
                    : 'rgba(96,165,250,0.6)'
              }
              strokeColor={
                isSelected
                  ? !isDarkMode
                    ? 'rgba(239,68,68,1)'
                    : 'rgba(248,113,113,1)'
                  : !isDarkMode
                    ? 'rgba(59,130,246,0.6)'
                    : 'rgba(96,165,250,0.6)'
              }
              strokeWidth={isSelected ? 10 : 6}
            />
          );
        })}

      {/* 現在地のマーカー */}
      {isRealTimePosition && <CurrentMarker />}
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
