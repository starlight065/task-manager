export type Priority = "high" | "medium" | "low";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  tag: string;
  completed: boolean;
}
