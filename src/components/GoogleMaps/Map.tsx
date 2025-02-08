import React, { useEffect, useMemo, useState } from 'react';
import { Place } from '@/src/entities/Place';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, {
  Callout,
  MapMarker,
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from 'react-native-maps';
import Header from '../Header/Header';
import Loading from '../Loading';
import { searchNearby, searchPlaceByText } from '@/src/apis/GoogleMaps';
import { usePlan } from '@/src/contexts/PlanContext';
import MapBottomSheet from './BottomSheet/MapBottomSheet';
import { MapCategory } from '@/src/entities/MapCategory';

/**
 * GoogleMap Component
 *
 * @param selectedPlace {Place | null} 選択中のロケーション情報
 * @param selectedPlaceList {Place[] | undefined} 選択中のロケーション情報リスト
 * @param isSearch {boolean | undefined} 検索機能の有無
 * @param isMarker {boolean | undefined} マーカーの有無
 * @param onSelectPlace {(place: Place) => void} 選択中のロケーション情報変更イベント
 * @param onMarkerDeselect {() => void} マーカー選択解除イベント
 */
type Props = {
  selectedPlace: Place | null;
  selectedPlaceList?: Place[];
  isSearch?: boolean;
  isMarker?: boolean;
  onSelectPlace?: (place: Place) => void;
  onMarkerDeselect?: () => void;
  onAdd?: (place: Place) => void;
  onRemove?: (place: Place) => void;
  onBack?: () => void;
};
export default function Map({
  selectedPlace,
  selectedPlaceList,
  isSearch = false,
  isMarker = false,
  onMarkerDeselect = () => void 0,
  onSelectPlace = () => void 0,
  onAdd = () => void 0,
  onRemove = () => void 0,
  onBack = () => void 0,
}: Props) {
  const markerRef: { [id: string]: MapMarker | null } = {};
  const { plan } = usePlan();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 検索結果の再描画ボタン表示までの時間
  const [searchTimer, setSearchTimer] = useState<boolean>(false);
  // 選択中のカテゴリ（meal, hotel, spot, selected）
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('meal');
  const [isCoords, setIsCoords] = useState<Region>({
    ...JSON.parse(plan!.locations![0]),
    latitudeDelta: 0.05,
    longitudeDelta: 0.03,
  });
  const [centerCords, setCenterCords] = useState<Region>({
    ...JSON.parse(plan!.locations![0]),
    latitudeDelta: 0.01,
    longitudeDelta: 0.03,
  });

  // === Method ===
  /** ロケーション情報設定処理 */
  const settingPlaces = (places: Place[]) => {
    if (!places || places.length == 0) {
      alert('検索結果がありません.');
      return;
    }
    setPlaces(places);
    onSelectPlace(places[0]);
  };

  /** 座標のロケーション情報取得 */
  const fetchLocation = async (latitude: number, longitude: number) => {
    if (selectedCategory === 'selected') return;
    setIsLoading(true);
    try {
      const response = await searchNearby(latitude, longitude, selectedCategory);
      settingPlaces(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** 再描画ボタン表示のまでの時間計測 */
  const reSearchTimer = () => {
    if (!searchTimer) {
      setTimeout(() => {
        setSearchTimer(true);
      }, 5000);
    }
  };

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

  /** テキスト検索 実行処理 */
  const handleTextSearch = async (searchText: string) => {
    setIsLoading(true);
    try {
      const response = await searchPlaceByText(
        isCoords?.latitude || 0,
        isCoords?.longitude || 0,
        searchText
      );
      settingPlaces(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** ロケーションを選択したときのイベントハンドラ */
  const handleSelectedPlace = (place: Place) => {
    setIsCoords((prev) => {
      return {
        ...prev,
        ...place.location,
      } as Region;
    });
    onSelectPlace(place);
  };

  /** 再検索 実行処理 */
  const handleResearch = async () => {
    setIsLoading(true);
    setSearchTimer(false);
    try {
      await fetchLocation(isCoords.latitude, isCoords.longitude);
      setCenterCords(isCoords);
      reSearchTimer();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /** スポット表示カテゴリの変更 */
  const handleSelectedCategory = (id: MapCategory) => {
    setSelectedCategory(id);
  };

  // ==== Memo ====
  /** 検索範囲の計算 */
  const isResearched = useMemo(() => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (centerCords!.latitude - isCoords!.latitude) * (Math.PI / 180);
    const dLon = (centerCords!.longitude - isCoords!.longitude) * (Math.PI / 180);

    if (!isCoords || !centerCords) return false;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(isCoords!.latitude * (Math.PI / 180)) *
        Math.cos(centerCords!.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    reSearchTimer();
    return distance > getThresholdDistanceByZoom(Math.log2(360 / isCoords!.latitudeDelta)); // 距離をキロメートルで返す
  }, [isCoords, centerCords]);
  // 選択中のロケーションのみ表示
  const isOnlySelected = useMemo(() => selectedCategory === 'selected', [selectedCategory]);

  // selectedPlaceListにある場合は､placesから除外する
  const filteredPlaces = useMemo(() => {
    if (!selectedPlaceList || !places) return places;
    return places.filter((place) => !selectedPlaceList.some((p) => p.id === place.id));
  }, [places, selectedPlaceList]);

  // === Effect ===
  useEffect(() => {
    if (isCoords) fetchLocation(isCoords.latitude, isCoords.longitude);
    reSearchTimer();
  }, []);
  useEffect(() => {
    if (selectedPlace && markerRef[selectedPlace.id] != null) {
      markerRef[selectedPlace.id]?.showCallout();
    }
  }, [selectedPlace]);

  /** カテゴリが変更されたら､そのカテゴリだけのロケーションを検索する */
  useEffect(() => {
    if (selectedCategory === 'selected') return;
    fetchLocation(isCoords.latitude, isCoords.longitude);
  }, [selectedCategory]);

  return (
    <>
      <MapView
        style={{ height: '100%', width: '100%', flex: 1, position: 'absolute', top: 0, left: 0 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={isCoords}
        region={isCoords}
        onRegionChangeComplete={(region, { isGesture }) => {
          if (isGesture)
            setIsCoords((prev) => {
              return { ...prev, ...region };
            });
        }}
      >
        {!isOnlySelected &&
          filteredPlaces?.map((place: Place) => {
            return (
              <Marker
                key={place.id}
                ref={(ref) => {
                  markerRef[place.id] = ref;
                }}
                title={place.displayName.text}
                onPress={() => handleSelectedPlace(place)}
                coordinate={{ ...place.location }}
              ></Marker>
            );
          })}
        {/* 選択中のPlace */}
        {selectedPlaceList?.map((place: Place) => {
          return (
            <Marker
              key={place.id}
              ref={(ref) => {
                markerRef[place.id] = ref;
              }}
              pinColor={'#B5F3C3'}
              title={`✔ ${place.displayName.text}`}
              onPress={() => handleSelectedPlace(place)}
              coordinate={{ ...place.location }}
            ></Marker>
          );
        })}
        <Callout tooltip={true} />
      </MapView>
      {/* 検索関係 */}
      <View className="w-full absolute top-0 pl-4">
        <View className="flex flex-col justify-center items-center w-full">
          {/* 検索ヘッダー */}
          {isSearch && (
            <Header onBack={onBack} onSearch={(text: string) => handleTextSearch(text)} />
          )}
        </View>
      </View>
      {/* 再検索ボタン */}
      <View className="w-full absolute top-20">
        {isSearch && (isResearched || searchTimer) && (
          <TouchableOpacity
            className="w-1/2 py-2 px-4 mt-2 mx-auto rounded-xl  bg-light-background dark:bg-dark-background"
            onPress={handleResearch}
          >
            <Text className="text-center text-md text-light-text dark:text-dark-text">
              エリアで再度検索する
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {places.length > 0 && (
        <MapBottomSheet
          placeList={places}
          selectedPlaceList={selectedPlaceList || []}
          selectedCategory={selectedCategory}
          isSelected={isOnlySelected}
          onAdd={onAdd}
          onRemove={onRemove}
          onSelectedPlace={handleSelectedPlace}
          onSelectedCategory={handleSelectedCategory}
        />
      )}
      {isLoading && <Loading />}
    </>
  );
}
