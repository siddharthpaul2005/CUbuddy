import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, RefreshControl, ScrollView, SectionList, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getEventFeed } from '../lib/api';
import type { Bucket, FeedEvent, FeedFilters } from '../lib/types';
import { colors, radius, space, type } from '../lib/theme';
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
  const [pastDay, setPastDay] = useState<number | null>(-1); // default to YESTERDAY (-1)
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
      {bucket === 'today' ? (
        <View style={styles.liveHero}>
          <Text style={styles.liveHeroTitle}>TODAY'S DROP</Text>
          <Text style={styles.liveHeroSubtitle}>
            {feed.data && feed.data.length > 0
              ? `${feed.data.length} high-stakes campus showdown${feed.data.length === 1 ? '' : 's'} live right now`
              : '3 high-stakes campus showdowns live right now'}
          </Text>
          <View style={styles.liveHeroLine} />
        </View>
      ) : bucket === 'past' ? (
        <View style={styles.pastHero}>
          <Text style={styles.pastHeroTitle}>PAST EVENTS</Text>
          <Text style={styles.pastHeroSubtitle}>
            Browse archived campus showdowns & verified scoreboards
          </Text>
          <LinearGradient
            colors={['#c7f32c', 'rgba(199,243,44,0.4)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.pastHeroLine}
          />
        </View>
      ) : (
        <View style={styles.upcomingHero}>
          <View style={styles.upcomingHeaderRow}>
            <Text style={styles.upcomingHeroTitle}>UPCOMING EVENTS</Text>
            <View style={styles.fixtureBadge}>
              <Text style={styles.fixtureBadgeCount}>{feed.data?.length ?? 3}</Text>
              <Text style={styles.fixtureBadgeText}>
                {(feed.data?.length ?? 3) === 1 ? 'FIXTURE' : 'FIXTURES'}
              </Text>
            </View>
          </View>
          <Text style={styles.upcomingHeroSubtitle}>
            Lock in your spot for upcoming campus tournaments, showdowns & showcases.
          </Text>
          <View style={styles.upcomingHeroLine} />
        </View>
      )}

      {bucket === 'past' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayRow}>
          {Array.from({ length: pastDays }, (_, i) => -(i + 1)).map((d) => {
            const active = pastDay === d;
            return (
              <Pressable
                key={d}
                onPress={() => setPastDay((cur) => (cur === d ? null : d))}
                style={[styles.pastChip, active && styles.pastChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.pastChipText, active && styles.pastChipTextActive]}>
                  {pastDayLabel(d).toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      {bucket === 'today' ? <Announcements items={bootstrap.data?.announcements ?? []} /> : null}

      <FilterBar
        clubs={bootstrap.data?.clubs ?? []}
        categories={bootstrap.data?.categories ?? []}
        filters={filters}
        onChange={setFilters}
      />
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
  liveHero: {
    paddingHorizontal: space.lg,
    alignItems: 'center',
    paddingTop: space.xs,
  },
  liveHeroTitle: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Impact',
      android: 'sans-serif-condensed',
      web: 'Impact, Anton, sans-serif',
      default: 'Impact',
    }),
  },
  liveHeroSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  liveHeroLine: {
    width: '100%',
    height: 2.5,
    backgroundColor: colors.accent,
    borderRadius: 999,
    marginTop: space.md,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  pastHero: {
    paddingHorizontal: space.lg,
    paddingTop: space.xs,
    alignItems: 'flex-start',
  },
  pastHeroTitle: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontFamily: Platform.select({
      ios: 'Impact',
      android: 'sans-serif-condensed',
      web: 'Impact, Anton, sans-serif',
      default: 'Impact',
    }),
  },
  pastHeroSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'left',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  pastHeroLine: {
    width: '100%',
    height: 2.5,
    borderRadius: 999,
    marginTop: space.md,
    shadowColor: 'rgba(199,243,44,0.4)',
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  pastChip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastChipActive: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  pastChipText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textMuted,
  },
  pastChipTextActive: {
    color: colors.onAccent,
    fontWeight: '800',
  },
  upcomingHero: {
    paddingHorizontal: space.lg,
    paddingTop: space.xs,
  },
  upcomingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  upcomingHeroTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontFamily: Platform.select({
      ios: 'Impact',
      android: 'sans-serif-condensed',
      web: 'Impact, Anton, sans-serif',
      default: 'Impact',
    }),
    lineHeight: 38,
  },
  fixtureBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  fixtureBadgeCount: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.accent,
    lineHeight: 16,
  },
  fixtureBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.accent,
    textTransform: 'uppercase',
    lineHeight: 12,
  },
  upcomingHeroSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'left',
    marginTop: 6,
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  upcomingHeroLine: {
    width: '100%',
    height: 2.5,
    backgroundColor: colors.accent,
    borderRadius: 999,
    marginTop: space.md,
    shadowColor: colors.accent,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
});
