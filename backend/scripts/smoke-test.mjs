// Checks the API and security rules end to end.
//
//   npm run test:api -- <admin-email> <admin-password>
//
// Safe to run against production: anything it creates is deleted at the end.

import { createClient } from '@supabase/supabase-js';

const [adminEmail, adminPassword] = process.argv.slice(2);
const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !adminEmail || !adminPassword) {
  console.error('Usage: npm run test:api -- <admin-email> <admin-password>  (needs SUPABASE_URL and SUPABASE_ANON_KEY in .env)');
  process.exit(1);
}

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const student = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, opts);
const admin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, opts);

let failures = 0;
function check(label, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
  if (!ok) failures++;
}

// --- Student (anonymous) reads ------------------------------------------------
const boot = await student.rpc('get_app_bootstrap');
check('student: get_app_bootstrap', !boot.error && boot.data?.config?.past_days !== undefined, boot.error?.message);

for (const bucket of ['today', 'past', 'upcoming']) {
  const { data, error } = await student.rpc('get_event_feed', { p_bucket: bucket });
  check(`student: get_event_feed(${bucket})`, !error, error?.message ?? `${data.length} events`);
}

const bad = await student.rpc('get_event_feed', { p_bucket: 'yesterday' });
check('student: invalid bucket is rejected', !!bad.error);

// --- Student cannot write -----------------------------------------------------
const anonInsert = await student.from('events').insert({ title: 'hack', starts_at: new Date().toISOString() });
check('student: cannot insert events', !!anonInsert.error);

const anonUpdate = await student.from('app_config').update({ value: 99 }).eq('key', 'past_days').select();
check('student: cannot update config', !!anonUpdate.error || anonUpdate.data.length === 0);

const anonUpload = await student.storage.from('media').upload(`smoke/${Date.now()}.png`, new Blob(['x'], { type: 'image/png' }));
check('student: cannot upload to storage', !!anonUpload.error);

const anonAdmins = await student.from('admins').select('*');
check('student: cannot list admins', !!anonAdmins.error || anonAdmins.data.length === 0);

// --- Admin writes ---------------------------------------------------------------
const signIn = await admin.auth.signInWithPassword({ email: adminEmail, password: adminPassword });
check('admin: sign in', !signIn.error, signIn.error?.message);

if (!signIn.error) {
  const startsAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
  const created = await admin
    .from('events')
    .insert({ title: '[smoke test] hidden event', starts_at: startsAt, is_published: false })
    .select()
    .single();
  check('admin: create event', !created.error, created.error?.message);

  if (!created.error) {
    const id = created.data.id;

    const hidden = await student.from('events').select('id').eq('id', id);
    check('student: unpublished event is hidden', !hidden.error && hidden.data.length === 0);

    const pub = await admin.from('events').update({ is_published: true }).eq('id', id).select().single();
    check('admin: publish event', !pub.error && pub.data.updated_by === signIn.data.user.id, pub.error?.message);

    const today = await student.rpc('get_event_feed', { p_bucket: 'today', p_search: 'smoke test' });
    const tomorrow = await student.rpc('get_event_feed', { p_bucket: 'upcoming', p_search: 'smoke test' });
    const seen = [...(today.data ?? []), ...(tomorrow.data ?? [])].some((e) => e.id === id);
    check('student: published event shows in feed', seen);

    const del = await admin.from('events').delete().eq('id', id).select();
    check('admin: delete event', !del.error && del.data.length === 1, del.error?.message);
  }

  const path = `smoke/${Date.now()}.png`;
  const up = await admin.storage.from('media').upload(path, new Blob(['x'], { type: 'image/png' }));
  check('admin: upload to storage', !up.error, up.error?.message);
  if (!up.error) {
    const url = admin.storage.from('media').getPublicUrl(path).data.publicUrl;
    const res = await fetch(url);
    check('public: uploaded file downloadable by URL', res.ok, `HTTP ${res.status}`);
    const rm = await admin.storage.from('media').remove([path]);
    check('admin: delete from storage', !rm.error, rm.error?.message);
  }
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
