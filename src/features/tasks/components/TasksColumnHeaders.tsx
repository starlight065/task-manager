import classNames from "classnames";

function TasksColumnHeaders() {
  return (
    <div className="tasks-page__col-headers">
      <div className="tasks-page__col-headers-check" />
      <div className="tasks-page__col-headers-content" />
      <div className={classNames("tasks-page__col-header", "tasks-page__col-header--priority")}>
        Priority
      </div>
      <div className={classNames("tasks-page__col-header", "tasks-page__col-header--date")}>
        Due Date
      </div>
      <div className={classNames("tasks-page__col-header", "tasks-page__col-header--tag")}>
        Tag
      </div>
      <div className="tasks-page__col-headers-actions" />
    </div>
  );
}

export default TasksColumnHeaders;
