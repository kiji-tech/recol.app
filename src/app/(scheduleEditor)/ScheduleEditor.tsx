import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Json, Tables } from '@/src/libs/database.types';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackgroundView, Button, Header } from '@/src/components';
import { usePlan } from '@/src/contexts/PlanContext';
import DatePicker from '../../components/DatePicker';
import dayjs from '@/src/libs/dayjs';
import MapModal from './component/MapModal';
import { Place } from '@/src/entities/Place';

export default function ScheduleEditor() {
  // === Member ===
  const { plan, editSchedule, setEditSchedule } = usePlan();
  const [openMapModal, setOpenMapModal] = useState(false);

  // === Effect ===
  useEffect(() => {
    if (!editSchedule) setEditSchedule({} as Tables<'schedule'>);
  }, []);

  // === Method ===
  /** スケジュールの編集 */
  const handleScheduleSubmit = async () => {
    if (!editSchedule) return;
    console.log({ editSchedule });
    const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ schedule: editSchedule }),
    });
    if (!res.ok) {
      // TODO: エラーハンドリング
      console.log(res);
      alert('登録に失敗しました');
      return;
    }
    router.back();
  };

  const handleSelectedPlaceList = (placeList: Place[]) => {
    const schedule = { ...editSchedule, place_list: placeList as unknown as Json[] };
    setEditSchedule({ ...schedule } as Tables<'schedule'>);
  };

  /** マップを表示する */
  const handleMapModal = () => {
    setOpenMapModal(true);
  };

  const handleBack = () => {
    router.back();
  };

  // === Render ===
  if (!editSchedule) return;
  return (
    <SafeAreaView>
      <ScrollView>
        <BackgroundView>
          <Header onBack={() => handleBack()} />
          <TextInput
            placeholder="タイトル..."
            value={editSchedule.title!}
            className={`flex flex-row justify-center rounded-xl items-center border-b-[1px] px-4 py-4 w-full text-3xl
            border-light-border dark:border-dark-border text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
            onChangeText={(text) => {
              setEditSchedule({ ...editSchedule, title: text });
            }}
          />
          {/* 日程 */}
          <View className="w-full flex flex-col justify-start items-start">
            <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>日時</Text>
            <View className={`flex flex-row justify-center gap-4`}>
              <DatePicker
                label="from"
                mode="time"
                value={editSchedule.from ? dayjs(editSchedule.from) : dayjs()}
                onChange={(date) => {
                  setEditSchedule({
                    ...editSchedule,
                    from: date.format('YYYY-MM-DDTHH:mm:ss.000Z'),
                  });
                }}
              />
              <DatePicker
                label="to"
                mode="time"
                value={
                  editSchedule.to ? dayjs(editSchedule.to) : dayjs(editSchedule.from).add(1, 'hour')
                }
                onChange={(date) =>
                  setEditSchedule({
                    ...editSchedule,
                    to: date.format('YYYY-MM-DDTHH:mm:ss.000Z'),
                  })
                }
              />
            </View>
          </View>
          {/* スケジュールの候補Map一覧 */}
          {/* マップから追加する */}
          <View className="w-full flex flex-col justify-start items-start gap-4">
            <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>候補</Text>
            {/* 追加ボタン */}
            <Button theme={'info'} onPress={handleMapModal} text={'マップから確認・追加'} />

            {/* 候補数 */}
            <Text>
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
                setEditSchedule({ ...editSchedule, description: text });
              }}
            />
          </View>

          {/* 保存ボタン */}
          <Button theme="theme" onPress={handleScheduleSubmit} text="保存" />
        </BackgroundView>
      </ScrollView>
      {/* マップモーダル */}
      {openMapModal && (
        <MapModal
          isOpen={openMapModal}
          placeList={(editSchedule.place_list as unknown as Place[]) || []}
          onSuccess={handleSelectedPlaceList}
          onClose={() => setOpenMapModal(false)}
        />
      )}
    </SafeAreaView>
  );
}
