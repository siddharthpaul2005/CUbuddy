// All event times are shown in IST regardless of the phone's timezone.
// Done by hand (fixed +05:30 offset, India has no DST) so it does not depend
// on the JS engine's Intl timezone support.

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ist(iso: string) {
  const d = new Date(new Date(iso).getTime() + IST_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
  };
}

export function formatTime(iso: string): string {
  const { hours, minutes } = ist(iso);
  const h12 = hours % 12 || 12;
  return `${h12}:${String(minutes).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
}

export function formatDate(iso: string): string {
  const { weekday, day, month } = ist(iso);
  return `${WEEKDAYS[weekday]}, ${day} ${MONTHS[month]}`;
}

export function formatTimeRange(startIso: string, endIso: string | null): string {
  if (!endIso) return formatTime(startIso);
  const sameDay = formatDate(startIso) === formatDate(endIso);
  return sameDay
    ? `${formatTime(startIso)} – ${formatTime(endIso)}`
    : `${formatTime(startIso)} – ${formatDate(endIso)}, ${formatTime(endIso)}`;
}

// Relative label for the date line on a card.
export function dayLabel(daysFromToday: number, iso: string): string {
  if (daysFromToday === 0) return 'Today';
  if (daysFromToday === 1) return 'Tomorrow';
  if (daysFromToday === -1) return 'Yesterday';
  return formatDate(iso);
}

export function isHappeningNow(startIso: string, endIso: string | null, now = Date.now()): boolean {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : start + 2 * 60 * 60 * 1000;
  return now >= start && now < end;
}

export function hasEnded(startIso: string, endIso: string | null, now = Date.now()): boolean {
  const end = endIso ? new Date(endIso).getTime() : new Date(startIso).getTime() + 2 * 60 * 60 * 1000;
  return now >= end;
}
