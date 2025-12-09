import { Context } from 'jsr:@hono/hono';
import { SuccessResponse, ErrorResponse } from './types.ts';

/**
 * 成功レスポンスを生成
 * @param c {Context} Honoコンテキスト
 * @param data {T} レスポンスデータ
 * @param status {number} HTTPステータスコード (デフォルト: 200)
 * @return {Response} 成功レスポンス
 */
export const success = <T>(c: Context, data: T, status = 200): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    error: null,
  };
  return c.json(response, status as any);
};

/**
 * エラーレスポンスを生成
 * @param c {Context} Honoコンテキスト
 * @param message {string} エラーメッセージ
 * @param code {string} エラーコード
 * @param status {number} HTTPステータスコード (デフォルト: 400)
 * @return {Response} エラーレスポンス
 */
export const error = (c: Context, message: string, code: string, status = 400): Response => {
  const response: ErrorResponse = {
    success: false,
    data: null,
    error: { message, code },
  };
  return c.json(response, status as any);
};
