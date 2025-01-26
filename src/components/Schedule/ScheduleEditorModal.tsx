import { Tables } from '@/src/libs/database.types';
import { useEffect, useState } from 'react';
import { Alert, Modal, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import DatePicker from '../DatePicker';
import dayjs from 'dayjs';
import ModalLayout from '../Modal/ModalLayout';

type Props = {
  initSchedule: Tables<'schedule'> | null;
  open: boolean;
  onClose: () => void;
};
export default function ScheduleEditorModal({ initSchedule, open, onClose }: Props) {
  // === Member ===
  const [schedule, setSchedule] = useState<Tables<'schedule'> | null>(null);
  const [isEdited, setIsEdited] = useState(false);

  // === Effect ===
  useEffect(() => {
    setSchedule(initSchedule);
  }, [initSchedule]);

  // === Method ===
  /** スケジュールの編集 */
  const handleScheduleSubmit = async () => {
    if (!schedule) return;
    const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL}/schedule`, {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
    if (!res.ok) {
      // TODO: エラーハンドリング
      alert('登録に失敗しました');
      return;
    }
    setIsEdited(false);
    onClose();
  };

  /** モーダルを閉じる */
  const handleClose = () => {
    if (initSchedule != schedule) {
      Alert.alert('変更を破棄しますか？', '', [
        {
          text: '破棄する',
          onPress: () => {
            if (schedule) {
              onClose();
            }
            setIsEdited(false);
            onClose();
          },
        },
      ]);
      return;
    }
    onClose();
  };

  // === Render ===
  if (!schedule) return;
  return (
    <Modal animationType="slide" transparent={true} visible={open}>
      <ModalLayout size="half" onClose={handleClose}>
        <TextInput
          placeholder="タイトル..."
          value={schedule.title!}
          className={`flex flex-row justify-center rounded-xl items-center border px-4 py-4 w-full text-xl
                 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background
                `}
          onChangeText={(text) => {
            setSchedule({ ...schedule, title: text });
          }}
        />
        {/* 日程 */}
        <View className="w-full flex flex-col justify-start items-start">
          <Text className={`text-lg font-bold text-light-text dark:text-dark-text`}>
            日時を選択してください
          </Text>
          <View className={`flex flex-row justify-center gap-4`}>
            <DatePicker
              label="from"
              mode="time"
              value={schedule.from ? dayjs(schedule.from) : dayjs()}
              onChange={(date) => setSchedule({ ...schedule, from: dayjs(date).toString() })}
            />
            <DatePicker
              label="to"
              mode="time"
              value={schedule.to ? dayjs(schedule.to) : dayjs(schedule.from).add(1, 'hour')}
              onChange={(date) => setSchedule({ ...schedule, to: dayjs(date).toString() })}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleScheduleSubmit}
          className={` w-full p-4
                bg-light-theme dark:bg-dark-theme`}
        >
          <Text className="text text-center">保存</Text>
        </TouchableOpacity>
      </ModalLayout>
    </Modal>
  );
}
