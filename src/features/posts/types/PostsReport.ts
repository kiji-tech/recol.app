import { Enums, Tables } from '@/src/libs/database.types';
export type PostsReportCategory = Enums<'PostsReportCategory'>;
type PostsReportType = Tables<'posts_report'>;

/**
 * PostsReport
 * 投稿通報
 */
export class PostsReport {
  uid?: string;
  posts_id?: string;
  user_id?: string;
  category_id?: PostsReportCategory;
  body?: string;
  created_at?: string;

  constructor(data: PostsReportType | PostsReport) {
    for (const key in data) {
      this[key as keyof PostsReport] = data[key as keyof PostsReportType] as never;
    }
  }
}
