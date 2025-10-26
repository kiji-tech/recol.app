import { Context, Hono } from 'jsr:@hono/hono';
import { LogUtil } from '../libs/LogUtil.ts';

const app = new Hono().basePath('/version-check');

const getVersionInfo = async (c: Context) => {
  LogUtil.log('[GET] version-check', { level: 'info' });
  try {
    // 環境変数から最低バージョンを取得
    const minVersion = Deno.env.get('MIN_APP_VERSION') || '1.1.0';

    LogUtil.log(`[GET] version-check: ${minVersion}`, { level: 'info' });
    return c.json({ minVersion });
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
};

app.get('/', getVersionInfo);

export default app;
