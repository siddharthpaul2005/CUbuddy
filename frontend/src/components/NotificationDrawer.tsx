import React from 'react';
import { X, Bell, CheckCheck, Zap } from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent?: (title: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md pt-16">
      <div 
        className="w-full max-w-sm bg-[#131317] border border-[#2a292e] rounded-2xl p-4 text-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#2a292e]">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#c7f32c]" />
            <span className="font-display uppercase text-sm tracking-wide">
              CAMPUS ARENA NOTIFICATIONS
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1f1f24] hover:bg-[#2a292e] flex items-center justify-center text-gray-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3 space-y-2.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {NOTIFICATIONS.map((item) => (
            <div 
              key={item.id} 
              className={`p-3 rounded-xl border transition-all ${
                item.unread 
                  ? 'bg-[#1b1b1f] border-[#c7f32c]/30 shadow-[0_0_12px_rgba(199,243,44,0.1)]' 
                  : 'bg-[#131317] border-[#2a292e]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#c7f32c]" />}
                  <span className="font-bold text-xs text-white">{item.title}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-[#2a292e] flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span className="flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5 text-[#c7f32c]" /> All 4 alerts synchronized
          </span>
          <button 
            onClick={onClose}
            className="text-[#c7f32c] hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};
