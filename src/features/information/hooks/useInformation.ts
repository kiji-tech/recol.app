import { useCallback, useEffect, useState } from 'react';
import { Information, fetchInformationList } from '@/src/features/information';
import { LogUtil } from '@/src/libs/LogUtil';
import { useAuth } from '@/src/features/auth/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INFORMATION_VIEWED_IDS_KEY = '@information_viewed_ids';

/**
 * お知らせ管理用のカスタムフック
 */
export const useInformation = () => {
  const { user } = useAuth();
  const [informationList, setInformationList] = useState<Information[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  /**
   * 表示済みお知らせID一覧を取得
   * @return {Promise<string[]>} 表示済みお知らせIDの配列
   */
  const getViewedIdList = async (): Promise<string[]> => {
    try {
      const viewedIdsJson = await AsyncStorage.getItem(INFORMATION_VIEWED_IDS_KEY);
      if (viewedIdsJson) {
        return JSON.parse(viewedIdsJson) as string[];
      }
      return [];
    } catch (error) {
      LogUtil.log(JSON.stringify({ getViewedIdListError: error }), {
        level: 'error',
        notify: true,
        user,
      });
      return [];
    }
  };

  /**
   * 表示済みお知らせIDを保存
   * @param {string[]} viewedIdList - 表示済みお知らせIDの配列
   */
  const setViewedIdList = async (viewedIdList: string[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(INFORMATION_VIEWED_IDS_KEY, JSON.stringify(viewedIdList));
    } catch (error) {
      LogUtil.log(JSON.stringify({ setViewedIdListError: error }), {
        level: 'error',
        notify: true,
        user,
      });
    }
  };

  /**
   * 有効期間内のお知らせをフィルタリング
   * API側でendAtが今日を過ぎているものは既に除外されているため、startAtのみチェック
   * @param {Information[]} infoList - お知らせ一覧
   * @return {Information[]} 有効期間内のお知らせ一覧
   */
  const filterValidInformations = useCallback((infoList: Information[]): Information[] => {
    const now = new Date();

    return infoList.filter((info) => {
      const startAt = new Date(info.startAt);

      // startAtが現在日時以降でない場合は除外
      if (startAt > now) {
        return false;
      }

      return true;
    });
  }, []);

  /**
   * 未表示のお知らせを抽出
   * @param {Information[]} validInformationList - 有効期間内のお知らせ一覧
   * @param {string[]} viewedIdList - 表示済みお知らせIDの配列
   * @return {Information[]} 未表示のお知らせ一覧
   */
  const filterUnviewedInformations = useCallback(
    (validInformationList: Information[], viewedIdList: string[]): Information[] => {
      return validInformationList.filter((info) => !viewedIdList.includes(info.id));
    },
    []
  );

  /**
   * お知らせ一覧を取得
   */
  const fetchInformations = useCallback(async () => {
    setLoading(true);
    try {
      const infoList = await fetchInformationList();

      // 有効期間内のお知らせをフィルタリング（startAtのみチェック、API側でendAtは既に除外済み）
      const validInformationList = filterValidInformations(infoList);

      // 表示済みIDを取得
      const viewedIdList = await getViewedIdList();

      // 未表示のお知らせを抽出
      const unviewedInformationList = filterUnviewedInformations(
        validInformationList,
        viewedIdList
      );

      setInformationList(unviewedInformationList);

      // 未表示のお知らせがある場合、モーダルを表示
      if (unviewedInformationList.length > 0) {
        setCurrentIndex(0);
        setIsModalVisible(true);
      }
    } catch (error) {
      LogUtil.log(JSON.stringify({ fetchInformationsError: error }), {
        level: 'error',
        notify: true,
        user,
      });
    } finally {
      setLoading(false);
    }
  }, [filterValidInformations, filterUnviewedInformations]);

  /**
   * モーダルを閉じる
   */
  const handleCloseModal = useCallback(async () => {
    const currentInfo = informationList[currentIndex];
    if (currentInfo) {
      // 表示済みIDを取得して追加
      const viewedIdList = await getViewedIdList();
      if (!viewedIdList.includes(currentInfo.id)) {
        viewedIdList.push(currentInfo.id);
        await setViewedIdList(viewedIdList);
      }

      // 次のお知らせがある場合は表示
      if (currentIndex < informationList.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // すべて表示した場合はモーダルを閉じる
        setIsModalVisible(false);
        setCurrentIndex(0);
      }
    }
  }, [currentIndex, informationList]);

  /**
   * 現在表示中のお知らせを取得
   * @return {Information | null} 現在表示中のお知らせ
   */
  const getCurrentInformation = (): Information | null => {
    if (informationList.length === 0 || currentIndex >= informationList.length) {
      return null;
    }
    const targetInformation = informationList[currentIndex];
    if (targetInformation.isNotification == false) {
      setCurrentIndex(currentIndex + 1);
      return null;
    }
    return targetInformation;
  };

  useEffect(() => {
    fetchInformations();
  }, [fetchInformations]);

  return {
    informationList,
    currentInformation: getCurrentInformation(),
    loading,
    isModalVisible,
    setIsModalVisible,
    handleCloseModal,
    fetchInformations,
  };
};
