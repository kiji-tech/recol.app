import { Context } from 'jsr:@hono/hono';
import { StatusCode } from 'jsr:@hono/hono/utils/http-status';

/**
 * 成功レスポンスを生成
 */
export function success<T>(c: Context, data: T, status: number = 200) {
  return c.json(
    {
      success: true,
      data,
      error: null,
    },
    status as StatusCode
  );
}

/**
 * エラーレスポンスを生成
 */
export function error(c: Context, message: string, code: string, status: number = 400) {
  return c.json(
    {
      success: false,
      data: null,
      error: {
        message,
        code,
      },
    },
    status as StatusCode
  );
}
