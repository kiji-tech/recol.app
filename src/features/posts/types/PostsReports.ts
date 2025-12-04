import { Enums, Tables } from '@/src/libs/database.types';
export type PostsReportCategory = Enums<'PostsReportCategory'>;
type PostsReportsType = Tables<'posts_report'>;

/**
 * PostsReport
 * 投稿通報
 */
export class PostsReports {
  uid?: string;
  posts_id?: string;
  user_id?: string;
  category_id?: PostsReportCategory;
  body?: string;
  created_at?: string;

  constructor(data: PostsReportsType | PostsReports) {
    for (const key in data) {
      this[key as keyof PostsReports] = data[key as keyof PostsReportsType] as never;
    }
  }
}
