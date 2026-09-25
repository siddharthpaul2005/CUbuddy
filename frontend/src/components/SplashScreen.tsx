import React, { useEffect, useState } from 'react';
import { Wifi, Signal, Battery, ChevronRight, RefreshCw } from 'lucide-react';
import { USER_PROFILE } from '../data/mockData';

interface SplashScreenProps {
  onDismiss: () => void;
  autoDismiss?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss, autoDismiss = false }) => {
  const [progress, setProgress] = useState(78);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSynced(true);
          setTimeout(onDismiss, 500); // Auto-dismiss when finished
          return 100;
        }
        const step = Math.random() > 0.5 ? 4 : 2;
        return Math.min(100, prev + step);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onDismiss]);

  return (
    <div className="relative w-full min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col justify-between select-none">
      {/* Ambient background glow layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] glow-radial" />
        <div className="absolute bottom-0 left-0 right-0 h-96 glow-bottom" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,black_85%)]" />
      </div>

      {/* Top spacing */}
      <div className="h-12 w-full"></div>

      {/* Hero Branding */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-8">
        {/* Pulse Mark Container */}
        <div className="relative mb-6 group cursor-default">
          <div className="absolute -inset-4 bg-[#c7f32c]/20 rounded-3xl blur-xl animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0A0A0E] border-2 border-[#c7f32c]/80 p-4 shadow-[0_0_35px_rgba(198,255,61,0.3)] flex items-center justify-center">
            {/* Exact SVG Pulse Logo */}
            <svg 
              className="w-full h-full drop-shadow-[0_0_10px_#c7f32c]" 
              fill="none" 
              viewBox="0 0 64 64" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect fill="#0A0A0E" height="64" rx="14" stroke="#c7f32c" strokeWidth="2" width="64" />
              <path 
                d="M12 36 L24 36 L30 18 L36 46 L42 28 L48 36 L52 36" 
                stroke="#c7f32c" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="4" 
              />
              <circle cx="30" cy="18" fill="#c7f32c" r="3" />
              <circle cx="36" cy="46" fill="#c7f32c" r="3" />
            </svg>

            {/* Corner cyber marks */}
            <span className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#c7f32c]" />
            <span className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#c7f32c]" />
            <span className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#c7f32c]" />
            <span className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#c7f32c]" />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight text-white uppercase text-center leading-none select-none">
          CAMPUS<span className="text-[#c7f32c] drop-shadow-[0_0_20px_rgba(198,255,61,0.6)]">PULSE</span>
        </h1>

        {/* Esports Tagline Pill */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131317] border border-white/10 shadow-inner">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c7f32c] animate-ping" />
          <p className="font-mono text-[11px] tracking-wider uppercase text-gray-300 font-semibold">
            CAMPUS EVENTS. <span className="text-[#c7f32c] font-bold">RANKED LIVE.</span>
          </p>
        </div>

        {/* Tier Indicator */}
        <div className="mt-4 flex items-center space-x-3 text-[10px] font-mono text-white/40 tracking-widest uppercase">
          <span className="text-[#c7f32c]/90 font-semibold">[SEASON 04]</span>
          <span>•</span>
          <span>LIVE ELO LADDERS</span>
          <span>•</span>
          <span>ALL-ARENA MESH</span>
        </div>

        {/* Enter Arena button */}
        <button
          onClick={onDismiss}
          className="mt-6 px-6 py-2.5 rounded-full bg-[#c7f32c] text-[#161e00] font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(199,243,44,0.4)] hover:bg-[#d2ff3a] active:scale-95 transition-all cursor-pointer"
        >
          <span>ENTER ARENA HUB</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </main>

      {/* Loading Module */}
      <footer className="relative z-10 w-full px-7 pb-8 pt-2 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-col space-y-3">
          {/* Status & Percentage */}
          <div className="flex items-center justify-between font-mono text-xs text-white/80">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-xs bg-[#c7f32c] animate-pulse" />
              <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
                SYNCING ARENA SERVERS
              </span>
            </div>
            <span className="text-[#c7f32c] font-bold tracking-tighter">
              {progress}%
            </span>
          </div>

          {/* Segmented High-Tech Progress Bar */}
          <div className="relative w-full bg-[#131317] p-1 rounded-lg border border-white/10 overflow-hidden shadow-2xl">
            <div className="relative w-full h-2.5 bg-black/80 rounded-sm overflow-hidden flex items-center">
              <div 
                className="h-full bg-[#c7f32c] rounded-xs neon-pulse-bar transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Diagonal stripes */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.25)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.25)_50%,rgba(0,0,0,0.25)_75%,transparent_75%,transparent)] bg-[length:8px_8px] opacity-40" />
              </div>
            </div>
          </div>

          {/* Peer Telemetry */}
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-[#c7f32c]/90 font-bold tracking-wider">//</span>
              <span className="text-gray-400">428 PEERS ONLINE</span>
            </div>
            <span className="text-white/40 tracking-wider">PING: 14MS</span>
          </div>

          {/* Manifest Footer */}
          <div className="pt-3 border-t border-white/5 text-center flex flex-col items-center gap-0.5">
            <p className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">
              v2.4.0-PROD • CAMPUSPULSE NETWORK • SECURE ELO MESH
            </p>
            <p className="text-[9px] tracking-wider text-white/20 font-mono">
              AUTHENTICATED HIGH-THROUGHPUT CAMPUS NODE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
