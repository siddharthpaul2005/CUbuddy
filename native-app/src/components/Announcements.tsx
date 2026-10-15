import { Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Megaphone } from 'lucide-react-native';
import type { Announcement } from '../lib/types';
import { colors, radius, space, type } from '../lib/theme';

// Banners managed from the admin panel's Announcements page.
export function Announcements({ items }: { items: Announcement[] }) {
  const { width } = useWindowDimensions();
  if (items.length === 0) return null;
  const cardWidth = items.length === 1 ? width - space.lg * 2 : width * 0.82;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={cardWidth + space.md}
      decelerationRate="fast"
      contentContainerStyle={styles.row}
    >
      {items.map((a) => (
        <Pressable
          key={a.id}
          disabled={!a.link_url}
          onPress={() => a.link_url && Linking.openURL(a.link_url)}
          style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && { opacity: 0.85 }]}
        >
          {a.image_url ? (
            <Image source={a.image_url} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.icon}>
              <Megaphone color={colors.accent} size={20} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{a.title}</Text>
            {a.body ? <Text style={[type.meta, { fontSize: 12 }]} numberOfLines={2}>{a.body}</Text> : null}
          </View>
          {a.link_url ? <ChevronRight color={colors.textDim} size={18} /> : null}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.lg, gap: space.md },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md,
    borderRadius: radius.lg, backgroundColor: colors.surfaceRaised,
    borderWidth: 1, borderColor: 'rgba(199,243,44,0.25)',
  },
  icon: {
    width: 44, height: 44, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(199,243,44,0.1)',
  },
  image: { width: 44, height: 44, borderRadius: radius.md },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
});
