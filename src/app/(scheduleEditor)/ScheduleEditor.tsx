import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import DatePicker from '../../components/DatePicker';
import dayjs from '@/src/libs/dayjs';
import MapModal from '../../features/map/components/MapModal';
import { upsertSchedule } from '@/src/features/schedule';
import { useAuth } from '@/src/features/auth';
import { Schedule } from '@/src/features/schedule';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { LogUtil } from '@/src/libs/LogUtil';
import { FontAwesome5 } from '@expo/vector-icons';
import CategorySelector from '../../features/schedule/components/CategorySelector';
import { Toast } from 'toastify-react-native';
import {
  adjustEndAtWhenReversed,
  adjustStartAtWhenNormal,
} from '@/src/features/schedule/libs/scheduleTime';
import i18n from '@/src/libs/i18n';
import { useMap } from '@/src/features/map';

export default function ScheduleEditor() {
  // === Member ===
  const { plan, editSchedule, setEditSchedule } = usePlan();
  const { session, profile } = useAuth();
  const [openMapModal, setOpenMapModal] = useState(false);
  const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:00.000Z';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { refetchSearchPlaceList } = useMap();
  // === Method ===
  /**
   * スケジュールを保存する
   */
  const saveSchedule = async (updateSchedule: Schedule) => {
    await upsertSchedule(updateSchedule, session).then(async () => {
      LogUtil.log('complete update schedule', { level: 'info' });
      // 通知処理の見直し
      await NotificationUtil.upsertUserSchedule(
        editSchedule as Schedule,
        profile?.enabled_schedule_notification ?? false
      );
    });
  };

  /**
   * スケジュールの編集 イベントハンドラ
   */
  const handleScheduleSubmit = async () => {
    if (!plan || !editSchedule) return;
    setIsLoading(true);
    const updateSchedule = {
      ...editSchedule,
      from: dayjs(editSchedule.from).format(DATE_FORMAT),
      to: dayjs(editSchedule.to).format(DATE_FORMAT),
    } as Schedule;
    saveSchedule(updateSchedule)
      .then(() => {
        // プランの再取得
        router.back();
      })
      .catch((e) => {
        if (e && e.message) {
          LogUtil.log(JSON.stringify(e), { level: 'error', notify: true });
          Toast.warn(i18n.t('SCREEN.SCHEDULE.SAVE_FAILED'));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * マップから選択した場所を追加
   */
  const handleSelectedPlaceList = () => {
    setOpenMapModal(false);
  };

  /**
   * マップを表示する
   */
  const handleMapModal = () => {
    refetchSearchPlaceList();
    setOpenMapModal(true);
  };

  /**
   * 戻る イベントハンドラ
   */
  const handleBack = () => {
    router.back();
  };

  // === Effect ===
  useEffect(() => {
    if (!editSchedule) setEditSchedule({} as Schedule);
  }, []);

  // === Render ===
  if (!editSchedule) return;
  return (
    <>
      <BackgroundView>
        <Header onBack={() => handleBack()} />
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 ">
          <View className="flex flex-col gap-6 pb-8">
            <TextInput
              placeholder={i18n.t('SCREEN.SCHEDULE.TITLE_PLACEHOLDER')}
              value={editSchedule.title!}
              className={`flex flex-row justify-center rounded-xl items-center border-b-[1px] px-4 py-4 w-full text-3xl
              border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
              onChangeText={(text) => {
                setEditSchedule({
                  ...editSchedule,
                  title: text,
                } as Schedule);
              }}
              placeholderTextColor={'gray'}
            />
            {/* 日程 */}
            <View className="w-full flex flex-col justify-start items-start">
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                {i18n.t('DATA.SCHEDULE.DATETIME')}
              </Text>
              <View className={`flex flex-row justify-center items-center gap-4`}>
                <DatePicker
                  mode="datetime"
                  value={editSchedule.from ? dayjs(editSchedule.from) : dayjs()}
                  onChange={(date) => {
                    const { from, to } = adjustEndAtWhenReversed(
                      date.format(DATE_FORMAT),
                      editSchedule.to!
                    );
                    setEditSchedule({
                      ...editSchedule,
                      from,
                      to,
                    } as Schedule);
                  }}
                />
                <Text className="text-light-text dark:text-dark-text"> ― </Text>
                <DatePicker
                  mode="datetime"
                  value={
                    editSchedule.to
                      ? dayjs(editSchedule.to)
                      : dayjs(editSchedule.from).add(1, 'hour')
                  }
                  onChange={(date) => {
                    const { from, to } = adjustStartAtWhenNormal(
                      editSchedule.from!,
                      date.format(DATE_FORMAT)
                    );
                    setEditSchedule({
                      ...editSchedule,
                      from,
                      to,
                    } as Schedule);
                  }}
                />
              </View>
            </View>

            {/* カテゴリ */}
            <CategorySelector
              category={editSchedule.category || 'Other'}
              onChange={(category: string) => {
                setEditSchedule({
                  ...editSchedule,
                  category,
                } as Schedule);
              }}
            />
            {/* マップから追加する */}
            <View className="w-full flex flex-col justify-start items-start gap-4">
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                {i18n.t('DATA.SCHEDULE.PLACE_LIST')}
              </Text>
              {/* 追加ボタン */}
              <Button
                theme={'info'}
                onPress={handleMapModal}
                text={i18n.t('SCREEN.SCHEDULE.ADD_FROM_MAP')}
              />

              {/* 候補数 */}
              <View className="flex flex-row gap-2 items-center">
                <FontAwesome5 name="map-marker-alt" size={18} color="#f87171" />
                <Text className="text-light-text dark:text-dark-text">
                  {i18n
                    .t('SCREEN.SCHEDULE.CANDIDATE_COUNT')
                    .replace(
                      '#count#',
                      ((editSchedule.place_list && editSchedule.place_list!.length) || 0).toString()
                    )}
                </Text>
              </View>
            </View>

            {/* メモ */}
            <View className="w-full flex flex-col justify-start items-start">
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                {i18n.t('DATA.SCHEDULE.MEMO')}
              </Text>
              <TextInput
                value={editSchedule.description!}
                multiline={true}
                className={`rounded-xl border px-4 py-4 w-full text-lg h-48 text-start align-top 
                          border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
                onChangeText={(text) => {
                  setEditSchedule({
                    ...editSchedule,
                    description: text,
                  } as Schedule);
                }}
                autoCapitalize="none"
              />
            </View>

            {/* 保存ボタン */}
            <Button
              theme="theme"
              onPress={handleScheduleSubmit}
              text={i18n.t('COMMON.SAVE')}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </ScrollView>
      </BackgroundView>
      {/* マップモーダル */}
      {openMapModal && <MapModal isOpen={openMapModal} onClose={handleSelectedPlaceList} />}
    </>
  );
}
