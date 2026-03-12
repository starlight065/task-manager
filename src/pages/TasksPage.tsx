import { useEffect, useState } from "react";
import "../styles/TasksPage.css";
import type { Task } from "../types/Task";
import { getTasks } from "../api/tasks";
import TaskListSection from "../components/tasks/TaskListSection";
import TasksColumnHeaders from "../components/tasks/TasksColumnHeaders";
import TasksHeader from "../components/tasks/TasksHeader";
import TasksProgress from "../components/tasks/TasksProgress";
import TasksToolbar from "../components/tasks/TasksToolbar";
import {
  getFilteredTasks,
  type PriorityFilter,
  type SortOption,
  type StatusFilter,
} from "../features/tasks/taskFilters";

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("due-date");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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
  const activeTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const pending = tasks.filter((task) => !task.completed).length;
  const progressPct = total === 0 ? 0 : Math.round((done / total) * 100);
  const visibleCount = filteredTasks.length;

  if (isLoading) {
    return (
      <div className="tasks-page">
        <TasksHeader pending={0} done={0} total={0} />
        <hr className="tasks-page__header-divider" />
        <div className="tasks-page__section-heading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <TasksHeader pending={pending} done={done} total={total} />
      <hr className="tasks-page__header-divider" />

      {error ? <div className="tasks-page__section-heading">{error}</div> : null}

      <TasksToolbar
        searchQuery={searchQuery}
        sortBy={sortBy}
        priorityFilter={priorityFilter}
        statusFilter={statusFilter}
        onSearchQueryChange={setSearchQuery}
        onSortByChange={setSortBy}
        onPriorityFilterChange={setPriorityFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <TasksColumnHeaders />

      <TaskListSection title="Active" tasks={activeTasks} />
      <TaskListSection title="Completed" tasks={completedTasks} />

      {visibleCount === 0 ? (
        <div className="tasks-page__empty-state">
          No tasks match your current search and filters.
        </div>
      ) : null}

      <TasksProgress done={done} total={total} progressPct={progressPct} />
    </div>
  );
}

export default TasksPage;
