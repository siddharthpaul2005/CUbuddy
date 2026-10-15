import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { CalendarDays, Clock, Download, ExternalLink, Info, MapPin, Trophy, Users, X } from 'lucide-react-native';
import type { FeedEvent } from '../lib/types';
import { colors, radius, space, type, categoryColor } from '../lib/theme';
import { dayLabel, formatDate, formatTimeRange, hasEnded } from '../lib/dates';
import { savePosterToGallery } from '../lib/poster';

interface Props {
  event: FeedEvent | null;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: Props) {
  return (
    <Modal visible={!!event} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {event ? <DetailContent event={event} onClose={onClose} /> : null}
    </Modal>
  );
}

function DetailContent({ event, onClose }: { event: FeedEvent; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [saving, setSaving] = useState(false);
  const [aspect, setAspect] = useState(4 / 5);
  const ended = hasEnded(event.starts_at, event.ends_at);
  const accent = categoryColor(event.category_color);

  async function savePoster() {
    if (!event.poster_url) return;
    setSaving(true);
    try {
      const result = await savePosterToGallery(event.poster_url, event.id);
      if (result === 'saved') Alert.alert('Saved', 'Poster saved to your gallery.');
      if (result === 'denied') Alert.alert('Permission needed', 'Allow photo access in Settings to save posters.');
    } catch (e) {
      Alert.alert('Could not save poster', e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function openRegistration() {
    if (!event.registration_url) return;
    try {
      await WebBrowser.openBrowserAsync(event.registration_url);
    } catch {
      Linking.openURL(event.registration_url);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        {event.poster_url ? (
          <Image
            source={event.poster_url}
            style={{ width, height: Math.min(width / aspect, width * 1.6), backgroundColor: colors.surface }}
            contentFit="contain"
            onLoad={(e) => e.source.width && e.source.height && setAspect(e.source.width / e.source.height)}
          />
        ) : (
          <View style={{ height: insets.top + 64 }} />
        )}

        <View style={styles.content}>
          <View style={styles.tagRow}>
            {event.category_name ? (
              <View style={[styles.tag, { borderColor: accent }]}>
                <Text style={[styles.tagText, { color: accent }]}>{event.category_name}</Text>
              </View>
            ) : null}
            {event.club_name ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{event.club_name}</Text>
              </View>
            ) : null}
          </View>

          <Text style={type.title}>{event.title}</Text>

          <View style={styles.infoCard}>
            <InfoRow icon={<CalendarDays color={colors.accent} size={18} />} label="Date"
              value={fullDate(event)} />
            <InfoRow icon={<Clock color={colors.accent} size={18} />} label="Time"
              value={formatTimeRange(event.starts_at, event.ends_at) + (ended ? ' (ended)' : '')} />
            {event.venue ? <InfoRow icon={<MapPin color={colors.accent} size={18} />} label="Venue" value={event.venue} /> : null}
            {event.organized_by ? <InfoRow icon={<Users color={colors.accent} size={18} />} label="Organized by" value={event.organized_by} /> : null}
            {event.rewards ? <InfoRow icon={<Trophy color={colors.accent} size={18} />} label="Rewards" value={event.rewards} /> : null}
          </View>

          {event.description ? (
            <View style={{ gap: space.sm }}>
              <Text style={[type.label, { color: colors.textDim }]}>About</Text>
              <Text style={[type.body, { color: colors.text }]}>{event.description}</Text>
            </View>
          ) : null}

          {!event.registration_url ? (
            <View style={styles.note}>
              <Info color={colors.textMuted} size={16} />
              <Text style={[type.meta, { flex: 1 }]}>Registration details, if any, are on the poster.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <Pressable onPress={onClose} style={[styles.closeBtn, { top: insets.top + space.md }]} hitSlop={12}
        accessibilityRole="button" accessibilityLabel="Close">
        <X color={colors.text} size={22} />
      </Pressable>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + space.md }]}>
        {event.poster_url ? (
          <Pressable onPress={savePoster} disabled={saving}
            style={({ pressed }) => [styles.secondaryBtn, !event.registration_url && styles.flex1, pressed && styles.pressed]}
            accessibilityRole="button" accessibilityLabel="Save poster">
            {saving ? <ActivityIndicator color={colors.text} /> : <Download color={colors.text} size={18} />}
            <Text style={styles.secondaryText}>{saving ? 'Saving…' : 'Save poster'}</Text>
          </Pressable>
        ) : null}
        {event.registration_url ? (
          <Pressable onPress={openRegistration} disabled={ended}
            style={({ pressed }) => [styles.primaryBtn, ended && styles.disabled, pressed && styles.pressed]}
            accessibilityRole="button">
            <Text style={styles.primaryText}>{ended ? 'Event ended' : 'Register'}</Text>
            {!ended ? <ExternalLink color={colors.onAccent} size={18} /> : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

// "Today · Thu, 15 Oct", or just "Mon, 19 Oct" when there is no relative name.
function fullDate(event: FeedEvent) {
  const relative = dayLabel(event.days_from_today, event.starts_at);
  const absolute = formatDate(event.starts_at);
  return relative === absolute ? absolute : `${relative} · ${absolute}`;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[type.label, { color: colors.textDim, fontSize: 10 }]}>{label}</Text>
        <Text style={[type.body, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.lg, gap: space.lg },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tag: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
  },
  tagText: { ...type.label, fontSize: 10, color: colors.textMuted },
  infoCard: {
    backgroundColor: colors.surfaceRaised, borderRadius: radius.lg, padding: space.lg, gap: space.lg,
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
  infoIcon: { paddingTop: 2 },
  note: {
    flexDirection: 'row', alignItems: 'center', gap: space.sm, padding: space.md,
    borderRadius: radius.md, backgroundColor: colors.surface,
  },
  closeBtn: {
    position: 'absolute', right: space.lg, width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(7,7,10,0.75)', alignItems: 'center', justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border,
  },
  actionBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: space.md,
    paddingHorizontal: space.lg, paddingTop: space.md, backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border,
  },
  flex1: { flex: 1 },
  primaryBtn: {
    flex: 1, height: 50, borderRadius: radius.md, backgroundColor: colors.accent,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm,
  },
  primaryText: { color: colors.onAccent, fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    height: 50, paddingHorizontal: space.lg, borderRadius: radius.md, backgroundColor: colors.surfaceRaised,
    borderWidth: 1, borderColor: colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm,
  },
  secondaryText: { color: colors.text, fontSize: 15, fontWeight: '700' },
  disabled: { backgroundColor: colors.border },
  pressed: { opacity: 0.8 },
});
