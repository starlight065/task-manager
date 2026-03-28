import classNames from "classnames";
import { useI18n } from "../../../shared/i18n/useI18n";
import type { TasksHeaderProps } from "../types/components";

function TasksHeader({ pending, done, total, subtitle }: TasksHeaderProps) {
  const { locale, t } = useI18n();
  const currentMonth = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date());
  const resolvedSubtitle = subtitle ?? currentMonth;

  return (
    <div className="tasks-page__header">
      <h1 className="tasks-page__title">
        {t("tasks.pageTitle")} {resolvedSubtitle ? <span>• {resolvedSubtitle}</span> : null}
      </h1>
      <div className="tasks-page__stats">
        <div className="tasks-page__stat">
          <span
            className={classNames("tasks-page__stat-value", "tasks-page__stat-value--pending")}
          >
            {pending}
          </span>
          <span className="tasks-page__stat-label">{t("tasks.stats.pending")}</span>
        </div>
        <div className="tasks-page__stat">
          <span className={classNames("tasks-page__stat-value", "tasks-page__stat-value--done")}>
            {done}
          </span>
          <span className="tasks-page__stat-label">{t("tasks.stats.done")}</span>
        </div>
        <div className="tasks-page__stat">
          <span
            className={classNames("tasks-page__stat-value", "tasks-page__stat-value--total")}
          >
            {total}
          </span>
          <span className="tasks-page__stat-label">{t("tasks.stats.total")}</span>
        </div>
      </div>
    </div>
  );
}

export default TasksHeader;
