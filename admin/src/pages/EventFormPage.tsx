import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { supabase } from '../lib/supabase';
import type { Category, Club, EventRow } from '../lib/types';
import { fromLocalInput, toLocalInput } from '../lib/dates';
import { blankToNull, errorMessage } from '../lib/errors';
import { removeImage } from '../lib/media';
import { ImageField } from '../components/ImageField';

interface FormState {
  title: string;
  description: string;
  club_id: string;
  category_id: string;
  organized_by: string;
  venue: string;
  starts_at: string; // datetime-local value
  ends_at: string;
  rewards: string;
  registration_url: string;
  poster_url: string | null;
  poster_path: string | null;
  is_published: boolean;
  is_featured: boolean;
}

const EMPTY: FormState = {
  title: '', description: '', club_id: '', category_id: '', organized_by: '', venue: '',
  starts_at: '', ends_at: '', rewards: '', registration_url: '',
  poster_url: null, poster_path: null, is_published: true, is_featured: false,
};

export function EventFormPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [originalPosterPath, setOriginalPosterPath] = useState<string | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('clubs').select('*').order('sort_order').order('name').then(({ data }) => setClubs(data ?? []));
    supabase.from('categories').select('*').order('sort_order').order('name').then(({ data }) => setCategories(data ?? []));
    if (isNew) return;
    supabase.from('events').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error) setError(error.message);
      else {
        const e = data as EventRow;
        setForm({
          title: e.title, description: e.description ?? '', club_id: e.club_id ?? '', category_id: e.category_id ?? '',
          organized_by: e.organized_by ?? '', venue: e.venue ?? '',
          starts_at: toLocalInput(e.starts_at), ends_at: toLocalInput(e.ends_at),
          rewards: e.rewards ?? '', registration_url: e.registration_url ?? '',
          poster_url: e.poster_url, poster_path: e.poster_path,
          is_published: e.is_published, is_featured: e.is_featured,
        });
        setOriginalPosterPath(e.poster_path);
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = blankToNull({
        ...form,
        starts_at: fromLocalInput(form.starts_at),
        ends_at: fromLocalInput(form.ends_at),
      });
      const { error } = isNew
        ? await supabase.from('events').insert(payload)
        : await supabase.from('events').update(payload).eq('id', id);
      if (error) throw error;
      if (originalPosterPath && originalPosterPath !== form.poster_path) await removeImage(originalPosterPath);
      navigate('/events');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isNew ? 'New event' : 'Edit event'}</h1>
        <Link to="/events" className="text-sm text-indigo-600 hover:underline">← Back to events</Link>
      </div>

      <div className="card space-y-4 p-5">
        <ImageField
          label="Poster"
          folder="posters"
          url={form.poster_url}
          onUploaded={(img) => {
            // A fresh upload that replaces another fresh upload is never saved; clean it up.
            if (form.poster_path && form.poster_path !== originalPosterPath) removeImage(form.poster_path);
            setForm((f) => ({ ...f, poster_url: img.url, poster_path: img.path }));
          }}
          onClear={() => {
            if (form.poster_path && form.poster_path !== originalPosterPath) removeImage(form.poster_path);
            setForm((f) => ({ ...f, poster_url: null, poster_path: null }));
          }}
        />

        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input id="title" className="input" required value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="club">Club</label>
            <select id="club" className="input" value={form.club_id} onChange={(e) => set('club_id', e.target.value)}>
              <option value="">— None —</option>
              {clubs.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active ? '' : ' (inactive)'}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="category">Event type</label>
            <select id="category" className="input" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="starts">Starts * (IST)</label>
            <input id="starts" type="datetime-local" className="input" required value={form.starts_at}
              onChange={(e) => set('starts_at', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ends">Ends (IST)</label>
            <input id="ends" type="datetime-local" className="input" value={form.ends_at} min={form.starts_at}
              onChange={(e) => set('ends_at', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="venue">Venue</label>
            <input id="venue" className="input" value={form.venue} onChange={(e) => set('venue', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="org">Organized by</label>
            <input id="org" className="input" value={form.organized_by} onChange={(e) => set('organized_by', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="desc">Description</label>
          <textarea id="desc" rows={4} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="rewards">Rewards / prizes</label>
          <input id="rewards" className="input" placeholder="e.g. ₹5,000 pool + certificates" value={form.rewards}
            onChange={(e) => set('rewards', e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="reg">Registration link</label>
          <input id="reg" type="url" className="input" placeholder="https://… (leave empty if details are on the poster)"
            value={form.registration_url} onChange={(e) => set('registration_url', e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} />
            Published (visible in app)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
            Featured (shown first)
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save event'}</button>
        <Link to="/events" className="btn-secondary">Cancel</Link>
      </div>
    </form>
  );
}
