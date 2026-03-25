import { useEffect, useState, type SubmitEvent } from "react";
import type { CreateTaskDto, SubtaskDto, TaskDto } from "../../../shared/types";
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
import {
  EMPTY_TASK_FORM,
  normalizeTaskFormValues,
  validateTaskForm,
  type TaskFormErrors,
} from "./taskForm";
import {
  getFilteredTasks,
} from "./taskFilters";
import type { PriorityFilter, SortOption, StatusFilter } from "../types/model";

export function useTasksPageModel() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<number[]>([]);
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
  const [taskToDelete, setTaskToDelete] = useState<TaskDto | null>(null);
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

        setError(err instanceof Error ? err.message : "Failed to load tasks");
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

  const filteredTasks = getFilteredTasks(
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
  );
  const taskModalMode: "create" | "edit" =
    editingTaskId === null ? "create" : "edit";

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
      subtasks: task.subtasks.map((s) => s.title),
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
    setTaskToDelete(task);
    setDeleteError(null);
  }

  function closeDeleteTaskModal() {
    setTaskToDelete(null);
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
      subtasks: (currentValues.subtasks ?? []).filter((_, i) => i !== index),
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
        const existingTask = tasks.find((t) => t.id === editingTaskId);
        const existingSubtasks: SubtaskDto[] = existingTask?.subtasks ?? [];
        const formSubtaskTitles = trimmedValues.subtasks ?? [];

        const updateSubtasks = formSubtaskTitles.map((title, index) => {
          const existing = existingSubtasks[index];
          return existing ? { id: existing.id, title } : { title };
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
      setFormError(err instanceof Error ? err.message : "Failed to save task");
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
    setPendingTaskIds((currentTaskIds) =>
      currentTaskIds.includes(taskId) ? currentTaskIds : [...currentTaskIds, taskId],
    );

    try {
      const updatedTask = await updateTaskCompletion(taskId, { completed });

      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== updatedTask.id) {
            return task;
          }

          return updatedTask;
        }),
      );
      setCompletionError(null);
    } catch (err) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => {
          if (task.id !== previousTask.id) {
            return task;
          }

          return previousTask;
        }),
      );
      setCompletionError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setPendingTaskIds((currentTaskIds) =>
        currentTaskIds.filter((currentTaskId) => currentTaskId !== taskId),
      );
    }
  }

  async function toggleSubtaskCompletion(taskId: number, subtaskId: number, completed: boolean) {
    const previousTask = tasks.find((task) => task.id === taskId);

    if (!previousTask) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed } : s,
          ),
        };
      }),
    );
    setPendingTaskIds((currentTaskIds) =>
      currentTaskIds.includes(taskId) ? currentTaskIds : [...currentTaskIds, taskId],
    );

    try {
      const updatedTask = await apiToggleSubtaskCompletion(taskId, subtaskId, { completed });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id !== updatedTask.id ? task : updatedTask)),
      );
      setCompletionError(null);
    } catch (err) {
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id !== previousTask.id ? task : previousTask)),
      );
      setCompletionError(err instanceof Error ? err.message : "Failed to update subtask");
    } finally {
      setPendingTaskIds((currentTaskIds) =>
        currentTaskIds.filter((currentTaskId) => currentTaskId !== taskId),
      );
    }
  }



  async function copyShareLink(shareToken: string) {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return;
    }

    throw new Error("Clipboard copy is not supported in this browser");
  }

  async function shareTask(task: TaskDto) {
    setPendingTaskIds((currentTaskIds) =>
      currentTaskIds.includes(task.id) ? currentTaskIds : [...currentTaskIds, task.id],
    );

    try {
      const nextTask = task.shareToken ? task : await createShareLink(task.id);

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === nextTask.id ? nextTask : currentTask)),
      );

      if (!nextTask.shareToken) {
        throw new Error("Failed to generate share link");
      }

      await copyShareLink(nextTask.shareToken);
      setCompletionError(null);
    } catch (err) {
      setCompletionError(err instanceof Error ? err.message : "Failed to copy share link");
    } finally {
      setPendingTaskIds((currentTaskIds) =>
        currentTaskIds.filter((currentTaskId) => currentTaskId !== task.id),
      );
    }
  }

  async function revokeTaskShare(task: TaskDto) {
    if (!task.shareToken) {
      return;
    }

    setPendingTaskIds((currentTaskIds) =>
      currentTaskIds.includes(task.id) ? currentTaskIds : [...currentTaskIds, task.id],
    );

    try {
      const nextTask = await revokeShareLink(task.id);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === nextTask.id ? nextTask : currentTask)),
      );
      setCompletionError(null);
    } catch (err) {
      setCompletionError(err instanceof Error ? err.message : "Failed to revoke share link");
    } finally {
      setPendingTaskIds((currentTaskIds) =>
        currentTaskIds.filter((currentTaskId) => currentTaskId !== task.id),
      );
    }
  }
  async function confirmTaskDelete() {
    if (!taskToDelete) {
      return;
    }

    const { id: taskId } = taskToDelete;

    setPendingTaskIds((currentTaskIds) =>
      currentTaskIds.includes(taskId) ? currentTaskIds : [...currentTaskIds, taskId],
    );
    setDeleteError(null);

    try {
      await deleteTask(taskId);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
      closeDeleteTaskModal();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setPendingTaskIds((currentTaskIds) =>
        currentTaskIds.filter((currentTaskId) => currentTaskId !== taskId),
      );
    }
  }

  const isDeletingTask =
    taskToDelete !== null && pendingTaskIds.includes(taskToDelete.id);

  return {
    isLoading,
    error,
    tasks,
    completionError,
    openCreateTaskModal,
    dismissCompletionError: () => setCompletionError(null),
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
      toggleTaskCompletion,
      toggleSubtaskCompletion,
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
      isOpen: taskToDelete !== null,
      taskTitle: taskToDelete?.title ?? "",
      error: deleteError,
      isDeleting: isDeletingTask,
      close: closeDeleteTaskModal,
      confirm: confirmTaskDelete,
    },
  };
}
