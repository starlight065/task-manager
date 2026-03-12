import type { Task } from "../../types/Task";
import TaskCard from "./TaskCard";

interface TaskListSectionProps {
  title: string;
  tasks: Task[];
}

function TaskListSection({ title, tasks }: TaskListSectionProps) {
  return (
    <>
      <div className="tasks-page__section-heading">
        {title}: {tasks.length} tasks
      </div>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </>
  );
}

export default TaskListSection;
