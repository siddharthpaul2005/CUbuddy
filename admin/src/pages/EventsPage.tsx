import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../lib/supabase';
import type { EventRow } from '../lib/types';
import { addDays, formatDateTime, startOfToday } from '../lib/dates';
import { errorMessage } from '../lib/errors';
import { removeImage } from '../lib/media';

type Row = EventRow & { clubs: { name: string } | null; categories: { name: string } | null };
type Filter = 'all' | 'today' | 'upcoming' | 'past' | 'drafts';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'drafts', label: 'Hidden' },
];

export function EventsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const today = startOfToday();
    let q = supabase.from('events').select('*, clubs(name), categories(name)');

    if (filter === 'today') {
      q = q.gte('starts_at', today.toISOString()).lt('starts_at', addDays(today, 1).toISOString()).order('starts_at');
    } else if (filter === 'upcoming') {
      q = q.gte('starts_at', addDays(today, 1).toISOString()).order('starts_at');
    } else if (filter === 'past') {
      q = q.lt('starts_at', today.toISOString()).order('starts_at', { ascending: false });
    } else if (filter === 'drafts') {
      q = q.eq('is_published', false).order('starts_at', { ascending: false });
    } else {
      q = q.order('starts_at', { ascending: false });
    }
    if (search.trim()) q = q.ilike('title', `%${search.trim()}%`);

    const { data, error } = await q.limit(200);
    if (error) setError(error.message);
    else setRows(data as Row[]);
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search]);

  async function togglePublished(row: Row) {
    const { error } = await supabase.from('events').update({ is_published: !row.is_published }).eq('id', row.id);
    if (error) return setError(error.message);
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_published: !r.is_published } : r)));
  }

  async function remove(row: Row) {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('events').delete().eq('id', row.id);
      if (error) throw error;
      await removeImage(row.poster_path);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link to="/events/new" className="btn-primary">+ New event</Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === f.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
        <input className="input ml-auto max-w-xs" placeholder="Search title…" value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Poster</th>
              <th className="p-3">Event</th>
              <th className="p-3">When</th>
              <th className="p-3">Visible</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No events.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="p-3">
                    {row.poster_url ? (
                      <img src={row.poster_url} alt="" className="h-16 w-12 rounded object-cover" />
                    ) : (
                      <div className="h-16 w-12 rounded bg-slate-100" />
                    )}
                  </td>
                  <td className="p-3">
                    <div className="font-medium">
                      {row.title} {row.is_featured && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">Featured</span>}
                    </div>
                    <div className="text-xs text-slate-500">
                      {[row.clubs?.name, row.categories?.name, row.venue].filter(Boolean).join(' · ') || '—'}
                    </div>
                  </td>
                  <td className="whitespace-nowrap p-3 text-slate-600">{formatDateTime(row.starts_at)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => togglePublished(row)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {row.is_published ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="whitespace-nowrap p-3 text-right">
                    <Link to={`/events/${row.id}`} className="btn-secondary mr-2">Edit</Link>
                    <button onClick={() => remove(row)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
