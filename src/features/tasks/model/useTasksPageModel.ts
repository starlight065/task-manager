import { useEffect, useState, type SubmitEvent } from "react";
import type { CreateTaskDto, Priority, SubtaskDto, TaskDto } from "../../../shared/types";
import { t } from "../../../shared/i18n";
import {
  createShareLink,
  createTask,
  deleteTask,
  getTasks,
  revokeShareLink,
  toggleSubtaskCompletion as apiToggleSubtaskCompletion,
  updateTask,
  updateTaskCompletion,
} from "../api/tasksApi";
import { getTaskSummary } from "../lib/getTaskSummary";
import { EMPTY_TASK_FORM, normalizeTaskFormValues, validateTaskForm } from "./taskForm";
import { getFilteredTasks } from "./taskFilters";
import type {
  PriorityFilter,
  SortOption,
  StatusFilter,
  TaskFormErrors,
} from "../types/model";

type BulkAction = "complete" | "delete" | "priority" | null;

type DeleteTarget =
  | {
      mode: "single";
      task: TaskDto;
    }
  | {
      mode: "bulk";
      taskCount: number;
      taskIds: number[];
      taskTitle: string;
    };

function dedupeTaskIds(taskIds: number[]) {
  return [...new Set(taskIds)];
}

function getRejectedResultsTaskIds(
  taskIds: number[],
  results: PromiseSettledResult<unknown>[],
): number[] {
  return taskIds.filter((_, index) => results[index]?.status === "rejected");
}

