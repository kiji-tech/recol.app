import { Hono, Context } from 'jsr:@hono/hono';
import { withUser } from './libs/authenticate/withUser.ts';
import * as plan from './plan/index.ts';
import * as schedule from './schedule/index.ts';
import * as media from './media/index.ts';
import * as posts from './posts/index.ts';

const app = new Hono().basePath('/v1');

// === Plan ===
app.get('/plan/:uid', (c: Context) => withUser(c, plan.get));
app.post('/plan/list', (c: Context) => withUser(c, plan.list));
app.post('/plan', (c: Context) => withUser(c, plan.createPlan));
app.put('/plan', (c: Context) => withUser(c, plan.updatePlan));
app.post('/plan/delete', (c: Context) => withUser(c, plan.deletePlan));

// === Schedule ===
app.get('/schedule/:id', (c: Context) => withUser(c, schedule.get));
app.post('/schedule/list', (c: Context) => withUser(c, schedule.list));
app.post('/schedule/list/notification', (c: Context) => withUser(c, schedule.listForNotification));
app.post('/schedule/delete', (c: Context) => withUser(c, schedule.deleteSchedule));
app.post('/schedule', (c: Context) => withUser(c, schedule.upsertSchedule));

// === Media ===
app.post('/media/list', (c: Context) => withUser(c, media.listMedia));
app.post('/media', (c: Context) => withUser(c, media.createMedia));
app.post('/media/delete', (c: Context) => withUser(c, media.deleteMedia));

// === Posts ===
app.post('/posts', (c: Context) => withUser(c, posts.createPosts));
Deno.serve(app.fetch);
