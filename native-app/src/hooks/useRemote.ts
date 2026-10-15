import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

// Data shown in the app is edited live from the admin panel, so refetch:
//   * on mount and whenever `deps` change
//   * when the app comes back to the foreground
//   * on pull-to-refresh (call `refresh`)
// Old data stays on screen while a refetch runs.

const REFETCH_AFTER_MS = 30_000;

export interface Remote<T> {
  data: T | undefined;
  error: string | null;
  loading: boolean; // nothing loaded yet for the current deps (first load or filters changed)
  refreshing: boolean; // user pulled to refresh
  refresh: () => void; // shows the pull-to-refresh spinner
  reloadIfStale: () => void; // silent, e.g. when a tab becomes visible again
}

export function useRemote<T>(load: () => Promise<T>, deps: unknown[], enabled = true): Remote<T> {
  const key = JSON.stringify(deps);
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string | null>(null);
  const [settledKey, setSettledKey] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const requestId = useRef(0);
  const lastLoadedAt = useRef(0);
  const latest = useRef({ load, key });
  useLayoutEffect(() => {
    latest.current = { load, key };
  });

  const run = useCallback(async () => {
    const id = ++requestId.current;
    const { load: doLoad, key: requestKey } = latest.current;
    try {
      const result = await doLoad();
      if (id !== requestId.current) return; // a newer request superseded this one
      setData(result);
      setError(null);
      lastLoadedAt.current = Date.now();
    } catch (e) {
      if (id !== requestId.current) return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (id === requestId.current) {
        setSettledKey(requestKey);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (enabled) run();
  }, [enabled, run, key]);

  useEffect(() => {
    if (!enabled) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && Date.now() - lastLoadedAt.current > REFETCH_AFTER_MS) run();
    });
    return () => sub.remove();
  }, [enabled, run]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    run();
  }, [run]);

  const reloadIfStale = useCallback(() => {
    if (lastLoadedAt.current && Date.now() - lastLoadedAt.current > REFETCH_AFTER_MS) run();
  }, [run]);

  return { data, error, loading: settledKey !== key, refreshing, refresh, reloadIfStale };
}