export function useTasksPageModel() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [shareFeedbackMessage, setShareFeedbackMessage] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<number[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<BulkAction>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("due-date");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<CreateTaskDto>(EMPTY_TASK_FORM);
  const [fieldErrors, setFieldErrors] = useState<TaskFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const nextTasks = await getTasks();

        if (!isMounted) {
          return;
        }

        setTasks(nextTasks);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : t("tasks.errors.loadTasks"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedTaskIds([]);
  }, [priorityFilter, searchQuery, statusFilter]);

  useEffect(() => {
    const existingTaskIds = new Set(tasks.map((task) => task.id));

    setSelectedTaskIds((currentTaskIds) => {
      const nextTaskIds = currentTaskIds.filter((taskId) => existingTaskIds.has(taskId));

      return nextTaskIds.length === currentTaskIds.length ? currentTaskIds : nextTaskIds;
    });
  }, [tasks]);

  const filteredTasks = getFilteredTasks(tasks, searchQuery, statusFilter, priorityFilter, sortBy);
  const selectedTasks = tasks.filter((task) => selectedTaskIds.includes(task.id));
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
  const taskModalMode: "create" | "edit" = editingTaskId === null ? "create" : "edit";

  async function reloadTasks() {
    const nextTasks = await getTasks();

    setTasks(nextTasks);
    setError(null);

    return nextTasks;
  }

  function addPendingTaskIds(taskIds: number[]) {
    const nextTaskIds = dedupeTaskIds(taskIds);

    if (nextTaskIds.length === 0) {
      return;
    }

    setPendingTaskIds((currentTaskIds) => dedupeTaskIds([...currentTaskIds, ...nextTaskIds]));
  }

  function removePendingTaskIds(taskIds: number[]) {
    if (taskIds.length === 0) {
      return;
    }

    const taskIdsToRemove = new Set(taskIds);

    setPendingTaskIds((currentTaskIds) =>
      currentTaskIds.filter((taskId) => !taskIdsToRemove.has(taskId)),
    );
  }

  function clearTaskSelection() {
    setSelectedTaskIds([]);
  }

  function onTaskSelectionChange(taskId: number, selected: boolean) {
    setSelectedTaskIds((currentTaskIds) => {
      if (selected) {
        return currentTaskIds.includes(taskId) ? currentTaskIds : [...currentTaskIds, taskId];
      }

      return currentTaskIds.filter((currentTaskId) => currentTaskId !== taskId);
    });
  }

  function openCreateTaskModal() {
    setEditingTaskId(null);
    setFormValues(EMPTY_TASK_FORM);
    setFieldErrors({});
    setFormError(null);
    setIsTaskModalOpen(true);
  }

  function openEditTaskModal(task: TaskDto) {
    setEditingTaskId(task.id);
    setFormValues({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      tag: task.tag,
      subtasks: task.subtasks.map((subtask) => subtask.title),
    });
    setFieldErrors({});
    setFormError(null);
    setIsTaskModalOpen(true);
  }

  function closeTaskModal() {
    setIsTaskModalOpen(false);
    setEditingTaskId(null);
    setFormValues(EMPTY_TASK_FORM);
    setFieldErrors({});
    setFormError(null);
  }

  function openDeleteTaskModal(task: TaskDto) {
    setDeleteTarget({
      mode: "single",
      task,
    });
    setDeleteError(null);
  }

  function openBulkDeleteModal() {
    if (selectedTaskIds.length === 0) {
      return;
    }

    setDeleteTarget({
      mode: "bulk",
      taskCount: selectedTaskIds.length,
      taskIds: selectedTaskIds,
      taskTitle: selectedTasks[0]?.title ?? "",
    });
    setDeleteError(null);
  }

  function closeDeleteTaskModal() {
    if (bulkAction === "delete") {
      return;
    }

    setDeleteTarget(null);
    setDeleteError(null);
  }

  function onTaskFieldChange(field: keyof CreateTaskDto, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [field]: undefined,
      };
    });

    setFormError(null);
  }

  function onSubtaskAdd(title: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      subtasks: [...(currentValues.subtasks ?? []), title],
    }));
  }

  function onSubtaskRemove(index: number) {
    setFormValues((currentValues) => ({
      ...currentValues,
      subtasks: (currentValues.subtasks ?? []).filter((_, currentIndex) => currentIndex !== index),
    }));
  }

  async function onTaskSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValues = normalizeTaskFormValues(formValues);
    const nextErrors = validateTaskForm(trimmedValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      if (editingTaskId === null) {
        const createdTask = await createTask(trimmedValues);

        setTasks((currentTasks) => [...currentTasks, createdTask]);
      } else {
        const existingTask = tasks.find((task) => task.id === editingTaskId);
        const existingSubtasks: SubtaskDto[] = existingTask?.subtasks ?? [];
        const formSubtaskTitles = trimmedValues.subtasks ?? [];

        const updateSubtasks = formSubtaskTitles.map((title, index) => {
          const existingSubtask = existingSubtasks[index];

          return existingSubtask ? { id: existingSubtask.id, title } : { title };
        });

        const updatedTask = await updateTask(editingTaskId, {
          title: trimmedValues.title,
          description: trimmedValues.description,
          priority: trimmedValues.priority,
          dueDate: trimmedValues.dueDate,
          tag: trimmedValues.tag,
          subtasks: updateSubtasks,
        });

        setTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        );
      }

      closeTaskModal();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t("tasks.errors.saveTask"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleTaskCompletion(taskId: number, completed: boolean) {
    const previousTask = tasks.find((task) => task.id === taskId);

    if (!previousTask) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, completed } : task)),
    );
    addPendingTaskIds([taskId]);

    try {
      const updatedTask = await updateTaskCompletion(taskId, { completed });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
      setCompletionError(null);
    } catch (err) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === previousTask.id ? previousTask : task)),
      );
      setCompletionError(err instanceof Error ? err.message : t("tasks.errors.updateTask"));
    } finally {
      removePendingTaskIds([taskId]);
    }
  }

  async function toggleSubtaskCompletion(taskId: number, subtaskId: number, completed: boolean) {
    const previousTask = tasks.find((task) => task.id === taskId);

    if (!previousTask) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          subtasks: task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed } : subtask,
          ),
        };
      }),
    );
    addPendingTaskIds([taskId]);

    try {
      const updatedTask = await apiToggleSubtaskCompletion(taskId, subtaskId, { completed });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
      setCompletionError(null);
    } catch (err) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === previousTask.id ? previousTask : task)),
      );
      setCompletionError(err instanceof Error ? err.message : t("tasks.errors.updateSubtask"));
    } finally {
      removePendingTaskIds([taskId]);
    }
  }

  async function runBulkTaskAction(
    taskIds: number[],
    action: Exclude<BulkAction, null>,
    runTaskAction: (taskId: number) => Promise<unknown>,
    partialFailureMessage: (failedCount: number) => string,
  ) {
    const nextTaskIds = dedupeTaskIds(taskIds);

    if (nextTaskIds.length === 0) {
      return true;
    }

    addPendingTaskIds(nextTaskIds);
    setBulkAction(action);
    setDeleteError(null);

    try {
      const results = await Promise.allSettled(
        nextTaskIds.map((taskId) => runTaskAction(taskId)),
      );
      const failedTaskIds = getRejectedResultsTaskIds(nextTaskIds, results);

      await reloadTasks();

      if (failedTaskIds.length > 0) {
        setSelectedTaskIds(failedTaskIds);
        setCompletionError(partialFailureMessage(failedTaskIds.length));
        return false;
      }

      clearTaskSelection();
      setCompletionError(null);
      return true;
    } catch (err) {
      setCompletionError(err instanceof Error ? err.message : t("tasks.errors.loadTasks"));
      return false;
    } finally {
      removePendingTaskIds(nextTaskIds);
      setBulkAction(null);
    }
  }

  async function updateSelectedTasksCompletion() {
    const taskIdsToUpdate = selectedTasks
      .filter((task) => task.completed !== completionTarget)
      .map((task) => task.id);

    return runBulkTaskAction(
      taskIdsToUpdate,
      "complete",
      (taskId) => updateTaskCompletion(taskId, { completed: completionTarget }),
      (failedCount) =>
        completionTarget
          ? t("tasks.bulk.completePartialFailure", { count: failedCount })
          : t("tasks.bulk.activatePartialFailure", { count: failedCount }),
    );
  }

  async function updateSelectedTasksPriority(priority: Priority) {
    const tasksById = new Map(tasks.map((task) => [task.id, task]));
    const taskIdsToUpdate = selectedTasks
      .filter((task) => task.priority !== priority)
      .map((task) => task.id);

    return runBulkTaskAction(
      taskIdsToUpdate,
      "priority",
      async (taskId) => {
        const task = tasksById.get(taskId);

        if (!task) {
          throw new Error(t("tasks.errors.updateTask"));
        }

        return updateTask(taskId, {
          title: task.title,
          description: task.description,
          priority,
          dueDate: task.dueDate,
          tag: task.tag,
          subtasks: task.subtasks.map((subtask) => ({
            id: subtask.id,
            title: subtask.title,
          })),
        });
      },
      (failedCount) => t("tasks.bulk.priorityPartialFailure", { count: failedCount }),
    );
  }

  async function copyShareLink(shareToken: string) {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return;
    }

    throw new Error(t("tasks.share.clipboardUnsupported"));
  }

  async function shareTask(task: TaskDto) {
    addPendingTaskIds([task.id]);

    try {
      const nextTask = task.shareToken ? task : await createShareLink(task.id);

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === nextTask.id ? nextTask : currentTask)),
      );

      if (!nextTask.shareToken) {
        throw new Error(t("tasks.share.generateFailed"));
      }

      await copyShareLink(nextTask.shareToken);
      setShareFeedbackMessage(t("tasks.share.linkCopied"));
      setCompletionError(null);
    } catch (err) {
      setShareFeedbackMessage(null);
      setCompletionError(err instanceof Error ? err.message : t("tasks.errors.copyShareLink"));
    } finally {
      removePendingTaskIds([task.id]);
    }
  }

  async function revokeTaskShare(task: TaskDto) {
    if (!task.shareToken) {
      return;
    }

    addPendingTaskIds([task.id]);

    try {
      const nextTask = await revokeShareLink(task.id);

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === nextTask.id ? nextTask : currentTask)),
      );
      setCompletionError(null);
    } catch (err) {
      setCompletionError(err instanceof Error ? err.message : t("tasks.errors.revokeShareLink"));
    } finally {
      removePendingTaskIds([task.id]);
    }
  }

  async function confirmTaskDelete() {
    if (!deleteTarget) {
      return;
    }

    if (deleteTarget.mode === "bulk") {
      const taskIds = deleteTarget.taskIds;

      await runBulkTaskAction(
        taskIds,
        "delete",
        (taskId) => deleteTask(taskId),
        (failedCount) => t("tasks.bulk.deletePartialFailure", { count: failedCount }),
      );

      setDeleteTarget(null);
      setDeleteError(null);

      return;
    }

    const taskId = deleteTarget.task.id;

    addPendingTaskIds([taskId]);
    setDeleteError(null);

    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t("tasks.errors.deleteTask"));
    } finally {
      removePendingTaskIds([taskId]);
    }
  }

  const isDeletingTask =
    deleteTarget?.mode === "bulk"
      ? bulkAction === "delete"
      : deleteTarget !== null && pendingTaskIds.includes(deleteTarget.task.id);
  const deleteTaskCount =
    deleteTarget?.mode === "bulk" ? deleteTarget.taskCount : deleteTarget ? 1 : 0;
  const deleteTaskTitle =
    deleteTarget?.mode === "bulk" ? deleteTarget.taskTitle : deleteTarget?.task.title ?? "";

  return {
    isLoading,
    error,
    tasks,
    completionError,
    shareFeedbackMessage,
    openCreateTaskModal,
    dismissCompletionError: () => setCompletionError(null),
    dismissShareFeedback: () => setShareFeedbackMessage(null),
    summary: getTaskSummary(tasks),
    toolbar: {
      searchQuery,
      sortBy,
      priorityFilter,
      statusFilter,
      setSearchQuery,
      setSortBy,
      setPriorityFilter,
      setStatusFilter,
      openCreateTaskModal,
    },
    taskLists: {
      activeTasks: filteredTasks.filter((task) => !task.completed),
      completedTasks: filteredTasks.filter((task) => task.completed),
      visibleCount: filteredTasks.length,
      pendingTaskIds,
      selectedTaskIds,
      selectedTasks,
      selectedCount,
      canUpdateCompletion,
      completionAction,
      isBulkActionPending: bulkAction !== null,
      toggleTaskCompletion,
      toggleSubtaskCompletion,
      onTaskSelectionChange,
      clearSelection: clearTaskSelection,
      updateSelectedTasksCompletion,
      openBulkDeleteModal,
      updateSelectedTasksPriority,
      openEditTaskModal,
      openDeleteTaskModal,
      shareTask,
      revokeTaskShare,
    },
    createTaskModal: {
      isOpen: isTaskModalOpen,
      mode: taskModalMode,
      formValues,
      fieldErrors,
      formError,
      isSubmitting,
      close: closeTaskModal,
      onFieldChange: onTaskFieldChange,
      onSubtaskAdd,
      onSubtaskRemove,
      onSubmit: onTaskSubmit,
    },
    deleteTaskModal: {
      isOpen: deleteTarget !== null,
      taskTitle: deleteTaskTitle,
      taskCount: deleteTaskCount,
      error: deleteError,
      isDeleting: isDeletingTask,
      close: closeDeleteTaskModal,
      confirm: confirmTaskDelete,
    },
  };
}
