import { Tables } from '@/src/libs/database.types';

export class Media {
  uid: string = '';
  plan_id: string = '';
  upload_user_id: string = '';
  url: string = '';
  delete_flag: boolean = false;
  created_at: string = '';
  constructor(data: Tables<'media'>) {
    for (const key in data) {
      this[key as keyof Media] = data[key as keyof Tables<'media'>] as never;
    }
  }
}
