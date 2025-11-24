import React, { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaymentPlan, Role } from '../../profile';

type MapContextType = {
  searchPlaceList: Place[];
  isSearchLoading: boolean;
  selectedPlace: Place | null;
  selectedPlaceList: Place[];
  selectedCategory: MapCategory;
  clearSelectedPlace: () => void;
  checkRateLimit: () => Promise<boolean>;
  clearRateLimitCount: () => Promise<void>;
  doTextSearch: (searchText: string) => void;
  doResearch: () => void;
  doSelectedCategory: (category: MapCategory) => void;
  doSelectedPlace: (place: Place) => void;
  doAddSelectedPlace: (place: Place) => void;
  doRemoveSelectedPlace: (place: Place) => void;
  region: Region | null;
  setRegion: (region: Region) => void;
  radius: number;
  refetchSearchPlaceList: () => void;
  isLoadingSelectedPlaceList: boolean;
};
const RATE_LIMIT_STORAGE_KEY = '@rate_limit';
const MapContext = createContext<MapContextType | null>(null);
const DEFAULT_RADIUS = 4200;

const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user, profile } = useAuth();
  const { currentRegion } = useLocation();
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<MapCategory>('selected');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedPlaceList, setSelectedPlaceList] = useState<Place[]>([]);
  const [region, setRegion] = useState<Region | null>(currentRegion);
  const [isLoadingSelectedPlaceList, setIsLoadingSelectedPlaceList] = useState<boolean>(false);
  const { editSchedule, setEditSchedule } = usePlan();
  const rateLimitMap: Record<PaymentPlan, number> = {
    Premium: 20,
    Free: 1,
    Basic: 1,
  };
  const mapSearchRateLimit = useMemo(
    () => rateLimitMap[profile?.payment_plan || 'Free'],
    [profile]
  );

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

  // === Rate Limit ===
  /**
   * レート制限カウントを取得する
   * 直近1時間で検索した件数（length）を返す
   */
  const fetchRateLimitCount = async (): Promise<number> => {
    const jsonValue = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    console.log('jsonValue', jsonValue);
    const searchDates: string[] = jsonValue != null ? JSON.parse(jsonValue) : [];

    const now = dayjs();
    const oneHourAgo = now.subtract(1, 'hour');

    // 直近1時間のデータのみにフィルタリング
    const validDates = searchDates.filter((dateStr) => {
      const date = dayjs(dateStr);
      return date.isAfter(oneHourAgo);
    });

    // フィルタリング後のデータを保存し直す（掃除）
    if (validDates.length !== searchDates.length) {
      await AsyncStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(validDates));
    }

    return validDates.length;
  };

  /**
   * レート制限カウントをクリアする
   */
  const clearRateLimitCount = async () => {
    await AsyncStorage.removeItem(RATE_LIMIT_STORAGE_KEY);
  };

  /**
   * レート制限チェック
   * @returns true: レート制限なし, false: レート制限あり
   */
  const checkRateLimit = async (): Promise<boolean> => {
    const OK = true;

    // プロフィールがない場合は実施できない
    if (!profile) return !OK;
    // User以外は制限なし
    if (!profile.isUser()) {
      return OK;
    }

    const currentCount = await fetchRateLimitCount();

    //カウントの比較
    if (currentCount >= mapSearchRateLimit) {
      return !OK;
    }

    // カウントを増やす（現在時刻を追加）
    const now = dayjs();
    const newDateStr = now.format('YYYY-MM-DD HH:mm:ss');

    const cleanJsonValue = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    if (cleanJsonValue && typeof cleanJsonValue == 'string') {
      await clearRateLimitCount();
      
    }
      console.log
    const cleanSearchDates: string[] = cleanJsonValue != null ? JSON.parse(cleanJsonValue) : [];

    const newSearchDates = [...cleanSearchDates, newDateStr];
    await AsyncStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(newSearchDates));

    return OK;
  };

  // === 検索系メソッド ===
  /**
   * 検索処理
   * @returns {Promise<Place[]>} 検索結果
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
      doSelectedPlace(placeList[0]);
    }
    return placeList;
  };

  /**
   * エリアで再検索
   * @returns {void}
   */
  const doResearch = async () => {
    refetchSearchPlaceList();
  };

  /**
   * テキスト検索 実行処理
   */
  const doTextSearch = async (searchText: string) => {
    setSelectedCategory('text');
    setSearchText(searchText);
  };

  /**
   * カテゴリ選択
   * @param category {MapCategory} 選択したカテゴリ
   * @returns {void}
   */
  const doSelectedCategory = (category: MapCategory) => {
    setSelectedCategory(category);
  };
  /**
   * 場所選択
   * @param place {Place} 選択した場所
   * @returns {void}
   */
  const doSelectedPlace = (place: Place) => {
    setRegion((prev) => {
      return {
        ...place.location,
        latitudeDelta: prev?.latitudeDelta || 0.05,
        longitudeDelta: prev?.longitudeDelta || 0.03,
      } as Region;
    });
    setSelectedPlace(place);
  };

  /**
   * スケジュールに対する場所の追加
   * @param place {Place} 選択した場所
   * @returns {void}
   */
  const doAddSelectedPlace = useCallback(
    (place: Place) => {
      setSelectedPlaceList((prev) => [...prev, place]);
      setEditSchedule({
        ...editSchedule,
        place_list: [...(editSchedule?.place_list || []), place.id],
      } as Schedule);
    },
    [editSchedule]
  );

  /**
   * スケジュールに対する場所の削除
   * @param place {Place} 選択した場所
   * @returns {void}
   */
  const doRemoveSelectedPlace = useCallback(
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
        checkRateLimit,
        clearRateLimitCount,
        doSelectedCategory,
        doSelectedPlace,
        doTextSearch,
        doResearch,
        doAddSelectedPlace,
        doRemoveSelectedPlace,
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
