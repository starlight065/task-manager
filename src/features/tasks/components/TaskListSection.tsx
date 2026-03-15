import type { TaskDto } from "../../../shared/types";
import TaskCard from "./TaskCard";

interface TaskListSectionProps {
  title: string;
  tasks: TaskDto[];
  pendingTaskIds: number[];
  onTaskCompletionChange: (taskId: number, completed: boolean) => void;
  onTaskEditClick: (task: TaskDto) => void;
  onTaskDeleteClick: (task: TaskDto) => void;
}

function TaskListSection({
  title,
  tasks,
  pendingTaskIds,
  onTaskCompletionChange,
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
          onEditClick={onTaskEditClick}
          onDeleteClick={onTaskDeleteClick}
        />
      ))}
    </>
  );
}

export default TaskListSection;
