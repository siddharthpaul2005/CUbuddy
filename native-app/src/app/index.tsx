import { useState } from 'react';
import { View, Text, StatusBar, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, History, CalendarDays, Trophy, Bell, Activity } from 'lucide-react-native';
import { SplashScreen } from '../components/SplashScreen';
import { LiveHubScreen } from '../components/LiveHubScreen';
import { PastEventsScreen } from '../components/PastEventsScreen';
import { UpcomingScreen } from '../components/UpcomingScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import { USER_PROFILE } from '../data/mockData';

type TabType = 'LIVE' | 'PAST' | 'FUTURE' | 'PROFILE';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('LIVE');

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <StatusBar barStyle="light-content" />
        <SplashScreen onDismiss={() => setShowSplash(false)} />
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'LIVE':
        return <LiveHubScreen onNavigateToPast={() => setActiveTab('PAST')} />;
      case 'PAST':
        return <PastEventsScreen />;
      case 'FUTURE':
        return <UpcomingScreen />;
      case 'PROFILE':
        return <ProfileScreen onOpenSyncScreen={() => setShowSplash(true)} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#131317]">
      <StatusBar barStyle="light-content" backgroundColor="#131317" />
      
      {/* Header */}
      <View className="h-14 px-4 flex-row items-center justify-between border-b border-[#2a292e]/40 bg-[#131317]">
        <Pressable 
          onPress={() => setActiveTab('LIVE')}
          className="flex-row items-center gap-2"
        >
          {/* App Avatar */}
          <View className="w-8 h-8 rounded-xl bg-[#0e0e12] border border-[#c7f32c] items-center justify-center">
            <Activity color="#c7f32c" size={20} strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-white font-bold uppercase tracking-wider text-base leading-tight">CampusPulse</Text>
            <Text className="text-[#c7f32c] font-bold text-[9px] uppercase tracking-widest">Live Hub</Text>
          </View>
        </Pressable>

        <View className="flex-row items-center gap-3">
          <Pressable className="w-9 h-9 rounded-full bg-[#1b1b1f] items-center justify-center relative">
            <Bell color="#d1d5db" size={18} />
            <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c7f32c]" />
          </Pressable>
          <Pressable onPress={() => setActiveTab('PROFILE')} className="relative">
            <Image 
              source={{ uri: USER_PROFILE.avatarUrl }} 
              className="w-8 h-8 rounded-full"
              style={{ borderWidth: 2, borderColor: '#c7f32c' }}
            />
            <View className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#c7f32c] border-2 border-[#131317]" />
          </Pressable>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 bg-[#07070a]">
        {renderContent()}
      </View>

      {/* Bottom Dock Navigation matching frontend */}
      <View className="h-16 flex-row justify-around items-center bg-[#131317]/95 border-t border-[#2a292e]">
        <Pressable onPress={() => setActiveTab('LIVE')} className="items-center justify-center min-w-[56px] min-h-[44px]">
          <Flame color={activeTab === 'LIVE' ? '#c7f32c' : '#9ca3af'} size={20} fill={activeTab === 'LIVE' ? '#c7f32c' : 'none'} />
          <Text className={`text-[9px] font-mono uppercase tracking-wider mt-0.5 ${activeTab === 'LIVE' ? 'text-[#c7f32c] font-bold' : 'text-gray-400'}`}>Live</Text>
          {activeTab === 'LIVE' && <View className="w-3 h-0.5 bg-[#c7f32c] rounded-full mt-0.5" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.8, shadowRadius: 4, elevation: 4 }} />}
        </Pressable>
        
        <Pressable onPress={() => setActiveTab('PAST')} className="items-center justify-center min-w-[56px] min-h-[44px]">
          <History color={activeTab === 'PAST' ? '#c7f32c' : '#9ca3af'} size={20} />
          <Text className={`text-[9px] font-mono uppercase tracking-wider mt-0.5 ${activeTab === 'PAST' ? 'text-[#c7f32c] font-bold' : 'text-gray-400'}`}>Past</Text>
          {activeTab === 'PAST' && <View className="w-3 h-0.5 bg-[#c7f32c] rounded-full mt-0.5" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.8, shadowRadius: 4, elevation: 4 }} />}
        </Pressable>
        
        <Pressable onPress={() => setActiveTab('FUTURE')} className="items-center justify-center min-w-[56px] min-h-[44px]">
          <CalendarDays color={activeTab === 'FUTURE' ? '#c7f32c' : '#9ca3af'} size={20} />
          <Text className={`text-[9px] font-mono uppercase tracking-wider mt-0.5 ${activeTab === 'FUTURE' ? 'text-[#c7f32c] font-bold' : 'text-gray-400'}`}>Future</Text>
          {activeTab === 'FUTURE' && <View className="w-3 h-0.5 bg-[#c7f32c] rounded-full mt-0.5" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.8, shadowRadius: 4, elevation: 4 }} />}
        </Pressable>
        
        <Pressable onPress={() => setActiveTab('PROFILE')} className="items-center justify-center min-w-[56px] min-h-[44px]">
          <Trophy color={activeTab === 'PROFILE' ? '#c7f32c' : '#9ca3af'} size={20} />
          <Text className={`text-[9px] font-mono uppercase tracking-wider mt-0.5 ${activeTab === 'PROFILE' ? 'text-[#c7f32c] font-bold' : 'text-gray-400'}`}>Profile</Text>
          {activeTab === 'PROFILE' && <View className="w-3 h-0.5 bg-[#c7f32c] rounded-full mt-0.5" style={{ shadowColor: '#c7f32c', shadowOpacity: 0.8, shadowRadius: 4, elevation: 4 }} />}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
