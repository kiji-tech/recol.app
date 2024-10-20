import React, { useMemo } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';

type Props = {
  region?: Region;
  centerRegion?: Region;
  places?: any;
  setRegion?: (region: Region) => void;
  selectPlace?: (place: any) => void;
  selectedPlace?: any;
  isMarker?: boolean;
  onPressReSearch?: () => void;
};
export default function Map({
  region,
  places,
  centerRegion,
  setRegion = () => void 0,
    selectPlace = () => void 0,
  onPressReSearch = () => void 0,
  selectedPlace,
  isMarker = false,
}: Props) {
  // ズームレベルに応じた閾値を決定する関数
  const getThresholdDistanceByZoom = (zoom: number): number => {
    // 一般的にズームレベルに応じて距離を調整する
    // ズームが低いほど大きな範囲が表示されるので閾値を大きくする
    if (zoom > 15) {
      return 0.5; // 近距離での閾値 (ズームイン時、500m)
    } else if (zoom > 10) {
      return 2; // 中距離での閾値 (ズーム中、2km)
    } else {
      return 10; // 遠距離での閾値 (ズームアウト時、10km)
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
    console.log({
      distance,
      log: Math.log2(360 / region!.latitudeDelta),
      flag: distance > getThresholdDistanceByZoom(Math.log2(360 / region!.latitudeDelta)),
    });
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
        {places?.map((place: any) => {
          return (
            <Marker
              key={place.id}
              onPress={() => selectPlace(place)}
              coordinate={{ ...place.location }}
            >
              {place && place.types && place.types.findIndex((t: any) => t == 'cafe') >= 0 && (
                <Image
                  source={require('@/assets/images/mapicons/cafe.png')}
                  style={{ width: 40, height: 40 }}
                />
              )}
              {place && place.types && place.types.findIndex((t: any) => t == 'hotel') >= 0 && (
                <Image
                  source={require('@/assets/images/mapicons/hotel.png')}
                  style={{ width: 40, height: 40 }}
                />
              )}
            </Marker>
          );
        })}
      </MapView>
      {isResearched && (
        <View className="w-full absolute top-0 left-0">
          <TouchableOpacity
            className="w-4/6 py-2 px-4 mt-2 mx-auto rounded-xl  bg-light-background dark:bg-dark-background"
            onPress={onPressReSearch}
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
