import type { TaskDto } from "../../../shared/types";

export interface TasksResponse {
  tasks: TaskDto[];
}

export interface TaskResponse {
  task: TaskDto;
}
