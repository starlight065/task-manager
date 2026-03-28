import TaskListSection from "./TaskListSection";
import TasksColumnHeaders from "./TasksColumnHeaders";
import TasksProgress from "./TasksProgress";
import TasksToolbar from "./TasksToolbar";
import { useI18n } from "../../../shared/i18n/useI18n";
import type { TasksListViewProps } from "../types/components";

function TasksListView({ model }: TasksListViewProps) {
  const { t } = useI18n();

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
        title={t("common.active")}
        tasks={model.taskLists.activeTasks}
        pendingTaskIds={model.taskLists.pendingTaskIds}
        onTaskCompletionChange={model.taskLists.toggleTaskCompletion}
        onSubtaskCompletionChange={model.taskLists.toggleSubtaskCompletion}
        onTaskEditClick={model.taskLists.openEditTaskModal}
        onTaskDeleteClick={model.taskLists.openDeleteTaskModal}
        onTaskShareClick={model.taskLists.shareTask}
        onTaskShareRevokeClick={model.taskLists.revokeTaskShare}
      />
      <TaskListSection
        title={t("common.completed")}
        tasks={model.taskLists.completedTasks}
        pendingTaskIds={model.taskLists.pendingTaskIds}
        onTaskCompletionChange={model.taskLists.toggleTaskCompletion}
        onSubtaskCompletionChange={model.taskLists.toggleSubtaskCompletion}
        onTaskEditClick={model.taskLists.openEditTaskModal}
        onTaskDeleteClick={model.taskLists.openDeleteTaskModal}
        onTaskShareClick={model.taskLists.shareTask}
        onTaskShareRevokeClick={model.taskLists.revokeTaskShare}
      />

      {model.taskLists.visibleCount === 0 ? (
        <div className="tasks-page__empty-state">{t("tasks.list.empty")}</div>
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
