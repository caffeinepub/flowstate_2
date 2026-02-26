import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Priority, TaskStatus, type Task } from '../backend';

// ─── Tasks ────────────────────────────────────────────────────────────────────

export function useGetTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasksByCreatedAt();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      priority,
      dueDate,
    }: {
      title: string;
      description: string;
      priority: Priority;
      dueDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createTask(title, description, priority, dueDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: TaskStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTaskStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      priority,
      dueDate,
    }: {
      id: bigint;
      title: string;
      description: string;
      priority: Priority;
      dueDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateTask(id, title, description, priority, dueDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export function useGetSessionCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['sessionCount'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getSessionCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, duration }: { userId: string; duration: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.startSession(userId, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionCount'] });
    },
  });
}

export function useCompleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, breakType }: { sessionId: bigint; breakType: null }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeSession(sessionId, breakType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionCount'] });
    },
  });
}
