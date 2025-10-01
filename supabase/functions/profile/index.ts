import { Hono } from 'jsr:@hono/hono';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { StripeUtil } from '../libs/StripeUtil.ts';
import dayjs from 'dayjs';
import { sendSlackNotification } from '../libs/SlackUtil.ts';

const app = new Hono().basePath('/profile');

const createProfile = async (c: Hono.Context) => {
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  // プロフィールがない場合は作成して返却する
  LogUtil.log(`${user.id}のプロフィールがないため作成します`, { level: 'info' });
  const customer = await StripeUtil.createCustomer(user.email!);
  LogUtil.log('Stripeアカウントの作成', { level: 'info' });
  // プロフィールを作成
  LogUtil.log('プロフィールの作成', { level: 'info' });
  if (!customer) {
    LogUtil.log('Stripeアカウントの作成に失敗しました', { level: 'error' });
    throw new Error(getMessage('C005', ['プロフィール']));
  }

  const { data: newData, error: newError } = await supabase
    .from('profile')
    .insert({ uid: user.id, stripe_customer_id: customer.id })
    .select('*')
    .maybeSingle();
  if (newError) {
    LogUtil.log(newError, { level: 'error', notify: true });
    throw newError;
  }
  // 作成時はsubscriptionは空で返却する
  newData.subscription = [];

  return c.json(newData);
};

const get = async (c: Hono.Context) => {
  console.log('[GET] profile');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq('uid', user.id)
    .maybeSingle();

  if (!data) {
    const newData = await createProfile(c).catch(() => {
      return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
    });
    // Slackに通知
    await sendSlackNotification({
      message: `[${user.id}]が新規登録されました`,
      webhookUrl: Deno.env.get('NEW_ACCOUNT_SLACK_WEBHOOK_URL') || '',
    });

    return c.json(newData);
  }

  if (error) {
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  // 期限内のsubscriptionを取得
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscription')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'trying', 'canceled'])
    .gte('current_period_end', dayjs().format('YYYY-MM-DD HH:mm:ss'));

  if (subscriptionError) {
    LogUtil.log(JSON.stringify(subscriptionError), { level: 'error', notify: true });
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  data.subscription = subscriptionData || [];

  return c.json(data);
};

const create = async (c: Hono.Context) => {
  console.log('[POST] profile');
  const supabase = generateSupabase(c);
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const data = await createProfile(c).catch(() => {
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  });

  return c.json(data);
};

const update = async (c: Hono.Context) => {
  console.log('[PUT] profile');
  const supabase = generateSupabase(c);
  const { display_name, avatar_url, notification_token, enabled_schedule_notification } =
    await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  // 古いアバター画像を削除
  const { data: oldProfile } = await supabase
    .from('profile')
    .select('avatar_url')
    .eq('uid', user.id)
    .maybeSingle();

  let finalAvatarUrl = oldProfile?.avatar_url || null;
  if (avatar_url && avatar_url.startsWith('data:image')) {
    // Base64画像をデコード
    const base64Data = avatar_url.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // ファイル名を生成
    const fileExt = avatar_url.split(';')[0].split('/')[1];
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    if (oldProfile?.avatar_url) {
      const oldFilePath = oldProfile.avatar_url.split('/').pop();
      if (oldFilePath) {
        await supabase.storage.from('avatars').remove([oldFilePath]);
      }
    }
    // 新しいアバター画像をアップロード
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, buffer, {
      contentType: `image/${fileExt}`,
      upsert: true,
    });

    if (uploadError) {
      console.error({
        uploadError,
        filePath,
        contentType: `image/${fileExt}`,
      });
      return c.json({ message: getMessage('C006', ['アバター']), code: 'C006' }, 500);
    }

    // 公開URLを取得
    finalAvatarUrl = filePath;
  }

  // プロフィールを更新
  const { data, error } = await supabase
    .from('profile')
    .upsert(
      {
        uid: user.id,
        display_name,
        avatar_url: finalAvatarUrl,
        notification_token,
        enabled_schedule_notification,
      },
      { onConflict: 'uid' }
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['プロフィール']), code: 'C007' }, 400);
  }

  // 期限内のsubscriptionを取得
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscription')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['active', 'trying', 'canceled'])
    .gte('current_period_end', dayjs().format('YYYY-MM-DD HH:mm:ss'));

  if (subscriptionError) {
    LogUtil.log(JSON.stringify(subscriptionError), { level: 'error', notify: true });
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  data.subscription = subscriptionData || [];

  return c.json(data);
};

const syncPremiumPlan = async (c: Hono.Context) => {
  console.log('[PUT] sync-premium-plan');
  const supabase = generateSupabase(c);
  const { isPremium, endAt } = await c.req.json();
  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const { data, error } = await supabase
    .from('profile')
    .update({ payment_plan: isPremium ? 'Premium' : 'Free', payment_end_at: endAt })
    .eq('uid', user.id);

  if (error) {
    console.error(error);
    return c.json({ message: getMessage('C007', ['プロフィール']), code: 'C007' }, 400);
  }

  return c.json();
};

app.get('/', get);
app.post('/', create);
app.put('/', update);
app.put('/sync-premium-plan', syncPremiumPlan);
Deno.serve(app.fetch);
