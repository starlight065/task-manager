import type { CreateTaskPayload, Task } from "../types";

export async function getTasks(): Promise<Task[]> {
  const response = await fetch("/api/tasks", {
    credentials: "include",
  });

  if (response.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error("Failed to load tasks");
  }

  const data: { tasks: Task[] } = await response.json();
  return data.tasks;
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error("Session expired. Please log in again.");
  }

  const data: { error?: string; task?: Task } = await response.json();

  if (!response.ok || !data.task) {
    throw new Error(data.error ?? "Failed to create task");
  }

  return data.task;
}
