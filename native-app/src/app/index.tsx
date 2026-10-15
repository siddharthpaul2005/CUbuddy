import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Flame, History, Wrench } from 'lucide-react-native';
import type { Bucket, FeedEvent } from '../lib/types';
import { colors, radius, space, type } from '../lib/theme';
import { useBootstrap } from '../hooks/useBootstrap';
import { FeedScreen } from '../screens/FeedScreen';
import { EventDetail } from '../components/EventDetail';
import { CalendarArrowRight } from '../components/CalendarArrowRight';

const TABS: { bucket: Bucket; label: string; Icon: React.ComponentType<{ color: string; size?: number }> }[] = [
  { bucket: 'today', label: 'LIVE', Icon: Flame },
  { bucket: 'past', label: 'PAST', Icon: History },
  { bucket: 'upcoming', label: 'FUTURE', Icon: CalendarArrowRight },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const bootstrap = useBootstrap();
  const [tab, setTab] = useState<Bucket>('today');
  const [openEvent, setOpenEvent] = useState<FeedEvent | null>(null);

  const config = bootstrap.data?.config;
  if (config?.maintenance_mode) {
    return (
      <View style={[styles.screen, styles.maintenance, { paddingTop: insets.top }]}>
        <Wrench color={colors.accent} size={40} />
        <Text style={[type.title, { textAlign: 'center' }]}>Be right back</Text>
        <Text style={[type.body, { textAlign: 'center' }]}>
          {config.maintenance_message || 'CUbuddy is being updated.'}
        </Text>
        <Pressable onPress={bootstrap.refresh} style={styles.retry}>
          <Text style={styles.retryText}>Check again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.appBar}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>CU</Text>
        </View>
        <Text style={styles.appName}>
          CU<Text style={{ color: colors.accent }}>buddy</Text>
        </Text>
      </View>

      <View style={styles.body}>
        {TABS.map(({ bucket }) => (
          // All tabs stay mounted so scroll position and filters survive tab switches.
          <View key={bucket} style={[StyleSheet.absoluteFill, tab !== bucket && styles.hidden]}
            pointerEvents={tab === bucket ? 'auto' : 'none'}>
            <FeedScreen bucket={bucket} active={tab === bucket} onOpenEvent={setOpenEvent} />
          </View>
        ))}
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
        {TABS.map(({ bucket, label, Icon }) => {
          const selected = tab === bucket;
          const itemColor = selected ? colors.accent : colors.textMuted;
          return (
            <Pressable
              key={bucket}
              onPress={() => setTab(bucket)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
            >
              <View style={styles.tabIcon}>
                <Icon color={itemColor} size={22} />
              </View>
              <Text style={[styles.tabLabel, selected && styles.tabLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <EventDetail event={openEvent} onClose={() => setOpenEvent(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  appBar: {
    height: 52, flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  logo: {
    width: 30, height: 30, borderRadius: 9, backgroundColor: colors.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  logoText: { color: colors.onAccent, fontWeight: '900', fontSize: 13 },
  appName: { color: colors.text, fontSize: 19, fontWeight: '800' },
  body: { flex: 1 },
  hidden: { opacity: 0 },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
  },
  tabIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  tabLabelActive: {
    color: colors.accent,
  },
  maintenance: { alignItems: 'center', justifyContent: 'center', gap: space.lg, padding: space.xl },
  retry: { paddingHorizontal: space.xl, height: 44, justifyContent: 'center', borderRadius: radius.md, backgroundColor: colors.accent },
  retryText: { color: colors.onAccent, fontWeight: '800' },
});
