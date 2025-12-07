import React, { useMemo } from 'react';
import MapView, {
  Callout,
  Circle,
  LatLng,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { useTheme } from '@/src/contexts';
import { Route } from '../types/Direction';
import { decodePolyline } from '../libs/direction';
import { Place, CurrentMarker, DefaultMarker, SelectedMarker } from '@/src/features/map';
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

/**
 * マップコンポーネント
 */
export default function Map({
  selectedPlaceList = [],
  placeList = [],
  radius,
  region,
  isMarker = false,
  isCallout = false,
  isCenterCircle = false,
  routeList = [],
  selectedStepIndex = null,
  isRealTimePosition = false,
  onSelectedPlace = () => void 0,
  onRegionChange = () => void 0,
}: {
  selectedPlaceList: Place[];
  placeList: Place[];
  radius: number;
  region: Region;
  isMarker?: boolean;
  isCallout?: boolean;
  isCenterCircle?: boolean;
  isRealTimePosition?: boolean;
  routeList?: Route[] | null;
  selectedStepIndex?: number | null;
  onSelectedPlace: (place: Place) => void;
  onRegionChange?: (region: Region) => void;
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
                    ? 'rgba(220,38,38,1)'
                    : 'rgba(248,113,113,1)'
                  : !isDarkMode
                    ? 'rgba(16,185,129,0.8)'
                    : 'rgba(34,197,94,0.8)'
              }
              strokeColor={
                isSelected
                  ? !isDarkMode
                    ? 'rgba(220,38,38,1)'
                    : 'rgba(248,113,113,1)'
                  : !isDarkMode
                    ? 'rgba(16,185,129,0.8)'
                    : 'rgba(34,197,94,0.8)'
              }
              strokeWidth={isSelected ? 8 : 6}
            />
          );
        })}

      {/* 現在地のマーカー */}
      {isRealTimePosition && <CurrentMarker />}
      {/** 選択中の場所マーカー */}
      {isMarker && (
        <>
          {selectedPlaceList.map((place) => (
            <SelectedMarker
              key={`selected-${place.id}`}
              place={place}
              onPress={() => onSelectedPlace(place)}
            />
          ))}
          {filterPlaceList.map((place) => (
            <DefaultMarker
              key={`default-${place.id}`}
              place={place}
              onPress={() => onSelectedPlace(place)}
            />
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
