import type { TaskDto } from "../../../shared/types";

export function getTaskSummary(tasks: TaskDto[]) {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const pending = total - done;
  const progressPct = total === 0 ? 0 : Math.round((done / total) * 100);

  return { pending, done, total, progressPct };
}
