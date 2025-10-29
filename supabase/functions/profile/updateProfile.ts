import { Context } from 'jsr:@hono/hono';
import { SupabaseClient } from 'npm:@supabase/supabase-js';
import { generateSupabase, getUser } from '../libs/supabase.ts';
import { getMessage } from '../libs/MessageUtil.ts';
import { LogUtil } from '../libs/LogUtil.ts';
import { Tables } from '../libs/database.types.ts';
import dayjs from 'dayjs';

export const updateProfile = async (c: Context) => {
  console.log('[PUT] profile');
  const supabase = generateSupabase(c);
  const { display_name, avatar_url, notification_token, enabled_schedule_notification } =
    await c.req.json();

  const user = await getUser(c, supabase);
  if (!user) {
    return c.json({ message: getMessage('C001'), code: 'C001' }, 403);
  }

  const finalAvatarUrl = await handleAvatarUpdate(supabase, user.id, avatar_url);
  if (avatar_url && finalAvatarUrl === null) {
    return c.json({ message: getMessage('C006', ['アバター']), code: 'C006' }, 500);
  }

  const profileData = await updateProfileData(supabase, user.id, {
    display_name,
    avatar_url: avatar_url ? finalAvatarUrl : null,
    notification_token,
    enabled_schedule_notification,
  } as Tables<'profile'>);

  if (!profileData) {
    return c.json({ message: getMessage('C007', ['プロフィール']), code: 'C007' }, 400);
  }

  const subscriptionData = await getSubscriptionData(supabase, user.id);
  if (!subscriptionData) {
    return c.json({ message: getMessage('C005', ['プロフィール']), code: 'C005' }, 400);
  }

  profileData.subscription = subscriptionData;
  return c.json(profileData);
};

const handleAvatarUpdate = async (
  supabase: SupabaseClient,
  userId: string,
  avatarUrl: string | null
) => {
  const { data: oldProfile } = await supabase
    .from('profile')
    .select('avatar_url')
    .eq('uid', userId)
    .maybeSingle();

  let finalAvatarUrl = oldProfile?.avatar_url || null;

  if (avatarUrl && avatarUrl.startsWith('data:image')) {
    const uploadResult = await uploadAvatarImage(
      supabase,
      userId,
      avatarUrl,
      oldProfile?.avatar_url
    );
    if (!uploadResult) {
      return null;
    }
    finalAvatarUrl = uploadResult;
  }

  return finalAvatarUrl;
};

const uploadAvatarImage = async (
  supabase: SupabaseClient,
  userId: string,
  avatarUrl: string,
  oldAvatarUrl?: string
) => {
  const base64Data = avatarUrl.split(',')[1];
  const buffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  const fileExt = avatarUrl.split(';')[0].split('/')[1];
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  if (oldAvatarUrl) {
    const oldFilePath = oldAvatarUrl.split('/').pop();
    if (oldFilePath) {
      await supabase.storage.from('avatars').remove([oldFilePath]);
    }
  }

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
    return null;
  }

  return filePath;
};

const updateProfileData = async (
  supabase: SupabaseClient,
  userId: string,
  profileData: Tables<'profile'>
) => {
  const { data, error } = await supabase
    .from('profile')
    .upsert(
      {
        ...profileData,
        uid: userId, // Ensure uid from argument always overwrites profileData.uid (if present)
      },
      { onConflict: 'uid' }
    )
    .select('*')
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
};

const getSubscriptionData = async (supabase: SupabaseClient, userId: string) => {
  const { data: subscriptionData, error: subscriptionError } = await supabase
    .from('subscription')
    .select('*')
    .eq('user_id', userId)
    .in('status', ['active', 'trying', 'canceled'])
    .gte('current_period_end', dayjs().format('YYYY-MM-DD HH:mm:ss'));

  if (subscriptionError) {
    LogUtil.log(JSON.stringify(subscriptionError), { level: 'error', notify: true });
    return null;
  }

  return subscriptionData || [];
};
