import React from 'react';
import { ActivityItem } from '../types';
import { CheckCircle2, DollarSign, Clock, MapPin } from 'lucide-react';

interface ActivityStreamProps {
  activities: ActivityItem[];
}

export const ActivityStream: React.FC<ActivityStreamProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border-y border-slate-800 py-2.5 px-4 text-xs text-slate-300 overflow-x-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center gap-4 min-w-[700px]">
        
        {/* Stream Header Tag */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-400">
            Live Dispatch Stream
          </span>
        </div>

        {/* Horizontal Ticker / List */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1">
          {activities.slice(0, 5).map((act) => {
            const timeFormatted = new Date(act.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={act.id}
                className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 shrink-0 hover:border-slate-600 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-medium text-white">{act.driverName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 flex items-center gap-1 max-w-[200px] truncate">
                  <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                  {act.route}
                </span>
                <span className="text-slate-500">•</span>
                <span className="font-semibold text-emerald-300 flex items-center">
                  <DollarSign className="w-3 h-3" />
                  {act.payout.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5 ml-1">
                  <Clock className="w-2.5 h-2.5" />
                  {timeFormatted}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
