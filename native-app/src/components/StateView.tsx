import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarX2, WifiOff } from 'lucide-react-native';
import { colors, radius, space, type } from '../lib/theme';

export function LoadingView() {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.wrap}>
      <WifiOff color={colors.textDim} size={36} />
      <Text style={styles.title}>Couldn’t load events</Text>
      <Text style={[type.body, styles.center]}>{message}</Text>
      <Pressable onPress={onRetry} style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

export function EmptyView({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.wrap}>
      <CalendarX2 color={colors.textDim} size={36} />
      <Text style={styles.title}>{title}</Text>
      <Text style={[type.body, styles.center]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, paddingHorizontal: space.xl, gap: space.md },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  center: { textAlign: 'center' },
  button: {
    marginTop: space.sm, paddingHorizontal: space.xl, height: 44, justifyContent: 'center',
    borderRadius: radius.md, backgroundColor: colors.accent,
  },
  buttonText: { color: colors.onAccent, fontWeight: '800', fontSize: 15 },
});
