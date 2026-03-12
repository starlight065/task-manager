import { useEffect, useState } from "react";
import type { TaskDto } from "../../../shared/types";
import { getTasks } from "../api/tasksApi";

export function useTasksQuery() {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return {
    tasks,
    isLoading,
    error,
    addTask,
  };
}
