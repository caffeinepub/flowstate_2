import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePomodoro, type PomodoroMode } from '../hooks/usePomodoro';

const MODE_LABELS: Record<PomodoroMode, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const CIRCLE_RADIUS = 54;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

interface PomodoroTimerProps {
  onSessionComplete?: () => void;
}

export function PomodoroTimer({ onSessionComplete }: PomodoroTimerProps) {
  const {
    mode,
    timeDisplay,
    isRunning,
    progress,
    completedSessions,
    showCompletionPrompt,
    start,
    pause,
    reset,
    switchMode,
    dismissPrompt,
  } = usePomodoro();

  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress);

  const handleComplete = () => {
    dismissPrompt();
    onSessionComplete?.();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mode Tabs */}
      <div className="flex gap-1 bg-surface-400 rounded-lg p-1 w-full">
        {(['focus', 'shortBreak', 'longBreak'] as PomodoroMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`flex-1 text-xs font-medium py-1.5 px-2 rounded-md transition-all duration-200 ${
              mode === m
                ? 'bg-amber-500 text-surface-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke="oklch(0.28 0.015 260)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={CIRCLE_RADIUS}
            fill="none"
            stroke={mode === 'focus' ? 'oklch(0.75 0.18 55)' : 'oklch(0.65 0.16 200)'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCLE_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-display text-3xl font-bold text-foreground tracking-tight">
            {timeDisplay}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5 font-medium">
            {MODE_LABELS[mode]}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={reset}
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-surface-100"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          onClick={isRunning ? pause : start}
          className="h-10 px-6 bg-amber-500 hover:bg-amber-600 text-surface-500 font-semibold rounded-full shadow-glow transition-all duration-200"
        >
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-1.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1.5" />
              {progress > 0 ? 'Resume' : 'Start'}
            </>
          )}
        </Button>
      </div>

      {/* Completion Prompt */}
      {showCompletionPrompt && (
        <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center animate-slide-in">
          <p className="text-sm font-medium text-amber-400">
            {mode === 'focus' ? '🎉 Session complete!' : '⏰ Break over!'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {mode === 'focus' ? 'Great work! Take a break.' : 'Ready to focus again?'}
          </p>
          <button
            onClick={handleComplete}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Session dots */}
      {completedSessions > 0 && (
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: Math.min(completedSessions, 8) }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-500"
            />
          ))}
          {completedSessions > 8 && (
            <span className="text-xs text-muted-foreground">+{completedSessions - 8}</span>
          )}
        </div>
      )}
    </div>
  );
}
