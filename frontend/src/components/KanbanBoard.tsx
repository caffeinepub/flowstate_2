import React, { useState } from 'react';
import { Plus, LayoutGrid, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { type Task, TaskStatus } from '../backend';
import { useGetTasks, useUpdateTaskStatus } from '../hooks/useQueries';

const COLUMNS: { id: TaskStatus; label: string; color: string; accent: string }[] = [
  {
    id: TaskStatus.todo,
    label: 'To Do',
    color: 'border-t-surface-50',
    accent: 'text-muted-foreground',
  },
  {
    id: TaskStatus.inProgress,
    label: 'In Progress',
    color: 'border-t-amber-500',
    accent: 'text-amber-400',
  },
  {
    id: TaskStatus.done,
    label: 'Done',
    color: 'border-t-green-500',
    accent: 'text-green-400',
  },
];

function ColumnSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full bg-surface-300 rounded-lg" />
      ))}
    </div>
  );
}

export function KanbanBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<bigint | null>(null);

  const { data: tasks = [], isLoading } = useGetTasks();
  const updateStatus = useUpdateTaskStatus();

  const getTasksByStatus = (status: TaskStatus): Task[] =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: bigint) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the column entirely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const taskIdStr = e.dataTransfer.getData('taskId');
    if (!taskIdStr) return;

    const taskId = BigInt(taskIdStr);
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    await updateStatus.mutateAsync({ id: taskId, status: targetStatus });
  };

  const totalTasks = tasks.length;
  const doneTasks = getTasksByStatus(TaskStatus.done).length;

  return (
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-xl font-bold text-foreground">Task Board</h2>
          </div>
          {totalTasks > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5 ml-7">
              {doneTasks} of {totalTasks} tasks completed
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-surface-500 font-semibold shadow-glow transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="mb-5 h-1.5 bg-surface-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${(doneTasks / totalTasks) * 100}%` }}
          />
        </div>
      )}

      {/* Columns */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col bg-surface-400 rounded-xl border-t-2 ${column.color} transition-all duration-200 ${
                isOver ? 'ring-2 ring-amber-500/40 bg-amber-500/5' : ''
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold ${column.accent}`}>
                    {column.label}
                  </h3>
                  <span className="text-xs bg-surface-200 text-muted-foreground px-2 py-0.5 rounded-full font-medium">
                    {columnTasks.length}
                  </span>
                </div>
                {updateStatus.isPending && draggingTaskId !== null && (
                  <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                )}
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5 min-h-[200px]">
                {isLoading ? (
                  <ColumnSkeleton />
                ) : columnTasks.length === 0 ? (
                  <div
                    className={`flex items-center justify-center h-full min-h-[120px] rounded-lg border-2 border-dashed transition-colors duration-200 ${
                      isOver
                        ? 'border-amber-500/50 bg-amber-500/5'
                        : 'border-border/30'
                    }`}
                  >
                    <p className="text-xs text-muted-foreground/50">
                      {isOver ? 'Drop here' : 'No tasks'}
                    </p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <TaskCard
                      key={task.id.toString()}
                      task={task}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddTaskModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
