export const colors = {
  bg: '#07070a',
  surface: '#141418',
  surfaceRaised: '#1b1b1f',
  border: '#2a292e',
  text: '#f4f4f5',
  textMuted: '#a1a1aa',
  textDim: '#71717a',
  accent: '#c7f32c',
  onAccent: '#161e00',
  danger: '#f87171',
  live: '#ff5a5a',
} as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const type = {
  title: { fontSize: 26, fontWeight: '800' as const, color: colors.text, letterSpacing: 0.2 },
  cardTitle: { fontSize: 18, fontWeight: '700' as const, color: colors.text, lineHeight: 23 },
  body: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  meta: { fontSize: 13, color: colors.textMuted },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const },
};

// Category colour from the admin panel, with a safe fallback.
export function categoryColor(color: string | null | undefined): string {
  return color && /^#[0-9a-f]{6}$/i.test(color) ? color : colors.accent;
}
