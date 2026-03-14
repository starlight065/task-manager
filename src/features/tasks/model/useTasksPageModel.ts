import { useEffect, useState, type SubmitEvent } from "react";
import type { CreateTaskDto, TaskDto } from "../../../shared/types";
import { createTask, getTasks, updateTask, updateTaskCompletion } from "../api/tasksApi";
import { getTaskSummary } from "../lib/getTaskSummary";
import {
  EMPTY_TASK_FORM,
  normalizeTaskFormValues,
  validateTaskForm,
  type TaskFormErrors,
} from "./taskForm";
import {
  getFilteredTasks,
  type PriorityFilter,
  type SortOption,
  type StatusFilter,
} from "./taskFilters";

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
        const updatedTask = await updateTask(editingTaskId, trimmedValues);

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

  return {
    isLoading,
    error,
    completionError,
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
      openEditTaskModal,
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
      onSubmit: onTaskSubmit,
    },
  };
}
