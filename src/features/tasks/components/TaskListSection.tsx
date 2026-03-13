import type { TaskDto } from "../../../shared/types";
import TaskCard from "./TaskCard";

interface TaskListSectionProps {
  title: string;
  tasks: TaskDto[];
  pendingTaskIds: number[];
  onTaskCompletionChange: (taskId: number, completed: boolean) => void;
}

function TaskListSection({
  title,
  tasks,
  pendingTaskIds,
  onTaskCompletionChange,
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
        />
      ))}
    </>
  );
}

export default TaskListSection;
