import "../styles/TasksPage.css";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import TaskListSection from "../components/tasks/TaskListSection";
import TasksColumnHeaders from "../components/tasks/TasksColumnHeaders";
import TasksHeader from "../components/tasks/TasksHeader";
import TasksProgress from "../components/tasks/TasksProgress";
import TasksToolbar from "../components/tasks/TasksToolbar";
import { useTasksPageState } from "../features/tasks/useTasksPageState";

function TasksPage() {
  const { isLoading, error, summary, filters, createModal } = useTasksPageState();

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
      <TasksHeader pending={summary.pending} done={summary.done} total={summary.total} />
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

      <TaskListSection title="Active" tasks={filters.activeTasks} />
      <TaskListSection title="Completed" tasks={filters.completedTasks} />

      {filters.visibleCount === 0 ? (
        <div className="tasks-page__empty-state">
          No tasks match your current search and filters.
        </div>
      ) : null}

      <TasksProgress
        done={summary.done}
        total={summary.total}
        progressPct={summary.progressPct}
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
    </div>
  );
}

export default TasksPage;
