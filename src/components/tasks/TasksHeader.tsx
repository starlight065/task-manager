import classNames from "classnames";

interface TasksHeaderProps {
  pending: number;
  done: number;
  total: number;
}

function TasksHeader({ pending, done, total }: TasksHeaderProps) {
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="tasks-page__header">
      <h1 className="tasks-page__title">
        Task manager <span>• {currentMonth}</span>
      </h1>
      <div className="tasks-page__stats">
        <div className="tasks-page__stat">
          <span
            className={classNames("tasks-page__stat-value", "tasks-page__stat-value--pending")}
          >
            {pending}
          </span>
          <span className="tasks-page__stat-label">pending</span>
        </div>
        <div className="tasks-page__stat">
          <span className={classNames("tasks-page__stat-value", "tasks-page__stat-value--done")}>
            {done}
          </span>
          <span className="tasks-page__stat-label">done</span>
        </div>
        <div className="tasks-page__stat">
          <span
            className={classNames("tasks-page__stat-value", "tasks-page__stat-value--total")}
          >
            {total}
          </span>
          <span className="tasks-page__stat-label">total</span>
        </div>
      </div>
    </div>
  );
}

export default TasksHeader;
