import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark, Clock, MapPin, Zap, Flame, Trophy, Music, Users, ChevronRight, Check, Rocket, Briefcase, Wallet, Star } from 'lucide-react-native';
import { TODAY_DROPS, EventCardData } from '../data/mockData';

interface LiveHubScreenProps {
  onRegisterClick?: (event: EventCardData) => void;
  onNavigateToPast?: () => void;
  onBookmarkToggle?: (id: string) => void;
  savedIds?: Set<string>;
  registeredIds?: Set<string>;
}

const renderActionIcon = (iconName: string, color: string, size: number) => {
  switch (iconName) {
    case 'rocket': return <Rocket color={color} size={size} />;
    case 'briefcase': return <Briefcase color={color} size={size} />;
    case 'wallet': return <Wallet color={color} size={size} />;
    case 'star': return <Star color={color} size={size} />;
    case 'bolt': default: return <Zap color={color} fill={color} size={size} />;
  }
};

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
      style={{ 
        opacity, 
        backgroundColor: color,
        shadowColor: color,
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 0 },
        elevation: 5
      }} 
      className="w-2 h-2 rounded-full"
    />
  );
};

export const LiveHubScreen: React.FC<LiveHubScreenProps> = ({
  onRegisterClick,
  onNavigateToPast,
  onBookmarkToggle,
  savedIds = new Set(),
  registeredIds = new Set(),
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HACKATHONS' | 'ESPORTS' | 'CYBER'>('ALL');

  const filteredCards = TODAY_DROPS.filter((card) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HACKATHONS') return card.categoryTag.includes('HACKATHON');
    if (activeFilter === 'ESPORTS') return card.categoryTag.includes('ESPORTS');
    if (activeFilter === 'CYBER') return card.categoryTag.includes('CYBER') || card.categoryTag.includes('SOUND');
    return true;
  });

  return (
    <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 }}>
      {/* Live Peer Status Pill */}
      <View className="items-center justify-center my-1.5">
        <View className="flex-row items-center gap-2 px-3 py-1 rounded-full bg-[#1b1b1f] border border-[#2a292e] shadow-sm">
          <BlinkingDot color="#c7f32c" />
          <Text className="text-gray-300 text-[11px] font-mono uppercase tracking-wider font-semibold">
            LIVE ARENA <Text className="text-gray-500">•</Text> <Text className="text-[#c7f32c] font-bold">428 CAMPUS PEERS</Text> CHECKED IN
          </Text>
        </View>
      </View>

      {/* Hero Headline */}
      <View className="items-center mt-1 mb-2">
        <Text className="text-white text-4xl uppercase tracking-wider font-bold text-center">
          TODAY'S DROP
        </Text>
        <Text className="text-xs text-gray-400 mt-1 text-center">
          3 high-stakes campus showdowns live right now
        </Text>

        {/* Tactical Accent Neon Glow Line */}
        <LinearGradient 
          colors={['transparent', '#c7f32c', 'transparent']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }}
          className="w-full h-[2px] mt-3 rounded-full" 
          style={{ shadowColor: '#c7f32c', shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 6 }}
        />
      </View>

      {/* Horizontal Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2.5 mb-2">
        <View className="flex-row items-center gap-2 pr-4">
          <Pressable
            onPress={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full ${
              activeFilter === 'ALL' ? 'bg-[#c7f32c]' : 'bg-[#1f1f24]'
            }`}
            style={activeFilter === 'ALL' ? { shadowColor: '#c7f32c', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 6 } : {}}
          >
            <Text className={`text-[12px] font-mono uppercase tracking-wider ${
              activeFilter === 'ALL' ? 'text-[#161e00] font-bold' : 'text-gray-400'
            }`}>
              ALL ARENAS ({TODAY_DROPS.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveFilter('HACKATHONS')}
            className={`px-3.5 py-1.5 rounded-full ${
              activeFilter === 'HACKATHONS' ? 'bg-[#c7f32c]' : 'bg-[#1f1f24]'
            }`}
            style={activeFilter === 'HACKATHONS' ? { shadowColor: '#c7f32c', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 6 } : {}}
          >
            <Text className={`text-[12px] font-mono uppercase tracking-wider ${
              activeFilter === 'HACKATHONS' ? 'text-[#161e00] font-bold' : 'text-gray-400'
            }`}>
              HACKATHONS
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveFilter('ESPORTS')}
            className={`px-3.5 py-1.5 rounded-full ${
              activeFilter === 'ESPORTS' ? 'bg-[#c7f32c]' : 'bg-[#1f1f24]'
            }`}
            style={activeFilter === 'ESPORTS' ? { shadowColor: '#c7f32c', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 6 } : {}}
          >
            <Text className={`text-[12px] font-mono uppercase tracking-wider ${
              activeFilter === 'ESPORTS' ? 'text-[#161e00] font-bold' : 'text-gray-400'
            }`}>
              ESPORTS
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveFilter('CYBER')}
            className={`px-3.5 py-1.5 rounded-full ${
              activeFilter === 'CYBER' ? 'bg-[#c7f32c]' : 'bg-[#1f1f24]'
            }`}
            style={activeFilter === 'CYBER' ? { shadowColor: '#c7f32c', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 6 } : {}}
          >
            <Text className={`text-[12px] font-mono uppercase tracking-wider ${
              activeFilter === 'CYBER' ? 'text-[#161e00] font-bold' : 'text-gray-400'
            }`}>
              CYBER & SOUND
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Event Cards Feed */}
      <View className="flex-col gap-4 mt-2">
        {filteredCards.map((card) => {
          const isSaved = savedIds.has(card.id);
          const isRegistered = registeredIds.has(card.id);

          return (
            <View 
              key={card.id}
              className="w-full bg-[#1b1b1f] border border-[#2a292e] rounded-xl overflow-hidden shadow-xl flex-col"
            >
              {/* Card Media Header */}
              <View className="relative w-full h-44 bg-[#0e0e12]">
                <Image 
                  source={typeof card.image === 'string' ? { uri: card.image } : card.image} 
                  className="w-full h-full opacity-85"
                  resizeMode="cover"
                />
                
                <LinearGradient 
                  colors={['#1b1b1f', 'rgba(27,27,31,0.35)', 'transparent']}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  className="absolute inset-0"
                />
                
                {/* Top Category Tag */}
                <View className="absolute top-3 left-3 flex-row items-center gap-1.5">
                  <View className={`px-2.5 py-1 rounded-full flex-row items-center gap-1.5 ${
                    card.id === 'drop-1' 
                      ? 'bg-[#571bc1]' 
                      : card.id === 'drop-2' 
                        ? 'bg-[#93000a]' 
                        : 'bg-[#004e5c]'
                  }`}>
                    {card.id === 'drop-1' && <Zap color="#e9ddff" size={12} />}
                    {card.id === 'drop-2' && <Flame color="#ffdad6" size={12} />}
                    {card.id === 'drop-3' && <Music color="#acedff" size={12} />}
                    <Text className={`font-mono text-[9px] uppercase font-bold tracking-wider ${
                      card.id === 'drop-1' ? 'text-[#e9ddff]' : card.id === 'drop-2' ? 'text-[#ffdad6]' : 'text-[#acedff]'
                    }`}>
                      {card.categoryTag}
                    </Text>
                  </View>
                </View>

                {/* Top Bookmark Trigger */}
                <Pressable
                  onPress={() => onBookmarkToggle?.(card.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <Bookmark color={isSaved ? '#c7f32c' : '#d1d5db'} fill={isSaved ? '#c7f32c' : 'transparent'} size={16} />
                </Pressable>

                {/* Floating Bottom Left Badge on Media */}
                {card.badgeTag && (
                  <View className="absolute bottom-3 left-3">
                    <View className={`px-2.5 py-1 rounded flex-row items-center gap-1 border ${
                      card.badgeType === 'spots' 
                        ? 'bg-[#93000a]/90 border-[#ffb4ab]/30' 
                        : 'bg-black/70 border-[#2a292e]'
                    }`}>
                      {card.badgeType === 'spots' && <Clock color="#ffb4ab" size={12} />}
                      <Text className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                        card.badgeType === 'spots' ? 'text-[#ffb4ab]' : 'text-white'
                      }`}>
                        {card.badgeTag}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Card Body */}
              <View className="p-4 flex-col gap-2">
                {/* Guild & Tier Sub */}
                <View className="flex-row items-center gap-2 mb-1">
                  <Text className="text-gray-400 font-bold text-[10px] font-mono uppercase tracking-wider">{card.guildSub}</Text>
                  <View className="w-1 h-1 rounded-full bg-gray-500" />
                  <Text className="text-[#c7f32c] text-[10px] font-mono uppercase tracking-wider">{card.tierTag}</Text>
                </View>

                {/* Main Headline */}
                <Text className="text-2xl uppercase tracking-wide text-white font-bold mb-1">
                  {card.title}
                </Text>

                {/* Date & Location */}
                <View className="flex-col gap-1.5 mt-1">
                  <View className="flex-row items-center gap-2">
                    <Clock color="#c7f32c" size={14} />
                    <Text className="text-gray-200 text-xs">{card.time}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <MapPin color="#c7f32c" size={14} />
                    <Text className="text-gray-400 text-xs truncate">{card.venue}</Text>
                  </View>
                </View>

                {/* Bottom Prize & Register CTA */}
                <View className="mt-4 pt-4 border-t border-[#2a292e] flex-row items-center justify-between">
                  <View className="flex-col flex-1 mr-2">
                    <Text 
                      className="text-lg uppercase text-white tracking-wide font-bold"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {card.prizeText}
                    </Text>
                    {card.registeredCount && (
                      <Text className="text-[10px] font-mono text-gray-400 mt-0.5">
                        {card.registeredCount}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    onPress={() => onRegisterClick?.(card)}
                    className={`px-3 py-1.5 rounded-full flex-row items-center justify-center flex-shrink-0 ${
                      isRegistered
                        ? 'bg-[#2a292e] border border-[#c7f32c]/50'
                        : 'bg-[#c7f32c]'
                    }`}
                    style={!isRegistered ? { 
                      shadowColor: '#c7f32c', 
                      shadowOpacity: 0.5, 
                      shadowRadius: 10, 
                      shadowOffset: { width: 0, height: 0 }, 
                      elevation: 10 
                    } : {}}
                  >
                    {isRegistered ? (
                      <View className="flex-row items-center gap-1.5 flex-shrink-1">
                        <Check color="#c7f32c" size={14} />
                        <Text className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#c7f32c]" numberOfLines={1} adjustsFontSizeToFit>REGISTERED</Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center gap-1.5 flex-shrink-1 max-w-[120px]">
                        <Text className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#161e00] flex-shrink" numberOfLines={1} adjustsFontSizeToFit>{card.actionText}</Text>
                        {renderActionIcon(card.actionIcon, "#161e00", 14)}
                      </View>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Missed a Scrimmage Banner */}
      <Pressable 
        onPress={onNavigateToPast}
        className="mt-5 p-4 rounded-xl bg-[#1b1b1f] border border-[#2a292e] flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-[#2a292e] flex items-center justify-center">
            <Trophy color="#c7f32c" size={18} />
          </View>
          <View className="flex-col">
            <Text className="text-sm uppercase text-white tracking-wide font-bold">
              MISSED A SCRIMMAGE?
            </Text>
            <Text className="text-[10px] text-gray-400 mt-0.5">
              Browse previous finals & tournament vods
            </Text>
          </View>
        </View>
        <ChevronRight color="#6b7280" size={20} />
      </Pressable>
    </ScrollView>
  );
};
