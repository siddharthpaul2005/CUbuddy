// Creates (or re-links) an admin login.
//
//   npm run admin:create -- <email> <password> "<name>"
//
// Run it once per admin. Running it again for an existing email resets that
// admin's password and keeps them in the admins table.

import { createClient } from '@supabase/supabase-js';

const [email, password, name = null] = process.argv.slice(2);
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  process.exit(1);
}
if (!email || !password) {
  console.error('Usage: npm run admin:create -- <email> <password> "<name>"');
  process.exit(1);
}
if (password.length < 10) {
  console.error('Use a password of at least 10 characters.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(target) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
}

let user = await findUserByEmail(email);

if (user) {
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (error) throw error;
  console.log(`Existing user ${email}: password updated.`);
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) throw error;
  user = data.user;
  console.log(`Created user ${email}.`);
}

const { error: adminError } = await supabase
  .from('admins')
  .upsert({ user_id: user.id, email, name }, { onConflict: 'user_id' });
if (adminError) throw adminError;

console.log(`${email} is an admin.`);
