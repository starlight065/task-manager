import "../styles/TasksPage.css";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import TaskListSection from "../components/tasks/TaskListSection";
import TasksColumnHeaders from "../components/tasks/TasksColumnHeaders";
import TaskErrorModal from "../components/tasks/TaskErrorModal";
import TasksHeader from "../components/tasks/TasksHeader";
import TasksProgress from "../components/tasks/TasksProgress";
import TasksToolbar from "../components/tasks/TasksToolbar";
import { useCreateTaskModal } from "../features/tasks/hooks/useCreateTaskModal";
import { useTaskFilters } from "../features/tasks/hooks/useTaskFilters";
import { useTasksQuery } from "../features/tasks/hooks/useTasksQuery";

function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    completionError,
    pendingTaskIds,
    addTask,
    toggleTaskCompletion,
    dismissCompletionError,
  } = useTasksQuery();
  const filters = useTaskFilters(tasks);
  const createModal = useCreateTaskModal({ onTaskCreated: addTask });

  if (isLoading) {
    return (
      <div className="tasks-page">
        <TasksHeader pending={0} done={0} total={0} />
        <hr className="tasks-page__header-divider" />
        <div className="tasks-page__loading-state" aria-label="Loading tasks" role="status">
          <svg
            className="loading-spinner"
            width="40"
            height="40"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="5"
            />
            <circle
              className="spinner-path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <TasksHeader
        pending={filters.summary.pending}
        done={filters.summary.done}
        total={filters.summary.total}
      />
      <hr className="tasks-page__header-divider" />

      {error ? <div className="tasks-page__section-heading">{error}</div> : null}

      <TasksToolbar
        searchQuery={filters.searchQuery}
        sortBy={filters.sortBy}
        priorityFilter={filters.priorityFilter}
        statusFilter={filters.statusFilter}
        onCreateTaskClick={createModal.open}
        onSearchQueryChange={filters.setSearchQuery}
        onSortByChange={filters.setSortBy}
        onPriorityFilterChange={filters.setPriorityFilter}
        onStatusFilterChange={filters.setStatusFilter}
      />

      <TasksColumnHeaders />

      <TaskListSection
        title="Active"
        tasks={filters.activeTasks}
        pendingTaskIds={pendingTaskIds}
        onTaskCompletionChange={toggleTaskCompletion}
      />
      <TaskListSection
        title="Completed"
        tasks={filters.completedTasks}
        pendingTaskIds={pendingTaskIds}
        onTaskCompletionChange={toggleTaskCompletion}
      />

      {filters.visibleCount === 0 ? (
        <div className="tasks-page__empty-state">
          No tasks match your current search and filters.
        </div>
      ) : null}

      <TasksProgress
        done={filters.summary.done}
        total={filters.summary.total}
        progressPct={filters.summary.progressPct}
      />

      {createModal.isOpen ? (
        <CreateTaskModal
          formValues={createModal.formValues}
          fieldErrors={createModal.fieldErrors}
          formError={createModal.formError}
          isSubmitting={createModal.isSubmitting}
          isClosing={createModal.isClosing}
          onCloseComplete={createModal.close}
          onFieldChange={createModal.onFieldChange}
          onSubmit={createModal.onSubmit}
        />
      ) : null}

      {completionError ? (
        <TaskErrorModal message={completionError} onClose={dismissCompletionError} />
      ) : null}
    </div>
  );
}

export default TasksPage;
