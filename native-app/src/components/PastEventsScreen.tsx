import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, Pressable, Animated } from 'react-native';
import { ShieldCheck, Trophy, Lock, BarChart3, ChevronDown, CheckCircle2, Clock, MapPin, Archive } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PAST_EVENTS, PastEventCardData } from '../data/mockData';

const BlinkingDot = ({ color }: { color: string }) => {
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
      style={{ opacity, backgroundColor: color, shadowColor: color, shadowOpacity: 1, shadowRadius: 8, shadowOffset: { width: 0, height: 0 }, elevation: 5 }} 
      className="w-2 h-2 rounded-full"
    />
  );
};

interface PastEventsScreenProps {
  onOpenScoreboard?: (event: PastEventCardData) => void;
}

export const PastEventsScreen: React.FC<PastEventsScreenProps> = ({ onOpenScoreboard }) => {
  const [selectedDay, setSelectedDay] = useState('YESTERDAY');
  const [extraCardsLoaded, setExtraCardsLoaded] = useState(false);

  const days = ['YESTERDAY', '2 DAYS AGO', '3 DAYS AGO', '4 DAYS AGO', 'LAST WEEK', 'SEASON 1'];

  const handleLoadOlder = () => {
    setExtraCardsLoaded(true);
  };

  return (
    <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 }}>
      {/* Header Info */}
      <View className="pt-2 pb-2 flex-col gap-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <BlinkingDot color="#c7f32c" />
            <Text className="font-mono text-[10px] uppercase tracking-widest text-[#c7f32c] font-bold">
              Vault Archives
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <ShieldCheck color="#c7f32c" size={14} />
            <Text className="font-mono text-[10px] text-gray-400">MATCH HISTORIAN ACTIVE</Text>
          </View>
        </View>

        <Text className="text-4xl uppercase text-white tracking-wider font-black mt-1" style={{ fontFamily: 'System', fontWeight: 'bold' }}>
          PAST EVENTS
        </Text>
        <Text className="text-xs text-gray-400 -mt-1 font-sans">
          Browse archived campus showdowns & verified scoreboards
        </Text>

        <LinearGradient
          colors={['#c7f32c', 'rgba(199,243,44,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-0.5 mt-2 rounded-full"
          style={{ shadowColor: 'rgba(199,243,44,0.4)', shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 5 }}
        />
      </View>

      {/* Horizontal Time-Range Selector Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 mb-2">
        <View className="flex-row items-center" style={{ gap: 8, paddingRight: 16 }}>
          {days.map((day) => (
            <Pressable
              key={day}
              onPress={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-full ${
                selectedDay === day ? 'bg-[#c7f32c]' : 'bg-[#2a292e]'
              }`}
              style={selectedDay === day ? { shadowColor: '#c7f32c', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 6 } : {}}
            >
              <Text className={`font-mono text-xs tracking-wider ${
                selectedDay === day ? 'text-[#161e00] font-bold' : 'text-gray-400'
              }`}>
                {day}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Archive Summary Stat Bar */}
      <View className="my-2 bg-[#0e0e12] border border-[#2a292e] rounded-xl p-3 flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center gap-2.5 flex-1 pr-2">
          <View className="w-8 h-8 rounded-lg bg-[#2a292e] items-center justify-center">
            <Trophy color="#c7f32c" size={16} />
          </View>
          <View className="flex-col">
            <Text className="font-mono text-[10px] uppercase tracking-wider text-[#c7f32c] font-bold" numberOfLines={1}>
              {selectedDay === 'YESTERDAY' ? 'Yesterday Recap' : `${selectedDay} Recap`}
            </Text>
            <Text className="font-mono text-xs uppercase text-gray-200" numberOfLines={1}>
              {selectedDay === 'YESTERDAY' ? '3 Showdowns Concluded' : '0 Showdowns Concluded'}
            </Text>
          </View>
        </View>
        <View className="flex-col items-end">
          <Text className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
            Prizes Logged
          </Text>
          <Text className="text-lg text-white tracking-wide font-bold">
            {selectedDay === 'YESTERDAY' ? '₹16,000' : '₹0'}
          </Text>
        </View>
      </View>

      {/* Archived Event Cards Feed */}
      <View className="flex-col mt-2 pb-6" style={{ gap: 16 }}>
        {selectedDay === 'YESTERDAY' ? PAST_EVENTS.map((card) => (
          <View key={card.id} className="w-full bg-[#1b1b1f] border border-[#2a292e] rounded-xl overflow-hidden shadow-lg flex-col">
            {/* Media Header */}
            <View className="relative w-full h-44 bg-[#0e0e12]">
              <Image source={typeof card.image === 'string' ? { uri: card.image } : card.image} className="w-full h-full opacity-80" resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(27,27,31,0.3)', '#1b1b1f']}
                className="absolute inset-0"
              />
              
              {/* Category & Tier Tags */}
              <View className="absolute top-3 left-3 flex-row items-center flex-wrap" style={{ gap: 6 }}>
                <View className={`px-2.5 py-1 rounded-full flex-row items-center shadow-sm ${
                  card.id === 'past-1' ? 'bg-[#571bc1]' : card.id === 'past-2' ? 'bg-[#93000a]' : 'bg-[#004e5c]'
                }`}>
                  <Text className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                    card.id === 'past-1' ? 'text-[#c4abff]' : card.id === 'past-2' ? 'text-[#ffdad6]' : 'text-[#acedff]'
                  }`}>{card.categoryTag}</Text>
                </View>
                <View className="px-2 py-0.5 rounded-full bg-[#0e0e12]/80">
                  <Text className="text-gray-400 font-mono text-[9px] tracking-widest uppercase">{card.badgeTag}</Text>
                </View>
              </View>

              {/* Concluded Flag */}
              <View className="absolute top-3 right-3">
                <View className="px-2.5 py-1 rounded-full bg-[#0e0e12]/90 border border-white/5 flex-row items-center gap-1">
                  <CheckCircle2 color="#c7f32c" size={12} />
                  <Text className="text-gray-300 font-mono text-[10px] uppercase">{card.statusBadge}</Text>
                </View>
              </View>

              {/* Scoreboard Winner Highlight Banner */}
              <View className="absolute bottom-3 left-3 right-3 bg-[#0e0e12]/95 rounded-lg px-3 py-2 flex-row items-center justify-between border border-[#2a292e]" style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 }}>
                <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                  <Trophy color="#c7f32c" size={16} />
                  <Text className="font-mono text-xs uppercase text-white font-bold" numberOfLines={1}>{card.winnerBanner}</Text>
                </View>
                <Text className="font-mono text-xs text-[#c7f32c] font-bold">{card.winnerAccent}</Text>
              </View>
            </View>

            {/* Card Body */}
            <View className="p-4 flex-col gap-2">
              <View className="flex-row items-center justify-between gap-2">
                <Text className="font-mono text-[10px] uppercase tracking-widest text-gray-400">{card.guildSub}</Text>
                <Text className="font-mono text-[10px] text-gray-500">{card.matchId}</Text>
              </View>

              <Text className="text-2xl uppercase text-white tracking-wide font-bold leading-tight">{card.title}</Text>

              {/* Match Meta Data */}
              <View className="flex-row items-center gap-3 pt-0.5">
                <View className="flex-row items-center gap-1">
                  <Clock color="#c7f32c" size={14} />
                  <Text className="text-gray-400 text-xs">{card.time}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MapPin color="#c7f32c" size={14} />
                  <Text className="text-gray-400 text-xs">{card.venue}</Text>
                </View>
              </View>

              {/* Custom micro-recap */}
              {card.leaderboardSnippet && (
                <View className="mt-2 p-2.5 rounded-lg bg-[#0e0e12] border border-[#2a292e] flex-row items-center justify-around gap-2">
                  <View className="flex-col items-center flex-1">
                    <Text className="font-mono text-[9px] text-gray-500 uppercase">1ST PLACE</Text>
                    <Text className="font-mono text-xs text-white font-bold" numberOfLines={1}>{card.leaderboardSnippet.first}</Text>
                  </View>
                  <View className="w-px h-6 bg-[#2a292e]" />
                  <View className="flex-col items-center flex-1">
                    <Text className="font-mono text-[9px] text-gray-500 uppercase">RUNNER UP</Text>
                    <Text className="font-mono text-xs text-gray-300" numberOfLines={1}>{card.leaderboardSnippet.runnerUp}</Text>
                  </View>
                  <View className="w-px h-6 bg-[#2a292e]" />
                  <View className="flex-col items-center flex-1">
                    <Text className="font-mono text-[9px] text-gray-500 uppercase">BEST EXPLOIT</Text>
                    <Text className="font-mono text-xs text-[#c7f32c] font-bold" numberOfLines={1}>{card.leaderboardSnippet.specialAward}</Text>
                  </View>
                </View>
              )}

              {card.headToHead && (
                <View className="mt-2 p-2.5 rounded-lg bg-[#0e0e12] border border-[#2a292e] flex-row items-center justify-between gap-2">
                  <View className="flex-row items-center gap-2 flex-1">
                    <View className="w-7 h-7 rounded-full bg-[#c7f32c] items-center justify-center">
                      <Text className="font-bold text-[#161e00] text-sm">{card.headToHead.symbolA}</Text>
                    </View>
                    <View className="flex-col flex-1">
                      <Text className="font-mono text-xs text-white font-bold" numberOfLines={1}>{card.headToHead.teamA}</Text>
                      <Text className="font-mono text-[10px] text-[#c7f32c]">{card.headToHead.teamAScore}</Text>
                    </View>
                  </View>
                  <Text className="font-bold text-sm text-gray-500 px-2">VS</Text>
                  <View className="flex-row items-center justify-end gap-2 flex-1">
                    <View className="flex-col items-end flex-1">
                      <Text className="font-mono text-xs text-gray-300" numberOfLines={1}>{card.headToHead.teamB}</Text>
                      <Text className="font-mono text-[10px] text-gray-400">{card.headToHead.teamBScore}</Text>
                    </View>
                    <View className="w-7 h-7 rounded-full bg-[#2a292e] items-center justify-center">
                      <Text className="font-bold text-gray-300 text-sm">{card.headToHead.symbolB}</Text>
                    </View>
                  </View>
                </View>
              )}

              {card.tags && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2 py-0.5">
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                    {card.tags.map((tag, idx) => (
                      <View 
                        key={idx} 
                        className={`px-2 py-0.5 rounded border ${
                          idx === 2 ? 'bg-[#0e0e12] border-[#c7f32c]/30' : 'bg-[#0e0e12] border-[#2a292e]'
                        }`}
                      >
                        <Text className={`font-mono text-[10px] ${idx === 2 ? 'text-[#c7f32c] font-bold' : 'text-gray-400'}`}>
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}

              {/* Action Footer */}
              <View className="mt-3 pt-3 border-t border-[#2a292e] flex-row items-center justify-between gap-3">
                <View className="flex-row items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e0e12]">
                  <Lock color="#6b7280" size={14} />
                  <Text className="text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                    {card.id === 'past-1' ? 'RESULTS OUT' : 'CLOSED'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => onOpenScoreboard?.(card)}
                  className="flex-row items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2a292e] flex-shrink-0"
                  style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.95 : 1 }] }]}
                >
                  <BarChart3 color="#c7f32c" size={14} />
                  <Text className="text-white font-mono text-xs uppercase tracking-wider font-bold">
                    {card.actionType === 'scoreboard' && 'SCOREBOARD & VOD'}
                    {card.actionType === 'leaderboard' && 'LEADERBOARD'}
                    {card.actionType === 'winning_entries' && 'WINNING ENTRIES'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )) : (
          <View className="py-10 border border-dashed border-[#2a292e] rounded-xl mt-2 bg-[#0e0e12] items-center justify-center">
            <Text className="font-mono text-xs text-gray-400 uppercase tracking-widest">NO LOGS MATCHING {selectedDay}</Text>
          </View>
        )}

        {extraCardsLoaded && (
          <View className="p-3 bg-[#0e0e12] rounded-xl border border-[#2a292e] items-center justify-center">
            <Text className="text-[#c7f32c] font-mono font-bold text-xs mb-1">
              ARCHIVED SEASON 03 RECAP
            </Text>
            <Text className="text-gray-400 text-xs text-center">
              Loaded 12 additional verified historical scoreboards from local mesh node.
            </Text>
          </View>
        )}
      </View>

      {/* End of Archive Banner */}
      <View className="pb-6 items-center flex-col" style={{ gap: 8 }}>
        <View className="w-10 h-10 rounded-full bg-[#1b1b1f] border border-[#2a292e] items-center justify-center">
          <Archive color="#9ca3af" size={20} />
        </View>
        <Text className="font-mono text-xs uppercase tracking-widest text-gray-400">
          ALL 24-HOUR MATCH LOGS SYNCHRONIZED
        </Text>
        <Pressable onPress={handleLoadOlder} className="flex-row items-center gap-1 mt-1">
          <Text className="font-mono text-xs text-[#c7f32c] uppercase tracking-wider font-bold">LOAD OLDER TOURNAMENT CYCLES</Text>
          <ChevronDown color="#c7f32c" size={16} />
        </Pressable>
      </View>
    </ScrollView>
  );
};
