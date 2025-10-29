import { Hono } from 'jsr:@hono/hono';
import { create } from './createPlan.ts';
import { update } from './updatePlan.ts';
import { get, list } from './fetchPlan.ts';
import { deletePlan } from './deletePlan.ts';

const app = new Hono().basePath('/plan');

app.get('/:uid', get);
app.post('/list', list);
app.post('/', create);
app.put('/', update);
app.post('/delete', deletePlan);
Deno.serve(app.fetch);
