export type Priority = "high" | "medium" | "low";

export interface SubtaskDto {
  id: number;
  title: string;
  completed: boolean;
}

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  tag: string;
  completed: boolean;
  subtasks: SubtaskDto[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  tag: string;
  subtasks?: string[];
}

export type UpdateTaskDto = Omit<CreateTaskDto, "subtasks"> & {
  subtasks?: { id?: number; title: string }[];
};

export interface UpdateTaskCompletionDto {
  completed: boolean;
}

export interface UpdateSubtaskCompletionDto {
  completed: boolean;
}
