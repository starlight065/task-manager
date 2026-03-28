import classNames from "classnames";
import { useI18n } from "../../../shared/i18n/useI18n";

function TasksColumnHeaders() {
  const { t } = useI18n();

  return (
    <div className="tasks-page__col-headers">
      <div className="tasks-page__col-headers-check" />
      <div className="tasks-page__col-headers-content" />
      <div className={classNames("tasks-page__col-header", "tasks-page__col-header--priority")}>
        {t("tasks.columns.priority")}
      </div>
      <div className={classNames("tasks-page__col-header", "tasks-page__col-header--date")}>
        {t("tasks.columns.dueDate")}
      </div>
      <div className={classNames("tasks-page__col-header", "tasks-page__col-header--tag")}>
        {t("tasks.columns.tag")}
      </div>
    </div>
  );
}

export default TasksColumnHeaders;
