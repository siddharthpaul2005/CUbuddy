// Tiny client for the two public backend endpoints. Plain fetch against the
// Supabase REST API: no login, no SDK needed for read-only access.

import type { Bootstrap, Bucket, FeedEvent, FeedFilters } from './types';

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!URL || !KEY) {
  throw new Error('Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in native-app/.env');
}

const TIMEOUT_MS = 15000;

async function rpc<T>(fn: string, body: Record<string, unknown> = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: {
        apikey: KEY!,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Server error ${res.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`);
    }
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') throw new Error('The server took too long to respond.');
    if (e instanceof TypeError) throw new Error('No internet connection.');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export function getBootstrap() {
  return rpc<Bootstrap>('get_app_bootstrap');
}

export function getEventFeed(bucket: Bucket, filters: FeedFilters) {
  return rpc<FeedEvent[]>('get_event_feed', {
    p_bucket: bucket,
    p_club_id: filters.clubId,
    p_category_id: filters.categoryId,
    p_limit: 200,
  });
}
