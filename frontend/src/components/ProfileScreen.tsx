import React from 'react';
import { USER_PROFILE } from '../data/mockData';
import { Trophy, Award, Shield, QrCode, Zap, ExternalLink, Calendar, CheckCircle } from 'lucide-react';

interface ProfileScreenProps {
  onOpenSyncScreen: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onOpenSyncScreen }) => {
  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 text-white">
      {/* Player Card Header */}
      <div className="relative rounded-2xl bg-[#1b1b1f] border border-[#2a292e] p-5 overflow-hidden shadow-xl mt-1">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#c7f32c]/10 blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img 
              src={USER_PROFILE.avatarUrl} 
              alt="Kira Vance Player Profile" 
              className="w-18 h-18 rounded-2xl object-cover ring-2 ring-[#c7f32c] shadow-[0_0_20px_rgba(199,243,44,0.35)]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#c7f32c] ring-2 ring-[#131317] flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-black fill-current" />
            </span>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#c7f32c]/20 text-[#c7f32c] font-bold border border-[#c7f32c]/30">
                {USER_PROFILE.rank}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                {USER_PROFILE.seasonRank}
              </span>
            </div>

            <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight mt-1 truncate">
              {USER_PROFILE.gamerTag}
            </h2>
            <span className="text-xs text-gray-400 font-sans">
              {USER_PROFILE.realName} • {USER_PROFILE.hostel}
            </span>

            <div className="mt-2 flex items-center gap-3 text-xs font-mono">
              <div>
                <span className="text-gray-500 block text-[9px] uppercase">RATING</span>
                <span className="text-[#c7f32c] font-bold text-sm">{USER_PROFILE.elo} ELO</span>
              </div>
              <div className="w-px h-6 bg-[#2a292e]" />
              <div>
                <span className="text-gray-500 block text-[9px] uppercase">AFFILIATION</span>
                <span className="text-white font-bold">{USER_PROFILE.guild}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 my-3">
        <div className="p-3 bg-[#1b1b1f] border border-[#2a292e] rounded-xl">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Showdowns Entered</span>
          <span className="font-display text-2xl text-white tracking-wide">
            {USER_PROFILE.stats.showdownsJoined}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono block">14 Victories ({Math.round(14/18*100)}% WR)</span>
        </div>

        <div className="p-3 bg-[#1b1b1f] border border-[#2a292e] rounded-xl">
          <span className="text-[10px] font-mono uppercase text-gray-400 block">Bounties Claimed</span>
          <span className="font-display text-2xl text-[#c7f32c] tracking-wide">
            {USER_PROFILE.stats.bountiesClaimed}
          </span>
          <span className="text-[10px] text-gray-400 font-mono block">16 Podium Finishes</span>
        </div>
      </div>

      {/* Verified Tickets Section */}
      <div className="space-y-2 mt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-gray-300 font-bold flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-[#c7f32c]" /> ACTIVE ARENA TICKETS (1)
          </span>
          <span className="text-[10px] font-mono text-[#c7f32c]">VERIFIED RFID PASS</span>
        </div>

        {USER_PROFILE.registeredTickets.map((t, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-[#0e0e12] border-2 border-[#c7f32c]/40 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#c7f32c]/20 text-[#c7f32c] font-mono text-[9px] uppercase font-bold">
                  {t.status}
                </span>
                <h3 className="font-display text-lg text-white uppercase mt-1">
                  {t.eventName}
                </h3>
                <span className="text-xs text-gray-400 font-mono block mt-0.5">
                  {t.date}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <QrCode className="w-8 h-8 text-black" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#2a292e] flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">SEAT: <span className="text-white font-bold">{t.seatCode}</span></span>
              <span className="text-[10px] text-gray-500">GATE PASS: #A-2025</span>
            </div>
          </div>
        ))}
      </div>

      {/* Hardware Node Telemetry Button */}
      <div className="mt-4 pt-3 border-t border-[#2a292e]">
        <button
          onClick={onOpenSyncScreen}
          className="w-full py-2.5 rounded-xl bg-[#1b1b1f] hover:bg-[#2a292e] border border-[#2a292e] text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-[#c7f32c] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-[#c7f32c]" />
          <span>VIEW HARDWARE MESH TELEMETRY</span>
        </button>
      </div>
    </div>
  );
};
