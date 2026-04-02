import { useState } from "react";
import type { TaskDto } from "../../../shared/types";
import type { PriorityFilter, StatusFilter } from "../types/model";

interface UseTaskSelectionParams {
  tasks: TaskDto[];
  searchQuery: string;
  priorityFilter: PriorityFilter;
  statusFilter: StatusFilter;
}

function dedupeTaskIds(taskIds: number[]) {
  return [...new Set(taskIds)];
}

export function useTaskSelection({
  tasks,
  searchQuery,
  priorityFilter,
  statusFilter,
}: UseTaskSelectionParams) {
  const scopeKey = `${searchQuery}\u0000${priorityFilter}\u0000${statusFilter}`;
  const existingTaskIds = new Set(tasks.map((task) => task.id));
  const [selectionState, setSelectionState] = useState(() => ({
    scopeKey,
    taskIds: [] as number[],
  }));
  const scopedTaskIds = selectionState.scopeKey === scopeKey ? selectionState.taskIds : [];
  const selectedTaskIds = scopedTaskIds.filter((taskId) => existingTaskIds.has(taskId));

  const selectedTaskIdSet = new Set(selectedTaskIds);
  const selectedTasks = tasks.filter((task) => selectedTaskIdSet.has(task.id));
  const selectedCount = selectedTaskIds.length;
  const areAllSelectedTasksCompleted =
    selectedCount > 0 && selectedTasks.every((task) => task.completed);
  const completionAction: "complete" | "activate" = areAllSelectedTasksCompleted
    ? "activate"
    : "complete";
  const completionTarget = completionAction === "complete";
  const canUpdateCompletion = selectedTasks.some(
    (task) => task.completed !== completionTarget,
  );

  function clearSelection() {
    setSelectionState({
      scopeKey,
      taskIds: [],
    });
  }

  function replaceSelection(taskIds: number[]) {
    setSelectionState({
      scopeKey,
      taskIds: dedupeTaskIds(taskIds).filter((taskId) => existingTaskIds.has(taskId)),
    });
  }

  function onTaskSelectionChange(taskId: number, selected: boolean) {
    setSelectionState((currentState) => {
      const currentTaskIds = (
        currentState.scopeKey === scopeKey ? currentState.taskIds : []
      ).filter((currentTaskId) => existingTaskIds.has(currentTaskId));

      if (selected) {
        return {
          scopeKey,
          taskIds: currentTaskIds.includes(taskId) ? currentTaskIds : [...currentTaskIds, taskId],
        };
      }

      return {
        scopeKey,
        taskIds: currentTaskIds.filter((currentTaskId) => currentTaskId !== taskId),
      };
    });
  }

  return {
    selectedTaskIds,
    selectedTasks,
    selectedCount,
    completionAction,
    completionTarget,
    canUpdateCompletion,
    clearSelection,
    replaceSelection,
    onTaskSelectionChange,
  };
}
