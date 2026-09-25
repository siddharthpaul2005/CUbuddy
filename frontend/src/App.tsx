import React, { useState } from 'react';
import { 
  Flame, 
  History, 
  CalendarDays, 
  Radar as RadarIcon, 
  Trophy, 
  Bell, 
  Smartphone, 
  Zap,
  Sparkles
} from 'lucide-react';
import { LiveHubScreen } from './components/LiveHubScreen';
import { PastEventsScreen } from './components/PastEventsScreen';
import { UpcomingScreen } from './components/UpcomingScreen';
import { RadarScreen } from './components/RadarScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { SplashScreen } from './components/SplashScreen';
import { RegistrationModal } from './components/RegistrationModal';
import { ScoreboardModal } from './components/ScoreboardModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { USER_PROFILE, EventCardData, PastEventCardData, UpcomingEventCardData } from './data/mockData';

export type TabType = 'LIVE' | 'PAST' | 'FUTURE' | 'RADAR' | 'PROFILE';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('LIVE');
  const [showSplashScreen, setShowSplashScreen] = useState(false);

  // Saved events & registered passes state
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['drop-2']));
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set(['drop-1']));

  // Modals
  const [regModalData, setRegModalData] = useState<{
    isOpen: boolean;
    title: string;
    prize: string;
    time: string;
    venue: string;
    id: string;
  }>({
    isOpen: false,
    title: '',
    prize: '',
    time: '',
    venue: '',
    id: '',
  });

  const [selectedPastEvent, setSelectedPastEvent] = useState<PastEventCardData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Bookmark toggle
  const handleBookmarkToggle = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Open registration for Live card
  const handleLiveRegister = (event: EventCardData) => {
    setRegModalData({
      isOpen: true,
      title: event.title,
      prize: event.prizeText,
      time: event.time,
      venue: event.venue,
      id: event.id,
    });
  };

  // Open registration for Upcoming card
  const handleUpcomingRegister = (event: UpcomingEventCardData) => {
    setRegModalData({
      isOpen: true,
      title: event.title,
      prize: event.prizePool,
      time: event.time,
      venue: event.venue,
      id: event.id,
    });
  };

  const handleRegistrationSuccess = (data: { teamName: string; tag: string; seatCode: string }) => {
    if (regModalData.id) {
      setRegisteredIds((prev) => new Set(prev).add(regModalData.id));
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-[#e4e1e7] flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-[#c7f32c] selection:text-[#161e00]">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#c7f32c]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#571bc1]/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Container */}
      <div className="w-full flex-1 flex flex-col relative z-10 max-w-7xl mx-auto bg-[#131317] min-h-screen">
        {showSplashScreen ? (
          <SplashScreen 
            onDismiss={() => setShowSplashScreen(false)} 
          />
        ) : (
          <div className="relative min-h-screen flex flex-col justify-between bg-[#131317]">
            {/* Header */}
            <header className="sticky top-0 inset-x-0 z-40 bg-[#131317]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-[#2a292e]/40">
              <div className="h-14 px-4 flex items-center justify-between">
                {/* Brand Identity */}
                <div 
                  onClick={() => setActiveTab('LIVE')}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <img 
                    alt="CampusPulse Brand Mark" 
                    className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
                    src={USER_PROFILE.brandLogoUrl}
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col">
                    <span className="font-display text-base uppercase tracking-wider text-white leading-none">
                      CampusPulse
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#c7f32c] font-bold">
                      Live Hub
                    </span>
                  </div>
                </div>

                {/* Header Actions: Notification Bell + Profile Avatar */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowNotifications(true)}
                    aria-label="Notifications" 
                    className="w-9 h-9 rounded-full bg-[#1b1b1f] hover:bg-[#2a292e] flex items-center justify-center text-gray-300 hover:text-white transition-colors relative cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#c7f32c] shadow-[0_0_6px_#c7f32c]" />
                  </button>

                  <div 
                    onClick={() => setActiveTab('PROFILE')}
                    className="relative flex items-center justify-center cursor-pointer group"
                  >
                    <img 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[#c7f32c] shadow-[0_0_12px_rgba(199,243,44,0.4)] transition-transform group-hover:scale-105" 
                      src={USER_PROFILE.avatarUrl}
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#c7f32c] ring-1 ring-[#131317]" />
                  </div>
                </div>
              </div>
            </header>

            {/* Screen Content Viewport */}
            <main className="flex-1 w-full relative">
              {activeTab === 'LIVE' && (
                <LiveHubScreen 
                  onRegisterClick={handleLiveRegister}
                  onNavigateToPast={() => setActiveTab('PAST')}
                  onBookmarkToggle={handleBookmarkToggle}
                  savedIds={savedIds}
                  registeredIds={registeredIds}
                />
              )}

              {activeTab === 'PAST' && (
                <PastEventsScreen 
                  onOpenScoreboard={(event) => setSelectedPastEvent(event)}
                />
              )}

              {activeTab === 'FUTURE' && (
                <UpcomingScreen 
                  onPreRegisterClick={handleUpcomingRegister}
                  onBookmarkToggle={handleBookmarkToggle}
                  onNavigateToRadar={() => setActiveTab('RADAR')}
                  savedIds={savedIds}
                  registeredIds={registeredIds}
                />
              )}

              {activeTab === 'RADAR' && (
                <RadarScreen />
              )}

              {activeTab === 'PROFILE' && (
                <ProfileScreen 
                  onOpenSyncScreen={() => setShowSplashScreen(true)}
                />
              )}
            </main>

            {/* Bottom Dock Navigation matching mockup */}
            <nav className="fixed bottom-0 inset-x-0 sm:absolute z-40 pb-safe bg-[#131317]/95 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.6)] border-t border-[#2a292e]">
              <div className="flex justify-around items-center h-16 px-1">
                {/* LIVE TAB */}
                <button
                  onClick={() => setActiveTab('LIVE')}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all cursor-pointer ${
                    activeTab === 'LIVE' ? 'text-[#c7f32c] font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Flame className={`w-5 h-5 ${activeTab === 'LIVE' ? 'fill-current' : ''}`} />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Live</span>
                  {activeTab === 'LIVE' && (
                    <span className="w-3 h-0.5 bg-[#c7f32c] rounded-full shadow-[0_0_8px_rgba(199,243,44,0.8)] mt-0.5" />
                  )}
                </button>

                {/* PAST TAB */}
                <button
                  onClick={() => setActiveTab('PAST')}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all cursor-pointer ${
                    activeTab === 'PAST' ? 'text-[#c7f32c] font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <History className="w-5 h-5" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Past</span>
                  {activeTab === 'PAST' && (
                    <span className="w-3 h-0.5 bg-[#c7f32c] rounded-full shadow-[0_0_8px_rgba(199,243,44,0.8)] mt-0.5" />
                  )}
                </button>

                {/* FUTURE TAB */}
                <button
                  onClick={() => setActiveTab('FUTURE')}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all cursor-pointer ${
                    activeTab === 'FUTURE' ? 'text-[#c7f32c] font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CalendarDays className="w-5 h-5" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Future</span>
                  {activeTab === 'FUTURE' && (
                    <span className="w-3 h-0.5 bg-[#c7f32c] rounded-full shadow-[0_0_8px_rgba(199,243,44,0.8)] mt-0.5" />
                  )}
                </button>

                {/* RADAR TAB */}
                <button
                  onClick={() => setActiveTab('RADAR')}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all cursor-pointer ${
                    activeTab === 'RADAR' ? 'text-[#c7f32c] font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <RadarIcon className="w-5 h-5" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Radar</span>
                  {activeTab === 'RADAR' && (
                    <span className="w-3 h-0.5 bg-[#c7f32c] rounded-full shadow-[0_0_8px_rgba(199,243,44,0.8)] mt-0.5" />
                  )}
                </button>

                {/* PROFILE TAB */}
                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-0.5 transition-all cursor-pointer ${
                    activeTab === 'PROFILE' ? 'text-[#c7f32c] font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-mono text-[9px] uppercase tracking-wider">Profile</span>
                  {activeTab === 'PROFILE' && (
                    <span className="w-3 h-0.5 bg-[#c7f32c] rounded-full shadow-[0_0_8px_rgba(199,243,44,0.8)] mt-0.5" />
                  )}
                </button>
              </div>

            </nav>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={regModalData.isOpen}
        onClose={() => setRegModalData((prev) => ({ ...prev, isOpen: false }))}
        eventTitle={regModalData.title}
        prizeText={regModalData.prize}
        timeText={regModalData.time}
        venueText={regModalData.venue}
        onSuccess={handleRegistrationSuccess}
      />

      {/* Scoreboard and VOD Modal */}
      <ScoreboardModal 
        event={selectedPastEvent}
        onClose={() => setSelectedPastEvent(null)}
      />

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
}
