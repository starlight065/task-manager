import { apiRequest } from "../../../shared/api/apiClient";
import type { CreateTaskDto, TaskDto } from "../../../shared/types";

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
