import { useOutletContext } from "react-router-dom";
import TasksDashboardView from "../features/dashboard/components/TasksDashboardView";
import type { TasksPageModel } from "../features/tasks/types/model";

function TasksDashboardPage() {
  const model = useOutletContext<TasksPageModel>();

  return <TasksDashboardView model={model} />;
}

export default TasksDashboardPage;
