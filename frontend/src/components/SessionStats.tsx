import React from 'react';
import { Flame, Clock } from 'lucide-react';
import { useGetSessionCount } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

export function SessionStats() {
  const { data: sessionCount, isLoading } = useGetSessionCount();

  const count = sessionCount ? Number(sessionCount) : 0;
  const focusMinutes = count * 25;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Today's Stats
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-surface-300 rounded-lg p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-muted-foreground">Sessions</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-8 bg-surface-100" />
          ) : (
            <span className="text-xl font-bold font-display text-amber-400">{count}</span>
          )}
        </div>
        <div className="bg-surface-300 rounded-lg p-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-muted-foreground">Minutes</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-12 bg-surface-100" />
          ) : (
            <span className="text-xl font-bold font-display text-amber-400">{focusMinutes}</span>
          )}
        </div>
      </div>
    </div>
  );
}
