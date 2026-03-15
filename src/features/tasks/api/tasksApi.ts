import { apiRequest } from "../../../shared/api/apiClient";
import type {
  CreateTaskDto,
  TaskDto,
  UpdateTaskDto,
  UpdateTaskCompletionDto,
} from "../../../shared/types";

interface TasksResponse {
  tasks: TaskDto[];
}

interface TaskResponse {
  task: TaskDto;
}

export async function getTasks(): Promise<TaskDto[]> {
  const data = await apiRequest<TasksResponse>("/api/tasks", {
    fallbackErrorMessage: "Failed to load tasks",
  });

  return data.tasks;
}

export async function createTask(payload: CreateTaskDto): Promise<TaskDto> {
  const data = await apiRequest<TaskResponse>("/api/tasks", {
    method: "POST",
    body: payload,
    fallbackErrorMessage: "Failed to create task",
  });

  return data.task;
}

export async function updateTask(taskId: number, payload: UpdateTaskDto): Promise<TaskDto> {
  const data = await apiRequest<TaskResponse>(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: payload,
    fallbackErrorMessage: "Failed to update task",
  });

  return data.task;
}

export async function updateTaskCompletion(
  taskId: number,
  payload: UpdateTaskCompletionDto,
): Promise<TaskDto> {
  const data = await apiRequest<TaskResponse>(`/api/tasks/${taskId}`, {
    method: "PATCH",
    body: payload,
    fallbackErrorMessage: "Failed to update task",
  });

  return data.task;
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiRequest<void>(`/api/tasks/${taskId}`, {
    method: "DELETE",
    fallbackErrorMessage: "Failed to delete task",
  });
}
