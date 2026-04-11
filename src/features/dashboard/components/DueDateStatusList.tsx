import classNames from "classnames";
import { useI18n } from "../../../shared/i18n/useI18n";
import type { TaskDto } from "../../../shared/types";

interface DueDateStatusListProps {
  readonly tasks: readonly TaskDto[];
}

function calculateDueStatus(task: TaskDto) {
  if (!task.dueDate || task.completed) return "onTrack";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "dueToday";
  if (diffDays <= 7) return "thisWeek";
  
  return "onTrack";
}

function DueDateStatusList({ tasks }: DueDateStatusListProps) {
  const { t } = useI18n();

  const statuses = tasks.reduce(
    (acc, task) => {
      const status = calculateDueStatus(task);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { overdue: 0, dueToday: 0, thisWeek: 0, onTrack: 0 } as Record<string, number>
  );

  return (
    <div className="dashboard-chart">
      <h3 className="dashboard-chart__title">{t("tasks.dashboard.dueDateStatus")}</h3>
      <div className="due-date-list">
        <div className="due-date-list__item">
          <div className="due-date-list__label-container">
            <span className={classNames("due-date-list__dot", "due-date-list__dot--overdue")} />
            <span className="due-date-list__label">{t("tasks.dashboard.overdue")}</span>
          </div>
          <span className="due-date-list__count">{statuses.overdue}</span>
        </div>
        <div className="due-date-list__item">
          <div className="due-date-list__label-container">
            <span className={classNames("due-date-list__dot", "due-date-list__dot--today")} />
            <span className="due-date-list__label">{t("tasks.dashboard.dueToday")}</span>
          </div>
          <span className="due-date-list__count">{statuses.dueToday}</span>
        </div>
        <div className="due-date-list__item">
          <div className="due-date-list__label-container">
            <span className={classNames("due-date-list__dot", "due-date-list__dot--week")} />
            <span className="due-date-list__label">{t("tasks.dashboard.thisWeek")}</span>
          </div>
          <span className="due-date-list__count">{statuses.thisWeek}</span>
        </div>
        <div className="due-date-list__item">
          <div className="due-date-list__label-container">
            <span className={classNames("due-date-list__dot", "due-date-list__dot--track")} />
            <span className="due-date-list__label">{t("tasks.dashboard.onTrack")}</span>
          </div>
          <span className="due-date-list__count">{statuses.onTrack}</span>
        </div>
      </div>
    </div>
  );
}

export default DueDateStatusList;
