import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Region } from 'react-native-maps';
import Header from '../Header/Header';

type MapSearchBarProps = {
  radius: number;
  region: Region;
  currentRegion: Region;
  isSearch: boolean;
  onSearch: (text: string) => void;
  onBack: () => void;
};
export default function MapSearchBar({
  radius,
  region,
  currentRegion,
  isSearch = false,
  onSearch = () => void 0,
  onBack = () => void 0,
}: MapSearchBarProps) {
  // === Member ===
  const [searchTimer, setSearchTimer] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  /** 再描画ボタン表示のまでの時間計測 */
  const reSearchTimer = () => {
    if (!searchTimer) {
      setTimeout(() => {
        setSearchTimer(true);
      }, 5000);
    }
  };

  /** 再検索の範囲 */
  const isResearched = useMemo(() => {
    if (!region || !currentRegion) return false;
    const R = 6371; // 地球の半径 (km)
    const dLat = (currentRegion!.latitude - region!.latitude) * (Math.PI / 180);
    const dLon = (currentRegion!.longitude - region!.longitude) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(region!.latitude * (Math.PI / 180)) *
        Math.cos(region!.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    reSearchTimer();
    return distance > radius; // 距離をキロメートルで返す
  }, [region, currentRegion]);

  return (
    <>
      <View className="w-full absolute top-0 pl-4 z-50">
        <View className="flex flex-col justify-center items-center w-full">
          {/* 検索ヘッダー */}
          <Header
            onBack={onBack}
            onSearch={(text: string) => {
              setSearchText(text);
              onSearch(text);
            }}
          />
        </View>
      </View>
      {/* 再検索ボタン */}
      <View className="w-full absolute top-20">
        {isSearch && (isResearched || searchTimer) && (
          <TouchableOpacity
            className="w-1/2 py-2 px-4 mt-2 mx-auto rounded-xl  bg-light-background dark:bg-dark-background"
            onPress={() => onSearch(searchText)}
          >
            <Text className="text-center text-md text-light-text dark:text-dark-text">
              エリアで再度検索する
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
