import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { BootstrapProvider, useBootstrap } from '../hooks/useBootstrap';
import { colors } from '../lib/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Keep the native splash up until settings have loaded (or failed),
// but never longer than a few seconds on a slow network.
function SplashGate() {
  const { loading } = useBootstrap();
  useEffect(() => {
    if (!loading) SplashScreen.hideAsync().catch(() => {});
    const timer = setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 4000);
    return () => clearTimeout(timer);
  }, [loading]);
  return null;
}

export default function RootLayout() {
  return (
    <BootstrapProvider>
      <SplashGate />
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </BootstrapProvider>
  );
}
