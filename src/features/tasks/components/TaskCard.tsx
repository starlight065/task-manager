import classNames from "classnames";
import type { TaskDto } from "../../../shared/types";
import editIcon from "../../../assets/icon-edit.svg";
import trashIcon from "../../../assets/icon-trash.svg";

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
  onSubtaskCompletionChange: (taskId: number, subtaskId: number, completed: boolean) => void;
  onEditClick: (task: TaskDto) => void;
  onDeleteClick: (task: TaskDto) => void;
}

function TaskCard({
  task,
  isUpdating,
  onCompletionChange,
  onSubtaskCompletionChange,
  onEditClick,
  onDeleteClick,
}: TaskCardProps) {
  const subtaskTotal = task.subtasks.length;
  const subtaskDone = task.subtasks.filter((s) => s.completed).length;
  const subtaskPct = subtaskTotal === 0 ? 0 : Math.round((subtaskDone / subtaskTotal) * 100);

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

        {subtaskTotal > 0 && (
          <div className="task-card__subtasks">
            <div className="task-card__subtask-progress">
              <div className="task-card__subtask-progress-bar-track">
                <div
                  className="task-card__subtask-progress-bar-fill"
                  style={{ width: `${subtaskPct}%` }}
                />
              </div>
              <span className="task-card__subtask-progress-label">
                {subtaskDone}/{subtaskTotal}
              </span>
            </div>
            <ul className="task-card__subtask-list">
              {task.subtasks.map((subtask) => (
                <li key={subtask.id} className="task-card__subtask">
                  <input
                    type="checkbox"
                    className="task-card__subtask-checkbox"
                    checked={subtask.completed}
                    disabled={isUpdating}
                    onChange={(event) => {
                      onSubtaskCompletionChange(task.id, subtask.id, event.target.checked);
                    }}
                    aria-label={`Mark subtask "${subtask.title}" as ${subtask.completed ? "incomplete" : "completed"}`}
                  />
                  <span
                    className={classNames("task-card__subtask-title", {
                      "task-card__subtask-title--completed": subtask.completed,
                    })}
                  >
                    {subtask.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="task-card__actions">
        <button
          type="button"
          className="task-card__action"
          aria-label="Edit task"
          disabled={isUpdating}
          onClick={() => onEditClick(task)}
        >
          <img src={editIcon} alt="" width="16" height="16" />
        </button>
        <button
          type="button"
          className="task-card__action"
          aria-label="Delete task"
          disabled={isUpdating}
          onClick={() => onDeleteClick(task)}
        >
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
