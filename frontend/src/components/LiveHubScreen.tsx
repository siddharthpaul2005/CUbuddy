import React, { useState } from 'react';
import { Bookmark, Clock, MapPin, Zap, Flame, Trophy, Music, Users, ChevronRight, Check } from 'lucide-react';
import { TODAY_DROPS, EventCardData } from '../data/mockData';

interface LiveHubScreenProps {
  onRegisterClick: (event: EventCardData) => void;
  onNavigateToPast: () => void;
  onBookmarkToggle: (id: string) => void;
  savedIds: Set<string>;
  registeredIds: Set<string>;
}

export const LiveHubScreen: React.FC<LiveHubScreenProps> = ({
  onRegisterClick,
  onNavigateToPast,
  onBookmarkToggle,
  savedIds,
  registeredIds,
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
    <div className="flex flex-col w-full px-4 pt-2 pb-24 text-white">
      {/* Live Peer Status Pill */}
      <div className="flex items-center justify-center my-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b1b1f] border border-[#2a292e] text-[11px] font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#c7f32c] animate-pulse shadow-[0_0_8px_#c7f32c]" />
          <span className="text-gray-300 uppercase tracking-wider font-semibold">
            LIVE ARENA <span className="text-gray-500">•</span>{' '}
            <span className="text-[#c7f32c] font-bold">428 CAMPUS PEERS</span> CHECKED IN
          </span>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="text-center mt-1 mb-2">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white leading-none">
          TODAY'S DROP
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-sans">
          3 high-stakes campus showdowns live right now
        </p>

        {/* Tactical Accent Neon Glow Line */}
        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#c7f32c] to-transparent mt-3 rounded-full shadow-[0_0_12px_rgba(199,243,44,0.5)]" />
      </div>

      {/* Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'ALL'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.4)]'
              : 'bg-[#1f1f24] text-gray-400 hover:text-white'
          }`}
        >
          ALL ARENAS ({TODAY_DROPS.length})
        </button>
        <button
          onClick={() => setActiveFilter('HACKATHONS')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'HACKATHONS'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.4)]'
              : 'bg-[#1f1f24] text-gray-400 hover:text-white'
          }`}
        >
          HACKATHONS
        </button>
        <button
          onClick={() => setActiveFilter('ESPORTS')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'ESPORTS'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.4)]'
              : 'bg-[#1f1f24] text-gray-400 hover:text-white'
          }`}
        >
          ESPORTS
        </button>
        <button
          onClick={() => setActiveFilter('CYBER')}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === 'CYBER'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.4)]'
              : 'bg-[#1f1f24] text-gray-400 hover:text-white'
          }`}
        >
          CYBER & SOUND
        </button>
      </div>

      {/* Event Cards Feed */}
      <div className="flex flex-col gap-4 mt-2">
        {filteredCards.map((card) => {
          const isSaved = savedIds.has(card.id);
          const isRegistered = registeredIds.has(card.id);

          return (
            <article 
              key={card.id}
              className="w-full bg-[#1b1b1f] border border-[#2a292e] rounded-xl overflow-hidden shadow-xl flex flex-col transition-all duration-200 hover:border-[#353439]"
            >
              {/* Card Media Header */}
              <div className="relative w-full h-44 bg-[#0e0e12] overflow-hidden">
                <img 
                  src={card.image} 
                  alt={card.altText}
                  className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1f] via-[#1b1b1f]/35 to-transparent" />

                {/* Top Category Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-md ${
                    card.id === 'drop-1' 
                      ? 'bg-[#571bc1] text-[#e9ddff]' 
                      : card.id === 'drop-2' 
                        ? 'bg-[#93000a] text-[#ffdad6]' 
                        : 'bg-[#004e5c] text-[#acedff]'
                  }`}>
                    {card.id === 'drop-1' && <Zap className="w-3 h-3" />}
                    {card.id === 'drop-2' && <Flame className="w-3 h-3" />}
                    {card.id === 'drop-3' && <Music className="w-3 h-3" />}
                    <span>{card.categoryTag}</span>
                  </span>
                </div>

                {/* Top Bookmark Trigger */}
                <button
                  onClick={() => onBookmarkToggle(card.id)}
                  aria-label="Bookmark event"
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0e0e12]/85 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-[#c7f32c] active:scale-90 transition-all shadow-md cursor-pointer"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#c7f32c] text-[#c7f32c]' : ''}`} />
                </button>

                {/* Floating Bottom Left Badge on Media */}
                {card.badgeTag && (
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider font-bold shadow-md flex items-center gap-1 ${
                      card.badgeType === 'spots' 
                        ? 'bg-[#93000a]/90 text-[#ffb4ab] border border-[#ffb4ab]/30 animate-pulse' 
                        : card.badgeType === 'elimination'
                          ? 'bg-[#0e0e12]/90 backdrop-blur-md text-white border border-[#2a292e]'
                          : 'bg-[#0e0e12]/90 backdrop-blur-md text-white border border-[#2a292e]'
                    }`}>
                      {card.badgeType === 'spots' && <Clock className="w-3 h-3" />}
                      {card.badgeTag}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-2">
                {/* Guild & Tier Sub */}
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider">
                  <span className="text-gray-400 font-bold">{card.guildSub}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span className="text-[#c7f32c]">{card.tierTag}</span>
                </div>

                {/* Main Headline */}
                <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight">
                  {card.title}
                </h2>

                {/* Date & Location */}
                <div className="space-y-1 text-xs text-gray-400 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c7f32c] shrink-0" />
                    <span className="text-gray-200">{card.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c7f32c] shrink-0" />
                    <span className="truncate">{card.venue}</span>
                  </div>
                </div>

                {/* Bottom Prize & Register CTA */}
                <div className="mt-3 pt-3 border-t border-[#2a292e] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg uppercase text-white tracking-wide flex items-center gap-1">
                      {card.prizeText}
                    </span>
                    {card.registeredCount && (
                      <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
                        {card.registeredCount}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onRegisterClick(card)}
                    className={`px-4 py-2 rounded-full font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_16px_rgba(199,243,44,0.3)] cursor-pointer ${
                      isRegistered
                        ? 'bg-[#2a292e] text-[#c7f32c] border border-[#c7f32c]/50'
                        : 'bg-[#c7f32c] hover:bg-[#d2ff3a] text-[#161e00]'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>REGISTERED</span>
                      </>
                    ) : (
                      <>
                        <span>{card.actionText}</span>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Missed a Scrimmage Banner */}
      <div 
        onClick={onNavigateToPast}
        className="mt-5 p-3.5 rounded-xl bg-[#1b1b1f] border border-[#2a292e] hover:border-[#c7f32c]/40 flex items-center justify-between cursor-pointer transition-all active:scale-98 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2a292e] group-hover:bg-[#c7f32c]/20 flex items-center justify-center text-[#c7f32c] transition-colors">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm uppercase text-white tracking-wide group-hover:text-[#c7f32c] transition-colors">
              MISSED A SCRIMMAGE?
            </span>
            <span className="text-xs text-gray-400">
              Browse previous finals &amp; tournament vods
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#c7f32c] group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};
