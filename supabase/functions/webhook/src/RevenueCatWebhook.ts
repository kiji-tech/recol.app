import { Context } from 'jsr:@hono/hono';

export class RevenueCatWebhook {
  public static async handle(c: Context) {
    console.log('[POST] /webhook/RevenueCat');

    const event = await c.req.json();
    console.log(event);
    return c.json('revenuecat webhook');
  }
}