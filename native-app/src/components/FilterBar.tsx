import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronDown, X } from 'lucide-react-native';
import type { Category, Club, FeedFilters } from '../lib/types';
import { colors, radius, space, type, categoryColor } from '../lib/theme';

interface Props {
  clubs: Club[];
  categories: Category[];
  filters: FeedFilters;
  onChange: (filters: FeedFilters) => void;
}

// One scrollable row: [Club ▾] [All] [Technical] [Cultural] ...
export function FilterBar({ clubs, categories, filters, onChange }: Props) {
  const [clubPickerOpen, setClubPickerOpen] = useState(false);
  const selectedClub = clubs.find((c) => c.id === filters.clubId);

  return (
    <>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {clubs.length > 0 ? (
          <Chip
            label={selectedClub ? selectedClub.short_name || selectedClub.name : 'All clubs'}
            active={!!selectedClub}
            trailing={<ChevronDown color={selectedClub ? colors.onAccent : colors.textMuted} size={14} />}
            onPress={() => setClubPickerOpen(true)}
          />
        ) : null}
        {clubs.length > 0 && categories.length > 0 ? <View style={styles.divider} /> : null}
        {categories.length > 0 ? (
          <Chip label="All types" active={!filters.categoryId} onPress={() => onChange({ ...filters, categoryId: null })} />
        ) : null}
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            active={filters.categoryId === c.id}
            dotColor={categoryColor(c.color)}
            onPress={() => onChange({ ...filters, categoryId: filters.categoryId === c.id ? null : c.id })}
          />
        ))}
      </ScrollView>

      <ClubPicker
        visible={clubPickerOpen}
        clubs={clubs}
        selectedId={filters.clubId}
        onSelect={(clubId) => {
          setClubPickerOpen(false);
          onChange({ ...filters, clubId });
        }}
        onClose={() => setClubPickerOpen(false)}
      />
    </>
  );
}

export function Chip({ label, active, onPress, dotColor, trailing }: {
  label: string;
  active: boolean;
  onPress: () => void;
  dotColor?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {dotColor && !active ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>{label}</Text>
      {trailing}
    </Pressable>
  );
}

function ClubPicker({ visible, clubs, selectedId, onSelect, onClose }: {
  visible: boolean;
  clubs: Club[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const options = [{ id: null as string | null, name: 'All clubs' }, ...clubs];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close club picker" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]}>
        <View style={styles.sheetHeader}>
          <Text style={[type.cardTitle]}>Filter by club</Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <X color={colors.textMuted} size={22} />
          </Pressable>
        </View>
        <ScrollView style={{ maxHeight: 420 }}>
          {options.map((club) => {
            const selected = club.id === selectedId;
            return (
              <Pressable key={club.id ?? 'all'} onPress={() => onSelect(club.id)}
                style={({ pressed }) => [styles.option, pressed && { backgroundColor: colors.surface }]}>
                <Text style={[styles.optionText, selected && { color: colors.accent }]}>{club.name}</Text>
                {selected ? <Check color={colors.accent} size={18} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.lg, gap: space.sm, alignItems: 'center' },
  divider: { width: 1, height: 20, backgroundColor: colors.border, marginHorizontal: 2 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    height: 34, paddingHorizontal: 14, borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: colors.onAccent, fontWeight: '800' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surfaceRaised, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg,
    paddingTop: space.lg, borderTopWidth: 1, borderColor: colors.border,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: space.lg, paddingBottom: space.md,
  },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: space.lg, paddingVertical: 14,
  },
  optionText: { fontSize: 16, color: colors.text },
});
