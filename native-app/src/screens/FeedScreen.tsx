import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { getEventFeed } from '../lib/api';
import type { Bucket, FeedEvent, FeedFilters } from '../lib/types';
import { colors, space, type } from '../lib/theme';
import { formatDate, hasEnded, isHappeningNow } from '../lib/dates';
import { useRemote } from '../hooks/useRemote';
import { useBootstrap } from '../hooks/useBootstrap';
import { EventCard } from '../components/EventCard';
import { FilterBar, Chip } from '../components/FilterBar';
import { Announcements } from '../components/Announcements';
import { EmptyView, ErrorView, LoadingView } from '../components/StateView';

interface Props {
  bucket: Bucket;
  active: boolean;
  onOpenEvent: (event: FeedEvent) => void;
}

interface Section {
  key: string;
  title: string | null;
  data: FeedEvent[];
}

const TITLES: Record<Bucket, string> = { today: 'Today', past: 'Past events', upcoming: 'Upcoming' };

export function FeedScreen({ bucket, active, onOpenEvent }: Props) {
  const bootstrap = useBootstrap();
  const config = bootstrap.data?.config ?? {};
  const pastDays = Number(config.past_days ?? 4);
  const upcomingDays = Number(config.upcoming_days ?? 15);

  const [filters, setFilters] = useState<FeedFilters>({ clubId: null, categoryId: null });
  const [pastDay, setPastDay] = useState<number | null>(null); // e.g. -1 = yesterday
  // Don't fetch a tab until it is first opened.
  const [visited, setVisited] = useState(active);
  if (active && !visited) setVisited(true);

  const feed = useRemote(
    () => getEventFeed(bucket, filters),
    [bucket, filters.clubId, filters.categoryId],
    visited,
  );

  // Tab switched back to: pick up admin edits made since we last loaded.
  const { reloadIfStale, refresh: refreshFeed } = feed;
  useEffect(() => {
    if (active) reloadIfStale();
  }, [active, reloadIfStale]);

  const { refresh: refreshBootstrap } = bootstrap;
  const refreshAll = useCallback(() => {
    refreshFeed();
    refreshBootstrap();
  }, [refreshFeed, refreshBootstrap]);

  const sections = useMemo(
    () => buildSections(bucket, feed.data ?? [], pastDay),
    [bucket, feed.data, pastDay],
  );

  const subtitle =
    bucket === 'today' ? formatDate(new Date().toISOString())
    : bucket === 'past' ? `Last ${pastDays} days`
    : `Next ${upcomingDays} days`;

  const header = (
    <View style={styles.header}>
      <View style={styles.titleBlock}>
        <View style={styles.titleRow}>
          <Text style={type.title}>{TITLES[bucket]}</Text>
          {feed.loading && feed.data ? <ActivityIndicator color={colors.accent} size="small" /> : null}
        </View>
        <Text style={type.meta}>{subtitle}</Text>
      </View>

      {bucket === 'today' ? <Announcements items={bootstrap.data?.announcements ?? []} /> : null}

      <FilterBar
        clubs={bootstrap.data?.clubs ?? []}
        categories={bootstrap.data?.categories ?? []}
        filters={filters}
        onChange={setFilters}
      />

      {bucket === 'past' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
          <Chip label="All days" active={pastDay === null} onPress={() => setPastDay(null)} />
          {Array.from({ length: pastDays }, (_, i) => -(i + 1)).map((d) => (
            <Chip key={d} label={pastDayLabel(d)} active={pastDay === d} onPress={() => setPastDay(d)} />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );

  const hasFilters = !!(filters.clubId || filters.categoryId || pastDay !== null);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.cardWrap}>
          <EventCard event={item} onPress={onOpenEvent} />
        </View>
      )}
      renderSectionHeader={({ section }) =>
        section.title ? (
          <Text style={[type.label, styles.sectionTitle]}>{section.title}</Text>
        ) : null
      }
      ListHeaderComponent={header}
      ListEmptyComponent={
        feed.loading && !feed.data ? <LoadingView />
        : feed.error && !feed.data ? <ErrorView message={feed.error} onRetry={refreshAll} />
        : <EmptyView title={hasFilters ? 'No matching events' : 'Nothing here yet'} message={emptyMessage(bucket, hasFilters)} />
      }
      ListFooterComponent={feed.error && feed.data ? (
        <Text style={[type.meta, styles.staleNote]}>Showing saved results · {feed.error}</Text>
      ) : null}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={feed.refreshing} onRefresh={refreshAll}
          tintColor={colors.accent} colors={[colors.accent]} progressBackgroundColor={colors.surfaceRaised} />
      }
      initialNumToRender={4}
      windowSize={7}
    />
  );
}

function buildSections(bucket: Bucket, events: FeedEvent[], pastDay: number | null): Section[] {
  if (events.length === 0) return [];

  if (bucket === 'today') {
    const now = Date.now();
    const live = events.filter((e) => isHappeningNow(e.starts_at, e.ends_at, now));
    const ended = events.filter((e) => !live.includes(e) && hasEnded(e.starts_at, e.ends_at, now));
    const later = events.filter((e) => !live.includes(e) && !ended.includes(e));
    return [
      { key: 'live', title: live.length ? 'Happening now' : null, data: live },
      { key: 'later', title: later.length && (live.length || ended.length) ? 'Later today' : null, data: later },
      { key: 'ended', title: ended.length ? 'Earlier today' : null, data: ended },
    ].filter((s) => s.data.length > 0);
  }

  if (bucket === 'past') {
    const visible = pastDay === null ? events : events.filter((e) => e.days_from_today === pastDay);
    const days = [...new Set(visible.map((e) => e.days_from_today))].sort((a, b) => b - a);
    return days.map((d) => ({
      key: String(d),
      title: pastDayLabel(d),
      data: visible.filter((e) => e.days_from_today === d),
    }));
  }

  const groups: Section[] = [
    { key: 'tomorrow', title: 'Tomorrow', data: [] },
    { key: 'week', title: 'This week', data: [] },
    { key: 'next', title: 'Next week', data: [] },
    { key: 'later', title: 'Later', data: [] },
  ];
  for (const e of events) {
    const d = e.days_from_today;
    groups[d <= 1 ? 0 : d <= 7 ? 1 : d <= 14 ? 2 : 3].data.push(e);
  }
  return groups.filter((g) => g.data.length > 0);
}

function pastDayLabel(daysFromToday: number) {
  return daysFromToday === -1 ? 'Yesterday' : `${-daysFromToday} days ago`;
}

function emptyMessage(bucket: Bucket, filtered: boolean) {
  if (filtered) return 'Try removing a filter.';
  if (bucket === 'today') return 'No events today. Check Upcoming for what’s next.';
  if (bucket === 'past') return 'No events in the last few days.';
  return 'No upcoming events have been posted yet.';
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl, flexGrow: 1 },
  header: { gap: space.lg, paddingTop: space.lg, paddingBottom: space.sm },
  titleBlock: { paddingHorizontal: space.lg, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dayRow: { gap: space.sm, paddingHorizontal: space.lg },
  sectionTitle: { color: colors.textDim, paddingHorizontal: space.lg, paddingTop: space.lg, paddingBottom: space.sm },
  cardWrap: { paddingHorizontal: space.lg, paddingVertical: space.sm },
  staleNote: { textAlign: 'center', padding: space.lg, color: colors.danger, fontSize: 12 },
});
