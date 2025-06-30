import { Hono } from 'jsr:@hono/hono';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const app = new Hono().basePath('/resend');

const TYPE_OBJECT: Record<string, { template: string; subject: string; html: string }> = {
  signup: {
    template: 'SignupMailTemplate',
    subject: 'Re:CoL アカウント登録',
    html: '<strong>it works! sign up email.</strong>',
  },
  resetPassword: {
    template: 'ResetPasswordMailTemplate',
    subject: 'Re:CoL パスワードリセット',
    html: '<strong>it works! reset password email.</strong>',
  },
};

const loadTemplate = async (
  templateName: string,
  variables: Record<string, string>
): Promise<string> => {
  const templatePath = `./mails/${templateName}.html`;
  let template = await Deno.readTextFile(templatePath);

  // 変数を置換
  Object.entries(variables).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return template;
};

const sendEmail = async (
  email: string,
  type: string,
  variables?: Record<string, string>
): Promise<Response> => {
  let html: string;

  if (type === 'resetPassword' && variables?.token) {
    // パスワードリセット用のディープリンクを生成
    const resetPasswordLink = `recol://reset-password?token=${variables.token}`;
    html = await loadTemplate(TYPE_OBJECT[type].template, { resetPasswordLink });
  } else {
    const signupLink = `recol://complete-signup?token=${variables.token}`;
    html = await loadTemplate(TYPE_OBJECT[type].template, { signupLink });
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: email,
      subject: TYPE_OBJECT[type].subject,
      html: html,
    }),
  });
  return res;
};

const handler = async (c: Hono.Context): Promise<Response> => {
  console.log('handler');
  const { email, type, variables } = await c.req.json();
  if (!email || !type) {
    return c.json({ message: 'Invalid request' }, 400);
  }

  const res = await sendEmail(email, type, variables);
  if (res.ok) {
    return c.json({ message: 'Email sent successfully' }, 200);
  } else {
    return c.json({ message: 'Email sending failed' }, 500);
  }
};

app.post('/', handler);
Deno.serve(app.fetch);
