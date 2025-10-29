import { Hono } from 'jsr:@hono/hono';
import { get, list, listForNotification } from './fetchSchedule.ts';
import { upsertSchedule } from './upsertSchedule.ts';
import { deleteSchedule } from './deleteSchedule.ts';

const app = new Hono().basePath('/schedule');

app.get('/:id', get);
app.post('/list', list);
app.post('/list/notification', listForNotification);
app.post('/delete', deleteSchedule);
app.post('/', upsertSchedule);

Deno.serve(app.fetch);
