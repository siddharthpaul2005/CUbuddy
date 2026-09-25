import React, { useState } from 'react';
import { Timer, Calendar, Bookmark, Bell, BellRing, Zap, Swords, ChevronRight, Check, Radar } from 'lucide-react';
import { UPCOMING_FIXTURES, UpcomingEventCardData } from '../data/mockData';

interface UpcomingScreenProps {
  onPreRegisterClick: (event: UpcomingEventCardData) => void;
  onBookmarkToggle: (id: string) => void;
  onNavigateToRadar: () => void;
  savedIds: Set<string>;
  registeredIds: Set<string>;
}

export const UpcomingScreen: React.FC<UpcomingScreenProps> = ({
  onPreRegisterClick,
  onBookmarkToggle,
  onNavigateToRadar,
  savedIds,
  registeredIds,
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
    <div className="flex flex-col w-full px-4 pt-2 pb-24 text-white">
      {/* Screen Header */}
      <header className="flex flex-col pt-2 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-white leading-tight">
            UPCOMING — NEXT 15 DAYS
          </h1>
          <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-full bg-[#1b1b1f] text-[#c7f32c] border border-[#2a292e] shadow-[0_0_12px_rgba(199,243,44,0.2)] font-bold">
            3 Fixtures
          </span>
        </div>
        <p className="text-xs text-gray-400 max-w-sm font-sans">
          Lock in your spot for upcoming campus tournaments, showdowns &amp; showcases.
        </p>

        {/* Thin Neon Lime Divider */}
        <div className="w-full h-0.5 bg-[#c7f32c] shadow-[0_0_10px_rgba(199,243,44,0.4)] mt-3 mb-2 rounded-full" />
      </header>

      {/* Interactive Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
        <button
          onClick={() => setActiveTrack('ALL')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeTrack === 'ALL'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] text-gray-400 hover:text-white'
          }`}
        >
          <span>All Tracks</span>
        </button>
        <button
          onClick={() => setActiveTrack('HARDWARE')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeTrack === 'HARDWARE'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] text-gray-400 hover:text-white'
          }`}
        >
          <span>Hardware &amp; Robotics</span>
        </button>
        <button
          onClick={() => setActiveTrack('ESPORTS')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeTrack === 'ESPORTS'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] text-gray-400 hover:text-white'
          }`}
        >
          <span>Esports</span>
        </button>
        <button
          onClick={() => setActiveTrack('HACKATHONS')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeTrack === 'HACKATHONS'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] text-gray-400 hover:text-white'
          }`}
        >
          <span>Hackathons</span>
        </button>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 mb-2 no-scrollbar">
        <button
          onClick={() => setActiveDay('ALL')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeDay === 'ALL'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] border border-[#2a292e] text-gray-400 hover:text-white'
          }`}
        >
          <span>All Days</span>
        </button>
        <button
          onClick={() => setActiveDay('TOMORROW')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeDay === 'TOMORROW'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] border border-[#2a292e] text-gray-400 hover:text-white'
          }`}
        >
          <span>Tomorrow</span>
        </button>
        <button
          onClick={() => setActiveDay('THIS_WEEK')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeDay === 'THIS_WEEK'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] border border-[#2a292e] text-gray-400 hover:text-white'
          }`}
        >
          <span>This Week</span>
        </button>
        <button
          onClick={() => setActiveDay('NEXT_WEEK')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs uppercase shrink-0 transition-all cursor-pointer ${
            activeDay === 'NEXT_WEEK'
              ? 'bg-[#c7f32c] text-[#161e00] font-bold shadow-[0_0_14px_rgba(199,243,44,0.3)]'
              : 'bg-[#1b1b1f] border border-[#2a292e] text-gray-400 hover:text-white'
          }`}
        >
          <span>Next Week</span>
        </button>
      </div>

      {/* TIMELINE STREAM */}
      <div className="flex flex-col gap-6 mt-3">
        {filtered.map((item) => {
          const isSaved = savedIds.has(item.id);
          const isRegistered = registeredIds.has(item.id);
          const hasReminder = reminders.has(item.id);

          return (
            <section key={item.id} className="flex flex-col gap-2">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    item.id === 'upcoming-1' ? 'bg-[#c7f32c] animate-ping' : item.id === 'upcoming-2' ? 'bg-[#d0bcff]' : 'bg-[#acedff]'
                  }`} />
                  <span className={`font-mono text-xs uppercase tracking-wider font-bold ${
                    item.id === 'upcoming-1' ? 'text-[#c7f32c]' : item.id === 'upcoming-2' ? 'text-[#d0bcff]' : 'text-[#acedff]'
                  }`}>
                    {item.timeframeSection}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase text-gray-400 tracking-widest">
                  {item.timeframeLock}
                </span>
              </div>

              {/* Card */}
              <article className="relative flex flex-col rounded-xl bg-[#1b1b1f] border border-[#2a292e] shadow-xl overflow-hidden group hover:border-[#353439] transition-all">
                {/* Poster Image */}
                <div className="relative w-full h-44 overflow-hidden bg-[#0e0e12]">
                  <img
                    src={item.image}
                    alt={item.altText}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1f] via-[#1b1b1f]/40 to-transparent" />

                  {/* Pinned Top-Left Countdown Pill */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0e0e12]/90 backdrop-blur-md font-mono text-[11px] uppercase font-bold shadow-md ${
                    item.id === 'upcoming-1' 
                      ? 'text-[#c7f32c] shadow-[0_0_12px_rgba(199,243,44,0.35)]' 
                      : item.id === 'upcoming-2'
                        ? 'text-[#d0bcff] shadow-[0_0_10px_rgba(208,188,255,0.25)]'
                        : 'text-[#acedff] shadow-[0_0_10px_rgba(172,237,255,0.25)]'
                  }`}>
                    {item.id === 'upcoming-1' ? <Timer className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                    <span>{item.countdownPill}</span>
                  </div>

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-[#2a292e]/90 backdrop-blur-sm text-gray-200 font-mono text-[10px] uppercase tracking-wider">
                    {item.categoryTag}
                  </div>

                  {/* Top-Right Bookmark Button */}
                  <button
                    onClick={() => onBookmarkToggle(item.id)}
                    aria-label="Save event"
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#0e0e12]/80 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-[#c7f32c] active:scale-90 transition-all shadow-md cursor-pointer"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#c7f32c] text-[#c7f32c]' : ''}`} />
                  </button>
                </div>

                {/* Card Body */}
                <div className="flex flex-col p-4 gap-2 relative">
                  {/* Guild Subtitle & Slots Indicator */}
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] uppercase text-[#d0bcff]">{item.guildSub}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span className="font-mono text-[11px] uppercase text-gray-400">{item.tierTag}</span>
                    </div>
                    {item.slotsWarning && (
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wide font-bold ${
                        item.id === 'upcoming-1' 
                          ? 'bg-[#93000a]/50 text-[#ffb4ab] border border-[#ffb4ab]/30 animate-pulse' 
                          : item.id === 'upcoming-2'
                            ? 'bg-[#1f1f24] text-[#c7f32c]'
                            : 'bg-[#1f1f24] text-[#acedff]'
                      }`}>
                        {item.slotsWarning}
                      </span>
                    )}
                  </div>

                  {/* Main Title */}
                  <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight">
                    {item.title}
                  </h2>

                  {/* Venue & Time */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs">
                    <Timer className={`w-3.5 h-3.5 ${item.id === 'upcoming-1' ? 'text-[#c7f32c]' : 'text-gray-400'}`} />
                    <span className="text-gray-200 font-medium">{item.time}</span>
                    <span className="text-gray-500">@</span>
                    <span className="truncate">{item.venue}</span>
                  </div>

                  {/* Prize Pool & Actions */}
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-[#2a292e]">
                    <div className="flex flex-col">
                      <span className="font-mono text-[10px] uppercase text-gray-400">
                        {item.id === 'upcoming-1' ? 'Total Purse' : item.id === 'upcoming-2' ? 'Stakes' : 'Total Prize'}
                      </span>
                      <span className={`font-display text-lg uppercase tracking-wide ${
                        item.id === 'upcoming-1' ? 'text-[#c7f32c]' : item.id === 'upcoming-2' ? 'text-[#d0bcff]' : 'text-[#acedff]'
                      }`}>
                        {item.prizePool}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Reminder Bell Trigger */}
                      <button
                        onClick={() => toggleReminder(item.id)}
                        aria-label="Set Reminder"
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                          hasReminder
                            ? 'bg-[#c7f32c]/20 text-[#c7f32c] border border-[#c7f32c]/40'
                            : 'bg-[#2a292e] text-gray-400 hover:text-white'
                        }`}
                      >
                        {hasReminder ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </button>

                      {/* Action Pill Button */}
                      <button
                        onClick={() => onPreRegisterClick(item)}
                        className={`px-4 py-2 rounded-full font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md cursor-pointer ${
                          isRegistered
                            ? 'bg-[#2a292e] text-[#c7f32c] border border-[#c7f32c]/40'
                            : item.id === 'upcoming-1'
                              ? 'bg-[#c7f32c] hover:bg-[#d2ff3a] text-[#161e00] shadow-[0_0_16px_rgba(199,243,44,0.35)]'
                              : item.id === 'upcoming-2'
                                ? 'bg-[#2a292e] hover:bg-[#c7f32c] hover:text-[#161e00] text-white'
                                : 'bg-[#1f1f24] hover:bg-[#acedff] hover:text-[#001f26] text-white'
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>REGISTERED</span>
                          </>
                        ) : (
                          <>
                            <span>{item.actionText}</span>
                            {item.id === 'upcoming-1' ? (
                              <Zap className="w-3.5 h-3.5 fill-current" />
                            ) : item.id === 'upcoming-2' ? (
                              <Swords className="w-3.5 h-3.5" />
                            ) : (
                              <Bell className="w-3.5 h-3.5" />
                            )}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          );
        })}
      </div>

      {/* Scouting Radar Pass Alert Banner */}
      <div 
        onClick={onNavigateToRadar}
        className="mt-6 p-4 rounded-xl bg-[#1b1b1f] border border-[#2a292e] hover:border-[#c7f32c]/40 flex items-center gap-3 cursor-pointer transition-all active:scale-98"
      >
        <div className="w-10 h-10 rounded-full bg-[#c7f32c]/20 text-[#c7f32c] flex items-center justify-center shrink-0">
          <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-mono text-xs uppercase text-[#c7f32c] font-bold tracking-wider">
            Scouting Radar Active
          </span>
          <p className="text-xs text-gray-400 truncate">
            6 unannounced scrims &amp; workshops pending fixture lock.
          </p>
        </div>
        <button className="px-3 py-1 rounded bg-[#2a292e] text-white hover:text-[#c7f32c] font-mono text-xs uppercase font-bold shrink-0">
          Sync
        </button>
      </div>
    </div>
  );
};
