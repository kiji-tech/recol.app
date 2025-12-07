import React, { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BackgroundView, Button, Header, DatePicker } from '@/src/components';
import { usePlan, useTheme } from '@/src/contexts';
import {
  Schedule,
  upsertSchedule,
  CategorySelector,
  adjustEndAtWhenReversed,
  adjustStartAtWhenNormal,
} from '@/src/features/schedule';
import { useAuth } from '@/src/features/auth';
import { NotificationUtil } from '@/src/libs/NotificationUtil';
import { LogUtil } from '@/src/libs/LogUtil';
import { FontAwesome5 } from '@expo/vector-icons';
import { Toast } from 'toastify-react-native';
import generateI18nMessage from '@/src/libs/i18n';
import { useMap, MapModal } from '@/src/features/map';
import { Image } from 'expo-image';
import {
  deletePlanMediaList,
  Media,
  uploadPlanMediaList,
  useImagePicker,
} from '@/src/features/media';
import { useMutation } from 'react-query';
import { ImagePickerAsset } from 'expo-image-picker';
import dayjs from '@/src/libs/dayjs';

export default function ScheduleEditor() {
  const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:00.000Z';
  // === Member ===
  const { plan, editSchedule, setEditSchedule } = usePlan();
  const { session, profile, user } = useAuth();
  const [openMapModal, setOpenMapModal] = useState(false);
  const { refetchSearchPlaceList } = useMap();
  const { selectImageList, toBase64 } = useImagePicker();
  const { isDarkMode } = useTheme();
  const [mediaList, setMediaList] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [removeMediaList, setRemoveMediaList] = useState<string[]>([]);
  type ViewMedia = { url: string; uid: string; isNew: boolean };
  const viewMediaList: ViewMedia[] = useMemo(
    () =>
      mediaList
        .map((media, index) => ({
          url: media.uri!,
          uid: `media-${index}`,
          isNew: true,
        }))
        .concat(
          editSchedule?.media_list?.map((media: Media) => ({
            url: `${process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL}/object/public/medias/${media.url}`,
            uid: media.uid!,
            isNew: false,
          })) || []
        ),
    [mediaList, editSchedule]
  );
  // === Method ===
  /**
   * スケジュールを保存する
   * @param updateSchedule 更新するスケジュール
   */
  const saveSchedule = async (updateSchedule: Schedule): Promise<Schedule> => {
    return await upsertSchedule(updateSchedule, session).then(async (savedSchedule) => {
      // 通知処理の見直し
      await NotificationUtil.upsertUserSchedule(
        updateSchedule,
        profile?.enabled_schedule_notification ?? false
      );
      return savedSchedule;
    });
  };

  /**
   * メディアを追加
   */
  const handleAddMedia = async () => {
    const result: ImagePicker.ImagePickerAsset[] = await selectImageList();
    setMediaList((prev) => [...prev, ...result]);
  };

  /**
   * メディア削除処理
   * 新規メディアの場合は、メディアリストから削除
   * 既存メディアの場合は、削除メディアリストに追加
   * @param image { uid: string; url: string; isNew: boolean }
   */
  const handleDeleteMedia = (image: { uid: string; url: string; isNew: boolean }) => {
    LogUtil.log(`handleDeleteMedia Start: ${JSON.stringify(image)}`);
    if (image.isNew) {
      setMediaList((prev: ImagePickerAsset[]) => prev.filter((media) => media.uri !== image.url));
    } else {
      setEditSchedule((prev: Schedule) => ({
        ...prev,
        media_list: prev.media_list?.filter((media) => media.uid !== image.uid),
      }));
      setRemoveMediaList((prev) => [...prev, image.uid]);
    }
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

  // === mutate ===
  /**
   * スケジュールの編集 イベントハンドラ
   */
  const mutateUpdateSchedule = useMutation('updateSchedule', {
    mutationFn: async () => {
      if (!plan || !editSchedule) return;
      // 削除対象メディアの更新
      if (removeMediaList.length > 0) {
        LogUtil.log(`removeMediaList: ${JSON.stringify(removeMediaList)}`);
        await deletePlanMediaList(editSchedule.plan_id!, removeMediaList, session);
      }

      // スケジュールの更新
      LogUtil.log(`updateSchedule: ${JSON.stringify(editSchedule)}`);
      const updateSchedule = {
        ...editSchedule,
        from: dayjs(editSchedule.from).format(DATE_FORMAT),
        to: dayjs(editSchedule.to).format(DATE_FORMAT),
        place_list: editSchedule.place_list?.filter((place) => place !== null),
      } as Schedule;
      const savedSchedule = await saveSchedule(updateSchedule);

      setEditSchedule((prev: Schedule) => ({ ...prev, uid: savedSchedule.uid! }));

      // メディアの登録
      const createMediaList = [];
      for (const media of mediaList) {
        const base64 = await toBase64(media.uri!);
        if (base64) createMediaList.push(base64);
      }
      if (createMediaList.length > 0) {
        await uploadPlanMediaList(
          savedSchedule.plan_id!,
          savedSchedule.uid!,
          createMediaList,
          session
        );
      }
    },
    onSuccess: () => {
      router.back();
    },
    onError: (e) => {
      LogUtil.log(JSON.stringify({ saveScheduleError: e }), {
        level: 'error',
        notify: true,
      });
      Toast.warn(generateI18nMessage('FEATURE.SCHEDULE.SAVE_FAILED'));
    },
  });

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
              placeholder={generateI18nMessage('FEATURE.SCHEDULE.TITLE_PLACEHOLDER')}
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
                {generateI18nMessage('FEATURE.SCHEDULE.DATETIME')}
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
                {generateI18nMessage('FEATURE.SCHEDULE.PLACE_LIST')}
              </Text>
              {/* 追加ボタン */}
              <Button
                theme={'info'}
                onPress={handleMapModal}
                text={generateI18nMessage('FEATURE.SCHEDULE.ADD_FROM_MAP')}
              />

              {/* 候補数 */}
              <View className="flex flex-row gap-2 items-center">
                <FontAwesome5 name="map-marker-alt" size={18} color="#f87171" />
                <Text className="text-light-text dark:text-dark-text">
                  {generateI18nMessage('FEATURE.SCHEDULE.CANDIDATE_COUNT', [
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

            {/* メモ */}
            <View className="w-full flex flex-col justify-start items-start">
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                {generateI18nMessage('FEATURE.SCHEDULE.MEMO')}
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

            {/* メディア */}
            <View className="w-full flex flex-col justify-start items-start gap-2">
              <View className="flex flex-row justify-start items-center gap-4   ">
                <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                  {generateI18nMessage('FEATURE.SCHEDULE.MEDIA_LIST', [
                    {
                      key: 'count',
                      value: viewMediaList.length.toString() || '0',
                    },
                  ])}
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
                data={viewMediaList}
                horizontal={true}
                contentContainerClassName="gap-4"
                keyExtractor={(item: ViewMedia) => item.uid}
                renderItem={({ item }) => {
                  return (
                    <View className="w-32 h-32 rounded-xl border border-light-border dark:border-dark-border">
                      <TouchableOpacity
                        className="absolute top-2 right-2 z-10 bg-light-background dark:bg-dark-background rounded-full p-2"
                        onPress={() => handleDeleteMedia(item)}
                      >
                        <FontAwesome5
                          name="minus"
                          size={12}
                          color={isDarkMode ? 'white' : 'black'}
                        />
                      </TouchableOpacity>
                      <Image
                        cachePolicy="memory-disk"
                        source={{ uri: item.url }}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 12,
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View>

            {/* 保存ボタン */}
            <Button
              theme="theme"
              onPress={mutateUpdateSchedule.mutateAsync}
              text={generateI18nMessage('COMMON.SAVE')}
              disabled={mutateUpdateSchedule.isLoading}
              loading={mutateUpdateSchedule.isLoading}
            />
          </View>
        </ScrollView>
      </BackgroundView>
      {/* マップモーダル */}
      {openMapModal && <MapModal isOpen={openMapModal} onClose={handleSelectedPlaceList} />}
    </>
  );
}
