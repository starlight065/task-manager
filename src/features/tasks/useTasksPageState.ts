import { useEffect, useState, type SubmitEvent } from "react";
import { createTask, getTasks } from "../../api/tasks";
import type { CreateTaskPayload, Task } from "../../types";
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

function getTaskSummary(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const pending = total - done;
  const progressPct = total === 0 ? 0 : Math.round((done / total) * 100);

  return { pending, done, total, progressPct };
}

export function useTasksPageState() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("due-date");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateModalClosing, setIsCreateModalClosing] = useState(false);
  const [taskFormValues, setTaskFormValues] = useState<CreateTaskPayload>(EMPTY_TASK_FORM);
  const [taskFormErrors, setTaskFormErrors] = useState<TaskFormErrors>({});
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
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

  function openCreateModal() {
    setTaskFormValues(EMPTY_TASK_FORM);
    setTaskFormErrors({});
    setTaskFormError(null);
    setIsCreateModalClosing(false);
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    setIsCreateModalClosing(false);
    setTaskFormErrors({});
    setTaskFormError(null);
  }

  function handleTaskFieldChange(field: keyof CreateTaskPayload, value: string) {
    setTaskFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setTaskFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [field]: undefined,
      };
    });

    setTaskFormError(null);
  }

  async function handleCreateTask(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedValues = normalizeTaskFormValues(taskFormValues);
    const nextErrors = validateTaskForm(trimmedValues);

    if (Object.keys(nextErrors).length > 0) {
      setTaskFormErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setTaskFormErrors({});
    setTaskFormError(null);

    try {
      const createdTask = await createTask(trimmedValues);
      setTasks((currentTasks) => [...currentTasks, createdTask]);
      setTaskFormValues(EMPTY_TASK_FORM);
      setIsCreateModalClosing(true);
    } catch (err) {
      setTaskFormError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredTasks = getFilteredTasks(
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
  );
  const activeTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);
  const summary = getTaskSummary(tasks);

  return {
    isLoading,
    error,
    summary,
    filters: {
      searchQuery,
      sortBy,
      priorityFilter,
      statusFilter,
      activeTasks,
      completedTasks,
      visibleCount: filteredTasks.length,
      setSearchQuery,
      setSortBy,
      setPriorityFilter,
      setStatusFilter,
    },
    createModal: {
      isOpen: isCreateModalOpen,
      isClosing: isCreateModalClosing,
      formValues: taskFormValues,
      fieldErrors: taskFormErrors,
      formError: taskFormError,
      isSubmitting,
      open: openCreateModal,
      close: closeCreateModal,
      onFieldChange: handleTaskFieldChange,
      onSubmit: handleCreateTask,
    },
  };
}
