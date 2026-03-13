import "../styles/TasksPage.css";
import CreateTaskModal from "../features/tasks/components/CreateTaskModal";
import TaskErrorModal from "../features/tasks/components/TaskErrorModal";
import TaskListSection from "../features/tasks/components/TaskListSection";
import TasksColumnHeaders from "../features/tasks/components/TasksColumnHeaders";
import TasksHeader from "../features/tasks/components/TasksHeader";
import TasksProgress from "../features/tasks/components/TasksProgress";
import TasksToolbar from "../features/tasks/components/TasksToolbar";
import { useTasksPageModel } from "../features/tasks/model/useTasksPageModel";

function TasksPage() {
  const model = useTasksPageModel();

  if (model.isLoading) {
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
        pending={model.summary.pending}
        done={model.summary.done}
        total={model.summary.total}
      />
      <hr className="tasks-page__header-divider" />

      {model.error ? <div className="tasks-page__section-heading">{model.error}</div> : null}

      <TasksToolbar
        searchQuery={model.toolbar.searchQuery}
        sortBy={model.toolbar.sortBy}
        priorityFilter={model.toolbar.priorityFilter}
        statusFilter={model.toolbar.statusFilter}
        onCreateTaskClick={model.toolbar.openCreateTaskModal}
        onSearchQueryChange={model.toolbar.setSearchQuery}
        onSortByChange={model.toolbar.setSortBy}
        onPriorityFilterChange={model.toolbar.setPriorityFilter}
        onStatusFilterChange={model.toolbar.setStatusFilter}
      />

      <TasksColumnHeaders />

      <TaskListSection
        title="Active"
        tasks={model.taskLists.activeTasks}
        pendingTaskIds={model.taskLists.pendingTaskIds}
        onTaskCompletionChange={model.taskLists.toggleTaskCompletion}
      />
      <TaskListSection
        title="Completed"
        tasks={model.taskLists.completedTasks}
        pendingTaskIds={model.taskLists.pendingTaskIds}
        onTaskCompletionChange={model.taskLists.toggleTaskCompletion}
      />

      {model.taskLists.visibleCount === 0 ? (
        <div className="tasks-page__empty-state">
          No tasks match your current search and filters.
        </div>
      ) : null}

      <TasksProgress
        done={model.summary.done}
        total={model.summary.total}
        progressPct={model.summary.progressPct}
      />

      <CreateTaskModal
        isOpen={model.createTaskModal.isOpen}
        formValues={model.createTaskModal.formValues}
        fieldErrors={model.createTaskModal.fieldErrors}
        formError={model.createTaskModal.formError}
        isSubmitting={model.createTaskModal.isSubmitting}
        onClose={model.createTaskModal.close}
        onFieldChange={model.createTaskModal.onFieldChange}
        onSubmit={model.createTaskModal.onSubmit}
      />

      <TaskErrorModal
        open={model.completionError !== null}
        message={model.completionError ?? ""}
        onClose={model.dismissCompletionError}
      />
    </div>
  );
}

export default TasksPage;
