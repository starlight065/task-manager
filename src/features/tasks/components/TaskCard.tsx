import classNames from "classnames";
import { Checkbox } from "@mui/material";
import editIcon from "../../../assets/icon-edit.svg";
import trashIcon from "../../../assets/icon-trash.svg";
import { useI18n } from "../../../shared/i18n/useI18n";
import { getTodayParts, parseIsoDate } from "../lib/calendarDate";
import type { TaskCardProps } from "../types/components";

function dueDateClass(dateStr: string): string {
  if (!dateStr) {
    return "task-card__due-date--normal";
  }

  const dueDate = parseIsoDate(dateStr);

  if (!dueDate) {
    return "task-card__due-date--normal";
  }

  // Convert both dates to local midnight timestamps so we can compare whole calendar days.
  const today = getTodayParts();
  const dueDateValue = new Date(dueDate.year, dueDate.month - 1, dueDate.day).getTime();
  const todayValue = new Date(today.year, today.month - 1, today.day).getTime();
  const diffDays = Math.round((dueDateValue - todayValue) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "task-card__due-date--overdue";
  }

  if (diffDays <= 4) {
    return "task-card__due-date--soon";
  }

  return "task-card__due-date--normal";
}

function TaskCard({
  task,
  isUpdating,
  checkboxMode,
  isSelected = false,
  onCompletionChange,
  onSelectionChange,
  onSubtaskCompletionChange,
  onEditClick,
  onDeleteClick,
  onShareClick,
  onShareRevokeClick,
}: TaskCardProps) {
  const subtaskTotal = task.subtasks.length;
  const subtaskDone = task.subtasks.filter((s) => s.completed).length;
  const subtaskPct = subtaskTotal === 0 ? 0 : Math.round((subtaskDone / subtaskTotal) * 100);
  const hasDescription = task.description.trim().length > 0;
  const hasDueDate = task.dueDate.trim().length > 0;
  const hasTag = task.tag.trim().length > 0;
  const isShared = task.shareToken !== null;
  const { t } = useI18n();
  const isSelectionMode = checkboxMode === "select";
  const checkboxChecked = isSelectionMode ? isSelected : task.completed;
  const checkboxAriaLabel = isSelectionMode
    ? t("tasks.card.toggleSelectionAriaLabel", {
        title: task.title,
        selected: isSelected,
      })
    : t("tasks.card.markTaskAriaLabel", {
        title: task.title,
        completed: task.completed,
      });

  return (
    <div
      className={classNames("task-card", {
        "task-card--selected": isSelected,
        "task-card--updating": isUpdating,
      })}
    >
      <Checkbox
        className="task-card__checkbox"
        checked={checkboxChecked}
        disabled={isUpdating}
        disableRipple
        size="small"
        onChange={(event) => {
          if (isSelectionMode) {
            onSelectionChange?.(task.id, event.target.checked);
            return;
          }

          onCompletionChange(task.id, event.target.checked);
        }}
        inputProps={{ "aria-label": checkboxAriaLabel }}
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          padding: "4px",
          color: "rgba(58, 142, 246, 0.45)",
          "&.Mui-checked": {
            color: "#3a8ef6",
          },
          "&.Mui-disabled": {
            color: "rgba(58, 142, 246, 0.28)",
          },
        }}
      />
      <div className="task-card__content">
        <div className="task-card__header">
          <div
            className={classNames("task-card__title", {
              "task-card__title--completed": task.completed,
            })}
          >
            {task.title}
          </div>
          <div className="task-card__actions">
            <div className="task-card__action-group">
              <button
                type="button"
                className="task-card__action task-card__action--share"
                aria-label={
                  isShared ? t("tasks.card.copyLinkAriaLabel") : t("tasks.card.createLinkAriaLabel")
                }
                disabled={isUpdating}
                onClick={() => onShareClick(task)}
              >
                {t("tasks.card.share")}
              </button>
              {isShared ? (
                <button
                  type="button"
                  className="task-card__action task-card__action--revoke"
                  aria-label={t("tasks.card.revokeLinkAriaLabel")}
                  disabled={isUpdating}
                  onClick={() => onShareRevokeClick(task)}
                >
                  {t("tasks.card.revoke")}
                </button>
              ) : null}
            </div>
            <div className="task-card__icon-actions">
              <button
                type="button"
                className="task-card__action task-card__action--icon"
                aria-label={t("tasks.card.editTaskAriaLabel")}
                disabled={isUpdating}
                onClick={() => onEditClick(task)}
              >
                <img src={editIcon} alt="" width="16" height="16" />
              </button>
              <button
                type="button"
                className="task-card__action task-card__action--icon"
                aria-label={t("tasks.card.deleteTaskAriaLabel")}
                disabled={isUpdating}
                onClick={() => onDeleteClick(task)}
              >
                <img src={trashIcon} alt="" width="16" height="16" />
              </button>
            </div>
          </div>
        </div>
        {hasDescription ? <div className="task-card__description">{task.description}</div> : null}

        {subtaskTotal > 0 && (
          <div className="task-card__subtasks">
            <div className="task-card__subtask-progress">
              <progress
                aria-label={t("tasks.card.subtaskCompletion")}
                className="task-card__subtask-progress-bar"
                max={100}
                value={subtaskPct}
              />
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
                    aria-label={t("tasks.card.markSubtaskAriaLabel", {
                      title: subtask.title,
                      completed: subtask.completed,
                    })}
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
      <div className="task-card__meta">
        <span className={classNames("priority-badge", `priority-badge--${task.priority}`)}>
          {t(`common.priorityLevels.${task.priority}`)}
        </span>
        {isShared ? (
          <span className="task-card__share-badge">{t("tasks.card.publicLinkEnabled")}</span>
        ) : null}
        {hasDueDate ? (
          <span
            className={classNames(
              "task-card__due-date",
              task.completed ? "task-card__due-date--completed" : dueDateClass(task.dueDate),
            )}
          >
            {task.dueDate}
          </span>
        ) : null}
        {hasTag ? <span className="tag-badge">{task.tag}</span> : null}
      </div>
    </div>
  );
}

export default TaskCard;
