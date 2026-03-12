import { useEffect, useState } from "react";
import type { TaskDto } from "../../../shared/types";
import { getTasks, updateTaskCompletion } from "../api/tasksApi";

export function useTasksQuery() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [pendingTaskIds, setPendingTaskIds] = useState<number[]>([]);

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

  function addTask(task: TaskDto) {
    setTasks((currentTasks) => [...currentTasks, task]);
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
        currentTaskIds.filter((currentTaskId) => {
          return currentTaskId !== taskId;
        }),
      );
    }
  }

  return {
    tasks,
    isLoading,
    error,
    completionError,
    pendingTaskIds,
    addTask,
    toggleTaskCompletion,
    dismissCompletionError: () => setCompletionError(null),
  };
}
