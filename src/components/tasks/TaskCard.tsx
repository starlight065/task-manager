import classNames from "classnames";
import type { TaskDto } from "../../shared/types";
import editIcon from "../../assets/icon-edit.svg";
import trashIcon from "../../assets/icon-trash.svg";

function dueDateClass(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "task-card__due-date--overdue";
  }

  if (diffDays <= 4) {
    return "task-card__due-date--soon";
  }

  return "task-card__due-date--normal";
}

interface TaskCardProps {
  task: TaskDto;
  isUpdating: boolean;
  onCompletionChange: (taskId: number, completed: boolean) => void;
}

function TaskCard({ task, isUpdating, onCompletionChange }: TaskCardProps) {
  return (
    <div
      className={classNames("task-card", {
        "task-card--updating": isUpdating,
      })}
    >
      <input
        type="checkbox"
        className="task-card__checkbox"
        checked={task.completed}
        disabled={isUpdating}
        onChange={(event) => {
          onCompletionChange(task.id, event.target.checked);
        }}
        aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "completed"}`}
      />
      <div className="task-card__content">
        <div
          className={classNames("task-card__title", {
            "task-card__title--completed": task.completed,
          })}
        >
          {task.title}
        </div>
        <div className="task-card__description">{task.description}</div>
      </div>
      <div className="task-card__actions">
        <button className="task-card__action" aria-label="Edit task" disabled={isUpdating}>
          <img src={editIcon} alt="" width="16" height="16" />
        </button>
        <button className="task-card__action" aria-label="Delete task" disabled={isUpdating}>
          <img src={trashIcon} alt="" width="16" height="16" />
        </button>
      </div>
      <div className="task-card__meta">
        <span className={classNames("priority-badge", `priority-badge--${task.priority}`)}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        <span
          className={classNames(
            "task-card__due-date",
            task.completed ? "task-card__due-date--completed" : dueDateClass(task.dueDate),
          )}
        >
          {task.dueDate}
        </span>
        <span className="tag-badge">{task.tag}</span>
      </div>
    </div>
  );
}

export default TaskCard;
