import React from 'react';
import { Activity } from '../../types';
import { formatTime24to12, isCurrentTimeInBlock } from '../../utils/time';
import { Clock, ArrowRight, Play, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  activities: Activity[];
}

export const TimelineWidget: React.FC<Props> = ({ activities }) => {
  const { setActiveTab, startTimer } = useAppStore();

  const activeIndex = activities.findIndex((a) => isCurrentTimeInBlock(a.startTime, a.endTime));
  const currentActivity = activeIndex >= 0 ? activities[activeIndex] : activities[0];
  const nextActivity = activeIndex >= 0 && activeIndex < activities.length - 1 ? activities[activeIndex + 1] : activities[0];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-zinc-800/80 shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            Today's Timeline Focus
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </h3>
          <p className="text-[11px] text-zinc-400 font-medium">Real-time schedule tracking</p>
        </div>

        <button
          onClick={() => setActiveTab('timetable')}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
        >
          <span>Full Timetable</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Current Active Activity Card */}
      {currentActivity && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/40 border border-emerald-500/40 shadow-glow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                CURRENT ACTIVITY NOW
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-400">
              {formatTime24to12(currentActivity.startTime)} - {formatTime24to12(currentActivity.endTime)}
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">{currentActivity.title}</h4>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">
                Category: <span className="text-zinc-200">{currentActivity.category}</span>
              </p>
            </div>

            {currentActivity.isStudySession && (
              <button
                onClick={() => {
                  startTimer(currentActivity.title, currentActivity.plannedMinutes || 180, currentActivity.id);
                  setActiveTab('timer');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-glow flex items-center space-x-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Focus Now</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Next Upcoming Activity Card */}
      {nextActivity && (
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Up Next</span>
              <p className="text-xs font-semibold text-zinc-200">{nextActivity.title}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {formatTime24to12(nextActivity.startTime)}
          </span>
        </div>
      )}

      {/* Quick Timeline Horizontal List */}
      <div className="space-y-1.5 pt-1">
        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Remaining Schedule</p>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {activities.slice(0, 6).map((act) => {
            const isCurrent = currentActivity?.id === act.id;
            return (
              <div
                key={act.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                  isCurrent
                    ? 'bg-zinc-800/90 text-white font-semibold border border-zinc-700'
                    : 'bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: act.color }} />
                  <span className="truncate max-w-[200px]">{act.title}</span>
                </div>
                <span className="font-mono text-[11px] text-zinc-500">
                  {formatTime24to12(act.startTime)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
