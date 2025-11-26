import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import DatePicker from '../../components/DatePicker';
import dayjs from '@/src/libs/dayjs';
import MapModal from '../../features/map/components/MapModal';
import { upsertSchedule } from '@/src/features/schedule';
import { useAuth } from '@/src/features/auth';
import useImagePicker from '@/src/features/media/hooks/useImagePicker';
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
import generateI18nMessage from '@/src/libs/i18n';
import { useMap } from '@/src/features/map';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Image } from 'expo-image';
import { Media } from '@/src/features/media';

export default function ScheduleEditor() {
  const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:00.000Z';
  // === Member ===
  const { plan, editSchedule, setEditSchedule } = usePlan();
  const { session, profile, user } = useAuth();
  const [openMapModal, setOpenMapModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { refetchSearchPlaceList } = useMap();
  const { selectImageList } = useImagePicker();
  const { isDarkMode } = useTheme();
  // === Method ===
  /**
   * スケジュールを保存する
   */
  const saveSchedule = async (updateSchedule: Schedule) => {
    await upsertSchedule(updateSchedule, session).then(async () => {
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
      place_list: editSchedule.place_list?.filter((place) => place !== null),
    } as Schedule;
    saveSchedule(updateSchedule)
      .then(() => {
        // プランの再取得
        router.back();
      })
      .catch((e) => {
        if (e && e.message) {
          LogUtil.log(JSON.stringify({ saveScheduleError: e }), {
            level: 'error',
            notify: true,
            user,
          });
          Toast.warn(generateI18nMessage('SCREEN.SCHEDULE.SAVE_FAILED'));
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  /**
   * メディアを追加
   */
  const handleAddMedia = async () => {
    LogUtil.log(JSON.stringify('handleAddMedia START'), {
      level: 'info',
    });
    const result: ImagePicker.ImagePickerAsset[] = await selectImageList();
    const addMediaList = result.map(
      (media: ImagePicker.ImagePickerAsset) =>
        new Media({ uid: media.assetId, url: media.uri } as Media)
    );
    setEditSchedule({
      ...editSchedule,
      media_list: [...editSchedule!.media_list, ...addMediaList],
    } as Schedule);
  };

  const handleDeleteMedia = () => {};

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
              placeholder={generateI18nMessage('SCREEN.SCHEDULE.TITLE_PLACEHOLDER')}
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
                {generateI18nMessage('DATA.SCHEDULE.DATETIME')}
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
                {generateI18nMessage('DATA.SCHEDULE.PLACE_LIST')}
              </Text>
              {/* 追加ボタン */}
              <Button
                theme={'info'}
                onPress={handleMapModal}
                text={generateI18nMessage('SCREEN.SCHEDULE.ADD_FROM_MAP')}
              />

              {/* 候補数 */}
              <View className="flex flex-row gap-2 items-center">
                <FontAwesome5 name="map-marker-alt" size={18} color="#f87171" />
                <Text className="text-light-text dark:text-dark-text">
                  {generateI18nMessage('SCREEN.SCHEDULE.CANDIDATE_COUNT', [
                    {
                      key: 'count',
                      value: (
                        (editSchedule.place_list &&
                          editSchedule.place_list.filter((place) => place !== null).length) ||
                        0
                      ).toString(),
                    },
                  ])}
                </Text>
              </View>
            </View>

            {/* メディア */}
            <View className="w-full flex flex-col justify-start items-start gap-2">
              <View className="flex flex-row justify-start items-center">
                <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                  {generateI18nMessage('SCREEN.SCHEDULE.MEDIA_LIST')}(
                  {editSchedule.media_list?.length})
                </Text>
                {/* +ボタン */}
                <TouchableOpacity
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-light-background dark:bg-dark-background"
                  onPress={handleAddMedia}
                >
                  <FontAwesome5 name="plus" size={12} color={isDarkMode ? 'white' : 'black'} />
                </TouchableOpacity>
              </View>
              {/* 登録している一覧 */}
              <FlatList
                data={editSchedule?.media_list}
                horizontal={true}
                contentContainerClassName="gap-4"
                renderItem={({ item }) => {
                  return (
                    <View className="w-32 h-32 rounded-xl border border-light-border dark:border-dark-border">
                      <Image
                        source={item.url}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>

            {/* メモ */}
            <View className="w-full flex flex-col justify-start items-start">
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                {generateI18nMessage('DATA.SCHEDULE.MEMO')}
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
              text={generateI18nMessage('COMMON.SAVE')}
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
