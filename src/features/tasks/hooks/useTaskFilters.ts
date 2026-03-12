import { useState } from "react";
import type { TaskDto } from "../../../shared/types";
import {
  getFilteredTasks,
  type PriorityFilter,
  type SortOption,
  type StatusFilter,
} from "../taskFilters";
import { getTaskSummary } from "../utils/getTaskSummary";

export function useTaskFilters(tasks: TaskDto[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("due-date");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredTasks = getFilteredTasks(
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
  );

  return {
    summary: getTaskSummary(tasks),
    searchQuery,
    sortBy,
    priorityFilter,
    statusFilter,
    activeTasks: filteredTasks.filter((task) => !task.completed),
    completedTasks: filteredTasks.filter((task) => task.completed),
    visibleCount: filteredTasks.length,
    setSearchQuery,
    setSortBy,
    setPriorityFilter,
    setStatusFilter,
  };
}
