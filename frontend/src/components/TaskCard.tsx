import React, { useState } from 'react';
import { Calendar, Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Task, Priority, TaskStatus } from '../backend';
import { useDeleteTask } from '../hooks/useQueries';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: bigint) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const PRIORITY_CONFIG = {
  [Priority.high]: {
    label: 'High',
    className: 'bg-red-500/15 text-red-400 border-red-500/30',
    dot: 'bg-red-400',
  },
  [Priority.medium]: {
    label: 'Medium',
    className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
  },
  [Priority.low]: {
    label: 'Low',
    className: 'bg-surface-50/50 text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
};

function formatDueDate(dueDate: bigint): string {
  // dueDate is in nanoseconds (ICP time)
  const ms = Number(dueDate) / 1_000_000;
  const date = new Date(ms);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Overdue ${Math.abs(diffDays)}d`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isDueDateOverdue(dueDate: bigint): boolean {
  const ms = Number(dueDate) / 1_000_000;
  return ms < Date.now();
}

export function TaskCard({ task, onDragStart, onDragEnd }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const deleteTask = useDeleteTask();

  const priorityConfig = PRIORITY_CONFIG[task.priority];

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, task.id);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd(e);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteTask.mutateAsync(task.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group bg-card border border-border rounded-lg p-3.5 shadow-card hover:shadow-card-hover hover:border-border/80 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-40 scale-95' : 'opacity-100'
      }`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0 group-hover:text-muted-foreground/70 transition-colors" />
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
            {task.title}
          </p>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-2.5 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${priorityConfig.className}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`} />
                {priorityConfig.label}
              </span>

              {/* Due Date */}
              {task.dueDate !== undefined && task.dueDate !== null && (
                <span
                  className={`inline-flex items-center gap-1 text-xs ${
                    isDueDateOverdue(task.dueDate)
                      ? 'text-red-400'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
