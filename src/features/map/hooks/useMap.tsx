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
import { useLocation } from '@/src/contexts/LocationContext';
import { fetchCachePlace } from '../apis/fetchCachePlace';
import { Schedule } from '../../schedule';
import { usePlan } from '@/src/contexts/PlanContext';
import { useFocusEffect } from '@react-navigation/native';

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
  const { session } = useAuth();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('selected');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const { currentRegion } = useLocation();
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
    LogUtil.log('fetchPlaceList', { level: 'info' });
    LogUtil.log(`selectedCategory: ${selectedCategory}`, { level: 'info' });
    LogUtil.log(`region: ${JSON.stringify(region)}`, { level: 'info' });
    LogUtil.log(`searchText: ${searchText}`, { level: 'info' });
    LogUtil.log(`radius: ${radius}`, { level: 'info' });
    LogUtil.log(`isSearchLoading: ${isSearchLoading}`, { level: 'info' });
    // searchNearby or searchPlaceByText
    let placeList: Place[] = [];
    if (selectedCategory === 'selected') {
      if (editSchedule && editSchedule?.place_list) {
        setIsLoadingSelectedPlaceList(true);
        placeList = await fetchCachePlace(editSchedule?.place_list || [], session).finally(() => {
          setIsLoadingSelectedPlaceList(false);
        });
      }
    }
    if (selectedCategory === 'text') {
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
    LogUtil.log(`handleSelectedCategory: ${category}`, { level: 'info' });
    setSelectedCategory(category);
  };
  /**
   * 場所選択
   * @param place {Place} 選択した場所
   * @returns {void}
   */
  const handleSelectedPlace = (place: Place) => {
    LogUtil.log('handleSelectedPlace', { level: 'info' });
    setRegion((prev) => {
      return {
        ...(prev || {}),
        ...place.location,
        latitude: place.location.latitude,
      } as Region;
    });
    setSelectedPlace(place);
  };

  /** スケジュールに対する場所の追加 */
  const handleAddSelectedPlace = useCallback(
    (place: Place) => {
      LogUtil.log('handleAddSelectedPlace', { level: 'info' });
      setSelectedPlaceList((prev) => [...prev, place]);
      setEditSchedule({
        ...editSchedule,
        place_list: [...(editSchedule?.place_list || []), place.id],
      } as Schedule);
    },
    [editSchedule]
  );

  /** スケジュールに対する場所の削除 */
  const handleRemoveSelectedPlace = (place: Place) => {
    LogUtil.log('handleRemoveSelectedPlace', { level: 'info' });
    setSelectedPlaceList((prev) => prev.filter((p) => p.id !== place.id));
    setEditSchedule({
      ...editSchedule,
      place_list: editSchedule?.place_list?.filter((p: string) => p !== place.id) || [],
    } as Schedule);
  };

  // === Effect ===

  /**
   * 初回ロケーション情報取得処理
   */
  useFocusEffect(
    useCallback(() => {
      if (currentRegion) {
        setRegion(
          selectedPlaceList.length > 0
            ? {
                ...selectedPlaceList[0].location,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025,
              }
            : currentRegion
        );
        // fetchLocation(currentRegion.latitude, currentRegion.longitude);
      }
    }, [currentRegion, selectedPlaceList])
  );

  /**
   * スケジュールに対する場所の取得処理
   */
  useEffect(() => {
    fetchCachePlace(editSchedule?.place_list || [], session).then((data: Place[]) => {
      setSelectedPlaceList(data || []);
    });
  }, [editSchedule]);

  // === Query ===
  const {
    data: searchPlaceList = [],
    refetch: refetchSearchPlaceList,
    isLoading: isSearchLoading,
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
