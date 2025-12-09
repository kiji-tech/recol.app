import { Tables } from '@/src/libs/database.types';
import { Profile } from '@/src/features/profile';
export type PostsType = Tables<'posts'>;

export class Posts {
  uid?: string;
  place_id: string = '';
  user_id: string | null = null;
  body: string = '';
  medias: string[] = [];
  delete_flag: boolean = false;
  created_at?: string;
  profile: Profile = new Profile({} as Profile);

  constructor(data: PostsType | Posts) {
    for (const key in data) {
      this[key as keyof Posts] = data[key as keyof PostsType] as never;
    }
  }
}
