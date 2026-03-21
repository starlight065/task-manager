import type { TaskListSectionProps } from "../types/components";
import TaskCard from "./TaskCard";

function TaskListSection({
  title,
  tasks,
  pendingTaskIds,
  onTaskCompletionChange,
  onSubtaskCompletionChange,
  onTaskEditClick,
  onTaskDeleteClick,
}: TaskListSectionProps) {
  return (
    <>
      <div className="tasks-page__section-heading">
        {title}: {tasks.length} tasks
      </div>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isUpdating={pendingTaskIds.includes(task.id)}
          onCompletionChange={onTaskCompletionChange}
          onSubtaskCompletionChange={onSubtaskCompletionChange}
          onEditClick={onTaskEditClick}
          onDeleteClick={onTaskDeleteClick}
        />
      ))}
    </>
  );
}

export default TaskListSection;
