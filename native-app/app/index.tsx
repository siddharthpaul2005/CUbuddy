import { useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SplashScreen } from '../src/components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        <SplashScreen onDismiss={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0A0A0E] justify-center items-center px-6">
      <StatusBar barStyle="light-content" />
      <Text className="text-white text-2xl font-bold uppercase tracking-widest mb-2">Main Arena Hub</Text>
      <Text className="text-gray-400 text-center font-mono text-xs">
        System initialized. The rest of the native screens (Upcoming, Past Events) will be hooked up here next.
      </Text>
    </View>
  );
}
