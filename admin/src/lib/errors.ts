export function errorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
  return String(e);
}

// Empty form fields should be stored as NULL, not "".
export function blankToNull<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj } as Record<string, unknown>;
  for (const [k, v] of Object.entries(out)) {
    if (typeof v === 'string' && v.trim() === '') out[k] = null;
  }
  return out as T;
}
