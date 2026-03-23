import type { TasksProgressProps } from "../types/components";

function TasksProgress({ done, total, progressPct }: TasksProgressProps) {
  return (
    <div className="tasks-page__progress">
      <span className="tasks-page__progress-label">
        {done} / {total} completed
      </span>
      <progress className="tasks-page__progress-bar" max={100} value={progressPct} />
    </div>
  );
}

export default TasksProgress;
