import { Json, Tables } from '@/src/libs/database.types';
import { useEffect, useState } from 'react';
import { Alert, Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from '../../components/DatePicker';
// import dayjs from 'dayjs';
import dayjs from '@/src/libs/dayjs';
import { BackgroundView, Button, Header } from '@/src/components';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchSchedule } from '@/src/libs/ApiService';
import { usePlan } from '@/src/contexts/PlanContext';
import MapModal from './component/MapModal';
import { Place } from '@/src/entities/Place';
import React from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import PlaceCard from '@/src/components/PlaceCard';

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
      body: JSON.stringify({ editSchedule }),
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
    console.log({ placeList });
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
    <GestureHandlerRootView>
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
                    editSchedule.to
                      ? dayjs(editSchedule.to)
                      : dayjs(editSchedule.from).add(1, 'hour')
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
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
                ロケーション
              </Text>
              {/* 追加ボタン */}
              <Button theme={'info'} onPress={handleMapModal} text={'マップから追加する'} />

              {/* Mapカード */}
              {editSchedule.place_list && (
                <ScrollView
                  className={'w-screen'}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View className="w-screen flex flex-row justify-start items-start gap-8">
                    {editSchedule.place_list.map((place: unknown) => {
                      const p = place as Place;
                      return (
                        <View className="w-4/6">
                          <PlaceCard
                            place={p}
                            onAddPlace={() => void 0}
                            onRemovePlace={() => void 0}
                            selected={false}
                          />
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* メモ */}
            <View className="w-full flex flex-col justify-start items-start">
              <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>メモ</Text>
              <TextInput
                placeholder="雨降ったら中止..."
                value={editSchedule.description!}
                multiline={true}
                className={`
            rounded-xl border px-4 py-4 w-full text-lg h-32 text-start
            text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background`}
                onChangeText={(text) => {
                  setEditSchedule({ ...editSchedule, description: text });
                }}
              />
            </View>

            {/* 保存ボタン */}
            <TouchableOpacity
              onPress={handleScheduleSubmit}
              className={` w-full p-4
                bg-light-theme dark:bg-dark-theme`}
            >
              <Text className="text text-center">保存</Text>
            </TouchableOpacity>
          </BackgroundView>
          {/* マップモーダル */}
          {openMapModal && (
            <MapModal
              isOpen={openMapModal}
              onSuccess={handleSelectedPlaceList}
              onClose={() => setOpenMapModal(false)}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
