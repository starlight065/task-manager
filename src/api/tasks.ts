import type { Task } from "../types";

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
