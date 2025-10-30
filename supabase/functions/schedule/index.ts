import { Hono } from 'jsr:@hono/hono';
import { get, list, listForNotification } from './fetchSchedule.ts';
import { upsertSchedule } from './upsertSchedule.ts';
import { deleteSchedule } from './deleteSchedule.ts';
import { withUser } from '../libs/authenticate/withUser.ts';

const app = new Hono().basePath('/schedule');

app.get('/:id', (c) => withUser(c, get));
app.post('/list', (c) => withUser(c, list));
app.post('/list/notification', (c) => withUser(c, listForNotification));
app.post('/delete', (c) => withUser(c, deleteSchedule));
app.post('/', (c) => withUser(c, upsertSchedule));

Deno.serve(app.fetch);
