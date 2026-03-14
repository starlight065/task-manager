export type Priority = "high" | "medium" | "low";

export interface TaskDto {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  createdAt: string;
  tag: string;
  completed: boolean;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  tag: string;
}

export type UpdateTaskDto = CreateTaskDto;

export interface UpdateTaskCompletionDto {
  completed: boolean;
}
