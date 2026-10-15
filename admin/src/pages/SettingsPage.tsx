import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AppConfigRow } from '../lib/types';
import { errorMessage } from '../lib/errors';

// Values are JSON: numbers as 4, text as "hello", booleans as true/false.
export function SettingsPage() {
  const [rows, setRows] = useState<AppConfigRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from('app_config').select('*').order('key');
    if (error) return setError(error.message);
    setRows(data as AppConfigRow[]);
    setDrafts(Object.fromEntries((data as AppConfigRow[]).map((r) => [r.key, JSON.stringify(r.value)])));
  }

  useEffect(() => {
    load();
  }, []);

  async function save(key: string) {
    setError(null);
    setSaved(null);
    try {
      const value = JSON.parse(drafts[key]);
      const { error } = await supabase.from('app_config').update({ value }).eq('key', key);
      if (error) throw error;
      setSaved(key);
      await load();
    } catch (e) {
      setError(`${key}: ${e instanceof SyntaxError ? 'not valid JSON (wrap text in "quotes")' : errorMessage(e)}`);
    }
  }

  async function add() {
    const key = newKey.trim();
    if (!key) return;
    const { error } = await supabase.from('app_config').insert({ key, value: '' });
    if (error) return setError(error.message);
    setNewKey('');
    await load();
  }

  async function remove(key: string) {
    if (!confirm(`Delete setting "${key}"? The app may rely on it.`)) return;
    const { error } = await supabase.from('app_config').delete().eq('key', key);
    if (error) return setError(error.message);
    await load();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">App settings</h1>
      <p className="text-sm text-slate-600">
        The app reads these on startup. Values are JSON: numbers like <code>4</code>, text in quotes like{' '}
        <code>"hello"</code>, and <code>true</code>/<code>false</code>.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="card divide-y divide-slate-100">
        {rows.map((r) => (
          <div key={r.key} className="grid gap-2 p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
            <div>
              <div className="font-mono text-sm font-semibold">{r.key}</div>
              <div className="text-xs text-slate-500">{r.description}</div>
            </div>
            <input
              className="input font-mono"
              value={drafts[r.key] ?? ''}
              onChange={(e) => setDrafts((d) => ({ ...d, [r.key]: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <button
                className="btn-primary"
                disabled={drafts[r.key] === JSON.stringify(r.value)}
                onClick={() => save(r.key)}
              >
                Save
              </button>
              <button className="btn-danger" onClick={() => remove(r.key)}>✕</button>
              {saved === r.key && <span className="text-xs text-green-600">Saved</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="input max-w-xs font-mono" placeholder="new_setting_key" value={newKey}
          onChange={(e) => setNewKey(e.target.value)} />
        <button className="btn-secondary" onClick={add}>Add setting</button>
      </div>
    </div>
  );
}
