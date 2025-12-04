import { Tables } from '@/src/libs/database.types';
import { Profile } from '../../profile';
export type PostsType = Tables<'posts'>;

const IS_MY_POSTS = true;

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
