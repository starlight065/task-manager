import type { CreateTaskDto, Priority } from "../../../shared/types";
import type { useTasksPageModel } from "../model/useTasksPageModel";

export type SortOption = "due-date" | "priority" | "created";
export type StatusFilter = "all" | "active" | "completed";
export type PriorityFilter = "all" | Priority;

export type TaskFormErrors = Partial<Record<keyof CreateTaskDto, string>>;

export type TasksPageModel = ReturnType<typeof useTasksPageModel>;
