import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: bigint;
    status: TaskStatus;
    title: string;
    createdAt: bigint;
    dueDate?: bigint;
    description: string;
    priority: Priority;
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum TaskStatus {
    done = "done",
    todo = "todo",
    inProgress = "inProgress"
}
export enum Variant_long_short {
    long_ = "long",
    short_ = "short"
}
export interface backendInterface {
    completeSession(sessionId: bigint, breakType: Variant_long_short | null): Promise<void>;
    createTask(title: string, description: string, priority: Priority, dueDate: bigint | null): Promise<bigint>;
    deleteTask(id: bigint): Promise<void>;
    getSessionCount(): Promise<bigint>;
    getTaskById(id: bigint): Promise<Task>;
    getTasksByCreatedAt(): Promise<Array<Task>>;
    getTasksByPriority(): Promise<Array<Task>>;
    startSession(userId: string, duration: bigint): Promise<bigint>;
    updateTask(id: bigint, title: string, description: string, priority: Priority, dueDate: bigint | null): Promise<void>;
    updateTaskStatus(id: bigint, status: TaskStatus): Promise<void>;
}
