import type { TaskDto } from "../../shared/types";
import TaskCard from "./TaskCard";

interface TaskListSectionProps {
  title: string;
  tasks: TaskDto[];
  onTaskCompletionChange: (taskId: number, completed: boolean) => void;
}

function TaskListSection({
  title,
  tasks,
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
          onCompletionChange={onTaskCompletionChange}
        />
      ))}
    </>
  );
}

export default TaskListSection;
