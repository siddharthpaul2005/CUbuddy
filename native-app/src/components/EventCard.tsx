import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { CalendarDays, Clock, ImageOff, MapPin, Trophy } from 'lucide-react-native';
import type { FeedEvent } from '../lib/types';
import { colors, radius, space, type, categoryColor } from '../lib/theme';
import { dayLabel, formatTimeRange, hasEnded, isHappeningNow } from '../lib/dates';

interface Props {
  event: FeedEvent;
  onPress: (event: FeedEvent) => void;
}

export const EventCard = memo(function EventCard({ event, onPress }: Props) {
  const live = isHappeningNow(event.starts_at, event.ends_at);
  const ended = !live && hasEnded(event.starts_at, event.ends_at);
  const accent = categoryColor(event.category_color);

  return (
    <Pressable
      onPress={() => onPress(event)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${event.title}. ${dayLabel(event.days_from_today, event.starts_at)}`}
    >
      <View style={[styles.posterWrap, !event.poster_url && styles.posterWrapEmpty]}>
        {event.poster_url ? (
          <Image
            source={event.poster_url}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top"
            transition={150}
            recyclingKey={event.id}
          />
        ) : (
          <View style={styles.posterEmpty}>
            <ImageOff color={colors.textDim} size={20} />
          </View>
        )}

        <View style={styles.badgeRow} pointerEvents="none">
          {event.category_name ? (
            <View style={[styles.badge, { borderColor: accent }]}>
              <View style={[styles.dot, { backgroundColor: accent }]} />
              <Text style={styles.badgeText} numberOfLines={1}>{event.category_name}</Text>
            </View>
          ) : null}
          <View style={styles.badgeSpacer} />
          {live ? (
            <View style={[styles.badge, styles.liveBadge]}>
              <View style={[styles.dot, { backgroundColor: '#fff' }]} />
              <Text style={[styles.badgeText, { color: '#fff' }]}>Live now</Text>
            </View>
          ) : event.is_featured ? (
            <View style={[styles.badge, styles.featuredBadge]}>
              <Text style={[styles.badgeText, { color: colors.onAccent }]}>Featured</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        {event.club_name ? (
          <Text style={[type.label, styles.club]} numberOfLines={1}>{event.club_name}</Text>
        ) : null}
        <Text style={type.cardTitle} numberOfLines={2}>{event.title}</Text>

        <View style={styles.metaList}>
          <MetaRow icon={<CalendarDays color={colors.accent} size={14} />}
            text={dayLabel(event.days_from_today, event.starts_at)} />
          <MetaRow icon={<Clock color={colors.accent} size={14} />}
            text={formatTimeRange(event.starts_at, event.ends_at) + (ended ? '  ·  Ended' : '')} />
          {event.venue ? <MetaRow icon={<MapPin color={colors.accent} size={14} />} text={event.venue} /> : null}
          {event.rewards ? <MetaRow icon={<Trophy color={colors.accent} size={14} />} text={event.rewards} /> : null}
        </View>
      </View>
    </Pressable>
  );
});

function MetaRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaIcon}>{icon}</View>
      <Text style={[type.meta, styles.metaText]} numberOfLines={1}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.85 },
  posterWrap: {
    height: 230,
    backgroundColor: colors.surface,
  },
  posterWrapEmpty: { height: 64 },
  posterEmpty: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: space.lg },
  badgeRow: {
    position: 'absolute',
    top: space.md,
    left: space.md,
    right: space.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSpacer: { flex: 1 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(7,7,10,0.78)',
    borderWidth: 1,
    borderColor: 'transparent',
    maxWidth: '62%',
  },
  liveBadge: { backgroundColor: colors.live },
  featuredBadge: { backgroundColor: colors.accent },
  badgeText: { ...type.label, fontSize: 10, color: colors.text },
  dot: { width: 6, height: 6, borderRadius: 3 },
  body: { padding: space.lg, gap: 6 },
  club: { color: colors.accent },
  metaList: { marginTop: 6, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { width: 22 },
  metaText: { flex: 1 },
});
