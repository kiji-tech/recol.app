import { Tables } from '@/src/libs/database.types';
import { ReactNode, useState } from 'react';
import { Text, ScrollView, TouchableOpacity } from 'react-native';
import ScheduleItem from './ScheduleItem';
import dayjs from 'dayjs';
import ScheduleEditorModal from './ScheduleEditorModal';

type Props = {
  plan: (Tables<'plan'> & { schedule: Tables<'schedule'>[] }) | null;
};

export default function TripCalendar({ plan }: Props): ReactNode {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Tables<'schedule'> | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Tables<'schedule'> | null>(null);
  // === Method ====
  /** 時間軸クリックイベント */
  const handleHourPress = (hour: string) => {
    setEditSchedule({
      from: dayjs()
        .set('hour', Number(hour.split(':')[0]))
        .set('minute', 0)
        .toString(),
    } as Tables<'schedule'>);
    setSelectedSchedule(null);
    setIsEditorOpen(true);
  };

  /** アイテムクリックイベント */
  const handleSchedulePress = (schedule: Tables<'schedule'>) => {
    setSelectedSchedule(schedule);
    setEditSchedule(schedule);
    setIsEditorOpen(true);
  };

  /** スケジュール編集モーダルの修正 */
  const handleModalClose = () => {
    setIsEditorOpen(false);
    setEditSchedule(null);
  };

  // === Render ===
  return (
    <ScrollView className="w-full my-12">
      {/* 時間軸の表示 */}
      {hours.map((hour) => {
        // 時間内にあるスケジュールを取得する
        return (
          <TouchableOpacity
            key={hour}
            onPress={() => {
              handleHourPress(hour);
            }}
            className={`w-full flex flex-row items-center 
                border-t-[1px] last-child:border-b-[1px]  h-[40px]                
                border-light-border dark:border-dark-border`}
          >
            <Text className="w-1/6 pl-2">{hour}</Text>
          </TouchableOpacity>
        );
      })}
      {/* スケジュールアイテム（タスク）の表示 */}
      {plan &&
        plan.schedule.map((s) => (
          <ScheduleItem
            key={s.uid}
            item={s}
            active={selectedSchedule ? selectedSchedule.uid == s.uid : false}
            onPress={handleSchedulePress}
          />
        ))}

      {/* スケジュール編集モーダル */}
      <ScheduleEditorModal
        initSchedule={editSchedule!}
        open={isEditorOpen}
        onClose={() => handleModalClose()}
      />
    </ScrollView>
  );
}
