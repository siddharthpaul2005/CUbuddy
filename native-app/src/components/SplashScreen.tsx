import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Pressable, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle, Defs, Pattern, RadialGradient, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onDismiss: () => void;
  autoDismiss?: boolean;
}

const BlinkingDot = ({ color, square = false }: { color: string, square?: boolean }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={{ opacity, backgroundColor: color }} 
      className={`w-1.5 h-1.5 ${square ? 'rounded-[1px]' : 'rounded-full'}`}
    />
  );
};

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
    <View className="flex-1 bg-black justify-between items-center relative overflow-hidden">
      
      {/* Ambient background glow layers (Grid + Vignette + Radial Glows) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none" className="z-0">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <Path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </Pattern>
            <RadialGradient id="centerGlow" cx="50%" cy="50%" rx="60%" ry="50%" fx="50%" fy="50%">
              <Stop offset="0%" stopColor="#c7f32c" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#c7f32c" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="vignette" cx="50%" cy="50%" rx="75%" ry="75%" fx="50%" fy="50%">
              <Stop offset="40%" stopColor="black" stopOpacity="0" />
              <Stop offset="100%" stopColor="black" stopOpacity="0.95" />
            </RadialGradient>
            <SvgLinearGradient id="bottomGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#c7f32c" stopOpacity="0" />
              <Stop offset="100%" stopColor="#c7f32c" stopOpacity="0.08" />
            </SvgLinearGradient>
          </Defs>
          
          {/* Grid Layer */}
          <Rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Center Glow Layer */}
          <Rect width="100%" height="100%" fill="url(#centerGlow)" />
          
          {/* Bottom Glow Layer */}
          <Rect x="0" y="60%" width="100%" height="40%" fill="url(#bottomGlow)" />
          
          {/* Vignette Layer */}
          <Rect width="100%" height="100%" fill="url(#vignette)" />
        </Svg>
      </View>

      {/* Top spacing matching web */}
      <View className="h-12 w-full" />

      {/* Hero Branding */}
      <View className="flex-1 w-full flex-col items-center justify-center px-6 -mt-8 z-10">
        
        {/* Pulse Mark Container */}
        <View className="relative mb-6 items-center justify-center">
          
          <View className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0A0A0E] border-[2px] border-[#c7f32c]/80 p-4 items-center justify-center" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.5, shadowRadius: 30, elevation: 15 }}>
            <Svg width="100%" height="100%" viewBox="0 0 64 64" fill="none" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 }}>
              <Rect fill="#0A0A0E" height="64" rx="14" stroke="#c7f32c" strokeWidth="2" width="64" />
              <Path 
                d="M12 36 L24 36 L30 18 L36 46 L42 28 L48 36 L52 36" 
                stroke="#c7f32c" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="4" 
              />
              <Circle cx="30" cy="18" fill="#c7f32c" r="3" />
              <Circle cx="36" cy="46" fill="#c7f32c" r="3" />
            </Svg>

            {/* Corner cyber marks - roughly emulated */}
            <View className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#c7f32c]" />
            <View className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#c7f32c]" />
            <View className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#c7f32c]" />
            <View className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#c7f32c]" />
          </View>
        </View>

        {/* Main Title */}
        <Text 
          className="text-white font-bold uppercase text-center" 
          style={{ 
            fontSize: 44,
            letterSpacing: -1,
            lineHeight: 46,
            textShadowColor: 'rgba(199, 243, 44, 0.4)', 
            textShadowRadius: 12,
            marginTop: 4
          }}
        >
          CAMPUS<Text className="text-[#c7f32c]">PULSE</Text>
        </Text>

        {/* Esports Tagline Pill */}
        <View className="mt-4 flex-row items-center px-4 py-1.5 rounded-full bg-[#131317] border border-white/10 shadow-sm" style={{ gap: 8 }}>
          <BlinkingDot color="#c7f32c" />
          <Text className="font-mono text-[10px] tracking-wider uppercase text-gray-300 font-semibold">
            CAMPUS EVENTS. <Text className="text-[#c7f32c] font-bold">RANKED LIVE.</Text>
          </Text>
        </View>

        {/* Tier Indicator */}
        <View className="mt-5 flex-row items-center justify-center flex-wrap px-4" style={{ gap: 8 }}>
          <Text className="text-[#c7f32c] font-mono text-[9px] uppercase font-bold tracking-widest">[SEASON 04]</Text>
          <Text className="text-white/40 font-mono text-[9px] uppercase tracking-widest">•</Text>
          <Text className="text-white/40 font-mono text-[9px] uppercase font-semibold tracking-widest">LIVE ELO LADDERS</Text>
          <Text className="text-white/40 font-mono text-[9px] uppercase tracking-widest">•</Text>
          <Text className="text-white/40 font-mono text-[9px] uppercase font-semibold tracking-widest">ALL-ARENA MESH</Text>
        </View>

        {/* Enter Arena button */}
        <Pressable
          onPress={onDismiss}
          className="mt-8 px-6 py-3 rounded-full bg-[#c7f32c] flex-row items-center active:scale-95"
          style={{ shadowColor: '#c7f32c', shadowOpacity: 0.5, shadowRadius: 15, shadowOffset: { width: 0, height: 0 }, elevation: 8, gap: 8 }}
        >
          <Text className="text-[#161e00] font-mono font-bold text-[11px] uppercase tracking-wider">ENTER ARENA HUB</Text>
          <ChevronRight color="#161e00" size={16} />
        </Pressable>
      </View>

      {/* Loading Module */}
      <View className="w-full px-7 pb-8 pt-2 items-center z-10">
        <View className="w-full max-w-sm flex-col" style={{ gap: 12 }}>
          {/* Status & Percentage */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <View className="w-2 h-2 rounded-sm bg-[#c7f32c]" />
              <Text className="text-white font-mono font-semibold text-[11px] uppercase tracking-wide">SYNCING ARENA SERVERS</Text>
            </View>
            <Text className="text-[#c7f32c] font-mono font-bold text-[11px] tracking-tight">{progress}%</Text>
          </View>

          {/* Segmented High-Tech Progress Bar */}
          <View className="w-full bg-[#131317] p-1 rounded-lg border border-white/10" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 }}>
            <View className="w-full h-2.5 bg-black/80 rounded-sm overflow-hidden flex-row">
              <View className="h-full bg-[#c7f32c] rounded-sm" style={{ width: `${progress}%`, shadowColor: '#c7f32c', shadowOpacity: 0.6, shadowRadius: 10, elevation: 5 }} />
            </View>
          </View>

          {/* Peer Telemetry */}
          <View className="flex-row items-center justify-between pt-0.5">
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Text className="text-[#c7f32c]/90 font-mono font-bold text-[10px] tracking-wider">//</Text>
              <Text className="text-gray-400 font-mono text-[10px] tracking-wider">428 PEERS ONLINE</Text>
            </View>
            <Text className="text-white/40 font-mono text-[10px] tracking-wider">PING: 14MS</Text>
          </View>

          {/* Manifest Footer */}
          <View className="pt-3 border-t border-white/5 items-center mt-1" style={{ gap: 2 }}>
            <Text className="font-mono text-[9px] tracking-widest text-gray-500 uppercase text-center">
              v2.4.0-PROD • CAMPUSPULSE NETWORK • SECURE ELO MESH
            </Text>
            <Text className="font-mono text-[9px] tracking-wider text-white/20 uppercase text-center mt-1">
              AUTHENTICATED HIGH-THROUGHPUT CAMPUS NODE
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
