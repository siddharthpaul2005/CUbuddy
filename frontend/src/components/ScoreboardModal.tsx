import React, { useState } from 'react';
import { X, Play, Trophy, Users, Award, ExternalLink, Activity } from 'lucide-react';
import { PastEventCardData } from '../data/mockData';

interface ScoreboardModalProps {
  event: PastEventCardData | null;
  onClose: () => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState<'scoreboard' | 'vod' | 'roster'>('scoreboard');

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="w-full max-w-md bg-[#131317] border border-[#2a292e] rounded-t-3xl sm:rounded-2xl p-5 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-[#353439] rounded-full mx-auto mb-3 sm:hidden" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono tracking-widest text-[#c7f32c] uppercase font-bold">
              VERIFIED HISTORIAN ARCHIVE
            </span>
            <span className="text-[10px] text-gray-500">• {event.matchId}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1f1f24] hover:bg-[#2a292e] flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight">
          {event.title}
        </h2>
        <div className="text-xs text-gray-400 mt-1 mb-4 flex items-center gap-2">
          <span>{event.time}</span>
          <span>•</span>
          <span>{event.venue}</span>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#0e0e12] p-1 rounded-xl border border-[#2a292e] mb-4">
          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`flex-1 py-1.5 text-xs font-mono uppercase font-bold rounded-lg transition-colors ${
              activeTab === 'scoreboard' ? 'bg-[#c7f32c] text-[#161e00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Match Scoreboard
          </button>
          <button
            onClick={() => setActiveTab('vod')}
            className={`flex-1 py-1.5 text-xs font-mono uppercase font-bold rounded-lg transition-colors ${
              activeTab === 'vod' ? 'bg-[#c7f32c] text-[#161e00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Broadcast VOD
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`flex-1 py-1.5 text-xs font-mono uppercase font-bold rounded-lg transition-colors ${
              activeTab === 'roster' ? 'bg-[#c7f32c] text-[#161e00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            Award Ledger
          </button>
        </div>

        {activeTab === 'scoreboard' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#1b1b1f] border border-[#2a292e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-[#c7f32c] uppercase font-bold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> OFFICIAL PODIUM
                </span>
                <span className="text-[11px] font-mono text-gray-400">ROUND 1 TO FINALS</span>
              </div>

              {event.headToHead ? (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#2a292e]/60">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#c7f32c] text-black font-display flex items-center justify-center text-xs">
                        {event.headToHead.symbolA}
                      </span>
                      <span className="font-bold text-sm text-white">{event.headToHead.teamA}</span>
                    </div>
                    <span className="text-xs font-bold text-[#c7f32c] font-mono">{event.headToHead.teamAScore}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#1f1f24]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#353439] text-gray-300 font-display flex items-center justify-center text-xs">
                        {event.headToHead.symbolB}
                      </span>
                      <span className="text-sm text-gray-300">{event.headToHead.teamB}</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{event.headToHead.teamBScore}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded-lg bg-[#2a292e]/60 text-white">
                    <span className="text-yellow-400 font-bold">🥇 1st Place</span>
                    <span className="font-bold">{event.leaderboardSnippet?.first || 'Team Zero-Day (2450 pts)'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#1f1f24] text-gray-300">
                    <span className="text-gray-400">🥈 Runner Up</span>
                    <span>{event.leaderboardSnippet?.runnerUp || 'SudoKu (2120 pts)'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-[#1f1f24] text-gray-300">
                    <span className="text-[#c7f32c]">⚡ Special Award</span>
                    <span className="text-[#c7f32c] font-bold">{event.leaderboardSnippet?.specialAward || 'KernelPnk'}</span>
                  </div>
                </div>
              )}
            </div>

            {event.tags && (
              <div className="p-3 rounded-xl bg-[#0e0e12] border border-[#2a292e]">
                <span className="text-[10px] font-mono uppercase text-gray-400 block mb-2">JURY EVALUATION SCORES</span>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-[#1f1f24] text-xs font-mono text-[#c7f32c]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vod' && (
          <div className="space-y-3">
            <div className="relative aspect-video rounded-xl bg-[#0e0e12] border border-[#2a292e] overflow-hidden flex items-center justify-center group">
              <img 
                src={event.image} 
                alt="Match stream replay thumbnail" 
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-black/40" />
              <button 
                onClick={() => alert('Starting CampusPulse HD Replay Stream (1080p60)...')}
                className="relative z-10 w-12 h-12 rounded-full bg-[#c7f32c] text-black flex items-center justify-center shadow-[0_0_20px_rgba(199,243,44,0.6)] group-hover:scale-110 transition-transform cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </button>
              <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-white">
                VOD DURATION: 03:42:15 • 1080p60
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Recorded live by CampusPulse Media Network. Complete caster commentary & player team-comms audio channels.
            </p>
          </div>
        )}

        {activeTab === 'roster' && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#0e0e12] border border-[#2a292e] text-xs font-mono space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Prize Purse Status:</span>
                <span className="text-[#c7f32c] font-bold">100% DISBURSED</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Historian Node:</span>
                <span className="text-white">Block #9042-SECURE</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Campus ELO Impact:</span>
                <span className="text-emerald-400 font-bold">+380 ELO to Winner Guild</span>
              </div>
            </div>
            <a 
              href="https://figma.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-[#1f1f24] hover:bg-[#2a292e] text-white text-xs font-mono uppercase flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>ACCESS ASSET VAULT</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c7f32c]" />
            </a>
          </div>
        )}

        <button 
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-full bg-[#1f1f24] hover:bg-[#2a292e] text-white text-xs font-mono uppercase font-bold tracking-wider"
        >
          CLOSE ARCHIVE INSPECTOR
        </button>
      </div>
    </div>
  );
};
