import { Tables } from '@/src/libs/database.types';

export type MediaType = Tables<'media'>;

export class Media {
  uid: string | null = null;
  plan_id: string | null = null;
  upload_user_id: string | null = null;
  url: string | null = null;
  delete_flag: boolean | null = null;
  created_at: string | null = null;
  constructor(data: Tables<'media'>) {
    for (const key in data) {
      this[key as keyof Media] = data[key as keyof Tables<'media'>] as never;
    }
  }
}
