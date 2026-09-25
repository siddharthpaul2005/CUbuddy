import React, { useState } from 'react';
import { ShieldCheck, Trophy, Lock, BarChart3, ChevronDown, CheckCircle2, Clock, MapPin, ExternalLink, Archive } from 'lucide-react';
import { PAST_EVENTS, PastEventCardData } from '../data/mockData';

interface PastEventsScreenProps {
  onOpenScoreboard: (event: PastEventCardData) => void;
}

export const PastEventsScreen: React.FC<PastEventsScreenProps> = ({ onOpenScoreboard }) => {
  const [selectedDay, setSelectedDay] = useState('YESTERDAY');
  const [extraCardsLoaded, setExtraCardsLoaded] = useState(false);

  const days = ['YESTERDAY', '2 DAYS AGO', '3 DAYS AGO', '4 DAYS AGO', 'LAST WEEK', 'SEASON 1'];

  const handleLoadOlder = () => {
    setExtraCardsLoaded(true);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 text-white">
      {/* Header Info */}
      <div className="pt-2 pb-2 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c7f32c] shadow-[0_0_8px_#c7f32c]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#c7f32c] font-bold">
              Vault Archives
            </span>
          </div>
          <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#c7f32c]" />
            MATCH HISTORIAN ACTIVE
          </span>
        </div>

        <h1 className="font-display text-4xl uppercase text-white tracking-wider mt-0.5">
          PAST EVENTS
        </h1>
        <p className="text-xs text-gray-400 -mt-1 font-sans">
          Browse archived campus showdowns &amp; verified scoreboards
        </p>

        {/* Tactical Accent Neon Glow Line */}
        <div className="w-full h-0.5 bg-gradient-to-r from-[#c7f32c] via-[#c7f32c]/40 to-transparent mt-2 rounded-full shadow-[0_0_10px_rgba(199,243,44,0.4)]" />
      </div>

      {/* Horizontal Time-Range Selector Chips */}
      <div className="w-full overflow-x-auto no-scrollbar py-2 flex items-center gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_12px_rgba(199,243,44,0.35)]'
                : 'bg-[#2a292e] text-gray-400 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Archive Summary Stat Bar */}
      <div className="my-2">
        <div className="w-full bg-[#0e0e12] border border-[#2a292e] rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#2a292e] flex items-center justify-center flex-shrink-0 text-[#c7f32c]">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#c7f32c] truncate font-bold">
                {selectedDay === 'YESTERDAY' ? 'Yesterday Recap' : `${selectedDay} Recap`}
              </span>
              <span className="font-mono text-xs uppercase text-gray-200 truncate">
                {selectedDay === 'YESTERDAY' ? '3 Showdowns Concluded' : '0 Showdowns Concluded'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0 pl-2">
            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-wider">
              Prizes Logged
            </span>
            <span className="font-display text-lg text-white tracking-wide">
              {selectedDay === 'YESTERDAY' ? '₹16,000' : '₹0'}
            </span>
          </div>
        </div>
      </div>

      {/* Archived Event Cards Feed */}
      <div className="flex flex-col gap-4 mt-2 pb-6">
        {selectedDay === 'YESTERDAY' ? PAST_EVENTS.map((card) => (
          <article
            key={card.id}
            className="w-full bg-[#1b1b1f] border border-[#2a292e] rounded-xl overflow-hidden shadow-lg flex flex-col transition-all duration-200 hover:border-[#353439]"
          >
            {/* Media Header */}
            <div className="relative w-full h-44 bg-[#0e0e12] overflow-hidden">
              <img
                src={card.image}
                alt={card.altText}
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1f] via-[#1b1b1f]/30 to-transparent" />

              {/* Category & Tier Tags */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm font-bold ${
                  card.id === 'past-1' 
                    ? 'bg-[#571bc1] text-[#c4abff]' 
                    : card.id === 'past-2' 
                      ? 'bg-[#93000a] text-[#ffdad6]' 
                      : 'bg-[#004e5c] text-[#acedff]'
                }`}>
                  <span>{card.categoryTag}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#0e0e12]/80 backdrop-blur-md text-gray-400 font-mono text-[9px] tracking-widest uppercase">
                  {card.badgeTag}
                </span>
              </div>

              {/* Concluded Flag */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-full bg-[#0e0e12]/90 backdrop-blur-md text-gray-300 font-mono text-[10px] uppercase flex items-center gap-1 border border-white/5">
                  <CheckCircle2 className="w-3 h-3 text-[#c7f32c]" />
                  <span>{card.statusBadge}</span>
                </span>
              </div>

              {/* Scoreboard Winner Highlight Banner */}
              <div className="absolute bottom-3 inset-x-3 bg-[#0e0e12]/95 backdrop-blur-md rounded-lg px-3 py-2 flex items-center justify-between shadow-md border border-[#2a292e]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Trophy className="w-4 h-4 text-[#c7f32c] flex-shrink-0" />
                  <span className="font-mono text-xs uppercase text-white font-bold truncate">
                    {card.winnerBanner}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#c7f32c] font-bold flex-shrink-0 ml-2">
                  {card.winnerAccent}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  {card.guildSub}
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  {card.matchId}
                </span>
              </div>

              <h2 className="font-display text-2xl uppercase text-white tracking-wide leading-tight">
                {card.title}
              </h2>

              {/* Match Meta Data */}
              <div className="flex items-center gap-3 text-gray-400 text-xs pt-0.5">
                <div className="flex items-center gap-1 min-w-0 truncate">
                  <Clock className="w-3.5 h-3.5 text-[#c7f32c] flex-shrink-0" />
                  <span className="truncate">{card.time}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#c7f32c]" />
                  <span>{card.venue}</span>
                </div>
              </div>

              {/* Custom micro-recap for each card */}
              {card.leaderboardSnippet && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#0e0e12] border border-[#2a292e] flex items-center justify-around gap-2 text-center">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-gray-500 uppercase">1ST PLACE</span>
                    <span className="font-mono text-xs text-white font-bold truncate">
                      {card.leaderboardSnippet.first}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-[#2a292e]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-gray-500 uppercase">RUNNER UP</span>
                    <span className="font-mono text-xs text-gray-300 truncate">
                      {card.leaderboardSnippet.runnerUp}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-[#2a292e]" />
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-gray-500 uppercase">BEST EXPLOIT</span>
                    <span className="font-mono text-xs text-[#c7f32c] font-bold truncate">
                      {card.leaderboardSnippet.specialAward}
                    </span>
                  </div>
                </div>
              )}

              {card.headToHead && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#0e0e12] border border-[#2a292e] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#c7f32c] flex items-center justify-center font-display text-sm text-[#161e00] flex-shrink-0">
                      {card.headToHead.symbolA}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs text-white font-bold truncate">
                        {card.headToHead.teamA}
                      </span>
                      <span className="font-mono text-[10px] text-[#c7f32c]">
                        {card.headToHead.teamAScore}
                      </span>
                    </div>
                  </div>
                  <span className="font-display text-sm text-gray-500 px-2">VS</span>
                  <div className="flex items-center gap-2 justify-end min-w-0 text-right">
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs text-gray-300 truncate">
                        {card.headToHead.teamB}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">
                        {card.headToHead.teamBScore}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#2a292e] flex items-center justify-center font-display text-sm text-gray-300 flex-shrink-0">
                      {card.headToHead.symbolB}
                    </div>
                  </div>
                </div>
              )}

              {card.tags && (
                <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {card.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        idx === 2 ? 'bg-[#0e0e12] text-[#c7f32c] border border-[#c7f32c]/30 font-bold' : 'bg-[#0e0e12] text-gray-400 border border-[#2a292e]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Footer */}
              <div className="mt-3 pt-3 border-t border-[#2a292e] flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e0e12] text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                  <span>{card.id === 'past-1' ? 'RESULTS OUT' : 'CLOSED'}</span>
                </div>
                <button
                  onClick={() => onOpenScoreboard(card)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2a292e] hover:bg-[#353439] text-white hover:text-[#c7f32c] font-mono text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer font-bold"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#c7f32c]" />
                  <span>
                    {card.actionType === 'scoreboard' && 'SCOREBOARD & VOD'}
                    {card.actionType === 'leaderboard' && 'LEADERBOARD'}
                    {card.actionType === 'winning_entries' && 'WINNING ENTRIES'}
                  </span>
                </button>
              </div>
            </div>
          </article>
        )) : (
          <div className="text-center py-10 font-mono text-xs text-gray-400 uppercase tracking-widest border border-dashed border-[#2a292e] rounded-xl mt-2 bg-[#0e0e12] flex items-center justify-center">
            NO LOGS MATCHING {selectedDay}
          </div>
        )}

        {extraCardsLoaded && (
          <div className="p-3 bg-[#0e0e12] rounded-xl border border-[#2a292e] text-center text-xs text-gray-400">
            <span className="text-[#c7f32c] font-mono font-bold block mb-1">
              ARCHIVED SEASON 03 RECAP
            </span>
            Loaded 12 additional verified historical scoreboards from local mesh node.
          </div>
        )}
      </div>

      {/* End of Archive Banner */}
      <div className="pb-6 text-center flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-[#1b1b1f] border border-[#2a292e] flex items-center justify-center text-gray-400">
          <Archive className="w-5 h-5 text-gray-400" />
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
          ALL 24-HOUR MATCH LOGS SYNCHRONIZED
        </span>
        <button
          onClick={handleLoadOlder}
          className="font-mono text-xs text-[#c7f32c] uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer font-bold"
        >
          <span>LOAD OLDER TOURNAMENT CYCLES</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
