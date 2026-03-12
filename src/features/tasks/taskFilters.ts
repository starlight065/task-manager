import type { Priority, Task } from "../../types/Task";

export type SortOption = "due-date" | "priority" | "created";
export type StatusFilter = "all" | "active" | "completed";
export type PriorityFilter = "all" | Priority;

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function getDateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function matchesSearch(task: Task, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [task.title, task.description, task.tag].some((value) =>
    value.toLowerCase().includes(normalizedQuery),
  );
}

function matchesStatus(task: Task, statusFilter: StatusFilter): boolean {
  if (statusFilter === "active") {
    return !task.completed;
  }

  if (statusFilter === "completed") {
    return task.completed;
  }

  return true;
}

function matchesPriority(task: Task, priorityFilter: PriorityFilter): boolean {
  return priorityFilter === "all" || task.priority === priorityFilter;
}

export function getFilteredTasks(
  tasks: Task[],
  searchQuery: string,
  statusFilter: StatusFilter,
  priorityFilter: PriorityFilter,
  sortBy: SortOption,
): Task[] {
  return sortTasks(
    tasks.filter(
      (task) =>
        matchesSearch(task, searchQuery) &&
        matchesStatus(task, statusFilter) &&
        matchesPriority(task, priorityFilter),
    ),
    sortBy,
  );
}

function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  const sortedTasks = [...tasks];

  sortedTasks.sort((left, right) => {
    if (sortBy === "priority") {
      return (
        PRIORITY_ORDER[left.priority] - PRIORITY_ORDER[right.priority] ||
        getDateValue(left.dueDate) - getDateValue(right.dueDate) ||
        left.id - right.id
      );
    }

    if (sortBy === "created") {
      return (
        getDateValue(right.createdAt) - getDateValue(left.createdAt) ||
        left.id - right.id
      );
    }

    return getDateValue(left.dueDate) - getDateValue(right.dueDate) || left.id - right.id;
  });

  return sortedTasks;
}
