interface TasksProgressProps {
  done: number;
  total: number;
  progressPct: number;
}

function TasksProgress({ done, total, progressPct }: TasksProgressProps) {
  return (
    <div className="tasks-page__progress">
      <span className="tasks-page__progress-label">
        {done} / {total} completed
      </span>
      <div className="tasks-page__progress-bar-track">
        <div className="tasks-page__progress-bar-fill" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  );
}

export default TasksProgress;
