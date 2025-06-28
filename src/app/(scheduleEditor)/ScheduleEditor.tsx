import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Tables } from '@/src/libs/database.types';
import { Alert, Text, TextInput, View } from 'react-native';
import { BackgroundView, Button, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import DatePicker from '../../components/Common/DatePicker';
import dayjs from '@/src/libs/dayjs';
import MapModal from './component/MapModal';
import { upsertSchedule } from '@/src/libs/ApiService';
import { useAuth } from '@/src/contexts/AuthContext';
import { Place } from '@/src/entities/Place';
import { Schedule } from '@/src/entities/Plan';

export default function ScheduleEditor() {
  // === Member ===
  const { editSchedule, setEditSchedule, fetchPlan } = usePlan();
  const { session } = useAuth();
  const [openMapModal, setOpenMapModal] = useState(false);
  const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:00.000Z';

  // === Method ===
  /** スケジュールの編集 */
  const handleScheduleSubmit = async () => {
    if (!editSchedule) return;
    const schedule = {
      ...editSchedule,
      from: dayjs(editSchedule.from).format(DATE_FORMAT),
      to: dayjs(editSchedule.to).format(DATE_FORMAT),
    };

    await upsertSchedule(schedule as Tables<'schedule'>, session)
      .then(async () => {
        // プランの撮り直し
        await fetchPlan();
        router.back();
      })
      .catch((e) => {
        if (e && e.message) {
          Alert.alert(e.message);
        }
      });
  };

  /** マップから選択した場所を追加 */
  const handleSelectedPlaceList = () => {
    setOpenMapModal(false);
  };

  /** マップを表示する */
  const handleMapModal = () => {
    setOpenMapModal(true);
  };

  /** 戻る */
  const handleBack = () => {
    router.back();
  };

  // === Effect ===
  useEffect(() => {
    if (!editSchedule) setEditSchedule({} as Tables<'schedule'> & { place_list: Place[] });
  }, []);

  // === Render ===
  if (!editSchedule) return;
  return (
    <>
      <BackgroundView>
        <Header onBack={() => handleBack()} />
        <TextInput
          placeholder="タイトル..."
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
          <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>日時</Text>
          <View className={`flex flex-row justify-center items-center gap-4`}>
            <DatePicker
              mode="datetime"
              value={editSchedule.from ? dayjs(editSchedule.from) : dayjs()}
              onChange={(date) => {
                const to = dayjs(editSchedule.to).isBefore(dayjs(date))
                  ? dayjs(date).add(1, 'hour').format(DATE_FORMAT)
                  : editSchedule.to;
                setEditSchedule({
                  ...editSchedule,
                  from: date.format(DATE_FORMAT),
                  to,
                } as Tables<'schedule'> & { place_list: Place[] });
              }}
            />
            <Text className="text-light-text dark:text-dark-text"> ― </Text>
            <DatePicker
              mode="datetime"
              value={
                editSchedule.to ? dayjs(editSchedule.to) : dayjs(editSchedule.from).add(1, 'hour')
              }
              onChange={(date) =>
                setEditSchedule({
                  ...editSchedule,
                  to: date.format(DATE_FORMAT),
                } as Schedule)
              }
            />
          </View>
        </View>
        {/* マップから追加する */}
        <View className="w-full flex flex-col justify-start items-start gap-4">
          <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>候補</Text>
          {/* 追加ボタン */}
          <Button theme={'info'} onPress={handleMapModal} text={'マップから確認・追加'} />

          {/* 候補数 */}
          <Text className="text-light-text dark:text-dark-text">
            {(editSchedule.place_list && editSchedule.place_list!.length) || 0}件候補があります｡
          </Text>
        </View>

        {/* メモ */}
        <View className="w-full flex flex-col justify-start items-start">
          <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>メモ</Text>
          <TextInput
            value={editSchedule.description!}
            multiline={true}
            className={`rounded-xl border px-4 py-4 w-full text-lg h-32 text-start align-top 
                        border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) => {
              setEditSchedule({
                ...editSchedule,
                description: text,
              } as Schedule);
            }}
          />
        </View>

        {/* 保存ボタン */}
        <Button theme="theme" onPress={handleScheduleSubmit} text="保存" />
      </BackgroundView>
      {/* マップモーダル */}
      {openMapModal && <MapModal isOpen={openMapModal} onClose={handleSelectedPlaceList} />}
    </>
  );
}
