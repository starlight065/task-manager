import classNames from "classnames";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicTask } from "../features/tasks/api/tasksApi";
import { formatIsoDate } from "../features/tasks/lib/calendarDate";
import { t as translate } from "../shared/i18n";
import { useI18n } from "../shared/i18n/useI18n";
import type { TaskDto } from "../shared/types";

function PublicTaskPage() {
  const { shareToken = "" } = useParams();
  const { locale, t } = useI18n();
  const [task, setTask] = useState<TaskDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const nextTask = await getPublicTask(shareToken);

        if (!isMounted) {
          return;
        }

        setTask(nextTask);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : translate("tasks.errors.loadSharedTask"));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [shareToken]);

  if (isLoading) {
    return <div className="public-task-page">{t("publicTask.loading")}</div>;
  }

  if (error || !task) {
    return (
      <div className="public-task-page">
        <div className="public-task-page__card">
          <h1 className="public-task-page__title">{t("publicTask.unavailableTitle")}</h1>
          <p className="public-task-page__description">
            {error ?? t("publicTask.unavailableDescription")}
          </p>
          <Link className="public-task-page__cta" to="/login">
            {t("publicTask.openApp")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="public-task-page">
      <article className="public-task-page__card">
        <div className="public-task-page__header">
          <h1 className="public-task-page__title">{task.title}</h1>
          <span
            className={classNames("priority-badge", `priority-badge--${task.priority}`)}
          >
            {t(`common.priorityLevels.${task.priority}`)}
          </span>
        </div>
        {task.description ? <p className="public-task-page__description">{task.description}</p> : null}
        <dl className="public-task-page__meta">
          <div>
            <dt>{t("common.status")}</dt>
            <dd>{task.completed ? t("common.completed") : t("common.inProgress")}</dd>
          </div>
          {task.dueDate ? (
            <div>
              <dt>{t("common.dueDate")}</dt>
              <dd>
                {formatIsoDate(
                  task.dueDate,
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                  locale,
                )}
              </dd>
            </div>
          ) : null}
          {task.tag ? (
            <div>
              <dt>{t("common.tag")}</dt>
              <dd>{task.tag}</dd>
            </div>
          ) : null}
        </dl>

        {task.subtasks.length > 0 ? (
          <section>
            <h2 className="public-task-page__subtitle">{t("publicTask.checklist")}</h2>
            <ul className="public-task-page__subtasks">
              {task.subtasks.map((subtask) => (
                <li key={subtask.id}>
                  <span
                    className={classNames("public-task-page__subtask", {
                      "public-task-page__subtask--done": subtask.completed,
                    })}
                  >
                    {subtask.title}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </div>
  );
}

export default PublicTaskPage;
