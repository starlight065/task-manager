import TaskListSection from "./TaskListSection";
import TasksColumnHeaders from "./TasksColumnHeaders";
import TasksProgress from "./TasksProgress";
import TasksToolbar from "./TasksToolbar";
import type { TasksListViewProps } from "../types/components";

function TasksListView({ model }: TasksListViewProps) {
  return (
    <>
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
    </>
  );
}

export default TasksListView;
