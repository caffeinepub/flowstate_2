import { useState, useEffect, useRef, useCallback } from 'react';
import { useStartSession, useCompleteSession } from './useQueries';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export interface PomodoroState {
  mode: PomodoroMode;
  timeRemaining: number;
  isRunning: boolean;
  sessionId: bigint | null;
  completedSessions: number;
  showCompletionPrompt: boolean;
}

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeRemaining, setTimeRemaining] = useState(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startSession = useStartSession();
  const completeSession = useCompleteSession();

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(async () => {
    clearTimer();
    setIsRunning(false);
    setTimeRemaining(0);

    if (mode === 'focus' && sessionId !== null) {
      try {
        await completeSession.mutateAsync({ sessionId, breakType: null });
        setCompletedSessions((prev) => prev + 1);
      } catch {
        // silent
      }
      setShowCompletionPrompt(true);
    } else {
      setShowCompletionPrompt(true);
    }
  }, [clearTimer, mode, sessionId, completeSession]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [isRunning, clearTimer, handleComplete]);

  const start = useCallback(async () => {
    if (mode === 'focus') {
      try {
        const durationMinutes = BigInt(Math.floor(MODE_DURATIONS.focus / 60));
        const id = await startSession.mutateAsync({
          userId: 'anonymous',
          duration: durationMinutes,
        });
        setSessionId(id);
      } catch {
        // silent - still start timer
      }
    }
    setIsRunning(true);
  }, [mode, startSession]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setTimeRemaining(MODE_DURATIONS[mode]);
    setSessionId(null);
    setShowCompletionPrompt(false);
  }, [clearTimer, mode]);

  const switchMode = useCallback(
    (newMode: PomodoroMode) => {
      clearTimer();
      setIsRunning(false);
      setMode(newMode);
      setTimeRemaining(MODE_DURATIONS[newMode]);
      setSessionId(null);
      setShowCompletionPrompt(false);
    },
    [clearTimer]
  );

  const dismissPrompt = useCallback(() => {
    setShowCompletionPrompt(false);
  }, []);

  const totalSeconds = MODE_DURATIONS[mode];
  const progress = (totalSeconds - timeRemaining) / totalSeconds;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return {
    mode,
    timeRemaining,
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
  };
}
