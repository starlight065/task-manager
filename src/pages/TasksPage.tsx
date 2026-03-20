import "../styles/TasksPage.css";
import loadingSpinnerIcon from "../assets/tasks-loading-spinner.svg";
import CreateTaskModal from "../features/tasks/components/CreateTaskModal";
import TaskDeleteModal from "../features/tasks/components/TaskDeleteModal";
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
          <img src={loadingSpinnerIcon} alt="" width="40" height="40" aria-hidden="true" />
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
        onSubtaskCompletionChange={model.taskLists.toggleSubtaskCompletion}
        onTaskEditClick={model.taskLists.openEditTaskModal}
        onTaskDeleteClick={model.taskLists.openDeleteTaskModal}
      />
      <TaskListSection
        title="Completed"
        tasks={model.taskLists.completedTasks}
        pendingTaskIds={model.taskLists.pendingTaskIds}
        onTaskCompletionChange={model.taskLists.toggleTaskCompletion}
        onSubtaskCompletionChange={model.taskLists.toggleSubtaskCompletion}
        onTaskEditClick={model.taskLists.openEditTaskModal}
        onTaskDeleteClick={model.taskLists.openDeleteTaskModal}
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
        mode={model.createTaskModal.mode}
        formValues={model.createTaskModal.formValues}
        fieldErrors={model.createTaskModal.fieldErrors}
        formError={model.createTaskModal.formError}
        isSubmitting={model.createTaskModal.isSubmitting}
        onClose={model.createTaskModal.close}
        onFieldChange={model.createTaskModal.onFieldChange}
        onSubtaskAdd={model.createTaskModal.onSubtaskAdd}
        onSubtaskRemove={model.createTaskModal.onSubtaskRemove}
        onSubmit={model.createTaskModal.onSubmit}
      />

      <TaskErrorModal
        open={model.completionError !== null}
        message={model.completionError ?? ""}
        onClose={model.dismissCompletionError}
      />

      <TaskDeleteModal
        isOpen={model.deleteTaskModal.isOpen}
        taskTitle={model.deleteTaskModal.taskTitle}
        error={model.deleteTaskModal.error}
        isDeleting={model.deleteTaskModal.isDeleting}
        onClose={model.deleteTaskModal.close}
        onConfirm={model.deleteTaskModal.confirm}
      />
    </div>
  );
}

export default TasksPage;
