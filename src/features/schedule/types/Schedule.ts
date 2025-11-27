import { Database, Tables } from '@/src/libs/database.types';
import { Media } from '../../media';

export class Schedule {
  uid?: string;
  plan_id: string | null = null;
  title: string | null = null;
  description: string | null = null;
  category: Database['public']['Enums']['ScheduleCategory'] | null = null;
  place_list: string[] | null = null;
  media_list: Media[] = [];
  from: string | null = null;
  to: string | null = null;
  delete_flag: boolean = false;
  created_at: string = '';
  updated_at: string | null = null;

  constructor(schedule: Schedule) {
    for (const key in schedule) {
      this[key as keyof Schedule] = schedule[key as keyof Tables<'schedule'>] as never;
    }
  }
}
