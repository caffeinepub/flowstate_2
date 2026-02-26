import React from 'react';
import { PomodoroTimer } from './PomodoroTimer';
import { SessionStats } from './SessionStats';
import { useQueryClient } from '@tanstack/react-query';

export function Sidebar() {
  const queryClient = useQueryClient();

  const handleSessionComplete = () => {
    queryClient.invalidateQueries({ queryKey: ['sessionCount'] });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border flex flex-col z-10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img
          src="/assets/generated/flowstate-logo.dim_128x128.png"
          alt="FlowState"
          className="w-9 h-9 rounded-lg object-cover"
        />
        <div>
          <h1 className="font-display font-bold text-lg text-foreground leading-none">
            FlowState
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Focus & Task Manager</p>
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-6">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Pomodoro Timer
          </p>
          <PomodoroTimer onSessionComplete={handleSessionComplete} />
        </div>

        <div className="border-t border-sidebar-border pt-5">
          <SessionStats />
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          Built with{' '}
          <span className="text-amber-500">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'flowstate-app')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
