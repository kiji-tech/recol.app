import React, { useEffect, useMemo, useState } from 'react';
import { CafeType, HotelsType, ParkType } from '@/src/apis/GoogleMaps';
import { Place } from '@/src/entities/Place';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import MapView, {
  Callout,
  LatLng,
  MapMarker,
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from 'react-native-maps';

const ICON_SIZE = 24;
type Props = {
  region?: Region;
  centerRegion?: Region;
  places?: Place[];
  selectedPlaces?: Place[];
  setRegion?: (region: Region) => void;
  selectPlace?: (place: Place) => void;
  selectedPlace: Place | null;
    isMarker?: boolean;
    isSearch?: boolean;
  onMarkerDeselect?: () => void;
  onPressReSearch?: () => void;
};
export default function Map({
  region,
  places,
  selectedPlaces,
  centerRegion,
  setRegion = () => void 0,
  selectPlace = () => void 0,
  onPressReSearch = () => void 0,
  onMarkerDeselect = () => void 0,
    selectedPlace,
  isSearch = false,
  isMarker = false,
}: Props) {
  const markerRef: { [id: string]: MapMarker | null } = {};
  const [searchTimer, setSearchTimer] = useState<boolean>(false);

  const reSearchTimer = () => {
    if (!searchTimer) {
      setTimeout(() => {
        setSearchTimer(true);
      }, 5000);
    }
  };

  useEffect(() => {
    reSearchTimer();
  }, []);

  useEffect(() => {
    if (selectedPlace && markerRef[selectedPlace.id] != null) {
      markerRef[selectedPlace.id]?.showCallout();
    }
  }, [selectedPlace]);

  // selectedPlacesにある場合は､placesから除外する
  const filteredPlaces = useMemo(() => {
    if (!selectedPlaces || !places) return places;
    return places.filter((place) => !selectedPlaces.some((p) => p.id === place.id));
  }, [places, selectedPlaces]);

  // ズームレベルに応じた閾値を決定する関数
  const getThresholdDistanceByZoom = (zoom: number): number => {
    // 一般的にズームレベルに応じて距離を調整する
    // ズームが低いほど大きな範囲が表示されるので閾値を大きくする
    if (zoom > 15) {
      return 0.3; // 近距離での閾値 (ズームイン時、500m)
    } else if (zoom > 10) {
      return 1; // 中距離での閾値 (ズーム中、2km)
    } else {
      return 3; // 遠距離での閾値 (ズームアウト時、10km)
    }
  };

  const isResearched = useMemo(() => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (centerRegion!.latitude - region!.latitude) * (Math.PI / 180);
    const dLon = (centerRegion!.longitude - region!.longitude) * (Math.PI / 180);

    if (!region || !centerRegion) return false;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(region!.latitude * (Math.PI / 180)) *
        Math.cos(centerRegion!.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    reSearchTimer();
    return distance > getThresholdDistanceByZoom(Math.log2(360 / region!.latitudeDelta)); // 距離をキロメートルで返す
  }, [region, centerRegion]);

  return (
    <>
      <MapView
        style={{ height: '100%', width: '100%', flex: 1, borderRadius: 10 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={(region, { isGesture }) => {
          if (isGesture) setRegion(region);
        }}
      >
        {filteredPlaces?.map((place: Place) => {
          return (
            <Marker
              key={place.id}
              ref={(ref) => {
                markerRef[place.id] = ref;
              }}
              title={place.displayName.text}
              onPress={() => selectPlace(place)}
              coordinate={{ ...place.location }}
            ></Marker>
          );
        })}
        {selectedPlaces?.map((place: Place) => {
          return (
            <Marker
              key={place.id}
              ref={(ref) => {
                markerRef[place.id] = ref;
              }}
              title={place.displayName.text}
              onPress={() => selectPlace(place)}
              coordinate={{ ...place.location }}
            ></Marker>
          );
        })}
        <Callout tooltip={true} />
      </MapView>
      {/* 再検索ボタン */}
      {isSearch && (isResearched || searchTimer) && (
        <View className="w-full absolute top-36">
          <TouchableOpacity
            className="w-4/6 py-2 px-4 mt-2 mx-auto rounded-xl  bg-light-background dark:bg-dark-background"
            onPress={() => {
              setSearchTimer(false);
              reSearchTimer();
              onPressReSearch();
            }}
          >
            <Text className="text-center text-lg text-light-text dark:text-dark-text">
              エリアで再度検索する
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
