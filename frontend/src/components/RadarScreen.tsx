import React, { useState } from 'react';
import { Radar, Swords, Shield, Zap, Flame, MapPin, Users, Award, Radio } from 'lucide-react';
import { HOSTEL_LADDER, LIVE_SCRIMS } from '../data/mockData';

export const RadarScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCRIMS' | 'HOSTEL_LADDER'>('SCRIMS');
  const [scrimList, setScrimList] = useState(LIVE_SCRIMS);
  const [challengeSent, setChallengeSent] = useState<string | null>(null);

  const handleChallenge = (id: string) => {
    setChallengeSent(id);
    setTimeout(() => {
      setChallengeSent(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full px-4 pt-2 pb-24 text-white">
      {/* Header */}
      <div className="pt-2 pb-2 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c7f32c] animate-ping" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#c7f32c] font-bold">
              Tactical Radar Online
            </span>
          </div>
          <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-[#c7f32c]" /> 14MS ULTRA-LOW LATENCY
          </span>
        </div>

        <h1 className="font-display text-4xl uppercase text-white tracking-wider mt-0.5">
          CAMPUS RADAR
        </h1>
        <p className="text-xs text-gray-400 -mt-1 font-sans">
          Live inter-hostel scrim lobbies &amp; dynamic ELO territory ladders
        </p>

        <div className="w-full h-0.5 bg-gradient-to-r from-[#c7f32c] via-[#c7f32c]/40 to-transparent mt-2 rounded-full shadow-[0_0_10px_rgba(199,243,44,0.4)]" />
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0e0e12] p-1 rounded-xl border border-[#2a292e] my-3">
        <button
          onClick={() => setActiveTab('SCRIMS')}
          className={`flex-1 py-2 text-xs font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'SCRIMS'
              ? 'bg-[#c7f32c] text-[#161e00] shadow-[0_0_12px_rgba(199,243,44,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Open Scrims ({scrimList.length})
        </button>
        <button
          onClick={() => setActiveTab('HOSTEL_LADDER')}
          className={`flex-1 py-2 text-xs font-mono uppercase font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'HOSTEL_LADDER'
              ? 'bg-[#c7f32c] text-[#161e00] shadow-[0_0_12px_rgba(199,243,44,0.3)]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Hostel Derby Ladder
        </button>
      </div>

      {activeTab === 'SCRIMS' ? (
        <div className="space-y-3">
          <div className="p-3 bg-[#1b1b1f] rounded-xl border border-[#2a292e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c7f32c] animate-pulse" />
              <span className="text-xs font-mono uppercase text-gray-300">
                LOBBY BROADCASTER: HOSTEL DERBY READY
              </span>
            </div>
            <button 
              onClick={() => alert('New Scrim Lobby opened on Campus Mesh: Delta Prime vs Challenger')}
              className="px-2.5 py-1 rounded-full bg-[#c7f32c] text-[#161e00] text-[10px] font-mono font-bold uppercase cursor-pointer"
            >
              + Create Lobby
            </button>
          </div>

          {scrimList.map((scrim) => (
            <div
              key={scrim.id}
              className="p-3.5 rounded-xl bg-[#1b1b1f] border border-[#2a292e] hover:border-[#353439] flex items-center justify-between transition-all"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c7f32c] font-bold uppercase">
                    {scrim.game}
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#0e0e12] rounded text-[10px] font-mono text-gray-400">
                    {scrim.ping}
                  </span>
                </div>
                <div className="text-sm font-bold text-white truncate">
                  Host: {scrim.host} <span className="text-gray-500 font-normal">({scrim.map})</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  {scrim.spots}
                </span>
              </div>

              <button
                onClick={() => handleChallenge(scrim.id)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  challengeSent === scrim.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#2a292e] hover:bg-[#c7f32c] hover:text-[#161e00] text-gray-200'
                }`}
              >
                {challengeSent === scrim.id ? 'CHALLENGE SENT' : 'DROP IN'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-[#0e0e12] rounded-xl border border-[#2a292e] text-xs font-mono text-gray-400">
            Current season points update in real-time following verified referee check-outs.
          </div>

          {HOSTEL_LADDER.map((hostel) => (
            <div
              key={hostel.rank}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                hostel.rank === 1
                  ? 'bg-[#1b1b1f] border-[#c7f32c]/50 shadow-[0_0_16px_rgba(199,243,44,0.15)]'
                  : 'bg-[#1b1b1f] border-[#2a292e]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-display text-base font-bold"
                  style={{ backgroundColor: `${hostel.color}25`, color: hostel.color }}
                >
                  #{hostel.rank}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-white">{hostel.name}</span>
                  <span className="text-[11px] font-mono text-gray-400">
                    Win Rate: <span className="text-white">{hostel.winRate}</span> • {hostel.badge}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span 
                  className="font-display text-base font-bold block"
                  style={{ color: hostel.color }}
                >
                  {hostel.points}
                </span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">SEASON ELO</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
