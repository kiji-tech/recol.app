import React, { useCallback, useEffect } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { searchPlaceByText } from '../libs/searchPlaceByText';
import { useAuth } from '@/src/features/auth';
import { Place } from '../types/Place';
import { searchNearby } from '../libs/searchNearby';
import { LogUtil } from '@/src/libs/LogUtil';
import { MapCategory } from '../types/MapCategory';
import { Region } from 'react-native-maps';
import { fetchCachePlace } from '../apis/fetchCachePlace';
import { Schedule } from '../../schedule';
import { usePlan } from '@/src/contexts/PlanContext';
import { useLocation } from '@/src/contexts/LocationContext';

type MapContextType = {
  searchPlaceList: Place[];
  isSearchLoading: boolean;
  selectedPlace: Place | null;
  selectedPlaceList: Place[];
  selectedCategory: MapCategory;
  clearSelectedPlace: () => void;
  handleTextSearch: (searchText: string) => void;
  handleResearch: () => void;
  handleSelectedCategory: (category: MapCategory) => void;
  handleSelectedPlace: (place: Place) => void;
  handleAddSelectedPlace: (place: Place) => void;
  handleRemoveSelectedPlace: (place: Place) => void;
  region: Region | null;
  setRegion: (region: Region) => void;
  radius: number;
  refetchSearchPlaceList: () => void;
  isLoadingSelectedPlaceList: boolean;
};

const MapContext = createContext<MapContextType | null>(null);
const DEFAULT_RADIUS = 4200;

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user } = useAuth();
  const { currentRegion } = useLocation();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('selected');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>([]);
  const [region, setRegion] = useState<Region | null>(currentRegion);
  const { editSchedule, setEditSchedule } = usePlan();
  const [isLoadingSelectedPlaceList, setIsLoadingSelectedPlaceList] = useState<boolean>(false);

  /** Map上の半径の計算 */
  const radius = useMemo(() => {
    if (!region) return 0;
    return DEFAULT_RADIUS * region!.longitudeDelta * 10;
  }, [region]);

  // === Method ===
  /**
   * 選択した場所をクリアする
   */
  const clearSelectedPlace = () => {
    setSelectedPlace(null);
  };

  // === 検索系メソッド ===
  /**
   * 検索処理
   */
  const fetchPlaceList = async (): Promise<Place[]> => {
    LogUtil.log('fetchPlaceList', { level: 'info', user });
    LogUtil.log(JSON.stringify({ selectedCategory: selectedCategory }), { level: 'info', user });
    LogUtil.log(JSON.stringify({ region: region }), { level: 'info', user });
    LogUtil.log(JSON.stringify({ searchText: searchText }), { level: 'info', user });
    LogUtil.log(JSON.stringify({ radius: radius }), { level: 'info', user });
    LogUtil.log(JSON.stringify({ isSearchLoading: isSearchLoading }), { level: 'info', user });
    // searchNearby or searchPlaceByText
    let placeList: Place[] = [];
    if (selectedCategory === 'selected') {
      if (editSchedule && editSchedule?.place_list) {
        setIsLoadingSelectedPlaceList(true);
        placeList = await fetchCachePlace(editSchedule?.place_list || [], session).finally(() => {
          setIsLoadingSelectedPlaceList(false);
        });
      }
    } else if (selectedCategory === 'text') {
      placeList = await searchPlaceByText(
        session,
        region?.latitude || 0,
        region?.longitude || 0,
        searchText,
        radius
      );
    } else {
      placeList = await searchNearby(
        session,
        region?.latitude || 0,
        region?.longitude || 0,
        selectedCategory,
        radius
      );
    }
    if (placeList.length > 0) {
      handleSelectedPlace(placeList[0]);
    }
    return placeList;
  };

  /**
   * エリアで再検索
   */
  const handleResearch = async () => {
    refetchSearchPlaceList();
  };

  /**
   * テキスト検索 実行処理
   */
  const handleTextSearch = async (searchText: string) => {
    setSelectedCategory('text');
    setSearchText(searchText);
  };

  /**
   * カテゴリ選択
   * @param category {MapCategory} 選択したカテゴリ
   * @returns {void}
   */
  const handleSelectedCategory = (category: MapCategory) => {
    setSelectedCategory(category);
  };
  /**
   * 場所選択
   * @param place {Place} 選択した場所
   * @returns {void}
   */
  const handleSelectedPlace = (place: Place) => {
    setRegion((prev) => {
      return {
        ...place.location,
        latitudeDelta: prev?.latitudeDelta || 0.05,
        longitudeDelta: prev?.longitudeDelta || 0.03,
      } as Region;
    });
    setSelectedPlace(place);
  };

  /** スケジュールに対する場所の追加 */
  const handleAddSelectedPlace = useCallback(
    (place: Place) => {
      setSelectedPlaceList((prev) => [...prev, place]);
      setEditSchedule({
        ...editSchedule,
        place_list: [...(editSchedule?.place_list || []), place.id],
      } as Schedule);
    },
    [editSchedule]
  );

  /** スケジュールに対する場所の削除 */
  const handleRemoveSelectedPlace = useCallback(
    (place: Place) => {
      setSelectedPlaceList((prev) => prev.filter((p) => p.id !== place.id));
      setEditSchedule({
        ...editSchedule,
        place_list: editSchedule?.place_list?.filter((p: string) => p !== place.id) || [],
      } as Schedule);
    },
    [editSchedule]
  );

  // === Effect ===

  /**
   * スケジュールに対する場所の取得処理
   */
  useEffect(() => {
    fetchCachePlace(editSchedule?.place_list || [], session).then((data: Place[]) => {
      setSelectedPlaceList(data || []);
      //   if (data.length > 0) {
      //     setRegion((prev) => {
      //       return {
      //         ...(prev || {}),
      //         ...data[0].location,
      //         latitudeDelta: prev?.latitudeDelta || 0.05,
      //         longitudeDelta: prev?.longitudeDelta || 0.03,
      //       } as Region;
      //     });
      //   }
    });
  }, [editSchedule]);

  // === Query ===
  const {
    data: searchPlaceList = [],
    refetch: refetchSearchPlaceList,
    isFetching: isSearchLoading,
  } = useQuery({
    queryKey: ['searchPlaceList', selectedCategory, searchText, editSchedule?.uid],
    queryFn: () => fetchPlaceList(),
  });

  return (
    <MapContext.Provider
      value={{
        searchPlaceList,
        isSearchLoading,
        selectedCategory,
        selectedPlace,
        selectedPlaceList,
        clearSelectedPlace,
        handleSelectedCategory,
        handleSelectedPlace,
        handleTextSearch,
        handleResearch,
        handleAddSelectedPlace,
        handleRemoveSelectedPlace,
        region,
        setRegion,
        radius,
        refetchSearchPlaceList,
        isLoadingSelectedPlaceList,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMaps must be used within a MapProvider');
  }
  return context;
};

export { MapProvider, useMap };
