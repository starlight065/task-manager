import { useOutletContext } from "react-router-dom";
import TasksListView from "../features/tasks/components/TasksListView";
import type { TasksPageModel } from "../features/tasks/types/model";

function TasksListPage() {
  const model = useOutletContext<TasksPageModel>();

  return <TasksListView model={model} />;
}

export default TasksListPage;
