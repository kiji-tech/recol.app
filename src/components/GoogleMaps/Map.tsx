import React, { useMemo } from 'react';
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import { Place } from '@/src/entities/Place';
import { LATITUDE_OFFSET } from '@/src/libs/ConstValue';

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
        latitude: region.latitude + LATITUDE_OFFSET,
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
  return (
    <Marker
      title={`✔ ${place.displayName.text}`}
      pinColor={'#B5F3C3'}
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
  onRegionChange?: (region: Region) => void;
  onSelectedPlace?: (place: Place) => void;
}) {
  // === Member ===
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

  // === Render ===
  if (!region) return null;
  return (
    <>
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
            region={region}
            radius={radius}
            fillColor="rgba(30,150,200,0.2)"
            strokeColor="#C1EBEE"
          />
        )}
        {/* ツールチップ */}
        {isCallout && <Callout tooltip={true} />}
      </MapView>
    </>
  );
}
