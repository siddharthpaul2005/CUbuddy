import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image, Pressable, Animated } from 'react-native';
import { Timer, Calendar, Bookmark, Bell, BellRing, Zap, Swords, Radar, Check, Rocket, Briefcase, Wallet, Star } from 'lucide-react-native';
import { UPCOMING_FIXTURES, UpcomingEventCardData } from '../data/mockData';
import { LinearGradient } from 'expo-linear-gradient';

interface UpcomingScreenProps {
  onPreRegisterClick?: (event: UpcomingEventCardData) => void;
  onBookmarkToggle?: (id: string) => void;
  onNavigateToRadar?: () => void;
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

const SpinningRadar = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Radar color="#c7f32c" size={20} />
    </Animated.View>
  );
};

export const UpcomingScreen: React.FC<UpcomingScreenProps> = ({
  onPreRegisterClick,
  onBookmarkToggle,
  onNavigateToRadar,
  savedIds = new Set(),
  registeredIds = new Set(),
}) => {
  const [activeTrack, setActiveTrack] = useState('ALL');
  const [activeDay, setActiveDay] = useState('ALL');
  const [reminders, setReminders] = useState<Set<string>>(new Set(['upcoming-2']));

  const toggleReminder = (id: string) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = UPCOMING_FIXTURES.filter((item) => {
    let trackMatch = true;
    if (activeTrack === 'HARDWARE') trackMatch = item.categoryTag.includes('HARDWARE');
    else if (activeTrack === 'ESPORTS') trackMatch = item.categoryTag.includes('ESPORTS');
    else if (activeTrack === 'HACKATHONS') trackMatch = item.categoryTag.includes('HACK');

    let dayMatch = true;
    if (activeDay === 'TOMORROW') dayMatch = item.timeframeSection.includes('TOMORROW');
    else if (activeDay === 'THIS_WEEK') dayMatch = item.timeframeSection.includes('THIS WEEK');
    else if (activeDay === 'NEXT_WEEK') dayMatch = item.timeframeSection.includes('NEXT WEEK');

    return trackMatch && dayMatch;
  });

  return (
    <ScrollView className="flex-1 w-full" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 }}>
      {/* Screen Header */}
      <View className="flex-col pt-2 pb-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-4xl uppercase tracking-wide text-white font-black max-w-[75%]" style={{ fontFamily: 'System', fontWeight: 'bold' }}>
            UPCOMING — NEXT 15 DAYS
          </Text>
          <View 
            className="px-2.5 py-1 rounded-full bg-[#1b1b1f] border border-[#2a292e]"
            style={{ shadowColor: '#c7f32c', shadowOpacity: 0.2, shadowRadius: 12, elevation: 5 }}
          >
            <Text className="font-mono text-[10px] uppercase text-[#c7f32c] font-bold">
              {filtered.length} Fixture{filtered.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-gray-400 font-sans mt-1">
          Lock in your spot for upcoming campus tournaments, showdowns & showcases.
        </Text>
        
        <LinearGradient
          colors={['#c7f32c', 'rgba(199,243,44,0.4)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-0.5 mt-3 mb-2 rounded-full"
          style={{ shadowColor: 'rgba(199,243,44,0.4)', shadowOpacity: 1, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 5 }}
        />
      </View>

      {/* TRACK FILTERS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 mb-0" contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
        <Pressable 
          onPress={() => setActiveTrack('ALL')}
          className={`px-3.5 py-1.5 rounded-full flex-row items-center justify-center`}
          style={activeTrack === 'ALL' ? { backgroundColor: '#c7f32c', shadowColor: '#c7f32c', shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 } : { backgroundColor: '#1b1b1f' }}
        >
          <Text className={`font-mono text-xs uppercase ${activeTrack === 'ALL' ? 'text-[#161e00] font-bold' : 'text-gray-400'}`}>All Tracks</Text>
        </Pressable>

        <Pressable 
          onPress={() => setActiveTrack('HARDWARE')}
          className={`px-3.5 py-1.5 rounded-full flex-row items-center justify-center`}
          style={activeTrack === 'HARDWARE' ? { backgroundColor: '#c7f32c', shadowColor: '#c7f32c', shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 } : { backgroundColor: '#1b1b1f' }}
        >
          <Text className={`font-mono text-xs uppercase ${activeTrack === 'HARDWARE' ? 'text-[#161e00] font-bold' : 'text-gray-400'}`}>Hardware & Robotics</Text>
        </Pressable>

        <Pressable 
          onPress={() => setActiveTrack('ESPORTS')}
          className={`px-3.5 py-1.5 rounded-full flex-row items-center justify-center`}
          style={activeTrack === 'ESPORTS' ? { backgroundColor: '#c7f32c', shadowColor: '#c7f32c', shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 } : { backgroundColor: '#1b1b1f' }}
        >
          <Text className={`font-mono text-xs uppercase ${activeTrack === 'ESPORTS' ? 'text-[#161e00] font-bold' : 'text-gray-400'}`}>Esports</Text>
        </Pressable>

        <Pressable 
          onPress={() => setActiveTrack('HACKATHONS')}
          className={`px-3.5 py-1.5 rounded-full flex-row items-center justify-center`}
          style={activeTrack === 'HACKATHONS' ? { backgroundColor: '#c7f32c', shadowColor: '#c7f32c', shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 } : { backgroundColor: '#1b1b1f' }}
        >
          <Text className={`font-mono text-xs uppercase ${activeTrack === 'HACKATHONS' ? 'text-[#161e00] font-bold' : 'text-gray-400'}`}>Hackathons</Text>
        </Pressable>
      </ScrollView>

      {/* Day Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 mb-2" contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
        {['ALL', 'TOMORROW', 'THIS_WEEK', 'NEXT_WEEK'].map(day => (
          <Pressable 
            key={day}
            onPress={() => setActiveDay(day)}
            className={`px-3.5 py-1.5 rounded-full flex-row items-center justify-center border ${activeDay === day ? 'border-transparent' : 'border-[#2a292e]'}`}
            style={activeDay === day ? { backgroundColor: '#c7f32c', shadowColor: '#c7f32c', shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 } : { backgroundColor: '#1b1b1f' }}
          >
            <Text className={`font-mono text-xs uppercase ${activeDay === day ? 'text-[#161e00] font-bold' : 'text-gray-400'}`}>
              {day === 'ALL' ? 'All Days' : day === 'THIS_WEEK' ? 'This Week' : day === 'NEXT_WEEK' ? 'Next Week' : day}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* TIMELINE STREAM */}
      <View className="flex-col mt-3" style={{ gap: 24 }}>
        {filtered.map((item) => {
          const isSaved = savedIds?.has(item.id) || false;
          const isRegistered = registeredIds?.has(item.id) || false;
          const hasReminder = reminders.has(item.id);

          return (
            <View key={item.id} className="flex-col gap-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <View 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: item.id === 'upcoming-1' ? '#c7f32c' : item.id === 'upcoming-2' ? '#d0bcff' : '#acedff' }} 
                  />
                  <Text className={`font-mono text-xs uppercase font-bold tracking-wider ${
                    item.id === 'upcoming-1' ? 'text-[#c7f32c]' : item.id === 'upcoming-2' ? 'text-[#d0bcff]' : 'text-[#acedff]'
                  }`}>{item.timeframeSection}</Text>
                </View>
                <Text className="font-mono text-[10px] uppercase text-gray-400 tracking-widest">{item.timeframeLock}</Text>
              </View>

              <View className="flex-col rounded-xl bg-[#1b1b1f] border border-[#2a292e] overflow-hidden shadow-lg" style={{ shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 }}>
                {/* Poster Image */}
                <View className="relative w-full h-44 bg-[#0e0e12]">
                  <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} className="w-full h-full opacity-85" resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(27,27,31,0.4)', '#1b1b1f']}
                    className="absolute inset-0"
                  />
                  
                  {/* Pinned Top-Left Countdown Pill */}
                  <View 
                    className="absolute top-3 left-3 flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-[#0e0e12]/90"
                    style={{ 
                      shadowColor: item.id === 'upcoming-1' ? '#c7f32c' : item.id === 'upcoming-2' ? '#d0bcff' : '#acedff', 
                      shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 
                    }}
                  >
                    {item.id === 'upcoming-1' ? <Timer color="#c7f32c" size={14} /> : <Calendar color={item.id === 'upcoming-2' ? '#d0bcff' : '#acedff'} size={14} />}
                    <Text className={`font-mono text-[11px] uppercase font-bold ${
                      item.id === 'upcoming-1' ? 'text-[#c7f32c]' : item.id === 'upcoming-2' ? 'text-[#d0bcff]' : 'text-[#acedff]'
                    }`}>{item.countdownPill}</Text>
                  </View>

                  {/* Category Pill Tag */}
                  <View className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#2a292e]/90">
                    <Text className="text-gray-200 font-mono text-[10px] uppercase tracking-wider">{item.categoryTag}</Text>
                  </View>

                  {/* Top-Right Bookmark Button */}
                  <Pressable
                    onPress={() => onBookmarkToggle?.(item.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0e0e12]/80 items-center justify-center shadow-md"
                    style={{ elevation: 5 }}
                  >
                    <Bookmark color={isSaved ? '#c7f32c' : '#d1d5db'} fill={isSaved ? '#c7f32c' : 'none'} size={16} />
                  </Pressable>
                </View>

                {/* Card Body */}
                <View className="flex-col p-4 gap-2">
                  <View className="flex-row items-center justify-between text-gray-400">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="font-mono text-[11px] uppercase text-[#d0bcff]">{item.guildSub}</Text>
                      <View className="w-1 h-1 rounded-full bg-gray-500" />
                      <Text className="font-mono text-[11px] uppercase text-gray-400">{item.tierTag}</Text>
                    </View>
                    {item.slotsWarning && (
                      <View className={`px-2 py-0.5 rounded-full ${
                        item.id === 'upcoming-1' ? 'bg-[#93000a]/50 border border-[#ffb4ab]/30' : 'bg-[#1f1f24]'
                      }`}>
                        <Text className={`font-mono text-[10px] uppercase tracking-wide font-bold ${
                          item.id === 'upcoming-1' ? 'text-[#ffb4ab]' : item.id === 'upcoming-2' ? 'text-[#c7f32c]' : 'text-[#acedff]'
                        }`}>{item.slotsWarning}</Text>
                      </View>
                    )}
                  </View>

                  <Text className="text-2xl uppercase tracking-wide text-white font-bold leading-tight">{item.title}</Text>
                  
                  <View className="flex-row items-center gap-2 mt-1">
                    <Timer color={item.id === 'upcoming-1' ? '#c7f32c' : '#9ca3af'} size={14} />
                    <Text className="text-gray-200 text-xs font-medium">{item.time}</Text>
                    <Text className="text-gray-500 text-xs">@</Text>
                    <Text className="text-gray-400 text-xs truncate flex-1" numberOfLines={1}>{item.venue}</Text>
                  </View>

                  <View className="flex-row items-center justify-between pt-3 mt-2 border-t border-[#2a292e]">
                    <View className="flex-col flex-1 pr-2">
                      <Text className="font-mono text-[10px] uppercase text-gray-400">
                        {item.id === 'upcoming-1' ? 'Total Purse' : item.id === 'upcoming-2' ? 'Stakes' : 'Total Prize'}
                      </Text>
                      <Text className={`text-lg uppercase font-bold tracking-wide ${
                        item.id === 'upcoming-1' ? 'text-[#c7f32c]' : item.id === 'upcoming-2' ? 'text-[#d0bcff]' : 'text-[#acedff]'
                      }`} numberOfLines={1} adjustsFontSizeToFit>{item.prizePool}</Text>
                    </View>

                    <View className="flex-row items-center gap-1.5 flex-shrink-0 max-w-[60%]">
                      <Pressable
                        onPress={() => toggleReminder(item.id)}
                        className={`w-8 h-8 rounded-full items-center justify-center ${
                          hasReminder ? 'bg-[#c7f32c]/20 border border-[#c7f32c]/40' : 'bg-[#2a292e]'
                        }`}
                      >
                        {hasReminder ? <BellRing color="#c7f32c" size={14} /> : <Bell color="#9ca3af" size={14} />}
                      </Pressable>

                      <Pressable
                        onPress={() => onPreRegisterClick?.(item)}
                        className={`px-3 py-2 rounded-full flex-row items-center justify-center gap-1.5 flex-shrink-1`}
                        style={[
                          isRegistered
                            ? { backgroundColor: '#2a292e', borderColor: 'rgba(199,243,44,0.4)', borderWidth: 1 }
                            : item.id === 'upcoming-1'
                              ? { backgroundColor: '#c7f32c', shadowColor: '#c7f32c', shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 }
                              : item.id === 'upcoming-2'
                                ? { backgroundColor: '#2a292e' }
                                : { backgroundColor: '#1f1f24' },
                          { transform: [{ scale: 1 }] }
                        ]}
                      >
                        {isRegistered ? (
                          <>
                            <Check color="#c7f32c" size={12} />
                            <Text className="font-mono text-[10px] uppercase font-bold text-[#c7f32c]" numberOfLines={1} adjustsFontSizeToFit>REGISTERED</Text>
                          </>
                        ) : (
                          <>
                            <Text className={`font-mono text-[10px] uppercase font-bold tracking-wider flex-shrink ${
                              item.id === 'upcoming-1' ? 'text-[#161e00]' : 'text-white'
                            }`} numberOfLines={1} adjustsFontSizeToFit>{item.actionText}</Text>
                            {renderActionIcon(item.actionIcon, item.id === 'upcoming-1' ? '#161e00' : 'white', 12)}
                          </>
                        )}
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
