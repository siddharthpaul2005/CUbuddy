import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface SplashScreenProps {
  onDismiss: () => void;
  autoDismiss?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss, autoDismiss = false }) => {
  const [progress, setProgress] = useState(78);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSynced(true);
          setTimeout(onDismiss, 500);
          return 100;
        }
        const step = Math.random() > 0.5 ? 4 : 2;
        return Math.min(100, prev + step);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onDismiss]);

  return (
    <View className="flex-1 bg-black justify-between items-center px-6 py-12">
      <View className="flex-1 justify-center items-center w-full mt-10">
        {/* Simple logo placeholder instead of SVG for now */}
        <View className="w-28 h-28 bg-[#0A0A0E] border-2 border-[#c7f32c]/80 rounded-3xl items-center justify-center mb-6 shadow-sm">
          <Text className="text-[#c7f32c] font-bold text-4xl">CP</Text>
        </View>
        
        <Text className="text-white text-4xl font-bold uppercase tracking-wider text-center">
          CAMPUS<Text className="text-[#c7f32c]">PULSE</Text>
        </Text>
        
        <View className="mt-4 bg-[#131317] border border-white/10 rounded-full px-4 py-1.5 flex-row items-center">
          <View className="w-1.5 h-1.5 rounded-full bg-[#c7f32c] mr-2" />
          <Text className="text-gray-300 text-xs font-semibold uppercase">
            CAMPUS EVENTS. <Text className="text-[#c7f32c] font-bold">RANKED LIVE.</Text>
          </Text>
        </View>

        <Pressable 
          onPress={onDismiss}
          className="mt-8 bg-[#c7f32c] px-6 py-3 rounded-full flex-row items-center active:opacity-80"
        >
          <Text className="text-[#161e00] font-bold text-xs uppercase mr-2">ENTER ARENA HUB</Text>
          <ChevronRight color="#161e00" size={16} />
        </Pressable>
      </View>

      <View className="w-full max-w-sm pb-8">
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-[#c7f32c] mr-2" />
            <Text className="text-white text-xs font-bold uppercase tracking-widest">SYNCING ARENA SERVERS</Text>
          </View>
          <Text className="text-[#c7f32c] font-bold text-xs">{progress}%</Text>
        </View>
        
        <View className="w-full bg-[#131317] border border-white/10 rounded-lg p-1">
          <View className="w-full h-2.5 bg-black/80 rounded-sm overflow-hidden">
            <View className="h-full bg-[#c7f32c]" style={{ width: `${progress}%` }} />
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-gray-500 font-bold text-[10px]">// 428 PEERS ONLINE</Text>
          <Text className="text-white/40 text-[10px]">PING: 14MS</Text>
        </View>
      </View>
    </View>
  );
};
