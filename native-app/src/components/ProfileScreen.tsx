import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { QrCode, Zap } from 'lucide-react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { USER_PROFILE } from '../data/mockData';

interface ProfileScreenProps {
  onOpenSyncScreen?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenSyncScreen }) => {
  return (
    <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 }}>
      {/* Player Card Header */}
      <View className="rounded-2xl bg-[#1b1b1f] border border-[#2a292e] p-5 shadow-xl mt-1 overflow-hidden relative">
        
        {/* Glow backdrop (Top Right) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient id="topRightGlow" cx="100%" cy="0%" rx="70%" ry="70%" fx="100%" fy="0%">
                <Stop offset="0%" stopColor="#c7f32c" stopOpacity="0.12" />
                <Stop offset="100%" stopColor="#c7f32c" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#topRightGlow)" />
          </Svg>
        </View>
        
        <View className="flex-row items-start gap-4">
          <View className="relative flex-shrink-0">
            <View style={{ shadowColor: '#c7f32c', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 8 }}>
              <Image 
                source={{ uri: USER_PROFILE.avatarUrl }} 
                className="w-[72px] h-[72px] rounded-2xl"
                style={{ borderWidth: 2, borderColor: '#c7f32c' }}
              />
            </View>
            <View className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c7f32c] items-center justify-center border-[2px] border-[#131317]">
              <Zap color="black" fill="black" size={10} />
            </View>
          </View>

          <View className="flex-col flex-1 min-w-0">
            <View className="flex-row items-center gap-2">
              <View className="px-2 py-0.5 rounded bg-[#c7f32c]/20 border border-[#c7f32c]/30">
                <Text className="font-mono text-[10px] uppercase text-[#c7f32c] font-bold">{USER_PROFILE.rank}</Text>
              </View>
              <Text className="text-[10px] font-mono text-gray-400">{USER_PROFILE.seasonRank}</Text>
            </View>

            <Text className="text-2xl uppercase tracking-wide text-white font-bold mt-1.5 leading-tight" numberOfLines={1}>
              {USER_PROFILE.gamerTag}
            </Text>
            <Text className="text-xs text-gray-400 font-sans mt-0.5">
              {USER_PROFILE.realName} • {USER_PROFILE.hostel}
            </Text>

            <View className="mt-3 flex-row items-center gap-3">
              <View>
                <Text className="text-gray-500 text-[9px] uppercase font-mono mb-0.5">RATING</Text>
                <Text className="text-[#c7f32c] font-bold text-sm font-mono">{USER_PROFILE.elo} ELO</Text>
              </View>
              <View className="w-[1px] h-7 bg-[#2a292e]" />
              <View>
                <Text className="text-gray-500 text-[9px] uppercase font-mono mb-0.5">AFFILIATION</Text>
                <Text className="text-white font-bold text-sm font-mono">{USER_PROFILE.guild}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-2.5 my-3">
        <View className="flex-1 p-3 bg-[#1b1b1f] border border-[#2a292e] rounded-xl flex-col">
          <Text className="text-[10px] font-mono uppercase text-gray-400">Showdowns Entered</Text>
          <Text className="text-2xl text-white tracking-wide font-black my-0.5" style={{ fontFamily: 'System' }}>
            {USER_PROFILE.stats.showdownsJoined}
          </Text>
          <Text className="text-[10px] text-emerald-400 font-mono">14 Victories ({Math.round(14/18*100)}% WR)</Text>
        </View>

        <View className="flex-1 p-3 bg-[#1b1b1f] border border-[#2a292e] rounded-xl flex-col">
          <Text className="text-[10px] font-mono uppercase text-gray-400">Bounties Claimed</Text>
          <Text className="text-2xl text-[#c7f32c] tracking-wide font-black my-0.5" style={{ fontFamily: 'System' }}>
            {USER_PROFILE.stats.bountiesClaimed}
          </Text>
          <Text className="text-[10px] text-gray-400 font-mono">16 Podium Finishes</Text>
        </View>
      </View>

      {/* Verified Tickets Section */}
      <View className="flex-col gap-2 mt-1">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-1.5">
            <QrCode color="#c7f32c" size={14} />
            <Text className="font-mono text-xs uppercase tracking-wider text-gray-300 font-bold">
              ACTIVE ARENA TICKETS (1)
            </Text>
          </View>
          <Text className="text-[10px] font-mono text-[#c7f32c]">VERIFIED RFID PASS</Text>
        </View>

        {USER_PROFILE.registeredTickets.map((t, idx) => (
          <View key={idx} className="p-4 rounded-xl bg-[#0e0e12] border-2 border-[#c7f32c]/40 flex-col">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 min-w-0 pr-3">
                <View className="self-start px-2 py-0.5 rounded bg-[#c7f32c]/20">
                  <Text className="text-[#c7f32c] font-mono text-[9px] uppercase font-bold">{t.status}</Text>
                </View>
                <Text className="text-lg text-white uppercase mt-2 font-bold leading-tight">{t.eventName}</Text>
                <Text className="text-xs text-gray-400 font-mono mt-1">{t.date}</Text>
              </View>
              <View className="p-2 bg-white rounded-lg shadow-sm">
                <QrCode color="black" size={32} />
              </View>
            </View>

            <View className="mt-4 pt-3 border-t border-[#2a292e] flex-row items-center justify-between">
              <Text className="text-xs font-mono text-gray-400">
                SEAT: <Text className="text-white font-bold">{t.seatCode}</Text>
              </Text>
              <Text className="text-[10px] font-mono text-gray-500">GATE PASS: #A-2025</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Hardware Node Telemetry Button */}
      <View className="mt-5 pt-4 border-t border-[#2a292e]">
        <Pressable
          onPress={onOpenSyncScreen}
          className="w-full py-3.5 rounded-xl bg-[#1b1b1f] border border-[#2a292e] flex-row items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Zap color="#c7f32c" size={14} />
          <Text className="text-xs font-mono uppercase tracking-wider text-gray-300 font-bold">
            VIEW HARDWARE MESH TELEMETRY
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};
