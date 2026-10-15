import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { blankToNull, errorMessage } from '../lib/errors';
import { fromLocalInput, toLocalInput } from '../lib/dates';
import { removeImage } from '../lib/media';
import { ImageField } from './ImageField';

// A list + edit form for simple tables (clubs, categories, announcements).

export type Field =
  | { key: string; label: string; type: 'text' | 'url' | 'textarea' | 'color'; required?: boolean; placeholder?: string }
  | { key: string; label: string; type: 'number' }
  | { key: string; label: string; type: 'checkbox' }
  | { key: string; label: string; type: 'datetime' }
  | { key: string; label: string; type: 'image'; pathKey: string; folder: 'logos' | 'banners' };

type Row = Record<string, unknown> & { id: string };

interface Props {
  title: string;
  table: string;
  fields: Field[];
  defaults: Record<string, unknown>;
  orderBy: string[];
  renderSummary: (row: Row) => ReactNode;
  deleteWarning?: string;
}

function toFormValues(fields: Field[], row: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...row };
  for (const f of fields) {
    if (f.type === 'datetime') out[f.key] = toLocalInput(row[f.key] as string | null);
    else if (f.type !== 'checkbox' && f.type !== 'image' && f.type !== 'number' && row[f.key] == null) out[f.key] = '';
  }
  return out;
}

function toPayload(fields: Field[], values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.type === 'datetime') out[f.key] = fromLocalInput(values[f.key] as string);
    else if (f.type === 'number') out[f.key] = Number(values[f.key] ?? 0);
    else out[f.key] = values[f.key];
    if (f.type === 'image') out[f.pathKey] = values[f.pathKey] ?? null;
  }
  return blankToNull(out);
}

export function CrudPage({ title, table, fields, defaults, orderBy, renderSummary, deleteWarning }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<{ id: string | null; values: Record<string, unknown>; original: Record<string, unknown> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    let q = supabase.from(table).select('*');
    for (const col of orderBy) q = q.order(col);
    const { data, error } = await q;
    if (error) setError(error.message);
    else setRows(data as Row[]);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function startNew() {
    setError(null);
    setEditing({ id: null, values: toFormValues(fields, defaults), original: {} });
  }

  function startEdit(row: Row) {
    setError(null);
    setEditing({ id: row.id, values: toFormValues(fields, row), original: row });
  }

  function setValue(key: string, value: unknown) {
    setEditing((e) => (e ? { ...e, values: { ...e.values, [key]: value } } : e));
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(fields, editing.values);
      const { error } = editing.id
        ? await supabase.from(table).update(payload).eq('id', editing.id)
        : await supabase.from(table).insert(payload);
      if (error) throw error;
      for (const f of fields) {
        if (f.type === 'image' && editing.original[f.pathKey] && editing.original[f.pathKey] !== payload[f.pathKey]) {
          await removeImage(editing.original[f.pathKey] as string);
        }
      }
      setEditing(null);
      await load();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm(deleteWarning ?? 'Delete this item? This cannot be undone.')) return;
    const { error } = await supabase.from(table).delete().eq('id', row.id);
    if (error) return setError(error.message);
    for (const f of fields) if (f.type === 'image') await removeImage(row[f.pathKey] as string | null);
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {!editing && <button onClick={startNew} className="btn-primary">+ Add</button>}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {editing && (
        <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-5">
          <h2 className="font-semibold">{editing.id ? 'Edit' : 'New'}</h2>
          {fields.map((f) => {
            const v = editing.values[f.key];
            const id = `f-${f.key}`;
            if (f.type === 'image') {
              const original = editing.original[f.pathKey];
              const current = editing.values[f.pathKey] as string | null;
              return (
                <ImageField
                  key={f.key}
                  label={f.label}
                  folder={f.folder}
                  url={(v as string) || null}
                  onUploaded={(img) => {
                    if (current && current !== original) removeImage(current);
                    setValue(f.key, img.url);
                    setValue(f.pathKey, img.path);
                  }}
                  onClear={() => {
                    if (current && current !== original) removeImage(current);
                    setValue(f.key, null);
                    setValue(f.pathKey, null);
                  }}
                />
              );
            }
            if (f.type === 'checkbox') {
              return (
                <label key={f.key} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!v} onChange={(e) => setValue(f.key, e.target.checked)} />
                  {f.label}
                </label>
              );
            }
            return (
              <div key={f.key}>
                <label className="label" htmlFor={id}>{f.label}{'required' in f && f.required ? ' *' : ''}</label>
                {f.type === 'textarea' ? (
                  <textarea id={id} rows={3} className="input" value={v as string}
                    onChange={(e) => setValue(f.key, e.target.value)} />
                ) : (
                  <input
                    id={id}
                    className={f.type === 'color' ? 'h-10 w-20 rounded border border-slate-300' : 'input'}
                    type={f.type === 'datetime' ? 'datetime-local' : f.type}
                    required={'required' in f && f.required}
                    placeholder={'placeholder' in f ? f.placeholder : undefined}
                    value={(v as string | number) ?? ''}
                    onChange={(e) => setValue(f.key, e.target.value)}
                  />
                )}
              </div>
            );
          })}
          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card divide-y divide-slate-100">
        {rows.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Nothing here yet.</p>}
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between gap-4 p-3">
            <div className="min-w-0 flex-1">{renderSummary(row)}</div>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => startEdit(row)} className="btn-secondary">Edit</button>
              <button onClick={() => remove(row)} className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
