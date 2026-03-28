import type { TasksProgressProps } from "../types/components";
import { useI18n } from "../../../shared/i18n/useI18n";

function TasksProgress({ done, total, progressPct }: TasksProgressProps) {
  const { t } = useI18n();

  return (
    <div className="tasks-page__progress">
      <span className="tasks-page__progress-label">
        {t("tasks.progress.completed", { done, total })}
      </span>
      <progress className="tasks-page__progress-bar" max={100} value={progressPct} />
    </div>
  );
}

export default TasksProgress;
