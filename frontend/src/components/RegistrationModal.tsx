import React, { useState } from 'react';
import { X, CheckCircle2, Ticket, QrCode, Shield, Zap } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  prizeText: string;
  timeText: string;
  venueText: string;
  onSuccess: (data: { teamName: string; tag: string; seatCode: string }) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  prizeText,
  timeText,
  venueText,
  onSuccess,
}) => {
  const [teamName, setTeamName] = useState('Delta Squadron');
  const [gamerTag, setGamerTag] = useState('Valkyrie_99');
  const [hostel, setHostel] = useState('Delta East Wing');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [seatCode, setSeatCode] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const randomSeat = `STATION-${Math.floor(10 + Math.random() * 89)}`;
      setSeatCode(randomSeat);
      setSubmitting(false);
      setConfirmed(true);
      onSuccess({ teamName, tag: gamerTag, seatCode: randomSeat });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-all">
      <div 
        className="w-full max-w-md bg-[#131317] border border-[#2a292e] rounded-t-3xl sm:rounded-2xl p-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1 bg-[#353439] rounded-full mx-auto mb-4 sm:hidden" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1f1f24] hover:bg-[#2a292e] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#c7f32c] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest text-[#c7f32c] uppercase font-bold">
                ARENA GATEWAY • INSTANT LOCK
              </span>
            </div>

            <h2 className="font-display text-2xl uppercase tracking-wide text-white leading-tight mb-2">
              {eventTitle}
            </h2>

            <div className="p-3 rounded-xl bg-[#1b1b1f] border border-[#2a292e] mb-5 text-xs text-gray-300 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Bounty:</span>
                <span className="font-bold text-[#c7f32c]">{prizeText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Schedule:</span>
                <span className="text-white truncate max-w-[220px]">{timeText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Arena Venue:</span>
                <span className="text-gray-200 truncate max-w-[220px]">{venueText}</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  Roster Team / Handle
                </label>
                <input 
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0e0e12] border border-[#2a292e] focus:border-[#c7f32c] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#c7f32c] transition-all"
                  placeholder="e.g. Delta Squadron"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Player Tag
                  </label>
                  <input 
                    type="text"
                    required
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0e0e12] border border-[#2a292e] focus:border-[#c7f32c] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#c7f32c] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                    Campus Hostel
                  </label>
                  <select 
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    className="w-full h-11 px-3 bg-[#0e0e12] border border-[#2a292e] focus:border-[#c7f32c] rounded-lg text-xs text-white focus:outline-none transition-all"
                  >
                    <option value="Delta East Wing">Delta East Wing</option>
                    <option value="Omega West">Omega West</option>
                    <option value="Sigma Quad">Sigma Quad</option>
                    <option value="Phoenix Hall">Phoenix Hall</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-full bg-[#c7f32c] hover:bg-[#d2ff3a] text-[#161e00] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(199,243,44,0.35)] transition-transform active:scale-98 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>LOCKING SPOT...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>CONFIRM & MINT ARENA PASS</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#c7f32c]/20 border border-[#c7f32c] flex items-center justify-center mx-auto mb-3 text-[#c7f32c] shadow-[0_0_20px_rgba(199,243,44,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-mono tracking-widest text-[#c7f32c] uppercase font-bold">
              VERIFIED ARENA FIXTURE ENTRY
            </span>
            <h3 className="font-display text-2xl uppercase tracking-wide text-white mt-1">
              YOU ARE LOCKED IN!
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Your match pass has been registered to the mesh server with biometric sync.
            </p>

            {/* Tactical Ticket Pass Visual */}
            <div className="mt-5 p-4 rounded-xl bg-[#0e0e12] border-2 border-[#c7f32c]/50 relative overflow-hidden text-left shadow-lg">
              <div className="flex justify-between items-start border-b border-[#2a292e] pb-3 mb-3">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#c7f32c]">CAMPUSPULSE OFFICIAL PASS</span>
                  <div className="font-bold text-white text-sm">{eventTitle}</div>
                </div>
                <QrCode className="w-9 h-9 text-[#c7f32c] shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-gray-500 block">PLAYER</span>
                  <span className="text-white font-bold">{gamerTag}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">ASSIGNED STATION</span>
                  <span className="text-[#c7f32c] font-bold">{seatCode}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">ROSTER</span>
                  <span className="text-gray-200">{teamName}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">HOSTEL</span>
                  <span className="text-gray-200">{hostel}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#2a292e] flex items-center justify-between text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#c7f32c]" /> SECURE ELO MESH
                </span>
                <span>ENTRY PASS #CP-2025</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 px-4 rounded-full bg-[#1f1f24] hover:bg-[#2a292e] text-white font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              DONE • RETURN TO ARENA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
