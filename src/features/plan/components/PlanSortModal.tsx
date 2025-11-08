import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import Button from '@/src/components/Button';
import { PlanSortType, DEFAULT_PLAN_SORT_TYPE } from '../types/PlanSortType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLAN_SORT_TYPE_STORAGE_KEY } from '../types/PlanSortType';
import { LogUtil } from '@/src/libs/LogUtil';

interface PlanSortModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (sortType: PlanSortType) => void;
}

/**
 * プラン一覧の並び替えモーダルコンポーネント
 * @param {boolean} visible - モーダルの表示/非表示
 * @param {() => void} onClose - モーダルを閉じるコールバック
 * @param {(sortType: PlanSortType) => void} onSave - ソート条件を保存するコールバック
 */
export default function PlanSortModal({ visible, onClose, onSave }: PlanSortModalProps) {
  const [selectedSortType, setSelectedSortType] = useState<PlanSortType>(DEFAULT_PLAN_SORT_TYPE);

  /**
   * LocalStorageからソート条件を読み込む
   */
  const loadSortType = async () => {
    try {
      const savedSortType = await AsyncStorage.getItem(PLAN_SORT_TYPE_STORAGE_KEY);
      if (savedSortType && (savedSortType === 'created_at' || savedSortType === 'schedule_date')) {
        setSelectedSortType(savedSortType as PlanSortType);
      }
    } catch (error) {
      LogUtil.log('Failed to load sort type', {
        level: 'error',
        error: error as Error,
      });
    }
  };

  /**
   * ソート条件を保存する
   */
  const handleSave = async () => {
    onSave(selectedSortType);
  };

  /**
   * ソート条件を選択する
   * @param {PlanSortType} sortType - 選択するソート条件
   */
  const handleSelectSortType = (sortType: PlanSortType) => {
    setSelectedSortType(sortType);
  };

  useEffect(() => {
    if (visible) {
      loadSortType();
    }
  }, [visible]);

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="rounded-xl p-6 w-full max-w-sm bg-light-background dark:bg-dark-background">
            {/* タイトル */}
            <Text className="text-xl font-bold mb-6 text-light-text dark:text-dark-text">
              並び替え
            </Text>

            {/* 選択肢 */}
            <View className="mb-6">
              {/* 作成日順 */}
              <TouchableOpacity
                onPress={() => handleSelectSortType('created_at')}
                className={`mb-4 p-4 rounded-lg border-2 ${
                  selectedSortType === 'created_at'
                    ? 'border-light-primary dark:border-dark-primary '
                    : 'border-light-border dark:border-dark-border'
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedSortType === 'created_at'
                      ? 'text-light-primary dark:text-dark-primary font-bold'
                      : 'text-light-text dark:text-dark-text'
                  }`}
                >
                  作成日順（降順）
                </Text>
              </TouchableOpacity>

              {/* スケジュールの日付順 */}
              <TouchableOpacity
                onPress={() => handleSelectSortType('schedule_date')}
                className={`p-4 rounded-lg border-2 ${
                  selectedSortType === 'schedule_date'
                    ? 'border-light-primary dark:border-dark-primary '
                    : 'border-light-border dark:border-dark-border'
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedSortType === 'schedule_date'
                      ? 'text-light-primary dark:text-dark-primary font-bold'
                      : 'text-light-text dark:text-dark-text'
                  }`}
                >
                  スケジュールの日付順（降順）
                </Text>
              </TouchableOpacity>
            </View>

            {/* ボタン */}
            <View className="flex flex-row gap-4">
              <View className="flex-1">
                <Button text="キャンセル" theme="background" onPress={onClose} />
              </View>
              <View className="flex-1">
                <Button text="OK" theme="info" onPress={handleSave} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
